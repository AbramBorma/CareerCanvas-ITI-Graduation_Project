from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, Question, Exam, AssignedExams,SupervisorQuestion,SupervisorExam
from .serializers import SubjectSerializer, ExamSerializer,SupervisorQuestionSerializer,SupervisorExamSerializer,SupervisorExamSerializer,QuestionSerializer
from users.models import User, Role
import json
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


class QuestionsPagination(PageNumberPagination):
    page_size = 5  

class FetchQuestions(APIView):
    pagination_class = QuestionsPagination
    @swagger_auto_schema(
        operation_summary="Fetch Questions",
        operation_description="Retrieve a list of All questions for a given subject and level.",
        tags=["Exams"]
    )
    def get(self, request, subject_name, level):
        try:
            user= request.user
            search_query = request.GET.get('search', '') 
            subject = Subject.objects.get(name=subject_name)
            questions = Question.objects.filter(subject=subject, level=level).filter(Q(user=user) | Q(is_general=True)).filter(Q(question_text__icontains=search_query))
            paginator = QuestionsPagination()
            paginated_questions = paginator.paginate_queryset(questions, request)
            data = [
                {
                    "id": question.id,
                    # "subject":question.subject.id,
                    # "level":question.level,
                    "question_text": question.question_text,
                    "correct_answer":question.correct_answer,
                    "options": [question.option1, question.option2, question.option3, question.option4],
                    "is_general":question.is_general,
                }
                for question in paginated_questions
            ]
            # return Response(data, status=status.HTTP_200_OK)
            return paginator.get_paginated_response(data)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)


class SubmitExam(APIView):
    @swagger_auto_schema(
        operation_summary="Submit Exam",
        operation_description="Submit an exam with the user's answers and calculate the score.",
        tags=["Exams"]
    )
    def post(self, request):
        json_data_str = request.body.decode('utf-8')
        try:
            data = json.loads(json_data_str)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

        user_email = data.get('user_email')
        subject_id = data.get('exam_id')
        answers = data.get('answers')  # {'question_id': 'selected_option', ...}
        total = data.get('totalNumber')

        if not user_email or not subject_id or not isinstance(answers, dict):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(email=user_email)
        subject = SupervisorExam.objects.get(id=subject_id)

        total_questions = 0
        correct_answers = 0
        for question_id, user_answer in answers.items():
            question = Question.objects.get(id=question_id)
            if question.level == "coding":
                correct_cases = user_answer
                correct_answers += correct_cases
                total_questions += 4
            else:
                is_correct = question.correct_answer == user_answer
                if is_correct:
                    correct_answers += 1
                total_questions += 1
        
        AssignedExams.objects.filter(user=user,subject=subject).delete()
        score = (correct_answers / total) * 100 if total_questions > 0 else 0
        exam = Exam.objects.create(user=user, subject=subject, score=score)
        return Response({"score": score}, status=status.HTTP_200_OK)
    


class SubjectListView(APIView):
    @swagger_auto_schema(
        operation_summary="List Subjects",
        operation_description="Retrieve a list of available subjects.",
        tags=["Exams"]
    )
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)  # Serialize the queryset
        return Response(serializer.data) 


class UserExamScoresView(APIView):
    @swagger_auto_schema(
        operation_summary="User Exam Scores",
        operation_description="Retrieve the exam scores of a specific user.",
        tags=["Exams"]
    )
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            exams = Exam.objects.filter(user=user)
            
            serializer = ExamSerializer(exams, many=True)
            response_data = {
                "exams": [
                    {
                        "subject_name": exam['subject']['name'],
                        "date_taken": exam['date_taken'],
                        "score": exam['score'],
                    }
                    for exam in serializer.data
                ]
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AssignedSubjectsForUserView(APIView):
    @swagger_auto_schema(
        operation_summary="Assigned Subjects for User",
        operation_description="Retrieve the subjects assigned to a specific user.",
        tags=["Exams"]
    )
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            assigned_exams = AssignedExams.objects.filter(user=user)
            subjects = [assigned_exam.subject for assigned_exam in assigned_exams]
            serializer = SupervisorExamSerializer(subjects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AssignUsersToSubjectByTrackView(APIView):
    @swagger_auto_schema(
        operation_summary="Assign Users to Subject by Track",
        operation_description="Assign all students in a specific track to a subject.",
        tags=["Exams"]
    )
    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        exam_id = request.data.get('examID')
        if not user or not exam_id:
            return Response({"error": "Supervisor id and exam name are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_track = user.track
            exam = SupervisorExam.objects.get(id=exam_id)            
            users_in_track = User.objects.filter(track=user_track, role=Role.STUDENT)

            assigned_count = 0
            for user in users_in_track:
                if not AssignedExams.objects.filter(user=user, subject=exam).exists():
                    AssignedExams.objects.create(user=user, subject=exam)
                    assigned_count += 1

            return Response(
                {"message": f"Assigned {assigned_count} students to the exam {exam.name} in track {user_track.name}"},
                status=status.HTTP_201_CREATED
            )
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except SupervisorExam.DoesNotExist:
            return Response({"error": f"Exam '{exam_id}' not found"}, status=status.HTTP_404_NOT_FOUND)


class RemoveAssignedUsersToSubjectByTrackView(APIView):
    
    @swagger_auto_schema(
        operation_description="Remove assigned students to a specific subject by track",
        operation_summary="Remove Assigned Students",
        tags=['Exams'],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'subject': openapi.Schema(type=openapi.TYPE_STRING, description='Subject name'),
            },
            required=['subject'],
            description="Request body should contain the subject name."
        ),
        responses={
            201: openapi.Response(
                description="Students successfully removed from the subject.",
                examples={
                    "application/json": {
                        "message": "Assigned 5 students to the subject Math in track AI"
                    }
                }
            ),
            400: "Bad Request - Missing required fields",
            404: "Not Found - User or subject not found"
        }
    )
    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        exam_id = request.data.get('examID')
        if not user or not exam_id:
            return Response({"error": "Supervisor id and Exam name are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_track = user.track
            exam = SupervisorExam.objects.get(id=exam_id)            
            users_in_track = User.objects.filter(track=user_track, role=Role.STUDENT)

            assigned_count = 0
            for user in users_in_track:
                if AssignedExams.objects.filter(user=user, subject=exam).exists():
                    AssignedExams.objects.filter(user=user, subject=exam).delete()
                    assigned_count += 1

            return Response(
                {"message": f"Removed {assigned_count} students from the Exam {exam.name} in track {user_track.name}"},
                status=status.HTTP_201_CREATED
            )
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except SupervisorExam.DoesNotExist:
            return Response({"error": f"Exam '{exam_id}' not found"}, status=status.HTTP_404_NOT_FOUND)
        







class SupervisorExamListView(APIView):
    @swagger_auto_schema(
        operation_summary="Show created Exams by a User",
        operation_description="Retrieve All the created exams for this supervisor.",
        tags=["Exams"]
    )
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            supervisor_exams = SupervisorExam.objects.filter(user=user)
            serializer = SupervisorExamSerializer(supervisor_exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class CreateSupervisorExamView(APIView):
    @swagger_auto_schema(
        operation_summary="Create an Exams by a User",
        operation_description="Create a new exams for this supervisor.",
        tags=["Exams"]
    )
    def post(self, request):
        # Extract data from the request
        name = request.data.get('name')
        subject_name = request.data.get('subject')
        user_id = request.data.get('user')
        number_of_questions = request.data.get('number_of_questions')

        # Validate that all required fields are present
        if not all([name, subject_name, user_id, number_of_questions]):
            return Response(
                {"error": "All fields (name, subject_name, user, number_of_questions) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the Subject object by name
        try:
            subject = Subject.objects.get(name=subject_name)
        except Subject.DoesNotExist:
            return Response(
                {"error": f"Subject with name '{subject_name}' does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the User object by ID
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"User with id '{user_id}' does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if a SupervisorExam with the same name and user already exists
        if SupervisorExam.objects.filter(name=name, user=user).exists():
            return Response(
                {"error": "An exam with this name already exists for the specified user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the new SupervisorExam object
        supervisor_exam = SupervisorExam.objects.create(
            name=name,
            subject=subject,
            user=user,
            number_of_questions=number_of_questions
        )

        # Serialize the created object
        serializer = SupervisorExamSerializer(supervisor_exam)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class DeleteSupervisorExamView(APIView):
    @swagger_auto_schema(
        operation_summary="Delete a Created Exam by the User",
        operation_description="Remove an exam for this supervisor.",
        tags=["Exams"]
    )
    def delete(self, request, exam_id):
        try:
            # Fetch the SupervisorExam object by its ID
            exam = SupervisorExam.objects.get(id=exam_id)
            
            # Delete the exam
            exam.delete()
            
            # Return a success response
            return Response({"message": "Exam deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except SupervisorExam.DoesNotExist:
            # Return a 404 if the exam is not found
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        

class AddSupervisorQuestionsView(APIView):
    @swagger_auto_schema(
        operation_summary="Add Exam questions for an exam",
        operation_description="Add Exam questions from the QuestionBank for an exam of a supervisor",
        tags=["Exams"]
    )
    def post(self, request, exam_id):
        questions_data = request.data.get('questions', [])

        if not questions_data:
            return Response({'error': 'No questions provided'}, status=status.HTTP_400_BAD_REQUEST)

        supervisor_questions = []
        try:
            # Fetch the user and the subject (exam) first
            exam = SupervisorExam.objects.get(id=exam_id)  # Exam is linked to the Subject model
        except (User.DoesNotExist, SupervisorExam.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        for question_data in questions_data:
            try:
                question = Question.objects.get(id=question_data['id'])

                # Check if SupervisorQuestion already exists
                supervisor_question, created = SupervisorQuestion.objects.get_or_create(
                    exam=exam,  # Link the subject as the exam
                    question=question
                )

                if created:
                    supervisor_questions.append(supervisor_question)  # Only add new records

            except Question.DoesNotExist as e:
                return Response({'error': f'Question not found: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        if supervisor_questions:
            return Response({'message': 'Questions added successfully', 'added_questions': len(supervisor_questions)}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'No new questions were added.'}, status=status.HTTP_200_OK)



class FetchExamQuestions(APIView):
    @swagger_auto_schema(
        operation_summary="Fetch Questions",
        operation_description="Retrieve a list of questions for a given exam and level.",
        tags=["Exams"]
    )
    def get(self, request, exam_id, level):
        try:
            exam = SupervisorExam.objects.get(id=exam_id)
            questions = SupervisorQuestion.objects.filter(exam=exam, question__level=level)
            data = [
                {
                    "id": question.question.id,
                    "question_text": question.question.question_text,
                    "options": [
                        question.question.option1,
                        question.question.option2,
                        question.question.option3,
                        question.question.option4,
                    ],
                }
                for question in questions
            ]

            return Response(data, status=status.HTTP_200_OK)

        except SupervisorExam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateQuestionView(APIView):
    @swagger_auto_schema(
        operation_summary="Create Custom questions for an exam",
        operation_description="Create Custom questions for the QuestionBank that can be accessed only by the given supervisor",
        tags=["Exams"]
    )
    def post(self, request):
        # Extract data from the request body
        subject_name = request.data.get('subject_name')
        question_text = request.data.get('question_text')
        level = request.data.get('level')
        option1 = request.data.get('option1')
        option2 = request.data.get('option2')
        option3 = request.data.get('option3')
        option4 = request.data.get('option4')
        correct_answer = request.data.get('correct_answer')
        user_id = request.data.get('user')

        # Validate that all required fields are present
        if not all([subject_name, question_text, level, option1, option2, option3, option4, correct_answer, user_id]):
            return Response(
                {"error": "All fields (subject_name, question_text, level, option1, option2, option3, option4, correct_answer, user) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate subject
        try:
            subject = Subject.objects.get(name=subject_name)
        except Subject.DoesNotExist:
            return Response(
                {"error": f"Subject with name '{subject_name}' does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"User with id '{user_id}' does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate level
        if level not in [choice[0] for choice in Question.LEVEL_CHOICES]:
            return Response(
                {"error": f"Invalid level '{level}', must be one of: {', '.join([choice[0] for choice in Question.LEVEL_CHOICES])}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if a similar question already exists for the same user and subject
        if Question.objects.filter(subject=subject, user=user, question_text=question_text).exists():
            return Response(
                {"error": "A similar question already exists for this user and subject."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the new Question object
        question = Question.objects.create(
            subject=subject,
            question_text=question_text,
            level=level,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            correct_answer=correct_answer,
            user=user,
            is_general=False  # The question is not general
        )

        # Serialize the created question object
        serializer = QuestionSerializer(question)

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class DeleteQuestion(APIView):
    @swagger_auto_schema(
        operation_summary="Delete a Created Question by the User",
        operation_description="Remove a question that was created by this supervisor.",
        tags=["Exams"]
    )
    def delete(self, request, question_id):
        try:
            user= request.user
            # Find the question with the given ID and created by the same user
            question = Question.objects.get(id=question_id, user=user, is_general=False)

            # Delete the question
            question.delete()

            return Response({"message": "Question deleted successfully"}, status=status.HTTP_200_OK)

        except Question.DoesNotExist:
            return Response({"error": "Question not found or cannot be deleted"}, status=status.HTTP_404_NOT_FOUND)
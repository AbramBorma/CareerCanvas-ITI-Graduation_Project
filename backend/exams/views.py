from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, Question, Exam,AssignedExams
from .serializers import SubjectSerializer,ExamSerializer
from users.models import User
import json

class FetchQuestions(APIView):
    def get(self, request, subject_name, level):
        try:
            subject = Subject.objects.get(name=subject_name)
            questions = Question.objects.filter(subject=subject, level=level)
            data = [
                {
                    "id": question.id,
                    "question_text": question.question_text,
                    "options": [question.option1, question.option2, question.option3, question.option4],
                }
                for question in questions
            ]
            return Response(data, status=status.HTTP_200_OK)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)


class SubmitExam(APIView):
    def post(self, request):
        json_data_str = request.body.decode('utf-8')
        try:
            data = json.loads(json_data_str)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

        user_email = data.get('user_email')
        subject_id = data.get('subject_id')
        answers = data.get('answers')  # {'question_id': 'selected_option', ...}

        if not user_email or not subject_id or not isinstance(answers, dict):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(email=user_email)
        subject = Subject.objects.get(name=subject_id)
        
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
        
        AssignedExams.objects.filter(user=user).delete()
        score = (correct_answers / 29) * 100 if total_questions > 0 else 0
        exam = Exam.objects.create(user=user, subject=subject, score=score)
        return Response({"score": score}, status=status.HTTP_200_OK)
    



class FetchAssignedExams(APIView):
    def get(self, request):
        json_data_str = request.body.decode('utf-8')
        try:
            data = json.loads(json_data_str)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

        user_email = data.get('user_email')
        try:
            subject = Subject.objects.get(name=subject_name)
            questions = Question.objects.filter(subject=subject, level=level)
            data = [
                {
                    "id": question.id,
                    "question_text": question.question_text,
                    "options": [question.option1, question.option2, question.option3, question.option4],
                }
                for question in questions
            ]
            return Response(data, status=status.HTTP_200_OK)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)


class SubjectListView(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
    

class UserExamScoresView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            exams = Exam.objects.filter(user=user)
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        


class AssignedSubjectsForUserView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            assigned_exams = AssignedExams.objects.filter(user=user)
            subjects = [assigned_exam.subject for assigned_exam in assigned_exams]
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AssignedExams, Subject
from users.models import User, Track

class AssignUsersToSubjectByTrackView(APIView):
    def post(self, request ,user_id):
        user = User.objects.get(id=user_id)
        subject_name = request.data.get('subject_name')
        
        if not user or not subject_name:
            return Response({"error": "Supervisor id and subject name are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_track = user.track
            subject = Subject.objects.get(name=subject_name)            
            users_in_track = User.objects.filter(track=user_track,role="student")

            assigned_count = 0
            for user in users_in_track:
                if not AssignedExams.objects.filter(user=user, subject=subject).exists():
                    AssignedExams.objects.create(user=user, subject=subject)
                    assigned_count += 1

            return Response(
                {"message": f"Assigned {assigned_count} students to the subject {subject.name} in track {user_track.name}"},
                status=status.HTTP_201_CREATED
            )
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Subject.DoesNotExist:
            return Response({"error": f"Subject '{subject_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

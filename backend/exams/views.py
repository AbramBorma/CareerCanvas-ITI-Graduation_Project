from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, Question, Exam, ExamResult

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
        user = request.user
        subject_id = request.data.get('subject_id')
        level = request.data.get('level')
        answers = request.data.get('answers')  # {'question_id': 'selected_option', ...}
        
        exam = Exam.objects.create(user=user, subject_id=subject_id, level=level)
        total_questions = 0
        correct_answers = 0

        for question_id, user_answer in answers.items():
            question = Question.objects.get(id=question_id)
            is_correct = question.correct_answer == user_answer
            if is_correct:
                correct_answers += 1
            ExamResult.objects.create(exam=exam, question=question, user_answer=user_answer, is_correct=is_correct)
            total_questions += 1

        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        return Response({"score": score}, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, Question, Exam
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

        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        exam = Exam.objects.create(user=user, subject=subject, score=score)
        return Response({"score": score}, status=status.HTTP_200_OK)
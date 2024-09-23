from rest_framework import serializers
from .models import Exam, Question, Answer

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'subject', 'level', 'time_limit', 'questions']

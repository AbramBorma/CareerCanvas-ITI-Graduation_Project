from rest_framework import serializers
from .models import Subject, Question, Exam

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class QuestionSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Question
        fields = ['id', 'subject', 'question_text', 'level', 'option1', 'option2', 'option3', 'option4', 'correct_answer']

class ExamSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    
    class Meta:
        model = Exam
        fields = ['id', 'user', 'subject', 'date_taken', 'score']

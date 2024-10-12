from rest_framework import serializers
from .models import Subject, Question, Exam,SupervisorQuestion,SupervisorExam

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class QuestionSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Question
        fields = ['id', 'subject', 'question_text', 'level', 'option1', 'option2', 'option3', 'option4', 'correct_answer' ,'user','is_general',]

    def validate(self, data):
        """
        Check that either 'user' is set or 'is_general' is True, but not both.
        """
        if data.get('user') and data.get('is_general'):
            raise serializers.ValidationError("A question cannot be both assigned to a user and general.")
        return data


class ExamSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    
    class Meta:
        model = Exam
        fields = ['id', 'user', 'subject', 'date_taken', 'score']


class SupervisorExamSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # To show username
    subject = serializers.StringRelatedField()  # To show subject name

    class Meta:
        model = SupervisorExam
        fields = ['id', 'name', 'subject', 'user', 'number_of_questions']

class SupervisorQuestionSerializer(serializers.ModelSerializer):
    exam = serializers.StringRelatedField(source='exam.name')  # To show exam name
    question = serializers.StringRelatedField(source='question.question_text')  # To show question text

    class Meta:
        model = SupervisorQuestion
        fields = ['id', 'exam', 'question']
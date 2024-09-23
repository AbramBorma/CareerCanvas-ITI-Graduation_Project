from django.shortcuts import render
from rest_framework import generics
from .models import Exam
from .serializers import ExamSerializer

class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class ExamDetailView(generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer



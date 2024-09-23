from django.urls import path
from .views import FetchQuestions, SubmitExam

urlpatterns = [
    path('api/exams/<str:subject_name>/<str:level>/', FetchQuestions.as_view(), name='fetch_questions'),
    path('api/exams/submit/', SubmitExam.as_view(), name='submit_exam'),
]

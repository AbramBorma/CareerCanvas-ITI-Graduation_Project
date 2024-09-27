from django.urls import path
from .views import FetchQuestions, SubmitExam

urlpatterns = [
    path('fetchQuestions/<str:subject_name>/<str:level>/', FetchQuestions.as_view(), name='fetch_questions'),
    path('submit/', SubmitExam.as_view(), name='submit_exam'),
]

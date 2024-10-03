from django.urls import path
from .views import FetchQuestions, SubmitExam,AssignedExams,SubjectListView,UserExamScoresView,AssignedSubjectsForUserView,AssignUsersToSubjectByTrackView

urlpatterns = [
    path('fetchQuestions/<str:subject_name>/<str:level>/', FetchQuestions.as_view(), name='fetch_questions'),
    path('submit/', SubmitExam.as_view(), name='submit_exam'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('scores/<int:user_id>/', UserExamScoresView.as_view(), name='user-exam-scores'),
    path('assigned-subjects/<int:user_id>/', AssignedSubjectsForUserView.as_view(), name='assigned-subjects-for-user'),
    path('assign-users-to-subject/<int:user_id>/', AssignUsersToSubjectByTrackView.as_view(), name='assign-users-to-subject'),



]

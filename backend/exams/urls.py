from django.urls import path
from .views import FetchQuestions, SubmitExam,SubjectListView,UserExamScoresView,AssignedSubjectsForUserView,AssignUsersToSubjectByTrackView,RemoveAssignedUsersToSubjectByTrackView
from .views import AddSupervisorQuestionsView,SupervisorExamListView,FetchExamQuestions,DeleteSupervisorExamView,CreateSupervisorExamView,CreateQuestionView

urlpatterns = [
    path('fetchQuestions/<str:subject_name>/<str:level>/', FetchQuestions.as_view(), name='fetch_questions'),
    path('submit/', SubmitExam.as_view(), name='submit_exam'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('scores/<int:user_id>/', UserExamScoresView.as_view(), name='user-exam-scores'),
    path('assigned-subjects/<int:user_id>/', AssignedSubjectsForUserView.as_view(), name='assigned-subjects-for-user'),
    path('assign-users-to-subject/<int:user_id>/', AssignUsersToSubjectByTrackView.as_view(), name='assign-users-to-subject'),
    path('remove-assigned-users-to-subject/<int:user_id>/', RemoveAssignedUsersToSubjectByTrackView.as_view(), name='assign-users-to-subject'),
    path('supervisor-exams/<int:user_id>/', SupervisorExamListView.as_view(), name='supervisor_exam_list'),
    path('add-supervisor-questions/<int:exam_id>/', AddSupervisorQuestionsView.as_view(), name='add_supervisor_questions'),
    path('exam-questions/<int:exam_id>/<str:level>/', FetchExamQuestions.as_view(), name='fetch_exam_questions'),
    path('delete-exam/<int:exam_id>/', DeleteSupervisorExamView.as_view(), name='delete_supervisor_exam'),
    path('create-supervisor-exam/', CreateSupervisorExamView.as_view(), name='create_supervisor_exam'),
    path('create-question/', CreateQuestionView.as_view(), name='create-question'),




]

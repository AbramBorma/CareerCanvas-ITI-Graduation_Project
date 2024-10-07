from django.contrib import admin
from .models import Subject, Question, Exam,AssignedExams,SupervisorQuestion,SupervisorExam

admin.site.register(Subject)
admin.site.register(Question)
admin.site.register(Exam)
admin.site.register(AssignedExams)
admin.site.register(SupervisorExam)
admin.site.register(SupervisorQuestion)


from django.db import models
from users.models import User
from django.core.exceptions import ValidationError


class Subject(models.Model):
    name = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    LEVEL_CHOICES = [
        ('easy', 'Easy'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('coding', 'Coding'),
    ]
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)
    correct_answer = models.CharField(max_length=200)


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_general = models.BooleanField(default=True)

    def clean(self):
        if self.user and self.is_general:
            raise ValidationError("A question cannot be both assigned to a user and general.")

    def save(self, *args, **kwargs):
        self.clean()  # Call the clean method to validate
        super().save(*args, **kwargs)


    def __str__(self):
        return self.question_text[:50]
    





class SupervisorExam(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    number_of_questions = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}for{self.user.username}"
    


class Exam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(SupervisorExam, on_delete=models.CASCADE)
    # level = models.CharField(max_length=20, choices=Question.LEVEL_CHOICES)
    date_taken = models.DateTimeField(auto_now_add=True)
    score = models.DecimalField(max_digits=5, decimal_places=2 ,default=0)  
        
    def __str__(self):
        return f"{self.subject.name} exam for {self.user.username} on {self.date_taken}"

    class Meta:
        ordering = ['-date_taken']  


class AssignedExams(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(SupervisorExam, on_delete=models.CASCADE)
    
    @classmethod
    def get_subject_names_by_student_id(cls, student_id):
        return cls.objects.filter(user_id=student_id).values_list('subject__name', flat=True)
        
    def __str__(self):
        return f"{self.subject} exam for {self.user.username}"
    





class SupervisorQuestion(models.Model):
    exam = models.ForeignKey(SupervisorExam, on_delete=models.CASCADE, related_name="SupervisorExam")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exam.name} for {self.exam.user.username}: {self.question.question_text[:50]}"

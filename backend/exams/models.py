from django.db import models
from users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=100)

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

    def __str__(self):
        return self.question_text[:50]

class Exam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # level = models.CharField(max_length=20, choices=Question.LEVEL_CHOICES)
    date_taken = models.DateTimeField(auto_now_add=True)
    score = models.DecimalField(max_digits=5, decimal_places=2 ,default=0)  
        
    def __str__(self):
        return f"{self.subject} exam for {self.user.username} on {self.date_taken}"

    class Meta:
        ordering = ['-date_taken']  


class AssignedExams(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

        
    def __str__(self):
        return f"{self.subject} exam for {self.user.username}"
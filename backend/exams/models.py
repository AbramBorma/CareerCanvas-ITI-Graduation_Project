from django.db import models

class Exam(models.Model):
    SUBJECT_CHOICES = [
        ('HTML', 'HTML'),
        ('JS', 'JavaScript'),
        ('PHP', 'PHP'),
        ('Python', 'Python'),
        ('NodeJS', 'NodeJS'),
    ]

    LEVEL_CHOICES = [
        ('Easy', 'Easy'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    time_limit = models.IntegerField(default=15)  # 15 minutes

    def __str__(self):
        return f"{self.subject} - {self.level}"

class Question(models.Model):
    exam = models.ForeignKey(Exam, related_name="questions", on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text

class Answer(models.Model):
    question = models.ForeignKey(Question, related_name="answers", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

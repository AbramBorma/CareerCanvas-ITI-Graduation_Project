from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

class Organization(models.TextChoices):
    ITI = "ITI", "ITI"
    SELF = "Self", "Self"

class Role(models.TextChoices):
    ADMIN = "admin", "Admin"
    EMPLOYEE = "employee", "Employee"
    USER = "user", "User"


class Branch(models.TextChoices):
    NEW_CAPITAL = "New Capital", "New Capital"
    CAIRO = "Cairo", "Cairo"
    MENOFIA = "Menofia", "Menofia"

class Course(models.TextChoices):
    PHP = "Open Source PHP", "Open Source PHP"
    PYTHON = "Open Source Python", "Open Source Python"

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    organization = models.CharField(max_length=10, choices=Organization.choices, default=Organization.SELF)
    branch = models.CharField(max_length=20, choices=Branch.choices, blank=True, null=True)
    course = models.CharField(max_length=30, choices=Course.choices, blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username        
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    
    linkedin = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    leetcode = models.URLField(blank=True, null=True)
    hackerrank = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.full_name


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

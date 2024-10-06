from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Define Role Model (for choices in User model)
class Role(models.TextChoices):
    ADMIN = "admin", "Admin"
    SUPERVISOR = "supervisor", "Supervisor"
    STUDENT = "student", "Student"

# Define Organization Model
class Organization(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# Define Branch Model
class Branch(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    admin = models.OneToOneField('User', null=True, blank=True, on_delete=models.SET_NULL, related_name="branch_admin")

    def __str__(self):
        return f"{self.name} - {self.organization.name}"

# Define Track Model
class Track(models.Model):
    name = models.CharField(max_length=100)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    supervisor = models.ForeignKey('User', null=True, blank=True, on_delete=models.CASCADE, related_name='tracks')  # Each track belongs to one supervisor

    def __str__(self):
        return f"{self.name} - {self.branch.name}"

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.is_active = False  # Ensure that the user isn't active until approved
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', Role.ADMIN)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, username, password, **extra_fields)

# Define User Model
class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=20, choices=Role.choices)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)
    branch = models.ForeignKey(Branch, null=True, blank=True, on_delete=models.SET_NULL)
    track = models.ForeignKey(Track, null=True, blank=True, on_delete=models.SET_NULL)
    email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    # New field for approval status
    is_approved_by_admin = models.BooleanField(default=False)  # Add this line

    github = models.URLField(blank=True, null=True)
    hackerrank = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    leetcode = models.URLField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.role == Role.STUDENT and not self.is_superuser:
            required_fields = ['github', 'hackerrank', 'linkedin', 'leetcode']
            for field in required_fields:
                if not getattr(self, field):
                    raise ValueError(f"{field.capitalize()} URL is required for students.")
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username


from .base import *
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
dotenv_path = os.path.join(BASE_DIR, '.env.dev')

print(f"Loading dotenv from: {dotenv_path}") 

load_dotenv(dotenv_path)

print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'career_canvas'),
        'USER': os.getenv('DB_USER', 'career_canvas'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'iti_GP'),
        'HOST': os.getenv('DB_HOST', 'localhost'),  # or '127.0.0.1'
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Development-specific email backend, caching, etc.
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com' 
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'mariamabdalmageid@gmail.com'  
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER  
FRONTEND_URL = 'http://localhost:3000' 

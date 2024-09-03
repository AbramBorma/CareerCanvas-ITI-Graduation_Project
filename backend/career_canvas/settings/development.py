from .base import *
import os

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
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

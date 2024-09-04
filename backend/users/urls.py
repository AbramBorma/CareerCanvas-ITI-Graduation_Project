# users/urls.py

from django.urls import path
from .views import UserRegistrationView, ActivateAccountView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate_account'),
]

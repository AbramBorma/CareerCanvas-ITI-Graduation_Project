# backend/api/urls.py

from django.urls import path
from .views import GitHubUsernameView

urlpatterns = [
    path('get-github-username/', GitHubUsernameView.as_view(), name='get_github_username'),
]

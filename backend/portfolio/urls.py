# backend/portfolio/urls.py
from django.urls import path
from .views import GitHubStatsView

urlpatterns = [
    path('github-stats/', GitHubStatsView.as_view(), name='github-stats'),
]

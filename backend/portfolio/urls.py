from django.urls import path
from .views import github_stats

urlpatterns = [
    path('github-stats/', github_stats, name='github_stats'),
]

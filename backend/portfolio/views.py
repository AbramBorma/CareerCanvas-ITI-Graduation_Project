# backend/portfolio/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class GitHubStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # Get the currently logged-in user
        if user.github and 'github.com/' in user.github:
            github_username = user.github.split('github.com/')[-1]
            return Response({'github_username': github_username})
        return Response({'error': 'GitHub link not found or invalid'}, status=400)

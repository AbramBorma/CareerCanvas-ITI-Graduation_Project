# backend/api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class GitHubUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        github_link = user.github

        if not github_link:
            return Response({"error": "GitHub link not found."}, status=400)

        try:
            github_username = github_link.rstrip('/').split('/')[-1]
            return Response({"github_username": github_username}, status=200)
        except IndexError:
            return Response({"error": "Invalid GitHub link."}, status=400)

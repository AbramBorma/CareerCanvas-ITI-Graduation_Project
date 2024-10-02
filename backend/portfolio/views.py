# backend/portfolio/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from users.permissions import IsStudent, IsSupervisor
from rest_framework.permissions import IsAuthenticated
from users.models import Branch, Track, Organization, User, Role
from rest_framework.exceptions import NotFound
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

class GitHubStatsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        user = request.user  # Get the currently logged-in user
        print(user)
        if user.github and 'github.com/' in user.github:
            github_username = user.github.split('github.com/')[-1]
            return Response({'github_username': github_username})
        return Response({'error': 'GitHub link not found or invalid'}, status=400)

# Function to extract the Leetcode username from the provided URL
def extract_username_from_leetcode_url(url):
    parts = url.rstrip('/').split('/')
    if len(parts) > 2 and parts[-2] == 'u':
        return parts[-1]
    return None

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_leetcode_data(request, student_id):
    try:
        user = User.objects.get(id=student_id, role=Role.STUDENT)
    except User.DoesNotExist:
        raise NotFound("User doesn't exist")
    
    leetcode_url = getattr(user, 'leetcode', None)
    github_url = getattr(user, 'github', None)

    if not leetcode_url:
        return Response({"error": "Leetcode URL not found for this student"}, status=404)

    # Extracting LeetCode username
    leetcode_username = extract_username_from_leetcode_url(leetcode_url)
    
    # Extracting GitHub username
    github_username = github_url.split('github.com/')[-1].split('/')[0] if github_url else None

    if not leetcode_username:
        return Response({"error": "Invalid Leetcode URL"}, status=400)
    elif not github_username:
        return Response({"error": "Invalid Github URL"}, status=400)
    
    return Response({
        "leetcode_username": leetcode_username,
        "github_username": github_username
    })  # Return both usernames to the frontend



@api_view(['GET'])
@permission_classes([IsSupervisor])
def get_student_portfolio(request, student_id):
    # Verify the supervisor's authorization to access the student's portfolio
    supervisor_user = request.user
    
    # Fetch the student object based on the ID
    student = get_object_or_404(User, id=student_id, role=Role.STUDENT, branch=supervisor_user.branch, track_id=supervisor_user.track_id)
    print(f"student is {student}")
    
    leetcode_url = getattr(student, 'leetcode', None)
    
    if not leetcode_url:
        return Response({"error": "Leetcode URL not found for this student"}, status=404)
    
    leetcode = extract_username_from_leetcode_url(leetcode_url)
    if not leetcode:
        return Response({"error": "Invalid Leetcode URL"}, status=400)
    # Make sure to return some meaningful data
    data = {
        "id": student.id,
        "full_name": f"{student.first_name} {student.last_name}",
        "email": student.email,
        "leetcode": leetcode
        # Add any other necessary fields to the response
    }
    print(data)
    

    return Response(data)  # Ensure you're returning a valid Response
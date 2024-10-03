import re
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from career_canvas.tasks import run_github_scraping, run_hackerrank_scraping
from rest_framework.decorators import api_view, permission_classes
from users.permissions import IsStudent, IsSupervisor
from rest_framework.permissions import IsAuthenticated
from users.models import Branch, Track, Organization, User, Role
from rest_framework.exceptions import NotFound
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication


User = get_user_model()
 
#def extract_github_username(url):
#     parts = url.split('github.com/')
#     return parts[-1]
    

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_github_username(request, student_id):
#     try:
#         user = User.objects.get(id=student_id, role=Role.STUDENT)
#     except User.DoesNotExist:
#         raise NotFound("User doesn't exist")
    
#     github_url = getattr(user, 'github', None)
    
#     if not github_url:
#         return Response({"error": "GitHub URL not found for this student"}, status=404)
    
#     github_username = extract_github_username(github_url)
#     if not github_username:
#         return Response({"error": "Invalid GitHub URL", "github_username":github_username}, status=400)
    
#     return Response({"github_username": github_username})  
    


class HackerRankDataView(APIView):
    def get(self, request, username):
        # Cache key for HackerRank data
        cache_key = f'hackerrank_data_{username}'
        cached_data = cache.get(cache_key)

        if cached_data:
            # Return cached data if available
            return Response(cached_data)
        else:
            # Trigger Celery task to scrape HackerRank data
            run_hackerrank_scraping.delay(username)

            # Inform the client that the scraping has started
            return Response({'message': 'HackerRank scraping started, try again later.'})

# Leetcode Data Fetching from the ready link

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
    
    if not leetcode_url:
        return Response({"error": "Leetcode URL not found for this student"}, status=404)
    
    leetcode_username = extract_username_from_leetcode_url(leetcode_url)
    if not leetcode_username:
        return Response({"error": "Invalid Leetcode URL"}, status=400)
    
    return Response({"username": leetcode_username})  # Return just the username to the frontend

def extract_username_from_hackerrank_url(url):
    parts = url.rstrip('/').split('/')
    if len(parts) > 2 and parts[-2] == 'profile':
        return parts[-1]
    return None

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_hackerrank_data(request, student_id):
    print(f"Received request for HackerRank stats for student ID: {student_id}")

    try:
        user = User.objects.get(id=student_id, role=Role.STUDENT)
        print(user)
    except User.DoesNotExist:
        raise NotFound("User doesn't exist")
    
    hackerrank_url = getattr(user, 'hackerrank', None)
    print(hackerrank_url)
    
    if not hackerrank_url:
        return Response({"error": "HackerRank URL not found for this student"}, status=404)
    
    hackerrank_username = extract_username_from_hackerrank_url(hackerrank_url)
    print(hackerrank_username)
    if not hackerrank_username:
        return Response({"error": "Invalid Leetcode URL"}, status=400)
    
    return Response({"username": hackerrank_username})

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

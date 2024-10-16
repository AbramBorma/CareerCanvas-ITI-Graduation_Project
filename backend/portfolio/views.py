import re
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from users.permissions import IsStudent, IsSupervisor
from rest_framework.permissions import IsAuthenticated
from users.models import Branch, Track, Organization, User, Role
from rest_framework.exceptions import NotFound
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



User = get_user_model()

def extract_github_username(url):
    parts = url.split('github.com/')
    return parts[-1]
    
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve GitHub username for a student",
    operation_summary="Get GitHub Username",
    tags=["Portfolio"]
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_github_username(request, student_id):
    try:
        user = User.objects.get(id=student_id, role=Role.STUDENT)
    except User.DoesNotExist:
        raise NotFound("User doesn't exist")
    
    github_url = getattr(user, 'github', None)
    
    if not github_url:
        return Response({"error": "GitHub URL not found for this student"}, status=404)
    
    github_username = extract_github_username(github_url)
    if not github_username:
        return Response({"error": "Invalid GitHub URL", "github_username":github_username}, status=400)
    
    return Response({"github_username": github_username})  
   
    


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

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve Leetcode and GitHub usernames for a student",
    operation_summary="Get Leetcode and GitHub Usernames",
    tags=["Portfolio"]
)
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


@swagger_auto_schema(
    method='get',
    operation_description="Retrieve a student's portfolio for supervisors",
    operation_summary="Get Student Portfolio",
    tags=["Portfolio"]
)
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

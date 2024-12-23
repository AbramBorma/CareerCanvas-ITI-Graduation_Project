from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from exams.models import AssignedExams
from users.serializer import EditProfileSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from users.models import Branch, Track, Organization, User, Role

from .models import User 
from django.urls import reverse
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.contrib.sites.shortcuts import get_current_site


from users.serializer import (
    MyTokenObtainPairSerializer,
    OrganizationSerializer,
    RegisterSerializer,
    PasswordResetSerializer,
    SetNewPasswordSerializer,
    UserSerializer,
    TrackSerializer
)
from users.permissions import IsAdmin, IsSupervisor, IsStudent


# JWT Token View
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    @swagger_auto_schema(operation_summary="Generate JWT Token", tags=['Auth'])
    def post(self, request, *args, **kwargs):
        user = User.objects.get(email=request.data['email'])
        if user and user.is_verified == True:
            if not user.check_password(request.data['password']):
                raise AuthenticationFailed("Invalid password")
            return super().post(request, *args, **kwargs)
        raise AuthenticationFailed("Your account is not activated yet. Please contact the admin.")

        


# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    @swagger_auto_schema(operation_summary="User Registration", tags=['Auth'])
    def perform_create(self, serializer):
        user = serializer.save()

        if user.role in [Role.ADMIN, Role.SUPERVISOR, Role.STUDENT]:
            user.is_active = False  # Make user inactive until they verify their email or get approved
            user.save()

        print(f"User {user.username} registered successfully with role {user.role}")
        


# Approve user view (Admin or Supervisor approval required)
@swagger_auto_schema(method='post', operation_summary="Approve Supervisor (Admin)", tags=['Admin'])
@api_view(['POST'])
@permission_classes([IsAdmin])  
def approve_supervisor(request, user_id):
    try:
        # Get the logged-in admin
        admin_user = request.user

        # Try to fetch the supervisor by ID
        user = User.objects.get(id=user_id, role=Role.SUPERVISOR)

        # Check if the supervisor belongs to the same branch as the admin
        if user.branch == admin_user.branch:
            user.is_authorized = True  # Approve the supervisor
            user.save()

            # Send approval email
            send_mail(
                'Account Approved',
                f'Congratulations {user.username}, your account has been approved as a supervisor.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
            )
            return Response({'message': 'Supervisor account approved successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You can only approve supervisors in your branch."}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Supervisor not found.'}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(method='get', operation_summary="Get Supervisors (Admin)", tags=['Admin'])    
@api_view(['GET'])
@permission_classes([IsAdmin])  # Use your custom permission to ensure the user is an admin
def get_supervisors(request):
    # Get the logged-in admin
    print(f"Incoming request from user: {request.user}")
    
    admin_user = request.user
    print(admin_user)

    # Check if the user has the admin role (in case IsAdmin permission isn't used)
    if admin_user.role == Role.ADMIN:
        # Filter supervisors in the same branch as the admin
        supervisors = User.objects.filter(role=Role.SUPERVISOR, branch=admin_user.branch)

        supervisors_list = [
            {
                "id": supervisor.id,
                "first_name": supervisor.first_name,  # Add first name
                "last_name": supervisor.last_name,    # Add last name
                "branch": supervisor.branch.name if supervisor.branch else "N/A",  # Add branch name, handle case if branch is None
                "is_authorized": supervisor.is_authorized  # whether the supervisor is approved or not
            }
            for supervisor in supervisors
        ]

        # Return supervisors list
        return Response({"supervisors": supervisors_list}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "You do not have permission to view this."}, status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(method='delete', operation_summary="Delete Supervisor (Admin)", tags=['Admin'])
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAdmin])  # Ensure only admins can delete supervisors
def delete_supervisor(request, user_id):
    print(f"Attempting to delete user with ID: {user_id}")  # Debugging line

    try:
        admin_user = request.user
        print(admin_user)
        # Try to fetch the supervisor by ID
        user = User.objects.get(id=user_id, role=Role.SUPERVISOR)
        
        if user.branch == admin_user.branch:

            # Perform deletion
            user.delete()

            return Response({'message': 'Supervisor account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'Supervisor not found.'}, status=status.HTTP_404_NOT_FOUND)
    

class ApproveStudentAPIView(APIView):
    permission_classes = [IsSupervisor]

    @swagger_auto_schema(operation_summary="Approve Student (Supervisor)", tags=['Supervisor'])
    def post(self, request, student_id):
        try:
            supervisor_user = request.user

            student = User.objects.get(
                id=student_id, 
                role=Role.STUDENT, 
                branch=supervisor_user.branch, 
                track_id=supervisor_user.track_id
            )

            student.is_authorized = True
            student.save()

            # Send approval email
            send_mail(
                'Account Approved',
                f'Congratulations {student.first_name} {student.last_name}, your account has been approved.',
                settings.DEFAULT_FROM_EMAIL,
                [student.email],
            )
            return Response({'message': 'Student account approved successfully.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentPagination(PageNumberPagination):
    page_size = 5  # Pagination set to 5 students per page

class StudentListAPIView(APIView):
    permission_classes = [IsSupervisor]
    pagination_class = StudentPagination

    def get(self, request):
        supervisor_user = request.user
        search_query = request.GET.get('search', '')  # Get the search query from the request

        # Filter students based on the search query, and the role, branch, and track of the supervisor
        students = User.objects.filter(
            role=Role.STUDENT,
            branch=supervisor_user.branch,
            track_id=supervisor_user.track_id
        ).filter(
            Q(first_name__icontains=search_query) | Q(last_name__icontains=search_query)
        ).order_by('first_name')  # You can search by both first and last names

        paginator = StudentPagination()
        paginated_students = paginator.paginate_queryset(students, request)

        students_list = [
            {
                "id": student.id,
                "full_name": f"{student.first_name} {student.last_name}",
                "username": student.username,
                "email": student.email,
                "track": student.track.name if student.track else None,
                "is_authorized": student.is_authorized,
                "branch": student.branch.name if student.branch else None,
                "exams": AssignedExams.get_subject_names_by_student_id(student.id)
            }
            for student in paginated_students
        ]

        return paginator.get_paginated_response(students_list)




class DeleteStudentAPIView(APIView):
    permission_classes = [IsSupervisor]

    @swagger_auto_schema(operation_summary="Delete Student (Supervisor)", tags=['Supervisor'])
    def delete(self, request, student_id):
        try:
            supervisor_user = request.user

            student = User.objects.get(
                id=student_id, 
                role=Role.STUDENT, 
                branch=supervisor_user.branch, 
                track_id=supervisor_user.track_id
            )

            student.delete()
            return Response({'message': 'Student account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

# Get All API Routes
@swagger_auto_schema(method='get', operation_summary="Get Routes", tags=['Misc'])
@permission_classes([AllowAny,])
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
    ]
    return Response(routes)


# Test Endpoint for GET/POST Requests
@swagger_auto_schema(method='get', operation_summary="Test GET/POST Endpoint", tags=['Misc'])
@swagger_auto_schema(method='post', operation_summary="Test POST Endpoint", tags=['Misc'])
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulations {request.user}, your API just responded to a GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello "
        data = f'Congratulations, your API just responded to a POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


# Password Reset View
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

class PasswordResetView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['email'])
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,  
                [user.email],
            )

            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Confirmation View
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            serializer = SetNewPasswordSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid link or expired.'}, status=status.HTTP_400_BAD_REQUEST)


# # Send Password Reset Email
# @swagger_auto_schema(method='post', operation_summary="Send Password Reset Email", tags=['Auth'])
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def send_password_reset_email(request):
#     email = request.data.get('email')
#     try:
#         user = User.objects.get(email=email)
#         token = default_token_generator.make_token(user)
#         uid = urlsafe_base64_encode(force_bytes(user.pk))

#         reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

#         send_mail(
#             'Reset Your Password',
#             f'Click the link to reset your password: {reset_url}',
#             settings.DEFAULT_FROM_EMAIL,
#             [email],
#             fail_silently=False,
#         )
#         return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
#     except User.DoesNotExist:
#         return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# # Confirm Password Reset 
# @swagger_auto_schema(method='post', operation_summary="Confirm Password Reset", tags=['Auth'])
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def reset_password_confirm(request, uidb64, token):
#     try:
#         uid = urlsafe_base64_decode(uidb64).decode()
#         user = User.objects.get(pk=uid)

#         if default_token_generator.check_token(user, token):
#             new_password = request.data.get('new_password')
#             user.set_password(new_password)
#             user.save()
#             return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

#     except User.DoesNotExist:
#         return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)


# List All Roles (Admin, Supervisor, Student)
@swagger_auto_schema(method='get', operation_summary="Roles List", tags=['General'])
@api_view(['GET'])
@permission_classes([AllowAny])
def roles_view(request):
    roles = [
        {'key': Role.ADMIN, 'value': Role.ADMIN.label},
        {'key': Role.SUPERVISOR, 'value': Role.SUPERVISOR.label},
        {'key': Role.STUDENT, 'value': Role.STUDENT.label},
    ]
    return Response(roles, status=status.HTTP_200_OK)


# Admin View
@swagger_auto_schema(method='get', operation_summary="Admin View", tags=['Admin'])
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_view(request):
    data = f"Hello Admin {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Supervisor View
@swagger_auto_schema(method='get', operation_summary="Supervisor View", tags=['Supervisor'])
@api_view(['GET'])
@permission_classes([IsSupervisor])
def supervisor_view(request):
    data = f"Hello Supervisor {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Student View
@swagger_auto_schema(method='get', operation_summary="Student View", tags=['Student'])
@api_view(['GET'])
@permission_classes([IsStudent])
def student_view(request):
    data = f"Hello User {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Activate User (Admin Only)
@swagger_auto_schema(method='post', operation_summary="Activate User (Admin)", tags=['Admin'])
@api_view(['POST'])
@permission_classes([IsAdminUser])
def activate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'}, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# List All Tracks
@swagger_auto_schema(method='get', operation_summary="List All Tracks", tags=['General'])
@api_view(['GET'])
@permission_classes([AllowAny])  # Ensure this allows unauthenticated access
def tracks_list(request):
    branch_id = request.query_params.get('branch')  # Get the branch ID from the query parameters
    if branch_id:
        tracks = Track.objects.filter(branch_id=branch_id)
        serializer = TrackSerializer(tracks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Branch ID not provided'}, status=status.HTTP_400_BAD_REQUEST)




# List All Organizations
@swagger_auto_schema(method='get', operation_summary="List All Organizations", tags=['General'])
@api_view(['GET'])
@permission_classes([AllowAny])  # Ensure this allows unauthenticated access
def organizations_list(request):
    organizations = Organization.objects.all()
    data = [{'id': org.id, 'name': org.name} for org in organizations]
    return Response(data)


# List All Branches
@swagger_auto_schema(method='get', operation_summary="List All Branches", tags=['General'])
@api_view(['GET'])
@permission_classes([AllowAny])  # Ensure this allows unauthenticated access
def branches_list(request):
    organization_id = request.query_params.get('organization')  # Get the organization ID from the query parameters
    if organization_id:
        branches = Branch.objects.filter(organization_id=organization_id)
        data = [{'id': branch.id, 'name': branch.name} for branch in branches]
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Organization ID not provided'}, status=status.HTTP_400_BAD_REQUEST)


# Register User Endpoint
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # Ensure this allows unauthenticated access
def register_user(request):
    serializer = UserSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email = serializer.data['email'])
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))    
            
        
        # Generate verification link
        current_site = get_current_site(request)
        verification_url = f"http://{current_site.domain}{reverse('verify_email', args=[uid, token])}"
        
        
        print(verification_url)

        # Send verification email
        subject = 'Verify Your Email'
        message = f'Hi {user.username},\n\nPlease verify your email by clicking the link: {verification_url}'
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        print(f"Verification email sent to {user.username} at {user.email}")
            
        
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def verify_email(request, uidb64, token):
    try:
        uidb = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk = uidb)
        if not user.is_verified and default_token_generator.check_token(user, token):  #change to is verfied
            user.is_verified = True  # Activate the user's account
            user.is_active = True
            user.save()
            return HttpResponse('Your email has been verified. You can now log in.')
        else:
            return HttpResponse('Your email has already been verified.')
    except User.DoesNotExist:
        return HttpResponse('Invalid verification link.')

#####################################
class EditProfileView(generics.RetrieveUpdateAPIView): 
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = EditProfileSerializer

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        print("Request Data:", request.data)  
        return super().put(request, *args, **kwargs)

    def get(self, request, *args, **kwargs): 
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

from django.shortcuts import render
from django.http import JsonResponse
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
from rest_framework.views import APIView  # <-- Add this import
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages




from users.models import Branch, Track, Organization, User, Role
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

    def post(self, request, *args, **kwargs):
        user = User.objects.filter(email=request.data['email']).first()
        if user and not user.is_active:
            raise AuthenticationFailed("Your account is not activated yet. Please contact the admin.")
        return super().post(request, *args, **kwargs)


# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        if user.role in [Role.ADMIN, Role.SUPERVISOR]:
            user.is_active = False  # Mark the user as inactive until approval
            user.save()
            
            # Notify admin for approval via email
            send_mail(
                'Approval Needed for New Registration',
                f'User {user.username} with role {user.role} has registered and is awaiting approval.',
                'from@example.com',
                ['admin@example.com'],  # Send this to the admin for approval
                fail_silently=False,
            )
        
        elif user.role == Role.STUDENT:
            user.is_active = False  # For students, ensure account remains inactive until admin approval
            user.save()

        print(f"User {user.username} registered successfully with role {user.role}")


# Approve user view (Admin or Supervisor approval required)
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
            user.is_active = True  # Approve the supervisor
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
    
@api_view(['GET'])
@permission_classes([IsAdmin])
def get_supervisors(request):
    # Get the logged-in admin
    admin_user = request.user
    
    if admin_user.role == Role.ADMIN:
        # Filter supervisors in the same branch as the admin
        supervisors = User.objects.filter(role=Role.SUPERVISOR, branch=admin_user.branch)

        if supervisors.exists():
            supervisors_list = [
                {
                    "id": supervisor.id,
                    "username": supervisor.username,
                    "email": supervisor.email,
                    "is_active": supervisor.is_active  # whether the supervisor is approved or not
                }
                for supervisor in supervisors
            ]
            return Response({"supervisors": supervisors_list}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No supervisors in this branch."}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "You do not have permission to view this."}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsSupervisor])  
def approve_student(request, student_id):
    try:
        # Get the logged-in supervisor
        supervisor_user = request.user

        # Try to fetch the student by ID and ensure they are in the same branch and track
        student = User.objects.get(id=student_id, role=Role.STUDENT, branch=supervisor_user.branch, tracks__in=supervisor_user.tracks.all())

        # Approve the student
        student.is_active = True
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


@api_view(['GET'])
@permission_classes([IsSupervisor])
def get_students(request):
    supervisor_user = request.user

    if supervisor_user.role == Role.SUPERVISOR:
        # Filter students by the same branch and track as the supervisor
        students = User.objects.filter(role=Role.STUDENT, branch=supervisor_user.branch, tracks__in=supervisor_user.tracks.all())
        
        if students.exists():
            students_list = [
                {
                    "id": student.id,
                    "Full Name": f"{student.first_name} {student.last_name}",
                    "username": student.username,
                    "email": student.email,
                    "track": [track.name for track in student.tracks.all()],
                    "is_active": student.is_active,
                }
                for student in students
            ]
            return Response({"students": students_list}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No students in this track."}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "You do not have permission to view this."}, status=status.HTTP_403_FORBIDDEN)



# Get All API Routes
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
    ]
    return Response(routes)


# Test Endpoint for GET/POST Requests
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
class PasswordResetView(APIView):
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


# Send Password Reset Email
@api_view(['POST'])
def send_password_reset_email(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        send_mail(
            'Reset Your Password',
            f'Click the link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# Confirm Password Reset 
@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)


# List All Roles (Admin, Supervisor, Student)
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
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_view(request):
    data = f"Hello Admin {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Supervisor View
@api_view(['GET'])
@permission_classes([IsSupervisor])
def supervisor_view(request):
    data = f"Hello Supervisor {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Student View
@api_view(['GET'])
@permission_classes([IsStudent])
def student_view(request):
    data = f"Hello User {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)


# Activate User (Admin Only)
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
@api_view(['GET'])
def tracks_list(request):
    tracks = Track.objects.all()
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# List All Organizations
@api_view(['GET'])
def organizations_list(request):
    organizations = Organization.objects.all()
    data = [{'id': org.id, 'name': org.name} for org in organizations]
    return Response(data)


# List All Branches
@api_view(['GET'])
def branches_list(request):
    branches = Branch.objects.all()
    data = [{'id': branch.id, 'name': branch.name} for branch in branches]
    return Response(data)


# Register User Endpoint
@csrf_exempt
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

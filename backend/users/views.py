from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


from django.shortcuts import render
from django.http import JsonResponse
from users.models import Organization, User  

from users.serializer import MyTokenObtainPairSerializer, RegisterSerializer  
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator, PasswordResetTokenGenerator
from .serializer import PasswordResetSerializer, SetNewPasswordSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin, IsEmployee, IsUser  

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

######################################################################################################################################

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

######################################################################################################################################


# Get All Routes
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
    ]
    return Response(routes)

######################################################################################################################################


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

######################################################################################################################################


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


######################################################################################################################################


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

######################################################################################################################################


token_generator = PasswordResetTokenGenerator()

######################################################################################################################################

@api_view(['POST'])
def send_password_reset_email(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = token_generator.make_token(user)
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

######################################################################################################################################

@api_view(['POST'])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        if token_generator.check_token(user, token):
            new_password = request.data.get('new_password')
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)

######################################################################################################################################

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if not request.user.is_active:
        return Response({'error': 'Your account is under review.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        if request.user.role == 'admin':
            data = "Admin access"
        elif request.user.role == 'employee' and request.user.organization == 'ITI':
            data = "Employee access"
        elif request.user.role == 'user':
            data = "User access"
        else:
            data = "No permissions"
        return Response({'response': data}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        text = "Hello "
        data = f'Congratulations, your API just responded to a POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    
    
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_view(request):
    data = f"Hello Admin {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsEmployee])
def employee_view(request):
    data = f"Hello Employee {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsUser])
def user_view(request):
    data = f"Hello User {request.user.username}, you have access to this view."
    return Response({'response': data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdmin])  
def approve_user(request, user_id):
    try:
        user = User.objects.get(id=user_id, organization=Organization.ITI)
        user.is_active = True
        user.save()

        send_mail(
            'Account Approved',
            f'Congratulations {user.username}, your ITI account has been approved and your role is {user.role}.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )
        return Response({'message': 'User account approved and email sent.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found or not in ITI organization.'}, status=status.HTTP_404_NOT_FOUND)
    
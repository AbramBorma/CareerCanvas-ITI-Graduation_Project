from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, login
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.views import View
from .forms import RegistrationForm
from .tokens import account_activation_token  # Custom token generator

User = get_user_model()

class UserRegistrationView(View):
    def get(self, request):
        form = RegistrationForm()
        return render(request, 'registration/register.html', {'form': form})

    def post(self, request):
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False  # Deactivate account until email is confirmed
            user.save()
            # Send activation email
            self.send_activation_email(request, user)
            return render(request, 'registration/confirm_email.html')
        return render(request, 'registration/register.html', {'form': form})

    def send_activation_email(self, request, user):
        subject = 'Activate Your Account'
        message = render_to_string('registration/activation_email.html', {
            'user': user,
            'domain': request.get_host(),
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': default_token_generator.make_token(user),
        })
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if account_activation_token.check_token(user, token):
                user.is_active = True
                user.save()
                login(request, user)  # Automatically log the user in after activation
                return redirect('login')  # Redirect to login page or any other page
            else:
                return render(request, 'registration/activation_invalid.html')  # Invalid token page
        except User.DoesNotExist:
            return render(request, 'registration/activation_invalid.html')  # Invalid user page
        

        from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'This is a protected view!'}, status=200)
    

    # views.py
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


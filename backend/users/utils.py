from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.conf import settings

def send_verification_email(user, request):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    verification_url = request.build_absolute_uri(
        reverse('users:verify_email', kwargs={'uidb64': uid, 'token': token})
    )

    subject = 'Verify your email'
    message = f'Click the link to verify your email: {verification_url}'

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

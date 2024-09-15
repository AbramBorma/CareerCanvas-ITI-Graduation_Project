# tests.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.registration_url = '/api/register/'  # Adjust URL according to your configuration

    def test_user_registration_success(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com'
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)


class UserLoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/token/'

        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_login_success(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


from django.core import mail

class PasswordResetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.reset_url = '/api/password/reset/'  # Adjust URL according to your configuration

        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='testuser@example.com')

    def test_password_reset_request_success(self):
        data = {'email': 'testuser@example.com'}
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)  # Check if one email has been sent
        self.assertIn('subject', mail.outbox[0].subject)  # Verify email content if needed


class TokenTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/token/'
        self.refresh_url = '/api/token/refresh/'

        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Obtain an access token
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'testpassword'}, format='json')
        self.access_token = response.data['access']
        self.refresh_token = response.data['refresh']

    def test_token_expiration(self):
        # Here you might need to manually set the token to expire or use a mock.
        # Simulate token expiration
        import time
        time.sleep(6 * 60)  # Assuming token expiry is set to 5 minutes

        # Try to access a protected resource
        response = self.client.get('/protected/', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        response = self.client.post(self.refresh_url, {'refresh': self.refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


        # users/tests.py

from django.test import TestCase

class SimpleTest(TestCase):
    def test_basic(self):
        self.assertEqual(1 + 1, 2)

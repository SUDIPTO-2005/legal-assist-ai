from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.profile_url = reverse('authentication:profile')
        self.user_data = {
            'email': 'advocate@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'full_name': 'Sarah Jenkins',
            'profession': 'Legal Counsel',
            'explanation_mode': 'professional'
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'advocate@example.com')

    def test_user_registration_password_mismatch(self):
        data = self.user_data.copy()
        data['password_confirm'] = 'DifferentPassword123!'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_data = {
            'email': 'advocate@example.com',
            'password': 'SecurePassword123!'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_profile_access_authenticated(self):
        reg_response = self.client.post(self.register_url, self.user_data, format='json')
        token = reg_response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'Sarah Jenkins')

    def test_profile_access_unauthenticated(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

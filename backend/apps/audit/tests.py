from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import AIAuditLog

User = get_user_model()

class AIAuditLogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='auditor@example.com', password='Password123!')
        self.client.force_authenticate(user=self.user)
        self.log = AIAuditLog.objects.create(
            user=self.user,
            action_type='chat_query',
            query_text='What is the notice period for contract termination?',
            response_summary='According to Section 5.2, 60 days notice is required.',
            model_used='gpt-4o',
            processing_time_ms=350
        )

    def test_list_audit_logs(self):
        url = reverse('audit:audit_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['model_used'], 'gpt-4o')

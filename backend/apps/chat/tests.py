from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.documents.models import Document
from .models import ChatSession, ChatMessage

User = get_user_model()

class ChatAssistantTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='client@example.com', password='Password123!')
        self.client.force_authenticate(user=self.user)
        self.session = ChatSession.objects.create(
            user=self.user,
            title='Lease Agreement Queries'
        )

    def test_send_chat_message(self):
        url = reverse('chat:send_message', kwargs={'session_id': self.session.id})
        payload = {'message': 'What happens if rent is paid 5 days late?'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user_message', response.data)
        self.assertIn('assistant_message', response.data)
        self.assertEqual(ChatMessage.objects.filter(session=self.session).count(), 2)

    def test_list_chat_sessions(self):
        url = reverse('chat:chat_session-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

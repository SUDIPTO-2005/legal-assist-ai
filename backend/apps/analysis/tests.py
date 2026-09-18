from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.documents.models import Document
from apps.analysis.models import AnalysisResult

User = get_user_model()

class AnalysisTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='analyst@example.com', password='Password123!')
        self.client.force_authenticate(user=self.user)
        self.document = Document.objects.create(
            owner=self.user,
            title='Sample Commercial Contract',
            extracted_text='This is a contract between Party A and Party B. Termination requires 60 days notice.',
            status='ready'
        )

    def test_trigger_analysis(self):
        url = reverse('analysis:trigger_analysis', kwargs={'document_id': self.document.id})
        response = self.client.post(url, {'explanation_mode': 'beginner'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('risk_score', response.data)
        self.assertIn('result_data', response.data)
        self.assertEqual(AnalysisResult.objects.count(), 1)

    def test_get_latest_analysis(self):
        # Trigger first
        trigger_url = reverse('analysis:trigger_analysis', kwargs={'document_id': self.document.id})
        self.client.post(trigger_url, {'explanation_mode': 'beginner'}, format='json')

        # Retrieve
        url = reverse('analysis:latest_analysis', kwargs={'document_id': self.document.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['document_title'], 'Sample Commercial Contract')

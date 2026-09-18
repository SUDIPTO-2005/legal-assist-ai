from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Document, DocumentFolder

User = get_user_model()

class DocumentManagementTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(email='usera@example.com', password='Password123!')
        self.user_b = User.objects.create_user(email='userb@example.com', password='Password123!')
        self.client.force_authenticate(user=self.user_a)

    def test_document_upload_success(self):
        dummy_file = SimpleUploadedFile(
            "nda_agreement.txt",
            b"This Non-Disclosure Agreement governs confidential proprietary data.",
            content_type="text/plain"
        )
        url = reverse('documents:document-list')
        data = {
            'title': 'Test NDA Agreement',
            'document_type': 'nda',
            'file': dummy_file
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 1)
        doc = Document.objects.first()
        self.assertEqual(doc.owner, self.user_a)

    def test_unauthorized_cross_user_access_prevented(self):
        doc = Document.objects.create(
            owner=self.user_a,
            title='Confidential Strategy',
            file_size=1024,
            original_filename='confidential.pdf'
        )
        
        # User B attempts to access User A's document
        client_b = APIClient()
        client_b.force_authenticate(user=self.user_b)
        url = reverse('documents:document-detail', kwargs={'pk': doc.id})
        response = client_b.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_soft_delete(self):
        doc = Document.objects.create(
            owner=self.user_a,
            title='Old Lease',
            original_filename='lease.txt'
        )
        url = reverse('documents:document-detail', kwargs={'pk': doc.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        doc.refresh_from_db()
        self.assertTrue(doc.is_deleted)

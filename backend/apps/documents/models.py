import uuid
from django.db import models
from django.conf import settings
from .storage import document_upload_path, validate_uploaded_file

class DocumentFolder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='document_folders')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='#1E3A5F')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        unique_together = ['owner', 'name']

    def __str__(self):
        return self.name


class Document(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Upload'),
        ('processing', 'Processing & Embedding'),
        ('ready', 'Ready for Analysis'),
        ('failed', 'Processing Failed'),
    ]

    DOC_TYPES = [
        ('employment', 'Employment Contract'),
        ('rental', 'Rental / Lease Agreement'),
        ('nda', 'Non-Disclosure Agreement (NDA)'),
        ('privacy', 'Privacy Policy / Terms of Service'),
        ('service', 'Master Service Agreement (MSA)'),
        ('legal_notice', 'Legal Notice / Court Notice'),
        ('commercial', 'Commercial Contract'),
        ('general', 'General Legal Document'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    folder = models.ForeignKey(DocumentFolder, on_delete=models.SET_NULL, null=True, blank=True, related_name='documents')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=30, choices=DOC_TYPES, default='general')
    
    file = models.FileField(upload_to=document_upload_path, validators=[validate_uploaded_file])
    original_filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField(default=0, help_text="Size in bytes")
    file_type = models.CharField(max_length=20, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    
    page_count = models.IntegerField(default=0)
    word_count = models.IntegerField(default=0)
    extracted_text = models.TextField(blank=True)
    
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'status', 'is_deleted']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.owner.email})"

    def soft_delete(self):
        self.is_deleted = True
        self.save()

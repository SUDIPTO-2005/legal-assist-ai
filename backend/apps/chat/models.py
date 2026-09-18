import uuid
from django.db import models
from django.conf import settings
from apps.documents.models import Document

class ChatSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_sessions')
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_sessions')
    title = models.CharField(max_length=255, default='Legal Inquiry')
    explanation_mode = models.CharField(max_length=20, default='beginner')
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.user.email})"


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'LexAssist AI'),
        ('system', 'System Notification'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    sources = models.JSONField(default=list, blank=True)
    
    escalation_suggested = models.BooleanField(default=False)
    escalation_reason = models.TextField(blank=True, null=True)
    
    model_used = models.CharField(max_length=100, default='gpt-4o')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.content[:40]}..."

import uuid
from django.db import models
from django.conf import settings
from apps.documents.models import Document

class AIAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_audit_logs')
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    
    action_type = models.CharField(max_length=50, default='chat_query') # chat_query, analysis, comparison
    query_text = models.TextField()
    response_summary = models.TextField()
    source_sections = models.JSONField(default=list, blank=True)
    
    model_used = models.CharField(max_length=100, default='gpt-4o')
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    processing_time_ms = models.IntegerField(default=0)
    
    escalation_triggered = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['document', 'timestamp']),
        ]

    def __str__(self):
        return f"Audit [{self.action_type}] {self.user.email} @ {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

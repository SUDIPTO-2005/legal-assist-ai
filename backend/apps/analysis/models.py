import uuid
from django.db import models
from django.conf import settings
from apps.documents.models import Document

class AnalysisResult(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending AI Processing'),
        ('processing', 'Analyzing Document Clauses'),
        ('complete', 'Analysis Complete'),
        ('failed', 'Analysis Failed'),
    ]

    RISK_LEVEL_CHOICES = [
        ('low', 'Low Risk'),
        ('medium', 'Moderate Review Advised'),
        ('high', 'High Risk'),
        ('legal_review_advised', 'Professional Legal Review Recommended'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='analyses')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    explanation_mode = models.CharField(max_length=20, default='beginner')
    language = models.CharField(max_length=10, default='en')
    
    # Structured AI output JSON
    result_data = models.JSONField(default=dict, blank=True)
    clauses_data = models.JSONField(default=list, blank=True)
    risk_metrics = models.JSONField(default=dict, blank=True)
    
    risk_score = models.IntegerField(default=0, help_text="Composite score 0-100")
    risk_level = models.CharField(max_length=30, choices=RISK_LEVEL_CHOICES, default='low')
    
    escalation_recommended = models.BooleanField(default=False)
    escalation_reason = models.TextField(blank=True, null=True)
    
    processing_time_seconds = models.FloatField(default=0.0)
    model_used = models.CharField(max_length=100, default='gpt-4o')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['document', 'status']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"Analysis: {self.document.title} ({self.risk_level})"


class ComparisonReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comparisons')
    document_a = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comparisons_as_doc_a')
    document_b = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comparisons_as_doc_b')
    
    title = models.CharField(max_length=255, blank=True)
    comparison_data = models.JSONField(default=dict)
    
    status = models.CharField(max_length=20, default='complete')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Compare: {self.document_a.title} vs {self.document_b.title}"

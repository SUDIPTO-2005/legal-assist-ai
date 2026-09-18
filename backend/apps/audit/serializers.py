from rest_framework import serializers
from .models import AIAuditLog

class AIAuditLogSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True, default=None)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AIAuditLog
        fields = [
            'id', 'user', 'user_email', 'document', 'document_title',
            'action_type', 'query_text', 'response_summary', 'source_sections',
            'model_used', 'prompt_tokens', 'completion_tokens', 'processing_time_ms',
            'escalation_triggered', 'ip_address', 'timestamp'
        ]
        read_only_fields = fields

from django.contrib import admin
from .models import AIAuditLog

@admin.register(AIAuditLog)
class AIAuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'model_used', 'processing_time_ms', 'escalation_triggered', 'timestamp']
    list_filter = ['action_type', 'escalation_triggered', 'model_used']
    search_fields = ['user__email', 'query_text', 'response_summary']
    readonly_fields = ['id', 'user', 'document', 'action_type', 'query_text', 'response_summary', 'source_sections', 'model_used', 'prompt_tokens', 'completion_tokens', 'processing_time_ms', 'escalation_triggered', 'ip_address', 'timestamp']

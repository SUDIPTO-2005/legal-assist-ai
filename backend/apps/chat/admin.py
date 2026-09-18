from django.contrib import admin
from .models import ChatSession, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ['role', 'content', 'sources', 'escalation_suggested', 'model_used', 'created_at']

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'document', 'explanation_mode', 'language', 'created_at']
    search_fields = ['title', 'user__email']
    inlines = [ChatMessageInline]

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'role', 'content', 'escalation_suggested', 'created_at']
    list_filter = ['role', 'escalation_suggested']
    search_fields = ['content', 'session__user__email']

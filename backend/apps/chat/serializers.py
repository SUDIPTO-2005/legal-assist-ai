from rest_framework import serializers
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'session', 'role', 'content', 'sources',
            'escalation_suggested', 'escalation_reason', 'model_used', 'created_at'
        ]
        read_only_fields = ['id', 'session', 'role', 'sources', 'escalation_suggested', 'escalation_reason', 'model_used', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True, default=None)
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'user', 'document', 'document_title', 'title',
            'explanation_mode', 'language', 'messages', 'message_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_message_count(self, obj):
        return obj.messages.count()

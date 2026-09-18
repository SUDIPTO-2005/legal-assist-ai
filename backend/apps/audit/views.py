from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import AIAuditLog
from .serializers import AIAuditLogSerializer

class AIAuditLogListView(generics.ListAPIView):
    serializer_class = AIAuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action_type', 'escalation_triggered', 'document']
    search_fields = ['query_text', 'response_summary', 'model_used']
    ordering_fields = ['timestamp', 'processing_time_ms']
    ordering = ['-timestamp']

    def get_queryset(self):
        return AIAuditLog.objects.filter(user=self.request.user)


class AIAuditLogDetailView(generics.RetrieveAPIView):
    serializer_class = AIAuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIAuditLog.objects.filter(user=self.request.user)

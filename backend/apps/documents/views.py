import os
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse, Http404
from .models import Document, DocumentFolder
from .serializers import DocumentSerializer, DocumentUploadSerializer, DocumentFolderSerializer
from .tasks import process_document_task
from apps.authentication.permissions import IsOwnerOrAdmin

class DocumentFolderViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentFolderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return DocumentFolder.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'status', 'folder']
    search_fields = ['title', 'description', 'original_filename', 'extracted_text']
    ordering_fields = ['created_at', 'title', 'file_size']
    ordering = ['-created_at']

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user, is_deleted=False)

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        doc = serializer.save()
        # Trigger processing (async Celery or synchronous fallback)
        try:
            process_document_task.delay(str(doc.id))
        except Exception:
            # Synchronous execution fallback if Celery/Redis is offline in dev
            try:
                process_document_task(str(doc.id))
            except Exception as e:
                doc.status = 'failed'
                doc.error_message = str(e)
                doc.save()

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        doc = self.get_object()
        if not doc.file or not os.path.exists(doc.file.path):
            raise Http404("Document file not found.")
        return FileResponse(
            open(doc.file.path, 'rb'),
            as_attachment=True,
            filename=doc.original_filename
        )

    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        doc = self.get_object()
        doc.status = 'processing'
        doc.save()
        try:
            process_document_task.delay(str(doc.id))
        except Exception:
            process_document_task(str(doc.id))
        return Response({'message': 'Reprocessing initiated.'}, status=status.HTTP_200_OK)

from django.contrib import admin
from .models import Document, DocumentFolder

@admin.register(DocumentFolder)
class DocumentFolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'created_at']
    search_fields = ['name', 'owner__email']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'document_type', 'status', 'page_count', 'file_size', 'is_deleted', 'created_at']
    list_filter = ['status', 'document_type', 'is_deleted']
    search_fields = ['title', 'original_filename', 'owner__email']
    ordering = ['-created_at']

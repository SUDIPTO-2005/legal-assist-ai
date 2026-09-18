from rest_framework import serializers
from .models import Document, DocumentFolder
import os

class DocumentFolderSerializer(serializers.ModelSerializer):
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = DocumentFolder
        fields = ['id', 'name', 'color', 'document_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_document_count(self, obj):
        return obj.documents.filter(is_deleted=False).count()


class DocumentSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    folder_name = serializers.CharField(source='folder.name', read_only=True, default=None)
    has_analysis = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'owner', 'owner_email', 'folder', 'folder_name',
            'title', 'description', 'document_type', 'file',
            'original_filename', 'file_size', 'file_type', 'status',
            'error_message', 'page_count', 'word_count', 'has_analysis',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'owner', 'owner_email', 'original_filename', 'file_size',
            'file_type', 'status', 'error_message', 'page_count', 'word_count',
            'created_at', 'updated_at'
        ]

    def get_has_analysis(self, obj):
        return hasattr(obj, 'analyses') and obj.analyses.filter(status='complete').exists()


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'document_type', 'folder', 'file']

    def create(self, validated_data):
        file_obj = validated_data['file']
        validated_data['owner'] = self.context['request'].user
        validated_data['original_filename'] = file_obj.name
        validated_data['file_size'] = file_obj.size
        
        ext = file_obj.name.split('.')[-1].lower() if '.' in file_obj.name else 'bin'
        validated_data['file_type'] = ext
        
        if not validated_data.get('title'):
            validated_data['title'] = os.path.splitext(file_obj.name)[0].replace('_', ' ').replace('-', ' ').title()

        return super().create(validated_data)

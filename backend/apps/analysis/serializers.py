from rest_framework import serializers
from .models import AnalysisResult, ComparisonReport
from apps.documents.serializers import DocumentSerializer

class AnalysisResultSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True)
    document_type = serializers.CharField(source='document.document_type', read_only=True)

    class Meta:
        model = AnalysisResult
        fields = [
            'id', 'document', 'document_title', 'document_type', 'status',
            'explanation_mode', 'language', 'result_data', 'clauses_data',
            'risk_metrics', 'risk_score', 'risk_level', 'escalation_recommended',
            'escalation_reason', 'processing_time_seconds', 'model_used',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'result_data', 'clauses_data', 'risk_metrics',
            'risk_score', 'risk_level', 'escalation_recommended', 'escalation_reason',
            'processing_time_seconds', 'model_used', 'created_at', 'updated_at'
        ]


class ComparisonReportSerializer(serializers.ModelSerializer):
    doc_a_title = serializers.CharField(source='document_a.title', read_only=True)
    doc_b_title = serializers.CharField(source='document_b.title', read_only=True)

    class Meta:
        model = ComparisonReport
        fields = [
            'id', 'document_a', 'document_b', 'doc_a_title', 'doc_b_title',
            'title', 'comparison_data', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'comparison_data', 'status', 'created_at']

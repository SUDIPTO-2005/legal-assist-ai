from django.contrib import admin
from .models import AnalysisResult, ComparisonReport

@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'status', 'risk_score', 'risk_level', 'escalation_recommended', 'created_at']
    list_filter = ['status', 'risk_level', 'escalation_recommended']
    search_fields = ['document__title', 'user__email']

@admin.register(ComparisonReport)
class ComparisonReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'document_a', 'document_b', 'created_at']
    search_fields = ['title', 'user__email']

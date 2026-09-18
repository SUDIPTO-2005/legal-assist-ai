from django.urls import path
from .views import TriggerAnalysisView, LatestDocumentAnalysisView, AnalysisDetailView, DocumentComparisonView

app_name = 'analysis'

urlpatterns = [
    path('document/<uuid:document_id>/trigger/', TriggerAnalysisView.as_view(), name='trigger_analysis'),
    path('document/<uuid:document_id>/latest/', LatestDocumentAnalysisView.as_view(), name='latest_analysis'),
    path('<uuid:pk>/', AnalysisDetailView.as_view(), name='analysis_detail'),
    path('compare/', DocumentComparisonView.as_view(), name='compare_documents'),
]

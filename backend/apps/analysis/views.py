from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import AnalysisResult, ComparisonReport
from .serializers import AnalysisResultSerializer, ComparisonReportSerializer
from .tasks import run_full_analysis_task
from apps.documents.models import Document
from apps.ai_engine.rag_pipeline import RAGPipeline
from apps.authentication.permissions import IsOwnerOrAdmin

class TriggerAnalysisView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, document_id):
        document = get_object_or_404(Document, id=document_id, owner=request.user, is_deleted=False)
        explanation_mode = request.data.get('explanation_mode', request.user.explanation_mode or 'beginner')
        language = request.data.get('language', request.user.preferred_language or 'en')

        # Create or reuse existing analysis
        analysis = AnalysisResult.objects.create(
            document=document,
            user=request.user,
            explanation_mode=explanation_mode,
            language=language,
            status='processing'
        )

        # Execute async or sync fallback
        try:
            run_full_analysis_task.delay(str(analysis.id))
        except Exception:
            try:
                run_full_analysis_task(str(analysis.id))
            except Exception as e:
                analysis.status = 'failed'
                analysis.save()

        analysis.refresh_from_db()
        return Response(AnalysisResultSerializer(analysis).data, status=status.HTTP_201_CREATED)


class LatestDocumentAnalysisView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, document_id):
        document = get_object_or_404(Document, id=document_id, owner=request.user, is_deleted=False)
        analysis = AnalysisResult.objects.filter(document=document).order_by('-created_at').first()
        if not analysis:
            return Response({'message': 'No analysis found for this document.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(AnalysisResultSerializer(analysis).data)


class AnalysisDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = AnalysisResultSerializer
    queryset = AnalysisResult.objects.all()


class DocumentComparisonView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        doc_a_id = request.data.get('document_a')
        doc_b_id = request.data.get('document_b')

        if not doc_a_id or not doc_b_id:
            return Response({'error': 'Both document_a and document_b IDs are required.'}, status=status.HTTP_400_BAD_REQUEST)

        doc_a = get_object_or_404(Document, id=doc_a_id, owner=request.user, is_deleted=False)
        doc_b = get_object_or_404(Document, id=doc_b_id, owner=request.user, is_deleted=False)

        pipeline = RAGPipeline()
        text_a = doc_a.extracted_text or (pipeline.process_and_index_document(doc_a.id, doc_a.file.path, doc_a.file_type)['extracted_text'] if doc_a.file else '')
        text_b = doc_b.extracted_text or (pipeline.process_and_index_document(doc_b.id, doc_b.file.path, doc_b.file_type)['extracted_text'] if doc_b.file else '')

        comparison_data = pipeline.compare_documents(text_a, text_b)

        report = ComparisonReport.objects.create(
            user=request.user,
            document_a=doc_a,
            document_b=doc_b,
            title=f"Comparison: {doc_a.title} vs {doc_b.title}",
            comparison_data=comparison_data,
            status='complete'
        )

        return Response(ComparisonReportSerializer(report).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        reports = ComparisonReport.objects.filter(user=request.user)
        return Response(ComparisonReportSerializer(reports, many=True).data)

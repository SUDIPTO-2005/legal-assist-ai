import time
from celery import shared_task
from .models import AnalysisResult, ComparisonReport
from apps.documents.models import Document
from apps.ai_engine.rag_pipeline import RAGPipeline

@shared_task(bind=True, max_retries=2)
def run_full_analysis_task(self, analysis_id: str):
    """Run AI analysis pipeline in Celery worker."""
    start_time = time.time()
    try:
        analysis = AnalysisResult.objects.get(id=analysis_id)
        analysis.status = 'processing'
        analysis.save()

        doc = analysis.document
        # Ensure document text is loaded
        if not doc.extracted_text and doc.file:
            pipeline = RAGPipeline()
            res = pipeline.process_and_index_document(doc.id, doc.file.path, doc.file_type)
            doc.extracted_text = res['extracted_text']
            doc.page_count = res['page_count']
            doc.word_count = res['word_count']
            doc.status = 'ready'
            doc.save()

        pipeline = RAGPipeline()
        output = pipeline.analyze_document(
            document_text=doc.extracted_text,
            explanation_mode=analysis.explanation_mode,
            language=analysis.language
        )

        analysis.result_data = output['analysis']
        analysis.clauses_data = output['clauses']
        analysis.risk_metrics = output['risk_metrics']
        analysis.risk_score = output['risk_metrics'].get('overall_risk_score', 35)
        analysis.risk_level = output['risk_metrics'].get('risk_level', 'low')
        analysis.escalation_recommended = output['analysis'].get('escalation_recommended', False)
        analysis.escalation_reason = output['analysis'].get('escalation_reason', '')
        analysis.processing_time_seconds = round(time.time() - start_time, 2)
        analysis.status = 'complete'
        analysis.save()

        return f"Analysis {analysis.id} completed in {analysis.processing_time_seconds}s."

    except Exception as exc:
        try:
            analysis = AnalysisResult.objects.get(id=analysis_id)
            analysis.status = 'failed'
            analysis.save()
        except Exception:
            pass
        raise self.retry(exc=exc, countdown=5)

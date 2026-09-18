from celery import shared_task
from .models import Document
from apps.ai_engine.rag_pipeline import RAGPipeline

@shared_task(bind=True, max_retries=3)
def process_document_task(self, document_id: str):
    """Async background task to extract text and index document embeddings."""
    try:
        doc = Document.objects.get(id=document_id)
        doc.status = 'processing'
        doc.save()

        pipeline = RAGPipeline()
        file_path = doc.file.path
        
        result = pipeline.process_and_index_document(
            document_id=doc.id,
            file_path=file_path,
            file_type=doc.file_type
        )

        doc.extracted_text = result['extracted_text']
        doc.page_count = result['page_count']
        doc.word_count = result['word_count']
        doc.status = 'ready'
        doc.save()

        return f"Document {doc.title} processed successfully."

    except Exception as exc:
        try:
            doc = Document.objects.get(id=document_id)
            doc.status = 'failed'
            doc.error_message = str(exc)
            doc.save()
        except Exception:
            pass
        raise self.retry(exc=exc, countdown=10)

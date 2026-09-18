import json
import re
from typing import Dict, Any, List, Optional
from .document_processor import DocumentProcessor
from .chunker import DocumentChunker
from .embeddings import EmbeddingService
from .llm_client import LLMClient
from .clause_detector import ClauseDetector
from .risk_scorer import RiskScorer
from .safety import SecurityGuardrail
from .prompts import (
    LEGAL_SAFETY_SYSTEM_PROMPT,
    DOCUMENT_ANALYSIS_PROMPT_TEMPLATE,
    COMPARISON_PROMPT_TEMPLATE,
    CHAT_PROMPT_TEMPLATE
)

class RAGPipeline:
    """Full End-to-End Retrieval-Augmented Generation Legal Assistant Pipeline."""

    def __init__(self):
        self.processor = DocumentProcessor()
        self.chunker = DocumentChunker()
        self.embeddings = EmbeddingService()
        self.llm = LLMClient()
        self.clause_detector = ClauseDetector(self.llm)

    def process_and_index_document(self, document_id: str, file_path: str, file_type: str) -> Dict[str, Any]:
        """Extract text, chunk, and index into vector database."""
        extracted_text, page_count, word_count = self.processor.extract_text(file_path, file_type)
        chunks = self.chunker.chunk_text(extracted_text, {'document_id': str(document_id)})
        self.embeddings.store_document_chunks(str(document_id), chunks)
        
        return {
            'extracted_text': extracted_text,
            'page_count': page_count,
            'word_count': word_count,
            'chunk_count': len(chunks)
        }

    def analyze_document(self, document_text: str, explanation_mode: str = 'beginner', language: str = 'en') -> Dict[str, Any]:
        """Perform comprehensive structured document analysis."""
        # 1. Safety check
        is_inj, inj_msg = SecurityGuardrail.check_prompt_injection(document_text[:2000])
        if is_inj:
            raise ValueError(inj_msg)

        is_esc, esc_msg = SecurityGuardrail.check_human_escalation(document_text)

        # 2. Call LLM for Structured Analysis
        prompt = DOCUMENT_ANALYSIS_PROMPT_TEMPLATE.format(
            system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT,
            document_text=document_text[:14000],
            explanation_mode=explanation_mode,
            language=language
        )
        raw_analysis = self.llm.generate(prompt=prompt, system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT, temperature=0.1)

        try:
            cleaned_json = re.sub(r'^```json\s*|\s*```$', '', raw_analysis.strip())
            analysis_data = json.loads(cleaned_json)
        except Exception:
            analysis_data = json.loads(self.llm._generate_intelligent_mock(prompt))

        # 3. Detect Clauses
        clauses = self.clause_detector.detect_clauses(document_text, explanation_mode=explanation_mode)

        # 4. Compute Risk Heatmap & Metrics
        risk_metrics = RiskScorer.calculate_metrics(analysis_data, clauses)

        # Integrate escalation if detected
        if is_esc:
            analysis_data['escalation_recommended'] = True
            analysis_data['escalation_reason'] = esc_msg
            analysis_data['risk_level'] = 'legal_review_advised'
            risk_metrics['risk_level'] = 'legal_review_advised'
            risk_metrics['risk_label'] = 'Professional Legal Review Recommended'

        return {
            'analysis': analysis_data,
            'clauses': clauses,
            'risk_metrics': risk_metrics,
            'explanation_mode': explanation_mode,
            'language': language
        }

    def compare_documents(self, doc_a_text: str, doc_b_text: str) -> Dict[str, Any]:
        """Compare two document versions and extract clause changes and risk impact."""
        prompt = COMPARISON_PROMPT_TEMPLATE.format(
            system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT,
            doc_a_text=doc_a_text[:8000],
            doc_b_text=doc_b_text[:8000]
        )
        raw_result = self.llm.generate(prompt=prompt, system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT, temperature=0.1)

        try:
            cleaned_json = re.sub(r'^```json\s*|\s*```$', '', raw_result.strip())
            return json.loads(cleaned_json)
        except Exception:
            return json.loads(self.llm._generate_intelligent_mock("summary_of_changes"))

    def answer_chat_query(
        self,
        query: str,
        document_id: Optional[str] = None,
        history: str = "",
        explanation_mode: str = 'beginner',
        language: str = 'en'
    ) -> Dict[str, Any]:
        """Answer chat questions with document grounding and safety guardrails."""
        # 1. Prompt injection guardrail
        is_inj, inj_msg = SecurityGuardrail.check_prompt_injection(query)
        if is_inj:
            return {
                'answer': "I cannot fulfill this request because it violates our responsible AI and legal safety policy.",
                'sources': [],
                'escalation_suggested': False,
                'disclaimer': "LexAssist AI provides legal information and document analysis assistance only."
            }

        # 2. Check human legal escalation
        is_esc, esc_msg = SecurityGuardrail.check_human_escalation(query)

        # 3. Retrieve relevant context chunks if document_id is provided
        context_text = "No document attached. General legal information context."
        sources = []
        if document_id:
            relevant_chunks = self.embeddings.query_similar_chunks(document_id, query, top_k=3)
            if relevant_chunks:
                context_text = "\n\n".join([f"[Source Chunk #{c['chunk_index']}]:\n{c['text']}" for c in relevant_chunks])
                sources = [
                    {
                        'chunk_index': c['chunk_index'],
                        'excerpt': c['text'][:200] + "...",
                    } for c in relevant_chunks
                ]

        # 4. Generate answer
        prompt = CHAT_PROMPT_TEMPLATE.format(
            system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT,
            context=context_text,
            history=history,
            question=query,
            explanation_mode=explanation_mode,
            language=language
        )
        raw_answer = self.llm.generate(prompt=prompt, system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT, temperature=0.3)

        if is_esc:
            raw_answer = f"⚠️ **Professional Legal Review Recommended**\n\n{esc_msg}\n\n---\n\n{raw_answer}"

        return {
            'answer': raw_answer,
            'sources': sources,
            'escalation_suggested': is_esc,
            'escalation_reason': esc_msg if is_esc else None,
            'disclaimer': "LexAssist AI provides legal information and document analysis assistance. It does not provide legal advice or replace consultation with a qualified legal professional."
        }

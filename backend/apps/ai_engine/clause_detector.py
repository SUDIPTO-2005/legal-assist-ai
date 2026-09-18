import json
import re
from typing import List, Dict, Any
from .llm_client import LLMClient
from .prompts import LEGAL_SAFETY_SYSTEM_PROMPT, CLAUSE_DETECTION_PROMPT_TEMPLATE

class ClauseDetector:
    """Specialized engine for detecting and categorizing legal clauses with risk indicators."""

    def __init__(self, llm_client: LLMClient = None):
        self.llm = llm_client or LLMClient()

    def detect_clauses(self, document_text: str, explanation_mode: str = 'beginner') -> List[Dict[str, Any]]:
        prompt = CLAUSE_DETECTION_PROMPT_TEMPLATE.format(
            system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT,
            document_text=document_text[:12000], # Process up to token limits
            explanation_mode=explanation_mode
        )
        raw_output = self.llm.generate(prompt=prompt, system_prompt=LEGAL_SAFETY_SYSTEM_PROMPT, temperature=0.1)
        
        try:
            # Clean possible markdown fence
            cleaned_json = re.sub(r'^```json\s*|\s*```$', '', raw_output.strip())
            return json.loads(cleaned_json)
        except Exception:
            # Fallback heuristic clause extraction
            return self._heuristic_clause_extraction(document_text)

    def _heuristic_clause_extraction(self, text: str) -> List[Dict[str, Any]]:
        clauses = []
        patterns = [
            ('indemnity', r'(?i)(indemnif\w+|hold\s+harmless)', 'Indemnification Clause', 'medium',
             'Outlines who pays if lawsuits or losses occur.', ['Is there a mutual monetary liability cap?']),
            ('termination', r'(?i)(termination|terminate\s+this\s+agreement|notice\s+of\s+non-renewal)', 'Termination & Cancellation', 'high',
             'Specifies how either party can exit this contract and notice requirements.', ['What is the exact notice period required?']),
            ('confidentiality', r'(?i)(confidentiality|non-disclosure|proprietary\s+information)', 'Confidentiality & Non-Disclosure', 'low',
             'Protects sensitive business information from unauthorized sharing.', ['How many years does confidentiality endure post-termination?']),
            ('dispute_resolution', r'(?i)(arbitration|jurisdiction|governing\s+law|court\s+of)', 'Governing Law & Dispute Resolution', 'medium',
             'Identifies where and how legal disputes will be resolved.', ['Is mandatory arbitration required, and in which state/country?']),
            ('non_compete', r'(?i)(non-compete|non-solicitation|restrictive\s+covenant)', 'Non-Compete & Non-Solicitation', 'high',
             'Restricts your ability to work with competitors or solicit clients.', ['Is the geographic scope and duration enforceable?']),
        ]

        for c_type, pattern, title, risk, expl, questions in patterns:
            match = re.search(pattern, text)
            if match:
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 250)
                excerpt = text[start:end].strip()
                clauses.append({
                    'clause_type': c_type,
                    'title': title,
                    'raw_text': f"...{excerpt}...",
                    'risk_level': risk,
                    'plain_explanation': expl,
                    'potential_pitfalls': ['Review full clause scope with counsel.'],
                    'questions_to_ask_lawyer': questions
                })

        return clauses

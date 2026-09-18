import re
from typing import Tuple, List

# Patterns that indicate prompt injection or jailbreak attempts
INJECTION_PATTERNS = [
    r'(?i)ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)',
    r'(?i)disregard\s+(all\s+)?(previous|prior|above)\s+instructions',
    r'(?i)system\s+prompt\s+override',
    r'(?i)you\s+are\s+now\s+(an?\s+unrestricted|DAN|jailbroken)',
    r'(?i)act\s+as\s+a\s+licensed\s+lawyer\s+and\s+give\s+formal\s+legal\s+advice',
    r'(?i)bypass\s+safety',
    r'(?i)reveal\s+your\s+system\s+(prompt|instructions)',
    r'(?i)hidden\s+developer\s+mode',
]

# Keywords that indicate severe legal emergencies requiring human escalation
ESCALATION_KEYWORDS = [
    r'(?i)\b(arrest\s+warrant|police\s+custody|bail\s+hearing|criminal\s+charges)\b',
    r'(?i)\b(lawsuit\s+filed|summons|court\s+summons|subpoena|injunction)\b',
    r'(?i)\b(eviction\s+notice\s+within\s+24\s+hours|foreclosure\s+auction)\b',
    r'(?i)\b(bankruptcy\s+filing|asset\s+seizure|wage\s+garnishment)\b',
    r'(?i)\b(restraining\s+order|domestic\s+violence\s+order)\b',
    r'(?i)\b(class\s+action|arbitration\s+claim\s+exceeding)\b',
]

class SecurityGuardrail:
    """Security checks for AI queries and document processing."""

    @staticmethod
    def check_prompt_injection(user_input: str) -> Tuple[bool, str]:
        """Check if user query attempts prompt injection or policy bypass."""
        if not user_input:
            return False, ""
        
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, user_input):
                return True, "Security alert: Input contains disallowed override commands or policy violation patterns."
        return False, ""

    @staticmethod
    def check_human_escalation(text: str) -> Tuple[bool, str]:
        """Detect situations requiring immediate professional human legal escalation."""
        if not text:
            return False, ""

        for pattern in ESCALATION_KEYWORDS:
            match = re.search(pattern, text)
            if match:
                matched_term = match.group(0)
                return True, (
                    f"Critical Legal Situation Detected ('{matched_term}'): "
                    "This matter involves active court proceedings, criminal liability, or urgent legal consequences. "
                    "Professional legal representation is strongly recommended immediately."
                )
        return False, ""

    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitize text by removing potentially dangerous control characters."""
        if not text:
            return ""
        # Remove zero-width characters and control chars except standard newlines and tabs
        cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]', '', text)
        return cleaned.strip()

    @staticmethod
    def redact_pii(text: str) -> str:
        """Lightweight PII redaction for credit cards, SSN/Aadhaar formats."""
        if not text:
            return ""
        # Redact credit card numbers
        text = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[REDACTED_PAYMENT_CARD]', text)
        # Redact US SSN / 9-digit IDs
        text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED_ID]', text)
        return text

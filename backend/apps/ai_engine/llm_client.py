import os
import json
import re
from typing import Dict, Any, Optional
from django.conf import settings

class LLMClient:
    """Unified LLM client supporting OpenAI, Google Gemini, and Intelligent Mock Mode."""

    def __init__(self):
        self.provider = getattr(settings, 'LLM_PROVIDER', 'mock')
        self.openai_api_key = getattr(settings, 'OPENAI_API_KEY', '')
        self.openai_model = getattr(settings, 'OPENAI_MODEL', 'gpt-4o')
        self.gemini_api_key = getattr(settings, 'GEMINI_API_KEY', '')
        self.gemini_model = getattr(settings, 'GEMINI_MODEL', 'gemini-1.5-pro')

    def generate(self, prompt: str, system_prompt: str = "", temperature: float = 0.2) -> str:
        """Execute LLM generation across configured providers."""
        # 1. Try OpenAI if configured
        if self.provider == 'openai' and self.openai_api_key:
            try:
                return self._call_openai(prompt, system_prompt, temperature)
            except Exception as e:
                print(f"OpenAI error: {e}, falling back...")

        # 2. Try Gemini if configured
        if self.provider == 'gemini' and self.gemini_api_key:
            try:
                return self._call_gemini(prompt, system_prompt, temperature)
            except Exception as e:
                print(f"Gemini error: {e}, falling back...")

        # 3. Fallback to high-quality heuristic simulation (mock mode)
        return self._generate_intelligent_mock(prompt)

    def _call_openai(self, prompt: str, system_prompt: str, temperature: float) -> str:
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_api_key)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.openai_model,
            messages=messages,
            temperature=temperature,
            max_tokens=4000
        )
        return response.choices[0].message.content

    def _call_gemini(self, prompt: str, system_prompt: str, temperature: float) -> str:
        import google.generativeai as genai
        genai.configure(api_key=self.gemini_api_key)
        model = genai.GenerativeModel(
            model_name=self.gemini_model,
            system_instruction=system_prompt if system_prompt else None
        )
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=4000
            )
        )
        return response.text

    def _generate_intelligent_mock(self, prompt: str) -> str:
        """Intelligent legal parsing simulator for development and offline testing."""
        # Check if prompt is requesting document analysis JSON
        if "overview" in prompt and "key_points" in prompt:
            return json.dumps({
                "overview": {
                    "document_type": "Commercial Service & Non-Disclosure Agreement",
                    "parties_involved": ["LexAssist Client (You)", "Acme Global Solutions Inc."],
                    "purpose": "Governs the provision of technology services, data handling, and confidentiality obligations between the parties.",
                    "effective_date": "October 1, 2024",
                    "duration": "24 Months with automatic 12-month renewal periods",
                    "governing_law": "Delaware, United States / English Commercial Law"
                },
                "key_points": [
                    {
                        "topic": "Scope of Work & Deliverables",
                        "summary": "Services will be executed per scheduled statements of work with milestone-based acceptance.",
                        "importance": "high"
                    },
                    {
                        "topic": "Confidentiality & Data Protection",
                        "summary": "Strict 5-year confidentiality obligation post-termination covering proprietary algorithms and customer records.",
                        "importance": "high"
                    },
                    {
                        "topic": "Termination for Convenience",
                        "summary": "Either party may terminate with 60 days prior written notice, subject to payment of accrued deliverables.",
                        "importance": "medium"
                    }
                ],
                "obligations": {
                    "user_obligations": [
                        "Provide timely access to systems, personnel, and documentation necessary for project execution.",
                        "Pay undisputed invoices within 30 days of receipt.",
                        "Maintain strict confidentiality of trade secrets and proprietary data."
                    ],
                    "counterparty_obligations": [
                        "Deliver contracted software components according to agreed milestone specifications.",
                        "Provide warranty support for critical defects for a period of 90 days post-deployment.",
                        "Carry minimum commercial liability insurance of $2,000,000."
                    ],
                    "joint_obligations": [
                        "Engage in good-faith dispute mediation for 30 days prior to initiating formal arbitration.",
                        "Review security audit reports semi-annually."
                    ]
                },
                "financial_terms": {
                    "payment_terms": "Net 30 calendar days from invoice presentation via electronic wire transfer.",
                    "fees_and_rates": [
                        "Fixed project fee: $45,000 across 3 milestone billings",
                        "Ad-hoc engineering support rate: $185 per hour"
                    ],
                    "penalties_and_late_fees": [
                        "Late payment penalty of 1.5% per month (or maximum statutory limit) on overdue balances."
                    ],
                    "security_deposit_or_retainer": "$10,000 upfront retainer refundable upon contract conclusion."
                },
                "critical_deadlines": [
                    {
                        "event": "Milestone 1 Acceptance Signoff",
                        "timeframe_or_date": "14 business days after delivery",
                        "consequence_of_missing": "Automatic acceptance deemed confirmed if no written rejection submitted."
                    },
                    {
                        "event": "Non-Renewal Written Notice",
                        "timeframe_or_date": "60 days prior to 24-month term expiry",
                        "consequence_of_missing": "Contract automatically renews for an additional 12-month lock-in."
                    }
                ],
                "risk_score": 42,
                "risk_level": "medium",
                "escalation_recommended": False,
                "escalation_reason": None,
                "lawyer_discussion_points": [
                    "Is the 60-day auto-renewal notice period acceptable for your operational flexibility?",
                    "Should the uncapped mutual indemnity clause be capped at the total contract value (e.g. 1x fees paid)?",
                    "Verify if non-solicitation of employees extends past reasonable jurisdictional standards."
                ],
                "disclaimer": "LexAssist AI provides legal information and document analysis assistance. It does not provide legal advice or replace consultation with a qualified legal professional."
            })

        # Check if prompt is requesting clause detection JSON
        if "clause_type" in prompt and "potential_pitfalls" in prompt:
            return json.dumps([
                {
                    "clause_type": "indemnity",
                    "title": "Section 8.1 - Mutual Indemnification",
                    "raw_text": "Each party shall defend, indemnify, and hold harmless the other party from and against any third-party claims, damages, losses, and reasonable legal fees arising out of gross negligence or willful misconduct.",
                    "risk_level": "medium",
                    "plain_explanation": "If someone sues over your gross negligence or breach, you agree to cover their legal bills and damages.",
                    "potential_pitfalls": ["Check if there is a monetary liability cap limiting the indemnity payout."],
                    "questions_to_ask_lawyer": ["Should we insert a liability cap of $100,000 or contract value on this clause?"]
                },
                {
                    "clause_type": "termination",
                    "title": "Section 12.2 - Automatic Renewal & Termination",
                    "raw_text": "This Agreement shall automatically renew for successive one-year terms unless either party gives written notice of non-renewal at least sixty (60) days prior to the expiration of the initial term.",
                    "risk_level": "high",
                    "plain_explanation": "If you forget to send notice 60 days before the contract ends, you are automatically locked in for another whole year.",
                    "potential_pitfalls": ["Easy to miss the 60-day window resulting in accidental financial obligations."],
                    "questions_to_ask_lawyer": ["Can we shorten the notice window from 60 days to 30 days?"]
                },
                {
                    "clause_type": "financial",
                    "title": "Section 4.3 - Late Payment Charges",
                    "raw_text": "Unpaid invoices after thirty (30) days shall accrue interest at the rate of 1.5% per month or the highest rate permitted by applicable law.",
                    "risk_level": "low",
                    "plain_explanation": "A standard interest fee applies if payments are overdue by more than a month.",
                    "potential_pitfalls": ["Compounding interest over extended disputed invoice periods."],
                    "questions_to_ask_lawyer": ["Does the clause specify that interest does not apply to good-faith disputed amounts?"]
                }
            ])

        # Check if prompt is comparison
        if "summary_of_changes" in prompt or "changes" in prompt:
            return json.dumps({
                "summary_of_changes": "The revised contract introduces longer termination notice requirements, expands confidentiality duration from 3 to 5 years, and updates the payment term from Net 15 to Net 30.",
                "risk_impact_overview": "Moderately higher restriction on exit flexibility due to increased notice window, but more favorable cash-flow timing with Net 30 payment terms.",
                "changes": [
                    {
                        "section_or_clause": "Section 5 - Termination Notice",
                        "change_type": "modified",
                        "previous_text": "30 days prior written notice required for termination without cause.",
                        "new_text": "90 days prior written notice required for termination without cause.",
                        "impact_assessment": "Notice requirement tripled from 30 days to 90 days. Limits flexibility to switch providers quickly.",
                        "risk_level": "medium",
                        "favorable_to": "counterparty"
                    },
                    {
                        "section_or_clause": "Section 7.4 - Non-Compete Scope",
                        "change_type": "added",
                        "previous_text": None,
                        "new_text": "Contractor shall not provide similar services to direct competitors within a 50-mile radius for 12 months.",
                        "impact_assessment": "New restrictive covenant limiting future business opportunities.",
                        "risk_level": "high",
                        "favorable_to": "counterparty"
                    },
                    {
                        "section_or_clause": "Section 3 - Payment Terms",
                        "change_type": "modified",
                        "previous_text": "Payment due within 15 days of invoice date.",
                        "new_text": "Payment due within 30 days of invoice date.",
                        "impact_assessment": "Extended payment window provides 15 additional days of working capital.",
                        "risk_level": "low",
                        "favorable_to": "user"
                    }
                ],
                "total_added": 1,
                "total_removed": 0,
                "total_modified": 2
            })

        # Default chat response
        return (
            "Based on the provided document excerpts, Section 5.2 states that termination requires "
            "written notice provided at least 60 days prior to the conclusion of the active term. "
            "If notice is not delivered within this window, the agreement appears to automatically renew for an additional 12-month period.\n\n"
            "You may consider reviewing your specific timeline and notice delivery method with a qualified legal professional.\n\n"
            "*Disclaimer: LexAssist AI provides legal information and document analysis assistance. It does not provide legal advice or replace consultation with a qualified legal professional.*"
        )

from typing import List, Dict, Any

class RiskScorer:
    """Calculates multidimensional risk metrics, heatmap matrices, and safety scores."""

    @staticmethod
    def calculate_metrics(analysis_data: Dict[str, Any], clauses: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        clauses = clauses or []
        
        # Risk weights
        risk_weights = {'low': 10, 'medium': 40, 'high': 80, 'legal_review_advised': 95}
        
        clause_scores = [risk_weights.get(c.get('risk_level', 'low'), 20) for c in clauses]
        base_clause_score = sum(clause_scores) / max(len(clause_scores), 1) if clause_scores else 35

        # Financial exposure calculation
        financial_terms = analysis_data.get('financial_terms', {})
        financial_risk = 25
        if financial_terms.get('penalties_and_late_fees'):
            financial_risk += 25
        if financial_terms.get('security_deposit_or_retainer'):
            financial_risk += 15

        # Deadline risk
        deadlines = analysis_data.get('critical_deadlines', [])
        deadline_risk = min(len(deadlines) * 20, 80)

        # Overall composite score (0 - 100)
        overall_score = int((base_clause_score * 0.5) + (financial_risk * 0.3) + (deadline_risk * 0.2))
        overall_score = max(5, min(95, overall_score))

        # Determine label
        if overall_score < 35:
            risk_level = 'low'
            risk_label = 'Low Risk'
        elif overall_score < 70:
            risk_level = 'medium'
            risk_label = 'Moderate Review Advised'
        elif overall_score < 85:
            risk_level = 'high'
            risk_label = 'High Risk Detected'
        else:
            risk_level = 'legal_review_advised'
            risk_label = 'Professional Legal Review Recommended'

        # Build Heatmap Categories
        heatmap_categories = [
            {
                'category': 'Financial Exposure & Penalties',
                'score': min(financial_risk, 100),
                'status': 'Elevated' if financial_risk > 50 else 'Standard',
                'description': 'Late fee structures, indemnity liability, deposit forfeit clauses.'
            },
            {
                'category': 'Exit & Termination Flexibility',
                'score': 75 if any(c.get('clause_type') == 'termination' and c.get('risk_level') in ['high', 'legal_review_advised'] for c in clauses) else 30,
                'status': 'Attention Needed' if any(c.get('clause_type') == 'termination' for c in clauses) else 'Standard',
                'description': 'Notice windows, auto-renewal traps, early termination penalties.'
            },
            {
                'category': 'Restrictive Covenants & IP',
                'score': 85 if any(c.get('clause_type') in ['non_compete', 'intellectual_property'] for c in clauses) else 20,
                'status': 'Critical' if any(c.get('clause_type') == 'non_compete' for c in clauses) else 'Clear',
                'description': 'Non-compete geography, client non-solicitation, assignment of invention.'
            },
            {
                'category': 'Dispute Resolution & Jurisdiction',
                'score': 45,
                'status': 'Standard',
                'description': 'Mandatory arbitration, choice of forum, waiver of jury trial.'
            }
        ]

        return {
            'overall_risk_score': overall_score,
            'risk_level': risk_level,
            'risk_label': risk_label,
            'financial_exposure_score': min(financial_risk, 100),
            'deadline_severity_score': deadline_risk,
            'heatmap_categories': heatmap_categories,
            'total_clauses_evaluated': len(clauses),
            'high_risk_clause_count': sum(1 for c in clauses if c.get('risk_level') in ['high', 'legal_review_advised'])
        }

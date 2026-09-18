export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  profession?: string;
  organization?: string;
  preferred_language: 'en' | 'hi' | 'bn' | 'es';
  explanation_mode: 'beginner' | 'professional';
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  color: string;
  document_count: number;
  created_at: string;
}

export type DocumentType = 
  | 'employment'
  | 'rental'
  | 'nda'
  | 'privacy'
  | 'service'
  | 'legal_notice'
  | 'commercial'
  | 'general';

export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'failed';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  document_type: DocumentType;
  file: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  status: DocumentStatus;
  error_message?: string;
  page_count: number;
  word_count: number;
  has_analysis: boolean;
  folder?: string;
  folder_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ClauseDetection {
  clause_type: string;
  title: string;
  raw_text: string;
  risk_level: 'low' | 'medium' | 'high' | 'legal_review_advised';
  plain_explanation: string;
  potential_pitfalls: string[];
  questions_to_ask_lawyer: string[];
}

export interface HeatmapCategory {
  category: string;
  score: number;
  status: string;
  description: string;
}

export interface RiskMetrics {
  overall_risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'legal_review_advised';
  risk_label: string;
  financial_exposure_score: number;
  deadline_severity_score: number;
  heatmap_categories: HeatmapCategory[];
  total_clauses_evaluated: number;
  high_risk_clause_count: number;
}

export interface AnalysisData {
  overview: {
    document_type: string;
    parties_involved: string[];
    purpose: string;
    effective_date?: string;
    duration?: string;
    governing_law?: string;
  };
  key_points: Array<{
    topic: string;
    summary: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  obligations: {
    user_obligations: string[];
    counterparty_obligations: string[];
    joint_obligations: string[];
  };
  financial_terms: {
    payment_terms: string;
    fees_and_rates: string[];
    penalties_and_late_fees: string[];
    security_deposit_or_retainer?: string;
  };
  critical_deadlines: Array<{
    event: string;
    timeframe_or_date: string;
    consequence_of_missing: string;
  }>;
  risk_score: number;
  risk_level: string;
  escalation_recommended: boolean;
  escalation_reason?: string;
  lawyer_discussion_points: string[];
  disclaimer: string;
}

export interface AnalysisResult {
  id: string;
  document: string;
  document_title: string;
  document_type: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  explanation_mode: 'beginner' | 'professional';
  language: string;
  result_data: AnalysisData;
  clauses_data: ClauseDetection[];
  risk_metrics: RiskMetrics;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'legal_review_advised';
  escalation_recommended: boolean;
  escalation_reason?: string;
  processing_time_seconds: number;
  model_used: string;
  created_at: string;
}

export interface ClauseChange {
  section_or_clause: string;
  change_type: 'added' | 'removed' | 'modified';
  previous_text?: string;
  new_text?: string;
  impact_assessment: string;
  risk_level: 'low' | 'medium' | 'high' | 'legal_review_advised';
  favorable_to: 'user' | 'counterparty' | 'neutral';
}

export interface ComparisonReport {
  id: string;
  document_a: string;
  document_b: string;
  doc_a_title: string;
  doc_b_title: string;
  title: string;
  comparison_data: {
    summary_of_changes: string;
    risk_impact_overview: string;
    changes: ClauseChange[];
    total_added: number;
    total_removed: number;
    total_modified: number;
  };
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Array<{ chunk_index: number; excerpt: string }>;
  escalation_suggested?: boolean;
  escalation_reason?: string;
  model_used?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  document?: string;
  document_title?: string;
  title: string;
  explanation_mode: 'beginner' | 'professional';
  language: string;
  messages: ChatMessage[];
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface AIAuditLog {
  id: string;
  user_email: string;
  document_title?: string;
  action_type: string;
  query_text: string;
  response_summary: string;
  source_sections: any[];
  model_used: string;
  prompt_tokens: number;
  completion_tokens: number;
  processing_time_ms: number;
  escalation_triggered: boolean;
  timestamp: string;
}

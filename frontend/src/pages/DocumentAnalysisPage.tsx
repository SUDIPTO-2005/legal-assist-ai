import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { documentsService } from '../services/documents.service';
import { useAnalysis } from '../hooks/useAnalysis';
import { ModeToggle } from '../components/common/ModeToggle';
import { EscalationAlert } from '../components/common/EscalationAlert';
import { RiskScoreGauge } from '../components/analysis/RiskScoreGauge';
import { RiskHeatmap } from '../components/analysis/RiskHeatmap';
import { ClauseCard } from '../components/analysis/ClauseCard';
import { InsightPanel } from '../components/analysis/InsightPanel';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { formatDate, formatFileSize } from '../lib/utils';
import { DOCUMENT_TYPE_LABELS } from '../lib/constants';

export const DocumentAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'professional'>('beginner');
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'lawyer_prep'>('overview');

  const { data: document, isLoading: isLoadingDoc } = useQuery({
    queryKey: ['document', id],
    queryFn: () => id ? documentsService.getDocument(id) : null,
    enabled: !!id
  });

  const { 
    analysis, 
    isLoading: isLoadingAnalysis, 
    triggerAnalysis, 
    isAnalyzing 
  } = useAnalysis(id);

  const handleRunAnalysis = async () => {
    if (!id) return;
    await triggerAnalysis({ docId: id, mode: explanationMode });
  };

  if (isLoadingDoc) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!document) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800">Document not found</h3>
        <Link to="/documents" className="text-xs font-bold text-legal-navy mt-2 inline-block">
          ← Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 leading-snug">
                {document.title}
              </h1>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
                {DOCUMENT_TYPE_LABELS[document.document_type] || 'Legal Contract'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Uploaded {formatDate(document.created_at)} • {formatFileSize(document.file_size)} • {document.page_count || 1} pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <ModeToggle mode={explanationMode} onChange={setExplanationMode} />
          
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-legal-navy hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Sparkles className={`w-3.5 h-3.5 text-legal-gold ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{analysis ? 'Re-Analyze AI' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Escalation Alert if triggered */}
      {analysis?.escalation_recommended && (
        <EscalationAlert reason={analysis.escalation_reason || undefined} />
      )}

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Document Specs
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">File Name</span>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">{document.original_filename}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Format</span>
                <span className="font-semibold text-slate-800 uppercase">{document.file_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Estimated Words</span>
                <span className="font-semibold text-slate-800">{document.word_count || 'Analyzed'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600 uppercase text-[11px]">{document.status}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={documentsService.getDownloadUrl(document.id)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original File</span>
              </a>
            </div>
          </div>

          {/* Quick Chat Link */}
          <div className="bg-gradient-to-br from-slate-900 to-legal-navy text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-legal-gold" />
              <h4 className="font-bold text-xs">Got questions about this contract?</h4>
            </div>
            <p className="text-[11px] text-slate-300">
              Ask our conversational AI assistant to clarify specific clauses or deadlines.
            </p>
            <Link
              to={`/chat?docId=${document.id}`}
              className="block text-center py-2 bg-legal-gold text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-amber-400 transition-all"
            >
              Start Document Chat
            </Link>
          </div>
        </div>

        {/* Center Column: Structured AI Insights & Tabs (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1">
            {[
              { id: 'overview', label: 'Executive Summary' },
              { id: 'clauses', label: `Clauses (${analysis?.clauses_data?.length || 0})` },
              { id: 'lawyer_prep', label: 'Lawyer Checklist' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-legal-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isAnalyzing || isLoadingAnalysis ? (
            <LoadingSkeleton rows={5} />
          ) : analysis ? (
            <div>
              {activeTab === 'overview' && (
                <InsightPanel data={analysis.result_data} explanationMode={explanationMode} />
              )}

              {activeTab === 'clauses' && (
                <div className="space-y-3">
                  {analysis.clauses_data?.map((clause, idx) => (
                    <ClauseCard key={idx} clause={clause} explanationMode={explanationMode} />
                  )) || <p className="text-xs text-slate-400">No specific clauses classified.</p>}
                </div>
              )}

              {activeTab === 'lawyer_prep' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-legal-gold" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Lawyer Consultation Brief
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prior to meeting your attorney, review these key items to minimize billable hours and address critical risk points directly:
                  </p>
                  <div className="space-y-3 pt-2">
                    {analysis.result_data?.lawyer_discussion_points?.map((pt, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-start gap-2.5">
                        <span className="font-extrabold text-legal-gold">#{idx + 1}</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="p-4 bg-slate-100 text-legal-navy rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-legal-gold" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Ready to Analyze</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click below to parse clauses, determine financial liabilities, and evaluate risk scores using GenAI.
              </p>
              <button
                onClick={handleRunAnalysis}
                className="px-6 py-2.5 bg-legal-navy hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                Start AI Analysis
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Risk Score & Heatmap (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <RiskScoreGauge
            score={analysis?.risk_score || 35}
            riskLevel={analysis?.risk_level || 'low'}
          />

          <RiskHeatmap
            categories={analysis?.risk_metrics?.heatmap_categories || []}
            financialExposure={analysis?.risk_metrics?.financial_exposure_score || 25}
            deadlinesRisk={analysis?.risk_metrics?.deadline_severity_score || 20}
          />
        </div>
      </div>
    </div>
  );
};

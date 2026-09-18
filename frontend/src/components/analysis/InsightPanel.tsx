import React from 'react';
import { AnalysisData } from '../../types';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Clock, 
  Shield, 
  FileText, 
  Sparkles 
} from 'lucide-react';

interface InsightPanelProps {
  data: AnalysisData;
  explanationMode?: 'beginner' | 'professional';
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ data, explanationMode = 'beginner' }) => {
  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-legal-navy mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-legal-gold" />
          <span>Document Executive Summary</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-500 block">Document Type</span>
            <span className="font-bold text-slate-800 text-sm">{data.overview?.document_type || 'Legal Contract'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Duration / Term</span>
            <span className="font-medium text-slate-800">{data.overview?.duration || 'Indefinite / As specified'}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-500 block">Parties Identified</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {data.overview?.parties_involved?.map((p, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200">
                  {p}
                </span>
              )) || <span className="text-slate-400">Standard contracting parties</span>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-500 block">Core Purpose</span>
            <p className="text-slate-700 mt-1 leading-relaxed">{data.overview?.purpose}</p>
          </div>
        </div>
      </div>

      {/* Obligations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Obligations */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Your Key Obligations (User Must Do)</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {data.obligations?.user_obligations?.map((ob, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{ob}</span>
              </li>
            )) || <li className="text-slate-400">No specific user duties identified.</li>}
          </ul>
        </div>

        {/* Counterparty Obligations */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Counterparty Duties (Other Party Must Do)</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {data.obligations?.counterparty_obligations?.map((ob, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{ob}</span>
              </li>
            )) || <li className="text-slate-400">Standard counterparty obligations.</li>}
          </ul>
        </div>
      </div>

      {/* Financial Terms & Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial info */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Financial Terms & Penalty Schedule</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-500">Payment Terms:</span>
              <p className="text-slate-800 mt-0.5">{data.financial_terms?.payment_terms || 'Standard invoicing terms'}</p>
            </div>
            {data.financial_terms?.penalties_and_late_fees?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-500">Penalties / Late Fees:</span>
                <ul className="mt-1 space-y-1">
                  {data.financial_terms.penalties_and_late_fees.map((p, idx) => (
                    <li key={idx} className="text-red-700 font-medium flex items-center gap-1.5">
                      <span className="text-red-500">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Critical Deadlines */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Critical Deadlines & Consequences</span>
          </h4>
          <div className="space-y-3">
            {data.critical_deadlines?.map((dl, idx) => (
              <div key={idx} className="text-xs p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                <div className="flex justify-between items-center font-bold text-amber-950">
                  <span>{dl.event}</span>
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[11px] text-amber-900">{dl.timeframe_or_date}</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  <span className="font-semibold">If missed:</span> {dl.consequence_of_missing}
                </p>
              </div>
            )) || <div className="text-xs text-slate-400">No strict deadlines flagged.</div>}
          </div>
        </div>
      </div>

      {/* Lawyer Prep Checklist */}
      {data.lawyer_discussion_points && data.lawyer_discussion_points.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-legal-navy text-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-legal-gold" />
            <h4 className="font-bold text-sm tracking-wide">
              Lawyer Preparation Mode: Discussion Checklist
            </h4>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Take these questions directly into your consultation with legal counsel:
          </p>
          <div className="space-y-2">
            {data.lawyer_discussion_points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-100 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="font-bold text-legal-gold">{idx + 1}.</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

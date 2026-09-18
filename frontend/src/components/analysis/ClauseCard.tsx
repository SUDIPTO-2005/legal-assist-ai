import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ClauseDetection } from '../../types';
import { getRiskColor } from '../../lib/utils';

interface ClauseCardProps {
  clause: ClauseDetection;
  explanationMode?: 'beginner' | 'professional';
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, explanationMode = 'beginner' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const riskStyles = getRiskColor(clause.risk_level);

  return (
    <div className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
      isOpen ? 'bg-white shadow-md border-slate-300' : 'bg-white/80 hover:bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider ${riskStyles.badge}`}>
            {clause.clause_type.replace('_', ' ')}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              {clause.title || `${clause.clause_type.toUpperCase()} Clause`}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {clause.plain_explanation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${riskStyles.badge}`}>
            {clause.risk_level.replace('_', ' ')}
          </span>
          <button className="p-1 text-slate-400 hover:text-slate-700">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
          {/* Explanation */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-legal-gold" />
              <span>What this means for you ({explanationMode === 'beginner' ? 'Plain English' : 'Legal Analysis'}):</span>
            </h5>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {clause.plain_explanation}
            </p>
          </div>

          {/* Raw Text Excerpt */}
          {clause.raw_text && (
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Original Document Text:</span>
              </h5>
              <div className="text-xs font-serif italic text-slate-600 bg-white p-3 rounded-xl border border-slate-200 max-h-36 overflow-y-auto leading-relaxed">
                "{clause.raw_text}"
              </div>
            </div>
          )}

          {/* Questions to ask lawyer */}
          {clause.questions_to_ask_lawyer && clause.questions_to_ask_lawyer.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
              <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Recommended Questions for your Lawyer:</span>
              </h5>
              <ul className="space-y-1">
                {clause.questions_to_ask_lawyer.map((q, idx) => (
                  <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

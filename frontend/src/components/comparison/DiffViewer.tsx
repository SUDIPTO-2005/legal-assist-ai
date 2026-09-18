import React from 'react';
import { ClauseChange } from '../../types';
import { PlusCircle, MinusCircle, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

interface DiffViewerProps {
  changes: ClauseChange[];
  docAName?: string;
  docBName?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  changes,
  docAName = 'Original Contract (A)',
  docBName = 'Revised Contract (B)'
}) => {
  const getChangeBadge = (type: string) => {
    switch (type) {
      case 'added':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <PlusCircle className="w-3.5 h-3.5" /> Added
          </span>
        );
      case 'removed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <MinusCircle className="w-3.5 h-3.5" /> Removed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <RefreshCw className="w-3.5 h-3.5" /> Modified
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {changes.map((change, idx) => {
        const risk = getRiskColor(change.risk_level);
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getChangeBadge(change.change_type)}
                <h4 className="font-bold text-slate-900 text-sm">{change.section_or_clause}</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${risk.badge}`}>
                {change.risk_level.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
              <span className="font-semibold text-slate-700 block mb-0.5">Impact Assessment:</span>
              <p>{change.impact_assessment}</p>
            </div>

            {/* Side-by-side comparison text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {change.previous_text && (
                <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl">
                  <span className="font-bold text-red-900 block mb-1">Previous Version ({docAName}):</span>
                  <p className="font-serif italic text-red-800 line-through decoration-red-400">
                    "{change.previous_text}"
                  </p>
                </div>
              )}

              {change.new_text && (
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-900 block mb-1">New Version ({docBName}):</span>
                  <p className="font-serif italic text-emerald-800">
                    "{change.new_text}"
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

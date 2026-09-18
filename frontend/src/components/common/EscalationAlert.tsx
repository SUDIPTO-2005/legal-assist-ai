import React from 'react';
import { AlertTriangle, ExternalLink, ShieldAlert } from 'lucide-react';

interface EscalationAlertProps {
  reason?: string;
  className?: string;
}

export const EscalationAlert: React.FC<EscalationAlertProps> = ({ 
  reason = "This document or clause contains high-risk commitments, potential dispute triggers, or court action clauses.",
  className = ''
}) => {
  return (
    <div className={`p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-red-950">
              Professional Legal Review Recommended
            </h4>
            <span className="px-2 py-0.5 bg-red-600 text-white font-semibold text-[10px] tracking-wider uppercase rounded-full">
              Escalation Advisory
            </span>
          </div>
          <p className="text-red-900 leading-relaxed mb-3">
            {reason}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-red-800 bg-red-100/80 px-2.5 py-1 rounded-md">
              Checklist ready for your lawyer
            </span>
            <span className="text-xs text-red-700 italic">
              Never sign agreements with critical flags without certified counsel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

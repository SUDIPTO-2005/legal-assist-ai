import React from 'react';
import { Scale, Info } from 'lucide-react';
import { LEGAL_DISCLAIMER_TEXT } from '../../lib/constants';

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 bg-amber-50/90 border border-amber-200/80 rounded-lg text-xs text-amber-900 font-medium ${className}`}>
        <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="truncate">{LEGAL_DISCLAIMER_TEXT}</span>
      </div>
    );
  }

  return (
    <aside aria-label="Legal safety disclaimer" className={`flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl text-amber-900 shadow-sm ${className}`}>
      <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-0.5">
        <Scale className="w-5 h-5 text-amber-700" />
      </div>
      <div className="text-sm">
        <h4 className="font-semibold text-amber-950 flex items-center gap-1.5 mb-0.5">
          Important Legal Safety Notice
        </h4>
        <p className="text-amber-800 leading-relaxed">
          {LEGAL_DISCLAIMER_TEXT}
        </p>
      </div>
    </aside>
  );
};

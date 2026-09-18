import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

interface ModeToggleProps {
  mode: 'beginner' | 'professional';
  onChange: (mode: 'beginner' | 'professional') => void;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center p-1 bg-slate-100/90 border border-slate-200 rounded-xl shadow-inner ${className}`}>
      <button
        type="button"
        onClick={() => onChange('beginner')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          mode === 'beginner'
            ? 'bg-white text-legal-navy shadow-sm border border-slate-200/80 font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5 text-legal-gold" />
        <span>Simple / Plain English</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('professional')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          mode === 'professional'
            ? 'bg-white text-legal-navy shadow-sm border border-slate-200/80 font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5 text-legal-navy" />
        <span>Professional Legalese</span>
      </button>
    </div>
  );
};

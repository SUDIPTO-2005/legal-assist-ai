import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

interface RiskScoreGaugeProps {
  score: number; // 0 - 100
  riskLevel: string;
  riskLabel?: string;
  className?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  riskLevel,
  riskLabel = 'Risk Assessment',
  className = ''
}) => {
  const getScoreColor = (val: number) => {
    if (val < 35) return { text: 'text-emerald-600', ring: '#10B981', bg: 'bg-emerald-500' };
    if (val < 70) return { text: 'text-amber-600', ring: '#F59E0B', bg: 'bg-amber-500' };
    return { text: 'text-red-600', ring: '#EF4444', bg: 'bg-red-500' };
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-5 bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-legal-gold" />
          <span>Legal Risk Score</span>
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          score < 35 ? 'bg-emerald-100 text-emerald-800' : score < 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
        }`}>
          {riskLevel.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#F1F5F9"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={colors.ring}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-black ${colors.text}`}>{score}</span>
            <span className="text-[10px] font-bold text-slate-400 -mt-1 uppercase">/ 100</span>
          </div>
        </div>

        <div className="text-xs space-y-1.5">
          <p className="font-semibold text-slate-700">
            {score < 35 ? 'Favorable Terms Detected' : score < 70 ? 'Standard Negotiable Risks' : 'Significant Exposure Clauses'}
          </p>
          <p className="text-slate-500 leading-relaxed">
            Composite evaluation of indemnities, penalties, auto-renewal windows, and covenants.
          </p>
        </div>
      </div>
    </div>
  );
};

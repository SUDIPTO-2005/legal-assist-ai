import React from 'react';
import { HeatmapCategory } from '../../types';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RiskHeatmapProps {
  categories?: HeatmapCategory[];
  financialExposure?: number;
  deadlinesRisk?: number;
  className?: string;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  categories = [],
  financialExposure = 35,
  deadlinesRisk = 20,
  className = ''
}) => {
  const getCategoryColor = (score: number) => {
    if (score < 40) return { bg: 'bg-emerald-500', bar: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score < 70) return { bg: 'bg-amber-500', bar: 'bg-amber-100', text: 'text-amber-700' };
    return { bg: 'bg-red-500', bar: 'bg-red-100', text: 'text-red-700' };
  };

  return (
    <div className={`p-5 bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-legal-navy" />
          <span>Legal Exposure Heatmap</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          4 Core Vectors
        </span>
      </div>

      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((cat, idx) => {
            const colors = getCategoryColor(cat.score);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{cat.category}</span>
                  <span className={`font-bold ${colors.text}`}>{cat.status} ({cat.score}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} transition-all duration-700 rounded-full`}
                    style={{ width: `${Math.min(cat.score, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">{cat.description}</p>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-400 py-4 text-center">
            Heatmap generated upon document analysis.
          </div>
        )}
      </div>
    </div>
  );
};

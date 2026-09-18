import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({ rows = 4, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl border border-slate-200/60 p-4 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

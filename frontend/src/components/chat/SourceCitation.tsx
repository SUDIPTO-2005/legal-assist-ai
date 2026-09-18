import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface SourceCitationProps {
  sources: Array<{ chunk_index: number; excerpt: string }>;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-slate-100 pt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-legal-navy transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5 text-legal-gold" />
        <span>Referenced {sources.length} document {sources.length === 1 ? 'excerpt' : 'excerpts'}</span>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-legal-gold/50">
          {sources.map((s, idx) => (
            <div key={idx} className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-0.5">Section Excerpt #{s.chunk_index + 1}:</span>
              <p className="font-serif italic text-slate-500">{s.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

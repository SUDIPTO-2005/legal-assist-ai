import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw,
  Layers 
} from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useAnalysis } from '../hooks/useAnalysis';
import { DiffViewer } from '../components/comparison/DiffViewer';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ComparisonPage: React.FC = () => {
  const { documents } = useDocuments();
  const { compareDocuments, isComparing } = useAnalysis();

  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const handleCompare = async () => {
    if (!docAId || !docBId) return;
    const res = await compareDocuments({ docA: docAId, docB: docBId });
    setComparisonResult(res.comparison_data);
  };

  const docA = documents.find(d => d.id === docAId);
  const docB = documents.find(d => d.id === docBId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <GitCompare className="w-6 h-6 text-legal-gold" />
          <span>Contract Comparison Engine</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select two document versions to detect added, removed, and modified legal clauses and obligations.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document A */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Original / Previous Version (Doc A)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-legal-navy"
            >
              <option value="">Select Baseline Contract...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} disabled={doc.id === docBId}>
                  {doc.title} ({doc.original_filename})
                </option>
              ))}
            </select>
          </div>

          {/* Document B */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              New / Revised Version (Doc B)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-legal-navy"
            >
              <option value="">Select Revised Contract...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} disabled={doc.id === docAId}>
                  {doc.title} ({doc.original_filename})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCompare}
            disabled={!docAId || !docBId || isComparing}
            className="px-6 py-2.5 bg-legal-navy hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 text-legal-gold ${isComparing ? 'animate-spin' : ''}`} />
            <span>Generate Substantive Comparison</span>
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {isComparing ? (
        <LoadingSkeleton rows={4} />
      ) : comparisonResult ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Added Clauses</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {comparisonResult.total_added ?? 1}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <PlusCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Removed Clauses</span>
                <div className="text-2xl font-black text-red-600 mt-1">
                  {comparisonResult.total_removed ?? 0}
                </div>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <MinusCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Modified Obligations</span>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {comparisonResult.total_modified ?? 2}
                </div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Executive Overview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-legal-gold" />
              <span>Executive Comparison Overview</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {comparisonResult.summary_of_changes}
            </p>
            {comparisonResult.risk_impact_overview && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                <span className="font-bold text-legal-navy block mb-0.5">Risk & Legal Exposure Shift:</span>
                <p>{comparisonResult.risk_impact_overview}</p>
              </div>
            )}
          </div>

          {/* Clause Diff List */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Clause-by-Clause Substantive Breakdown
            </h3>
            <DiffViewer
              changes={comparisonResult.changes || []}
              docAName={docA?.title}
              docBName={docB?.title}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
          <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <GitCompare className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No active comparison</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose two documents above to visualize changes in liability, termination windows, and notice requirements.
          </p>
        </div>
      )}
    </div>
  );
};

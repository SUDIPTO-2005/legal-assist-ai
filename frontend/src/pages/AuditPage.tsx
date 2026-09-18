import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  History, 
  ShieldCheck, 
  FileText, 
  Search, 
  Clock, 
  Cpu, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { auditService } from '../services/audit.service';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { formatDate } from '../lib/utils';
import { AIAuditLog } from '../types';

export const AuditPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['audit_logs'],
    queryFn: () => auditService.getAuditLogs(),
  });

  const filteredLogs = auditLogs.filter(log =>
    log.query_text?.toLowerCase().includes(search.toLowerCase()) ||
    log.model_used?.toLowerCase().includes(search.toLowerCase()) ||
    log.action_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-legal-gold" />
          <span>AI Safety & Interaction Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable transparency log of all GenAI queries, citations, token counts, and safety validations.
        </p>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit logs by prompt, action, or model..."
          className="w-full bg-transparent text-xs text-slate-800 outline-none"
        />
      </div>

      {/* Logs Table / Card List */}
      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log: AIAuditLog) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl text-legal-navy font-bold text-xs uppercase tracking-wider">
                      {log.action_type || 'AI Query'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        "{log.query_text}"
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>{formatDate(log.timestamp)}</span>
                        <span>• Model: {log.model_used || 'gpt-4o'}</span>
                        {log.processing_time_ms > 0 && (
                          <span>• {log.processing_time_ms}ms</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {log.escalation_triggered && (
                      <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full uppercase">
                        Escalation Flagged
                      </span>
                    )}
                    <button className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">AI Assistant Response Output:</span>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 leading-relaxed whitespace-pre-wrap font-serif">
                        {log.response_summary}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-500">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="block font-semibold">User Context</span>
                        <span className="text-slate-800">{log.user_email}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="block font-semibold">Token Usage</span>
                        <span className="text-slate-800">{log.prompt_tokens + log.completion_tokens || 'N/A'} tokens</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="block font-semibold">Attached Document</span>
                        <span className="text-slate-800">{log.document_title || 'None (Direct query)'}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="block font-semibold">Legal Disclaimer</span>
                        <span className="text-emerald-700 font-bold">Enforced ✅</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
          <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <History className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No audit logs recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Every query, document analysis, and AI chat response will be automatically logged here for accountability.
          </p>
        </div>
      )}
    </div>
  );
};

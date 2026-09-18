import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  UploadCloud, 
  GitCompare, 
  MessageSquare, 
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from '../components/documents/DocumentCard';
import { UploadZone } from '../components/documents/UploadZone';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { formatFileSize } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { documents, isLoading, uploadDocument, isUploading, deleteDocument } = useDocuments();

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    await uploadDocument(formData);
  };

  const readyDocs = documents.filter(d => d.status === 'ready');
  const pendingDocs = documents.filter(d => d.status === 'processing');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-legal-navy via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-legal-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.full_name || user?.email}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-light">
            Upload and analyze legal contracts, discover potential risk clauses, and navigate terms with AI assistance.
          </p>
        </div>

        {/* Quick action badges */}
        <div className="mt-6 flex flex-wrap gap-3 relative z-10">
          <Link
            to="/documents"
            className="px-4 py-2 bg-legal-gold hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>

          <Link
            to="/compare"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <GitCompare className="w-4 h-4 text-legal-gold" />
            <span>Compare Contracts</span>
          </Link>

          <Link
            to="/chat"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-legal-gold" />
            <span>Ask AI Legal Assistant</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: documents.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Analyzed & Ready', value: readyDocs.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Processing in Queue', value: pendingDocs.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'AI Guard Status', value: 'Active (Non-Advice)', icon: ShieldAlert, color: 'text-legal-gold', bg: 'bg-slate-100' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                <div className={`p-2 rounded-xl ${metric.bg} ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metric.value}</div>
            </div>
          );
        })}
      </div>

      {/* Drag and drop quick uploader */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-legal-gold" />
          <span>Quick Contract Uploader</span>
        </h2>
        <UploadZone onUpload={handleUpload} isUploading={isUploading} />
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-legal-navy" />
            <span>Recent Legal Documents</span>
          </h2>
          <Link to="/documents" className="text-xs font-bold text-legal-navy hover:text-slate-600 flex items-center gap-1">
            <span>View All ({documents.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.slice(0, 6).map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-800">No documents uploaded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your first employment agreement, lease, NDA, or service contract to start AI clause analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

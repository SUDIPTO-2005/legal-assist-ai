import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Trash2, 
  Download, 
  ArrowRight, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { DOCUMENT_TYPE_LABELS } from '../../lib/constants';
import { formatFileSize, formatDate } from '../../lib/utils';
import { documentsService } from '../../services/documents.service';

interface DocumentCardProps {
  document: DocumentItem;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Ready for Analysis
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            Processing...
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-3 bg-slate-100 group-hover:bg-legal-navy group-hover:text-legal-gold rounded-xl transition-colors text-slate-700">
            <FileText className="w-6 h-6" />
          </div>
          {getStatusBadge(document.status)}
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-legal-navy">
          {document.title}
        </h3>

        <div className="flex items-center gap-2 mt-1 mb-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {DOCUMENT_TYPE_LABELS[document.document_type] || 'Legal Contract'}
          </span>
          {document.page_count > 0 && (
            <span className="text-xs text-slate-400">
              • {document.page_count} {document.page_count === 1 ? 'page' : 'pages'}
            </span>
          )}
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Uploaded {formatDate(document.created_at)}</span>
          </div>
          <div>Size: {formatFileSize(document.file_size)}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <a
            href={documentsService.getDownloadUrl(document.id)}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => onDelete(document.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Link
          to={`/documents/${document.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-legal-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm group-hover:shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-legal-gold" />
          <span>Analyze AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

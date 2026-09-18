import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  FolderPlus, 
  UploadCloud, 
  Layers 
} from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from '../components/documents/DocumentCard';
import { UploadZone } from '../components/documents/UploadZone';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { DOCUMENT_TYPE_LABELS } from '../lib/constants';

export const DocumentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { documents, isLoading, uploadDocument, isUploading, deleteDocument } = useDocuments({
    search: search || undefined,
    document_type: selectedType || undefined
  });

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    if (selectedType) {
      formData.append('document_type', selectedType);
    }
    await uploadDocument(formData);
    setShowUploadModal(false);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.original_filename.toLowerCase().includes(search.toLowerCase());
    const matchesType = !selectedType || doc.document_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Legal Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, categorize, and extract intelligence from all your contracts.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(!showUploadModal)}
          className="px-4 py-2.5 bg-legal-navy hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4 text-legal-gold" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Drawer / Modal */}
      {showUploadModal && (
        <div className="bg-white border-2 border-legal-gold/40 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Upload New Legal Document</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              Close ✕
            </button>
          </div>
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or filename..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-legal-navy outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium outline-none w-full sm:w-auto"
          >
            <option value="">All Document Types</option>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
          <div className="p-4 bg-slate-100 text-slate-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No documents match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try clearing your search query or upload a new contract to get started.
          </p>
        </div>
      )}
    </div>
  );
};

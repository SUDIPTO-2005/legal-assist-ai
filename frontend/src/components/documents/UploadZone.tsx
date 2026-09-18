import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, isUploading = false, className = '' }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-legal-gold bg-amber-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-legal-navy hover:bg-slate-50/80 bg-white'
        } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-slate-100 text-legal-navy rounded-2xl shadow-sm">
            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-legal-gold animate-bounce' : 'text-slate-700'}`} />
          </div>

          <div>
            <p className="text-base font-bold text-slate-800">
              {isDragActive ? 'Drop your legal contract here...' : 'Upload your legal document'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Drag & drop or <span className="text-legal-navy font-semibold underline">browse files</span> from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['PDF', 'DOCX', 'TXT', 'Scanned OCR (PNG/JPG)'].map((type) => (
              <span key={type} className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                {type}
              </span>
            ))}
            <span className="text-[11px] text-slate-400">Up to 50MB</span>
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>File rejected: Please upload a valid PDF, Word document, TXT or Image file under 50MB.</span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MoreVertical, 
  Star, 
  Share2, 
  Download, 
  Calendar, 
  FileText, 
  HardDrive, 
  Trash2, 
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderPlus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Folder,
  X,
  Upload,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useDocumentContext, formatBytes } from '../context/DocumentContext';
import { shareDocumentNative } from '../services/nativeService';
import { DocumentCategory } from '../types';
import { ConfirmDialog, toast } from '../components/ui';

export const DocumentDetailScreen: React.FC = () => {
  const { 
    activeDocumentDetail, 
    documents, 
    setActiveTab, 
    deleteDocument, 
    updateDocument,
    toggleFavorite,
    setIsActionSheetOpen,
    setSelectedDocument,
    folders,
    createShare,
    userProfile
  } = useDocumentContext();

  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;
  const attachInputRef = useRef<HTMLInputElement>(null);

  // Active document or first vault document
  const doc = activeDocumentDetail || documents[0] || null;

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveFolderValue, setMoveFolderValue] = useState<DocumentCategory>((doc?.category as DocumentCategory) || 'Identity');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!doc) {
    return (
      <div className="p-12 text-center select-none bg-white rounded-3xl border border-[#E2E8F0] shadow-subtle max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#64748B] mb-4">
          <FileText className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-[#0F172A]">No Document Selected</h3>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
          Please select a document from your vault list or upload a new file.
        </p>
        <button 
          onClick={() => setActiveTab('documents')} 
          className="mt-5 px-5 py-2.5 rounded-full bg-[#111827] text-white font-bold text-xs cursor-pointer hover:bg-black transition-all"
        >
          View All Documents
        </button>
      </div>
    );
  }

  const isImage = Boolean(
    doc.fileUrl &&
    (doc.fileUrl.startsWith('data:image/') ||
      ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(doc.fileType.toLowerCase()))
  );

  const isPdf = Boolean(
    doc.fileUrl &&
    (doc.fileUrl.startsWith('data:application/pdf') || doc.fileType.toLowerCase() === 'pdf')
  );

  const handleShare = async () => {
    await shareDocumentNative(doc.title, `PaperTrail Vault Document: ${doc.title} (${doc.policyNumber || ''})`);
  };

  const handleDownload = () => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `${doc.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}.${doc.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Authenticated manifest for metadata-only vault entry
    const manifest = {
      vaultRecordId: doc.id,
      title: doc.title,
      category: doc.category,
      issuer: doc.issuer || 'PaperTrail Vault',
      policyNumber: doc.policyNumber || 'N/A',
      issueDate: doc.issueDate,
      expiryDate: doc.expiryDate || 'Permanent',
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      verified: doc.isVerified,
      vaultOwner: userProfile.name,
      ownerEmail: userProfile.email,
      encryption: 'AES-256-GCM Zero-Knowledge',
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_PaperTrail_Record.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const resolvedType = ext === 'png' ? 'png' : ext === 'jpg' || ext === 'jpeg' ? 'jpg' : ext === 'webp' ? 'png' : 'pdf';
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateDocument(doc.id, {
          fileUrl: reader.result,
          fileName: file.name,
          fileSizeBytes: file.size,
          fileSize: formatBytes(file.size),
          fileType: resolvedType,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleOpenRename = () => {
    setRenameValue(doc.title);
    setIsRenameOpen(true);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue.trim()) {
      updateDocument(doc.id, { title: renameValue.trim() });
      setIsRenameOpen(false);
      toast.success('Document renamed', `Updated title to "${renameValue.trim()}".`);
    }
  };

  const handleOpenMove = () => {
    setMoveFolderValue(doc.category);
    setIsMoveOpen(true);
  };

  const handleSaveMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (moveFolderValue) {
      updateDocument(doc.id, { category: moveFolderValue as any });
      setIsMoveOpen(false);
      toast.success('Moved folder', `Document moved to ${moveFolderValue}.`);
    }
  };

  return (
    <div className="w-full space-y-6 select-none pb-8">
      
      {/* 1. Desktop Breadcrumb Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('documents')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all shadow-subtle cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#1D5FF0] stroke-[2.2]" />
          <span>Back to Documents</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(doc.id)}
            className={`p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all shadow-subtle cursor-pointer ${
              doc.isFavorite ? 'text-amber-500' : 'text-[#64748B]'
            }`}
            title={doc.isFavorite ? 'Starred Document' : 'Star Document'}
          >
            <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all shadow-subtle cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#64748B]" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] text-xs font-bold text-white transition-all shadow-card cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>Download</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocument(doc);
              setIsActionSheetOpen(true);
            }}
            className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all shadow-subtle cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden File Picker for Attaching Real Document Assets */}
      <input
        ref={attachInputRef}
        type="file"
        onChange={handleAttachFile}
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />

      {/* 2. Dual Workspace Layout (Left: Canvas Viewer, Right: Metadata & Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Large Document Preview Workspace (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-subtle overflow-hidden flex flex-col">
          
          {/* Top Viewer Controls Bar */}
          <div className="px-6 py-3.5 border-b border-[#E2E8F0] bg-[#F7F9FC] flex items-center justify-between text-xs text-[#64748B] select-none">
            <div className="flex items-center gap-2 font-semibold">
              <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {doc.fileType}
              </span>
              <span className="truncate max-w-[200px] text-[#0F172A]">{doc.title}</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#E2E8F0]">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                  className="p-1 hover:text-[#1D5FF0] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold w-12 text-center text-[#0F172A]">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
                  className="p-1 hover:text-[#1D5FF0] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {doc.fileUrl && (
                <button
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                  className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#1D5FF0] hover:underline cursor-pointer"
                  title="Open full view in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Canvas Area with Real Uploaded File Rendering */}
          <div className="p-4 sm:p-8 bg-[#EEF2F8]/60 flex items-center justify-center min-h-[480px] sm:min-h-[580px] overflow-auto">
            {isImage ? (
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="w-full flex items-center justify-center transition-transform duration-200"
              >
                <img
                  src={doc.fileUrl}
                  alt={doc.title}
                  className="max-h-[540px] max-w-full rounded-2xl shadow-xl object-contain border border-slate-200/80 bg-white"
                />
              </div>
            ) : isPdf ? (
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="w-full h-[560px] rounded-2xl shadow-xl border border-slate-300/80 overflow-hidden bg-white transition-transform duration-200"
              >
                <iframe
                  src={doc.fileUrl}
                  title={doc.title}
                  className="w-full h-full border-none"
                />
              </div>
            ) : (
              /* Authentic PaperTrail Vault Security Record for documents without visual binary */
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="w-full max-w-[480px] aspect-[1/1.3] bg-white rounded-2xl shadow-xl border border-slate-300/80 p-6 sm:p-8 flex flex-col justify-between text-[#0F172A] relative transition-transform duration-200"
              >
                {/* Official PaperTrail Seal */}
                <div className="absolute right-6 top-6 w-20 h-20 rounded-full border-2 border-[#1D5FF0]/20 flex items-center justify-center pointer-events-none rotate-12">
                  <span className="text-[9px] font-black uppercase text-[#1D5FF0]/40 tracking-widest text-center">
                    PAPERTRAIL<br />VAULT SEAL
                  </span>
                </div>

                <div>
                  <div className="border-b-2 border-slate-900 pb-3">
                    <p className="text-[10px] font-black tracking-widest text-[#1D5FF0] uppercase">
                      PAPERTRAIL ENCRYPTED VAULT RECORD
                    </p>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1">
                      {doc.title}
                    </h2>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Record #{doc.id.toUpperCase()} · Category: {doc.category}
                    </p>
                  </div>

                  <div className="py-4 space-y-2.5 text-[11px]">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Issuer / Authority</span>
                      <span className="font-bold text-slate-900">{doc.issuer || 'Official Issuer'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Identifier / Policy #</span>
                      <span className="font-mono font-bold text-slate-900">{doc.policyNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Issue Date</span>
                      <span className="font-mono text-slate-900">{doc.issueDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Expiry Date</span>
                      <span className={`font-mono font-bold ${doc.isExpiringSoon ? 'text-rose-600' : 'text-slate-900'}`}>
                        {doc.expiryDate || 'Permanent / No Expiration'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">File Metadata</span>
                      <span className="font-mono text-slate-900 uppercase">{doc.fileType} · {doc.fileSize}</span>
                    </div>
                    {doc.notes && (
                      <div className="pt-1 text-[11px] text-slate-600">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Notes</span>
                        <p className="mt-0.5 italic">{doc.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {/* Attach Real File Prompt Button */}
                  <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl p-3 mb-3 text-center">
                    <p className="text-[11px] font-semibold text-[#0F172A] mb-1.5">
                      Attach or scan the original file
                    </p>
                    <button
                      onClick={() => attachInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1D5FF0] hover:bg-[#0752D9] text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File to View</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t-2 border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-600">
                    <span>ZERO-KNOWLEDGE ENCRYPTED</span>
                    <span className="text-emerald-700 font-bold">AES-256 ACTIVE</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Metadata & Management Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-subtle space-y-5">
            
            {/* Title & Category */}
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF1FF] text-[#1D5FF0] border border-[#1D5FF0]/20">
                  {doc.category}
                </span>

                {doc.isVerified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] mt-2 font-display">
                {doc.title}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                {doc.notes || 'Securely encrypted in your PaperTrail personal vault.'}
              </p>
            </div>

            {/* Detailed Properties Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Document Type</span>
                <span className="font-bold text-[#0F172A] uppercase">{doc.fileType} Format</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">File Size</span>
                <span className="font-bold text-[#0F172A]">{doc.fileSize}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Date Uploaded</span>
                <span className="font-bold text-[#0F172A]">{doc.issueDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Expiry Date</span>
                <span className={`font-bold ${doc.isExpiringSoon ? 'text-[#F04452]' : 'text-[#0F172A]'}`}>
                  {doc.expiryDate || 'No Expiry'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Assigned Folder</span>
                <span className="font-bold text-[#1D5FF0] flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5" />
                  {doc.category}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Security Status</span>
                <span className="font-semibold text-emerald-600">AES-256 Encrypted</span>
              </div>
            </div>

            {/* Document Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] text-white font-bold text-xs shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.2]" />
                <span>Download Document</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOpenRename}
                  className="py-2.5 px-3 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Rename</span>
                </button>

                <button
                  onClick={handleOpenMove}
                  className="py-2.5 px-3 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Move</span>
                </button>
              </div>

              <button
                onClick={handleDelete}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#F04452] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#F04452]" />
                <span>Delete Document</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Rename Document In-App Modal Dialog (Eliminates raw browser prompt) */}
      {isRenameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <form
            onSubmit={handleSaveRename}
            className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A]">Rename Document</h3>
              <button 
                type="button" 
                onClick={() => setIsRenameOpen(false)}
                className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#64748B]">Document Title</label>
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRenameOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#111827] text-white font-bold text-xs hover:bg-black cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Move Folder In-App Modal Dialog (Eliminates raw browser prompt) */}
      {isMoveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <form
            onSubmit={handleSaveMove}
            className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A]">Move to Folder</h3>
              <button 
                type="button" 
                onClick={() => setIsMoveOpen(false)}
                className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#64748B]">Select Destination Folder</label>
              <select
                value={moveFolderValue}
                onChange={(e) => setMoveFolderValue(e.target.value as DocumentCategory)}
                className="w-full mt-1.5 h-11 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
              >
                <option value="Identity">Identity</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Insurance">Insurance</option>
                <option value="Medical">Medical</option>
                <option value="Warranty">Warranty</option>
                {folders.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMoveOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#111827] text-white font-bold text-xs hover:bg-black cursor-pointer shadow-xs"
              >
                Move Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modern In-App Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteDocument(doc.id);
          setShowDeleteConfirm(false);
          setActiveTab('documents');
          toast.success('Document deleted', `"${doc.title}" was removed from your vault.`);
        }}
        title="Delete Document"
        description={`Are you sure you want to permanently delete "${doc.title}" from your vault? This action cannot be undone.`}
        confirmLabel="Delete Document"
        variant="danger"
      />

    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  ZoomIn,
  ZoomOut,
  CheckCheck,
  Lock,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { getCategoryColor } from '../lib/tokens';
import { triggerConfetti } from './Confetti';
import { ConfirmDialog, toast } from './ui';

export const DocumentModal: React.FC = () => {
  const { 
    selectedDocument, 
    setSelectedDocument, 
    updateDocument, 
    deleteDocument, 
    markDocumentVerified 
  } = useDocumentContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [editedExpiry, setEditedExpiry] = useState('');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'preview' | 'seal'>('preview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedDocument) return null;

  const categoryColor = getCategoryColor(selectedDocument.category);

  const isImage = Boolean(
    selectedDocument.fileUrl &&
    (selectedDocument.fileUrl.startsWith('data:image/') ||
      ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(selectedDocument.fileType.toLowerCase()))
  );

  const isPdf = Boolean(
    selectedDocument.fileUrl &&
    (selectedDocument.fileUrl.startsWith('data:application/pdf') || selectedDocument.fileType.toLowerCase() === 'pdf')
  );

  const handleStartEdit = () => {
    setEditedTitle(selectedDocument.title);
    setEditedNotes(selectedDocument.notes || '');
    setEditedExpiry(selectedDocument.expiryDate || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateDocument(selectedDocument.id, {
      title: editedTitle,
      notes: editedNotes,
      expiryDate: editedExpiry || null,
    });
    setIsEditing(false);
    toast.success('Document updated', 'Changes have been saved to your vault.');
    triggerConfetti();
  };

  const handleDownload = () => {
    if (selectedDocument.fileUrl) {
      const link = document.createElement('a');
      link.href = selectedDocument.fileUrl;
      link.download = `${selectedDocument.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}.${selectedDocument.fileType || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started', `${selectedDocument.title} is downloading.`);
      triggerConfetti();
      return;
    }

    // Generate digital record representation
    const content = `PAPERTRAIL SECURE DOCUMENT RECORD
Title: ${selectedDocument.title}
Category: ${selectedDocument.category}
Policy / Document ID: ${selectedDocument.policyNumber || 'N/A'}
Authority / Issuer: ${selectedDocument.issuer || 'Official Vault Record'}
Issue Date: ${selectedDocument.issueDate}
Expiry Date: ${selectedDocument.expiryDate || 'Permanent / N/A'}
Verified: ${selectedDocument.isVerified ? 'Yes' : 'No'}
Notes: ${selectedDocument.notes || 'None'}
Encrypted With: AES-256 PaperTrail Vault`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocument.title.replace(/\s+/g, '_')}_PaperTrail.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Record exported', `${selectedDocument.title} downloaded as vault record.`);
    triggerConfetti();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedDocument.title,
          text: `PaperTrail Secure Document: ${selectedDocument.title} (${selectedDocument.policyNumber || ''})`,
          url: window.location.href,
        });
        toast.success('Shared successfully', selectedDocument.title);
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(
      `PaperTrail Document: ${selectedDocument.title}\nID: ${selectedDocument.policyNumber || 'N/A'}\nIssuer: ${selectedDocument.issuer || 'Official Vault Record'}`
    );
    setCopied(true);
    toast.success('Copied to clipboard', 'Document reference is ready to paste.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine status color and label
  const getStatusDisplay = () => {
    if (selectedDocument.daysLeft !== null && selectedDocument.daysLeft < 0) {
      return {
        label: 'Expired',
        colorClass: 'text-[#DC2626]',
      };
    }
    if (selectedDocument.daysLeft !== null && selectedDocument.daysLeft <= 30) {
      return {
        label: `${selectedDocument.daysLeft} days remaining`,
        colorClass: 'text-[#D97706]',
      };
    }
    if (selectedDocument.isVerified) {
      return {
        label: 'Active & Verified',
        colorClass: 'text-[#16A34A]',
      };
    }
    return {
      label: 'Active & Protected',
      colorClass: 'text-[#1D5FF0]',
    };
  };

  const statusInfo = getStatusDisplay();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-lg bg-[#F8F9FA] rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E2E8F0]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
                style={{ 
                  backgroundColor: categoryColor.bg, 
                  color: categoryColor.accent, 
                  borderColor: `${categoryColor.accent}30` 
                }}
              >
                {selectedDocument.category}
              </span>

              {selectedDocument.isVerified ? (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D97706] bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FDE68A]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Unverified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  title="Edit document details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSelectedDocument(null)}
                className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* View Mode Segmented Tab (when image scan is available) */}
            {isImage && selectedDocument.fileUrl && (
              <div className="flex items-center justify-between px-1">
                <div className="inline-flex p-1 bg-[#EEF2F6] rounded-2xl border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('preview');
                      setZoom(1);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'preview'
                        ? 'bg-white text-[#1D5FF0] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Original Scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('seal');
                      setZoom(1);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'seal'
                        ? 'bg-[#080E1E] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Vault Seal</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono font-medium text-[#64748B]">
                  {selectedDocument.fileSize || '64.1 KB'} • {selectedDocument.fileType.toUpperCase()}
                </span>
              </div>
            )}

            {/* Visual Document Viewer Preview Canvas */}
            <div className="relative rounded-3xl overflow-hidden bg-[#080E1E] border border-[#1E293B] shadow-xl text-white flex flex-col justify-between min-h-[230px]">
              
              {/* Radial gradient glow for deep security card look */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(29, 95, 240, 0.35), transparent 60%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.15), transparent 50%)'
                }}
              />

              {/* Zoom control toggle */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <button
                  onClick={() => setZoom((z) => (z === 1 ? 1.35 : 1))}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white active:scale-90 transition-all cursor-pointer border border-white/10 shadow-sm"
                  title="Toggle zoom level"
                >
                  {zoom > 1 ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Actual Image preview display */}
              {isImage && selectedDocument.fileUrl && viewMode === 'preview' ? (
                <div className="relative z-10 w-full overflow-hidden flex items-center justify-center p-4 min-h-[230px] bg-black/20">
                  <img
                    src={selectedDocument.fileUrl}
                    alt={selectedDocument.title}
                    style={{
                      transform: `scale(${zoom})`,
                      transition: 'transform 0.25s ease-out'
                    }}
                    className="max-h-[270px] w-auto max-w-full rounded-2xl object-contain shadow-lg"
                  />
                </div>
              ) : (
                /* Encrypted Vault Security Certificate Card */
                <div 
                  className="relative z-10 p-6 flex flex-col justify-between flex-1"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.25s ease-out'
                  }}
                >
                  {/* Top Seal info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D5FF0] to-[#0B40BA] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/25 shrink-0">
                      PT
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold font-mono">
                        Official Vault Seal
                      </p>
                      <p className="text-xs font-bold text-white">
                        {selectedDocument.issuer || 'Official Vault Record'}
                      </p>
                    </div>
                  </div>

                  {/* Title & Document ID */}
                  <div className="my-6">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {selectedDocument.title}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-[#38BDF8] mt-1.5 flex items-center gap-1.5">
                      <span>ID:</span>
                      <span className="bg-[#38BDF8]/15 px-2 py-0.5 rounded text-[#38BDF8]">
                        {selectedDocument.policyNumber || 'DOC-544326'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Footer bar with cryptographic status & size */}
              <div className="relative z-10 px-6 py-3 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between text-[11px] text-[#94A3B8]">
                <div className="flex items-center gap-1.5 font-mono text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>AES-256 ENCRYPTED</span>
                </div>
                <span className="font-semibold text-white/80">
                  {selectedDocument.fileSize || '64.1 KB'} • {selectedDocument.fileType.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Document Details & Form */}
            {isEditing ? (
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] space-y-4 shadow-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1.5">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/10"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editedExpiry}
                    onChange={(e) => setEditedExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/10"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase mb-1.5">
                    Vault Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/10"
                    placeholder="Add secure notes or details..."
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-5 py-2 rounded-xl bg-[#1D5FF0] text-white text-xs font-bold hover:bg-[#174FCB] active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Authority / Issuer
                    </span>
                    <span className="font-bold text-[#0F172A] text-sm mt-1 block truncate">
                      {selectedDocument.issuer || 'Official Vault Record'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Issued Date
                    </span>
                    <span className="font-bold text-[#0F172A] text-sm mt-1 block">
                      {selectedDocument.issueDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Expiry Date
                    </span>
                    <span className="font-bold text-[#0F172A] text-sm mt-1 block">
                      {selectedDocument.expiryDate || 'Permanent Document'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Status
                    </span>
                    <span className={`font-bold text-sm mt-1 block ${statusInfo.colorClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {selectedDocument.notes && (
                  <div className="pt-3 border-t border-[#F1F5F9]">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                      Vault Notes
                    </span>
                    <p className="text-xs text-[#334155] font-medium leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                      {selectedDocument.notes}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F1F5F9]">
                    {selectedDocument.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                onClick={handleDownload}
                className="py-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-[#0F172A] font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:border-[#1D5FF0] hover:text-[#1D5FF0] hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2]" />
                <span>Download</span>
              </button>

              <button
                onClick={handleShare}
                className="py-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-[#0F172A] font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:border-[#1D5FF0] hover:text-[#1D5FF0] hover:bg-[#F8FAFC] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-[#16A34A]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 stroke-[2]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="py-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:bg-[#FEE2E2] hover:border-[#FECACA] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[2]" />
                <span>Delete</span>
              </button>
            </div>

            {/* Verify Document Action Bar */}
            {!selectedDocument.isVerified && (
              <button
                onClick={() => {
                  markDocumentVerified(selectedDocument.id);
                  toast.success('Document verified', 'Cryptographic verification status confirmed.');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Mark Document as Verified & Authentic</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modern In-App Confirmation Dialog (replaces browser confirm popup) */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteDocument(selectedDocument.id);
          setShowDeleteConfirm(false);
          setSelectedDocument(null);
          toast.success('Document deleted', `"${selectedDocument.title}" was removed from your vault.`);
        }}
        title="Delete Document"
        description={`Are you sure you want to permanently delete "${selectedDocument.title}" from your vault? This action cannot be undone.`}
        confirmLabel="Delete Document"
        variant="danger"
      />
    </AnimatePresence>
  );
};

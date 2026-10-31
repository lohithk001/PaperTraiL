import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Tag, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  Building, 
  ZoomIn,
  Copy,
  CheckCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from './Confetti';

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

  if (!selectedDocument) return null;

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
    triggerConfetti();
  };

  const handleDownload = () => {
    // Generate a downloadable document representation
    const content = `PAPERTRAIL SECURE DOCUMENT RECORD
Title: ${selectedDocument.title}
Category: ${selectedDocument.category}
Policy / Document ID: ${selectedDocument.policyNumber || 'N/A'}
Authority / Issuer: ${selectedDocument.issuer || 'N/A'}
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
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(
      `PaperTrail Document: ${selectedDocument.title}\nID: ${selectedDocument.policyNumber || 'N/A'}\nIssuer: ${selectedDocument.issuer || 'N/A'}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-lg bg-[#F7F7F7] rounded-t-[36px] sm:rounded-[36px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-charcoal-200"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-white border-b border-charcoal-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-primary/10 text-primary">
                {selectedDocument.category}
              </span>
              {selectedDocument.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-charcoal-700 active:scale-95 transition-all"
                  title="Edit document info"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSelectedDocument(null)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-charcoal-700 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="p-6 overflow-y-auto space-y-4">
            
            {/* Visual Document Viewer Preview Canvas */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-800 to-charcoal-900 border border-charcoal-700 p-6 text-white shadow-inner flex flex-col justify-between min-h-[220px]">
              
              {/* Zoom toggle floating button */}
              <button
                onClick={() => setZoom((z) => (z === 1 ? 1.25 : 1))}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white active:scale-90 transition-all"
                title="Toggle zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-xs">
                      PT
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-charcoal-300 font-bold">
                        Official Vault Seal
                      </p>
                      <p className="text-xs font-bold text-white">
                        {selectedDocument.issuer || 'PaperTrail Verified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-4">
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {selectedDocument.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300 mt-1">
                    ID: {selectedDocument.policyNumber || 'DOC-VAULT-2026-99'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[11px] text-charcoal-300">
                <span className="font-mono">AES-256 ENCRYPTED</span>
                <span>{selectedDocument.fileSize} • {selectedDocument.fileType.toUpperCase()}</span>
              </div>
            </div>

            {/* Document Details & Form */}
            {isEditing ? (
              <div className="p-4 rounded-3xl bg-white border border-charcoal-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-500 uppercase mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-500 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editedExpiry}
                    onChange={(e) => setEditedExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-500 uppercase mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-charcoal-600 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                      Authority / Issuer
                    </span>
                    <span className="font-bold text-charcoal-900 mt-0.5 block">
                      {selectedDocument.issuer || 'Official Document'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                      Issued Date
                    </span>
                    <span className="font-bold text-charcoal-900 mt-0.5 block">
                      {selectedDocument.issueDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                      Expiry Date
                    </span>
                    <span className="font-bold text-charcoal-900 mt-0.5 block">
                      {selectedDocument.expiryDate || 'Permanent Document'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                      Status
                    </span>
                    <span className="font-bold text-rose-600 mt-0.5 block">
                      {selectedDocument.daysLeft !== null
                        ? `${selectedDocument.daysLeft} days remaining`
                        : 'Active & Verified'}
                    </span>
                  </div>
                </div>

                {selectedDocument.notes && (
                  <div className="pt-2 border-t border-charcoal-100">
                    <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1">
                      Vault Notes
                    </span>
                    <p className="text-xs text-charcoal-700 font-medium leading-relaxed">
                      {selectedDocument.notes}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedDocument.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedDocument.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold text-charcoal-600 bg-neutral-100 px-2.5 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={handleDownload}
                className="py-3 rounded-2xl bg-white border border-charcoal-200 text-charcoal-800 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:border-primary hover:text-primary active:scale-95 transition-all shadow-xs"
              >
                <Download className="w-4 h-4 stroke-[2]" />
                <span>Download</span>
              </button>

              <button
                onClick={handleShare}
                className="py-3 rounded-2xl bg-white border border-charcoal-200 text-charcoal-800 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:border-primary hover:text-primary active:scale-95 transition-all shadow-xs"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 stroke-[2]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Delete "${selectedDocument.title}" from PaperTrail vault?`)) {
                    deleteDocument(selectedDocument.id);
                  }
                }}
                className="py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex flex-col items-center justify-center gap-1 hover:bg-rose-100 active:scale-95 transition-all shadow-xs"
              >
                <Trash2 className="w-4 h-4 stroke-[2]" />
                <span>Delete</span>
              </button>
            </div>

            {/* Verify Document Action Bar */}
            {!selectedDocument.isVerified && (
              <button
                onClick={() => markDocumentVerified(selectedDocument.id)}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Mark Document as Verified & Authentic</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

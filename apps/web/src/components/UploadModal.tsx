import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  Plus, 
  Check, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { useDocumentContext, formatBytes } from '../context/DocumentContext';
import { DocumentCategory } from '../types';
import { triggerConfetti } from './Confetti';

export const UploadModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    addDocument, 
    setSelectedDocument,
    setActiveDocumentDetail,
    setActiveTab
  } = useDocumentContext();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Insurance');
  const [issuer, setIssuer] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSizeBytes(file.size);
      setFileSizeStr(formatBytes(file.size));
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let daysLeft: number | null = null;
    let isExpiringSoon = false;

    if (expiryDate) {
      const diffMs = new Date(expiryDate).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      isExpiringSoon = daysLeft <= 30;
    }

    const tags = tagInput
      ? tagInput.split(',').map((t) => t.trim()).filter(Boolean)
      : [category, 'Encrypted'];

    const ext = selectedFile?.name.split('.').pop()?.toLowerCase();
    const resolvedType = ext === 'png' ? 'png' : ext === 'jpg' || ext === 'jpeg' ? 'jpg' : ext === 'webp' ? 'png' : 'pdf';
    const resolvedSize = fileSizeStr || (selectedFile ? formatBytes(selectedFile.size) : '0 KB');

    const newDoc = addDocument({
      title,
      category,
      fileType: resolvedType,
      fileName: fileName || selectedFile?.name || `${title}.${resolvedType}`,
      fileUrl: fileUrl || undefined,
      fileSizeBytes: fileSizeBytes || (selectedFile ? selectedFile.size : 0),
      fileSize: resolvedSize,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || null,
      daysLeft,
      isExpiringSoon,
      isVerified: true,
      issuer: issuer || 'Official Vault Record',
      policyNumber: policyNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      notes,
      tags,
      badgeLabel: isExpiringSoon ? 'EXPIRING SOON' : 'ACTIVE',
      badgeType: isExpiringSoon ? 'danger' : 'success',
      accentColor: category === 'Insurance' ? '#0861E8' : category === 'Identity' ? '#10B981' : '#8B5CF6',
    });

    triggerConfetti();
    setIsUploadModalOpen(false);
    setSelectedDocument(newDoc);
    setActiveDocumentDetail(newDoc);
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
            <div>
              <h3 className="text-base font-extrabold text-charcoal-900 tracking-tight">
                Upload New Document
              </h3>
              <p className="text-[11.5px] font-medium text-charcoal-500">
                Encrypted client-side with AES-256
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-charcoal-700 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5">
            
            {/* File Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-charcoal-300 hover:border-primary rounded-2.5xl p-5 bg-white text-center cursor-pointer transition-colors group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 stroke-[2]" />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-charcoal-900 truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    File selected ({fileSizeStr}) • Tap to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-charcoal-900">
                    Tap to upload or drag & drop file
                  </p>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">
                    PDF, PNG, JPG up to 50MB
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Health Insurance Policy 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 bg-white focus:outline-none focus:border-primary"
                >
                  <option value="Insurance">Insurance</option>
                  <option value="Identity">Identity</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Education">Education</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Finance">Finance</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 bg-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Issuer / Organization
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Geico, Gov, Apple"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Policy / ID Number
                </label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. POL-99201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Important, Auto, Annual, Personal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any reminders or important policy notes..."
                className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-charcoal-600 hover:bg-neutral-100 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-md shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save to Vault</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

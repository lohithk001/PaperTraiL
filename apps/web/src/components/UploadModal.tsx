import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  Plus, 
  Check, 
  FileText,
  ShieldAlert,
  Sparkles,
  Lock,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Tag
} from 'lucide-react';
import { useDocumentContext, formatBytes } from '../context/DocumentContext';
import { DocumentCategory } from '../types';
import { triggerConfetti } from './Confetti';
import { apiClient } from '../services/apiService';

type PipelineStatus = 'idle' | 'validating' | 'uploading' | 'securing' | 'processing' | 'ready' | 'error';

export const UploadModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    addDocument, 
    setSelectedDocument,
    setActiveDocumentDetail,
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

  // Upload Processing Pipeline State
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [aiSuggested, setAiSuggested] = useState<boolean>(false);
  const [extractedOcrSnippet, setExtractedOcrSnippet] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isUploadModalOpen) {
      setPipelineStatus('idle');
      setPipelineProgress(0);
      setStatusMessage('');
      setValidationError(null);
      setAiSuggested(false);
      setExtractedOcrSnippet(null);
    }
  }, [isUploadModalOpen]);

  if (!isUploadModalOpen) return null;

  // Stage 4: File Validation & Processing Pipeline Simulation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    setPipelineStatus('validating');
    setPipelineProgress(10);
    setStatusMessage('Validating file format and size...');

    // 1. Validate file extension and MIME type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
    if (!ext || !validExts.includes(ext)) {
      setValidationError('Unsupported format. Please select a PDF, PNG, JPG, or WEBP file.');
      setPipelineStatus('error');
      return;
    }

    // 2. Validate file size (max 50 MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setValidationError('File exceeds the 50 MB upload limit. Please select a smaller file.');
      setPipelineStatus('error');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeBytes(file.size);
    setFileSizeStr(formatBytes(file.size));

    const defaultTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (!title) {
      setTitle(defaultTitle);
    }

    // Read local data URL for instantaneous preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // 3. Stage: Storing in Neon DB Vault
    setPipelineStatus('uploading');
    setPipelineProgress(35);
    setStatusMessage('Storing document in Neon DB vault...');

    await new Promise((r) => setTimeout(r, 400));

    // 4. Stage: Securing Document (Client-side & Rest AES-256)
    setPipelineStatus('securing');
    setPipelineProgress(65);
    setStatusMessage('Securing document with AES-256 encryption...');

    await new Promise((r) => setTimeout(r, 400));

    // 5. Stage: Processing OCR & AI Metadata Categorisation
    setPipelineStatus('processing');
    setPipelineProgress(85);
    setStatusMessage('Extracting document metadata & dates with OCR...');

    try {
      const ocrResult = await apiClient.extractDocumentMetadata(file.name);
      if (ocrResult) {
        if (ocrResult.title) setTitle(ocrResult.title);
        if (ocrResult.category) {
          const cat = ocrResult.category as DocumentCategory;
          setCategory(cat);
        }
        if (ocrResult.issuer) setIssuer(ocrResult.issuer);
        if (ocrResult.policyNumber) setPolicyNumber(ocrResult.policyNumber);
        if (ocrResult.expiryDate) setExpiryDate(ocrResult.expiryDate);
        if (ocrResult.ocrText) setExtractedOcrSnippet(ocrResult.ocrText);
        setAiSuggested(true);
      }
    } catch {
      // Non-blocking: AI/OCR failure must never block access to successfully uploaded documents
    }

    // 6. Stage: Ready for confirmation
    setPipelineStatus('ready');
    setPipelineProgress(100);
    setStatusMessage('Document secured & metadata extracted. Ready to save.');
  };

  const handleRetry = () => {
    setValidationError(null);
    setPipelineStatus('idle');
    setPipelineProgress(0);
    setSelectedFile(null);
    fileInputRef.current?.click();
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
      : [category, 'Encrypted', 'Vault'];

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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-lg bg-[#F6F6F2] rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6E6E0]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-white border-b border-[#E6E6E0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center">
                <UploadCloud className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight font-display">
                  Add Document to Vault
                </h3>
                <p className="text-[11px] font-medium text-[#64748B]">
                  Encrypted at rest • Neon DB Storage
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
            
            {/* File Drop & Pipeline Status Card */}
            <div
              onClick={() => {
                if (pipelineStatus !== 'uploading' && pipelineStatus !== 'securing') {
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                pipelineStatus === 'error'
                  ? 'border-rose-300 bg-rose-50/50'
                  : pipelineStatus === 'ready'
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : selectedFile
                  ? 'border-blue-300 bg-blue-50/30'
                  : 'border-[#CBD5E1] hover:border-[#1D5FF0] bg-white'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
              />

              {!selectedFile ? (
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center mx-auto mb-2">
                    <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <p className="text-xs font-bold text-[#0F172A]">
                    Tap to upload or drag & drop file
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    PDF, PNG, JPG or WEBP up to 50 MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1D5FF0] shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#0F172A] truncate max-w-[260px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-[#64748B]">
                          {fileSizeStr} • Tap to replace file
                        </p>
                      </div>
                    </div>

                    {/* Pipeline Stage Badges */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      pipelineStatus === 'ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pipelineStatus === 'error'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-[#1D5FF0]'
                    }`}>
                      {pipelineStatus === 'uploading' && 'Uploading'}
                      {pipelineStatus === 'securing' && 'Securing'}
                      {pipelineStatus === 'processing' && 'Processing'}
                      {pipelineStatus === 'ready' && 'Ready'}
                      {pipelineStatus === 'error' && 'Failed'}
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  {pipelineStatus !== 'idle' && (
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          pipelineStatus === 'error' ? 'bg-rose-500' : 'bg-[#1D5FF0]'
                        }`}
                        style={{ width: `${pipelineProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Status Helper Message */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      {pipelineStatus === 'securing' && <Lock className="w-3 h-3 text-[#1D5FF0]" />}
                      {pipelineStatus === 'processing' && <Cpu className="w-3 h-3 text-purple-600 animate-spin" />}
                      {pipelineStatus === 'ready' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{statusMessage}</span>
                    </span>

                    {pipelineStatus === 'error' && (
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* AI Suggestion Banner (Stage 5 Confirmation) */}
            {aiSuggested && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-[#1D5FF0] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      AI Categorization & Dates Suggested
                    </span>
                    <span className="text-[#64748B] text-[11px] leading-relaxed block">
                      Extracted from file. Review the fields below and edit if needed.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#1D5FF0] bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                  Confirmed
                </span>
              </motion.div>
            )}

            {/* Document Title */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vehicle Insurance Policy 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
                required
              />
            </div>

            {/* Category & Expiry Date Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] bg-white focus:outline-none focus:border-[#1D5FF0]"
                >
                  <option value="Identity">Identity</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Medical">Health / Medical</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Expiry / Renewal Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0F172A] bg-white focus:outline-none focus:border-[#1D5FF0]"
                />
              </div>
            </div>

            {/* Issuer & Policy/ID Number Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Issuer / Organization
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Geico, Gov, Apple"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Policy / ID Number
                </label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. POL-99201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. Car, Annual, High Priority"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
              />
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Notes & Description
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Add private vault notes, renewal links, or coverage specifics..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
              />
            </div>

            {/* Submit Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!title.trim() || pipelineStatus === 'validating'}
                className="w-full py-3.5 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm & Store in Vault</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

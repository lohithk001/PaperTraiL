import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle2, 
  X,
  Sparkles,
  ShieldCheck,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { captureDocumentPhoto, pickGalleryPhoto } from '../services/nativeService';
import { DocumentCategory } from '../types';

interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'jpg' | 'png';
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export const UploadScreen: React.FC = () => {
  const { 
    setActiveTab, 
    addDocument, 
    sharedInboundFile, 
    setSharedInboundFile 
  } = useDocumentContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [documentTitle, setDocumentTitle] = useState(
    sharedInboundFile ? 'Inbound Shared Document' : ''
  );
  const [category, setCategory] = useState<DocumentCategory>('Identity');
  const [expiryDate, setExpiryDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: DocumentCategory[] = [
    'Identity',
    'Education',
    'Finance',
    'Insurance',
    'Warranty',
    'Medical',
  ];

  const processFiles = (files: FileList | File[]) => {
    const newItems: UploadQueueItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileType = ext === 'png' ? 'png' : ext === 'jpg' || ext === 'jpeg' ? 'jpg' : 'pdf';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      const item: UploadQueueItem = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: sizeMb,
        type: fileType,
        progress: 100,
        status: 'complete',
      };
      newItems.push(item);

      if (!documentTitle && i === 0) {
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
    setQueue(prev => [...prev, ...newItems]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleScanClick = async () => {
    const photo = await captureDocumentPhoto();
    if (photo) {
      const item: UploadQueueItem = {
        id: `file-${Date.now()}`,
        name: `Scanned_Doc_${new Date().toISOString().split('T')[0]}.jpg`,
        size: '1.4 MB',
        type: 'jpg',
        progress: 100,
        status: 'complete',
      };
      setQueue(prev => [...prev, item]);
      if (!documentTitle) setDocumentTitle('Scanned Vault Document');
    } else {
      setActiveTab('scan');
    }
  };

  const handleGalleryClick = async () => {
    const photo = await pickGalleryPhoto();
    if (photo) {
      const item: UploadQueueItem = {
        id: `file-${Date.now()}`,
        name: `Imported_Image_${Date.now()}.jpg`,
        size: '2.1 MB',
        type: 'jpg',
        progress: 100,
        status: 'complete',
      };
      setQueue(prev => [...prev, item]);
      if (!documentTitle) setDocumentTitle('Imported Gallery Document');
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveQueueItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveAll = () => {
    if (queue.length === 0) {
      alert('Please upload or drag at least one file.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      queue.forEach((item, index) => {
        const title = queue.length === 1 && documentTitle 
          ? documentTitle 
          : item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [category.toLowerCase(), item.type];

        addDocument({
          title,
          category,
          fileType: item.type,
          fileSize: item.size,
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: expiryDate || null,
          daysLeft: expiryDate ? 30 : null,
          isExpiringSoon: !!expiryDate,
          isVerified: true,
          tags,
          badgeLabel: 'VERIFIED',
          badgeType: 'success',
        });
      });

      setIsSubmitting(false);
      setSharedInboundFile(null);
      setActiveTab('documents');
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 select-none pb-8">
      
      {/* Hidden file input supporting multiple files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-slate-50 transition-all shadow-subtle cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight font-display">
              Upload Documents
            </h1>
            <p className="text-xs text-[#64748B]">Add documents securely with 256-bit AES encryption.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Vault Upload</span>
        </div>
      </div>

      {/* Inbound Share Sheet Banner */}
      {sharedInboundFile && (
        <div className="p-4 bg-[#EAF1FF] border border-[#1D5FF0]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#1D5FF0]" />
            <div>
              <p className="text-xs font-bold text-[#1D5FF0]">Document Received from Android Share Sheet</p>
              <p className="text-[11px] text-[#64748B]">Ready to verify and store in your vault.</p>
            </div>
          </div>
          <button onClick={() => setSharedInboundFile(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full min-h-[220px] rounded-3xl p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-subtle group ${
          isDragOver 
            ? 'border-[#1D5FF0] bg-[#EAF1FF]/40 scale-[0.99]' 
            : 'border-[#CBD5E1] bg-white hover:border-[#1D5FF0] hover:bg-[#F7F9FC]'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-[#EAF1FF] text-[#1D5FF0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-8 h-8 stroke-[2.2]" />
        </div>
        <p className="text-sm sm:text-base font-extrabold text-[#0F172A]">
          Drag and drop your documents here
        </p>
        <p className="text-xs font-medium text-[#64748B] mt-1">
          or <span className="text-[#1D5FF0] underline font-bold">browse files</span> from your computer
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-2 font-medium">
          Supports PDF, JPG, PNG up to 10MB each
        </p>
      </div>

      {/* Upload Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#1D5FF0]" />
          <span>Choose Files</span>
        </button>

        <button
          onClick={handleScanClick}
          className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
        >
          <Camera className="w-4 h-4 text-[#1D5FF0]" />
          <span>Scan Document</span>
        </button>

        <button
          onClick={handleGalleryClick}
          className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-subtle cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#1D5FF0]" />
          <span>Import Photo</span>
        </button>
      </div>

      {/* Uploaded File Queue */}
      {queue.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A]">
            Selected Files ({queue.length})
          </h3>

          <div className="space-y-2.5">
            {queue.map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] text-[#1D5FF0] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {item.type}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#64748B]">{item.size} • Uploaded 100%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                  <button
                    onClick={() => handleRemoveQueueItem(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Metadata Form */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-[#0F172A]">Document Title</label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="e.g. Visvesvaraya College Marksheet"
                className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Category</label>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-[#1D5FF0] text-white shadow-xs'
                          : 'bg-[#F7F9FC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
              <span>{isSubmitting ? 'Securing Documents in Vault...' : 'Save Documents to Vault'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

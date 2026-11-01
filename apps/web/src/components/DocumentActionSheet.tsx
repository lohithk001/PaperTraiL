import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  Download, 
  FolderPlus, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { shareDocumentNative } from '../services/nativeService';

export const DocumentActionSheet: React.FC = () => {
  const { 
    isActionSheetOpen, 
    setIsActionSheetOpen, 
    activeDocumentDetail, 
    selectedDocument,
    documents,
    setActiveTab,
    setSelectedCategory
  } = useDocumentContext();

  const doc = activeDocumentDetail || selectedDocument || documents[0];

  if (!isActionSheetOpen || !doc) return null;

  const handleShare = async () => {
    setIsActionSheetOpen(false);
    await shareDocumentNative(doc.title, `PaperTrail Document: ${doc.title}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `/documents/${doc.id}`);
    alert('Document link copied to clipboard!');
    setIsActionSheetOpen(false);
  };

  const handleDownload = () => {
    alert(`Downloading ${doc.title} (${doc.fileSize})`);
    setIsActionSheetOpen(false);
  };

  const handleSaveToFolder = () => {
    setSelectedCategory(doc.category);
    setActiveTab('folders');
    setIsActionSheetOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
        
        {/* Dimmed & softly blurred backdrop (Screen 12 Spec) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsActionSheetOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Rounded White Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.y > 80) {
              setIsActionSheetOpen(false);
            }
          }}
          className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 pb-8 shadow-sheet z-10 space-y-4"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2"></div>

          {/* Document Summary Header (Screen 12 Spec) */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-[#E2E8F0]">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#F04452]" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0F172A] truncate">
                {doc.title}
              </h3>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                {doc.fileType.toUpperCase()} • {doc.fileSize}
              </p>
            </div>
          </div>

          {/* Action List Items (Screen 12 Spec) */}
          <div className="space-y-1">
            
            {/* 1. Share Document */}
            <button
              onClick={handleShare}
              className="w-full py-3.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-[#64748B] group-hover:text-[#1D5FF0] transition-colors" />
                <span className="text-sm font-semibold text-[#0F172A]">Share Document</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#64748B] transition-colors" />
            </button>

            {/* 2. Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full py-3.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Copy className="w-5 h-5 text-[#64748B] group-hover:text-[#1D5FF0] transition-colors" />
                <span className="text-sm font-semibold text-[#0F172A]">Copy Link</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#64748B] transition-colors" />
            </button>

            {/* 3. Download */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#64748B] group-hover:text-[#1D5FF0] transition-colors" />
                <span className="text-sm font-semibold text-[#0F172A]">Download</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#64748B] transition-colors" />
            </button>

            {/* 4. Save to Folder */}
            <button
              onClick={handleSaveToFolder}
              className="w-full py-3.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FolderPlus className="w-5 h-5 text-[#64748B] group-hover:text-[#1D5FF0] transition-colors" />
                <span className="text-sm font-semibold text-[#0F172A]">Save to Folder</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#64748B] transition-colors" />
            </button>

          </div>

          {/* Cancel Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsActionSheetOpen(false)}
              className="w-full h-[50px] rounded-xl bg-[#F0F2F6] hover:bg-slate-200 active:scale-[0.99] text-[#0F172A] font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

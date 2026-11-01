import React, { useState } from 'react';
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
  Folder
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { shareDocumentNative } from '../services/nativeService';

export const DocumentDetailScreen: React.FC = () => {
  const { 
    activeDocumentDetail, 
    documents, 
    setActiveTab, 
    deleteDocument, 
    updateDocument,
    setIsActionSheetOpen,
    setSelectedDocument,
    folders,
    createShare
  } = useDocumentContext();

  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // Fallback to College Marksheet or first document
  const doc = activeDocumentDetail || documents.find(d => d.title.includes('Marksheet')) || documents[0];

  if (!doc) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-[#64748B]">No document selected.</p>
        <button 
          onClick={() => setActiveTab('documents')} 
          className="mt-4 px-4 py-2 rounded-xl bg-[#1D5FF0] text-white font-semibold text-xs"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    await shareDocumentNative(doc.title, `PaperTrail Document: ${doc.title}`);
  };

  const handleDownload = () => {
    alert(`Downloading ${doc.title} (${doc.fileSize})`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${doc.title}" from your vault?`)) {
      deleteDocument(doc.id);
      setActiveTab('documents');
    }
  };

  const handleRename = () => {
    const newTitle = prompt('Enter new document title:', doc.title);
    if (newTitle && newTitle.trim()) {
      updateDocument(doc.id, { title: newTitle.trim() });
    }
  };

  const handleMoveFolder = () => {
    const folderNames = folders.map(f => f.name).join(', ');
    const chosen = prompt(`Enter target folder name (${folderNames}):`, doc.category);
    if (chosen && chosen.trim()) {
      updateDocument(doc.id, { category: chosen.trim() as any });
      alert(`Moved "${doc.title}" to ${chosen.trim()}`);
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
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all shadow-subtle cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#64748B]" />
            <span>Share Link</span>
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

            {/* Zoom & Page Controls */}
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

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[#0F172A]">
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>

          {/* Document Canvas Area */}
          <div className="p-6 sm:p-10 bg-[#EEF2F8]/60 flex items-center justify-center min-h-[480px] sm:min-h-[580px] overflow-auto">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              className="w-full max-w-[480px] aspect-[1/1.3] bg-white rounded-xl shadow-2xl border border-slate-300/80 p-6 sm:p-8 flex flex-col justify-between text-[#0F172A] relative transition-transform duration-200"
            >
              {/* Official Seal / Watermark */}
              <div className="absolute right-8 bottom-12 w-24 h-24 rounded-full border-2 border-indigo-400/25 flex items-center justify-center pointer-events-none rotate-12">
                <span className="text-[10px] font-extrabold uppercase text-indigo-500/30 tracking-widest text-center">
                  PAPERTRAIL<br />VERIFIED
                </span>
              </div>

              {/* Certificate / Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-[#1D5FF0] text-white flex items-center justify-center mx-auto mb-1 text-xs font-bold">
                  VTU
                </div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  VISVESVARAYA TECHNOLOGICAL UNIVERSITY
                </h2>
                <p className="text-[10px] font-semibold text-[#64748B]">
                  STATEMENT OF MARKS / ACADEMIC TRANSCRIPT
                </p>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5">
                  Ref: {doc.policyNumber || 'VTU-CSE-2023-8841'}
                </p>
              </div>

              {/* Document Body */}
              <div className="space-y-2 py-3 font-mono text-[10px] text-[#0F172A]">
                <div className="flex justify-between border-b border-slate-200 pb-1 font-bold text-slate-600 text-[9px]">
                  <span>COURSE & SUBJECT</span>
                  <span>GRADE</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>18CS71 Computer Networks</span>
                  <span className="font-bold text-[#1D5FF0]">S (9.2)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>18CS72 Cloud Computing</span>
                  <span className="font-bold text-[#1D5FF0]">A (8.8)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>18CS73 Machine Learning</span>
                  <span className="font-bold text-[#1D5FF0]">S (9.5)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>18CS74 Cryptography & Vaults</span>
                  <span className="font-bold text-[#1D5FF0]">S (9.4)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>18CSL76 AI Systems Lab</span>
                  <span className="font-bold text-[#1D5FF0]">S (10.0)</span>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between text-[9px] font-semibold text-slate-700">
                <div>
                  <p>Candidate: Lohith K</p>
                  <p className="text-emerald-700 font-bold">Result: DISTINCTION (9.17 SGPA)</p>
                </div>
                <div className="text-right">
                  <p>Issue Date: {doc.issueDate}</p>
                  <p className="font-mono text-slate-400">Digital Sign: #PT-VAULT-AUTHENTIC</p>
                </div>
              </div>
            </div>
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
                  onClick={handleRename}
                  className="py-2.5 px-3 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Rename</span>
                </button>

                <button
                  onClick={handleMoveFolder}
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

    </div>
  );
};

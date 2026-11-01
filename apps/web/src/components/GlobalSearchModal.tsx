import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Folder, 
  Tag, 
  Calendar, 
  ArrowRight, 
  Clock, 
  X, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    documents, 
    folders, 
    setActiveDocumentDetail, 
    setActiveTab,
    setSelectedCategory
  } = useDocumentContext();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isGlobalSearchOpen]);

  // Filtered results
  const matchingDocuments = query.trim() === '' ? [] : documents.filter(doc => {
    const q = query.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.issuer?.toLowerCase().includes(q) ||
      doc.notes?.toLowerCase().includes(q) ||
      doc.tags.some(t => t.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  const matchingFolders = query.trim() === '' ? [] : folders.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const totalResults = matchingDocuments.length + matchingFolders.length;

  const handleSelectDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
    setIsGlobalSearchOpen(false);
  };

  const handleSelectFolder = (folderName: string) => {
    setSelectedCategory(folderName);
    setActiveTab('documents');
    setIsGlobalSearchOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (totalResults || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (totalResults || 1)) % (totalResults || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchingDocuments.length) {
        const doc = matchingDocuments[selectedIndex];
        if (doc) handleSelectDoc(doc);
      } else {
        const folder = matchingFolders[selectedIndex - matchingDocuments.length];
        if (folder) handleSelectFolder(folder.name);
      }
    } else if (e.key === 'Escape') {
      setIsGlobalSearchOpen(false);
    }
  };

  if (!isGlobalSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input */}
          <div className="flex items-center px-6 py-4 border-b border-[#E2E8F0] gap-3">
            <Search className="w-5 h-5 text-[#1D5FF0] stroke-[2.2] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search documents by name, category, issuer or tags..."
              className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsGlobalSearchOpen(false)}
              className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            
            {/* Empty query: Show quick suggestions & recent searches */}
            {query.trim() === '' ? (
              <div className="py-6 px-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Quick Filters</p>
                <div className="flex flex-wrap gap-2">
                  {['College Marksheet', 'Vehicle Insurance', 'Laptop Warranty', 'Aadhaar Card', 'Passport'].map(item => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-[#EAF1FF] hover:text-[#1D5FF0] hover:border-[#1D5FF0]/30 transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Vault Folders</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {folders.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleSelectFolder(f.name)}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#1D5FF0]/40 hover:bg-[#F7F9FC] transition-all text-left cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg ${f.iconBg} flex items-center justify-center shrink-0`}>
                          <Folder className={`w-4 h-4 ${f.color}`} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-[#0F172A] truncate">{f.name}</p>
                          <p className="text-[10px] text-[#64748B]">{f.documentCount} docs</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* No matching documents */
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-bold text-[#0F172A]">No documents found for "{query}"</h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Check for spelling errors or try searching for a category like Education, Insurance, or Identity.
                </p>
              </div>
            ) : (
              /* Results lists */
              <div className="space-y-4">
                
                {/* Documents section */}
                {matchingDocuments.length > 0 && (
                  <div>
                    <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Documents ({matchingDocuments.length})
                    </p>
                    <div className="space-y-1">
                      {matchingDocuments.map((doc, idx) => {
                        const isFocused = selectedIndex === idx;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => handleSelectDoc(doc)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                              isFocused 
                                ? 'bg-[#EAF1FF] border border-[#1D5FF0]/30 shadow-xs' 
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#1D5FF0] shrink-0 font-bold text-xs uppercase">
                                {doc.fileType}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                                  {doc.title}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                                  <span className="font-medium text-[#1D5FF0]">{doc.category}</span>
                                  <span>•</span>
                                  <span>{doc.fileSize}</span>
                                  {doc.expiryDate && (
                                    <>
                                      <span>•</span>
                                      <span className={doc.isExpiringSoon ? 'text-[#F04452] font-semibold' : ''}>
                                        Exp: {doc.expiryDate}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {doc.isExpiringSoon && (
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF2E6] text-[#F5A623]">
                                  Expiring Soon
                                </span>
                              )}
                              <ChevronRight className={`w-4 h-4 ${isFocused ? 'text-[#1D5FF0] translate-x-0.5' : 'text-slate-300'} transition-all`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Matching Folders */}
                {matchingFolders.length > 0 && (
                  <div>
                    <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Folders ({matchingFolders.length})
                    </p>
                    <div className="space-y-1">
                      {matchingFolders.map((folder, idx) => {
                        const itemIdx = matchingDocuments.length + idx;
                        const isFocused = selectedIndex === itemIdx;
                        return (
                          <div
                            key={folder.id}
                            onClick={() => handleSelectFolder(folder.name)}
                            onMouseEnter={() => setSelectedIndex(itemIdx)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                              isFocused 
                                ? 'bg-[#EAF1FF] border border-[#1D5FF0]/30 shadow-xs' 
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl ${folder.iconBg} flex items-center justify-center shrink-0`}>
                                <Folder className={`w-4 h-4 ${folder.color}`} />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-[#0F172A]">{folder.name}</p>
                                <p className="text-[11px] text-[#64748B]">{folder.documentCount} documents stored</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-[#1D5FF0] flex items-center gap-1">
                              Open Folder <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Bottom Keyboard Hints */}
          <div className="px-6 py-3 bg-[#F7F9FC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↓</kbd></span>
              <span>Open <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd></span>
              <span>Close <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Esc</kbd></span>
            </div>
            <span className="font-semibold text-[#1D5FF0]">PaperTrail Smart Vault Index</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

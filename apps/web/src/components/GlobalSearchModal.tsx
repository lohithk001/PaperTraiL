import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  X, 
  ChevronRight,
  ArrowRight,
  Folder
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { CategoryIcon, Badge } from './ui';

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
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs select-none"
        onClick={() => setIsGlobalSearchOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6E6E0] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input */}
          <div className="flex items-center px-5 py-3.5 border-b border-[#E6E6E0] gap-3">
            <Search className="w-4 h-4 text-[#1D5FF0] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search documents by title, category, issuer or tags..."
              className="flex-1 bg-transparent text-sm font-medium text-[#20211F] placeholder:text-[#9B9E96] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-[#9B9E96] hover:text-[#20211F] hover:bg-[#F0F0EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsGlobalSearchOpen(false)}
              className="text-xs font-medium px-2 py-0.5 bg-[#F0F0EA] text-[#6B6E66] rounded-md hover:bg-[#E6E6E0] transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            
            {/* Empty query: Show quick suggestions & folders */}
            {query.trim() === '' ? (
              <div className="py-4 px-2 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9B9E96]">Quick Filters</p>
                <div className="flex flex-wrap gap-2">
                  {['Passport', 'Driver License', 'Health Insurance', 'Degree Certificate', 'Vehicle Registration'].map(item => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] hover:bg-[#E5EDFF] hover:text-[#1D5FF0] hover:border-[#1D5FF0]/30 transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#9B9E96]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9B9E96] mb-2">Vault Folders</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {folders.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleSelectFolder(f.name)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E6E6E0] hover:border-[#1D5FF0]/40 hover:bg-[#F6F6F2] transition-all text-left cursor-pointer"
                      >
                        <CategoryIcon category={f.category} size="sm" />
                        <div className="overflow-hidden min-w-0">
                          <p className="text-xs font-semibold text-[#20211F] truncate">{f.name}</p>
                          <p className="text-[10px] text-[#9B9E96]">{f.documentCount} docs</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* No matching documents */
              <div className="py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F0F0EA] mx-auto flex items-center justify-center text-[#9B9E96]">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-[#20211F]">No documents found for "{query}"</h4>
                <p className="text-xs text-[#9B9E96] max-w-sm mx-auto">
                  Try searching for a category like Education, Insurance, Vehicle or Identity.
                </p>
              </div>
            ) : (
              /* Results lists */
              <div className="space-y-4">
                
                {/* Documents section */}
                {matchingDocuments.length > 0 && (
                  <div>
                    <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B9E96]">
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
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isFocused 
                                ? 'bg-[#E5EDFF] border border-[#1D5FF0]/30' 
                                : 'hover:bg-[#F6F6F2] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <CategoryIcon category={doc.category} size="sm" />
                              <div className="overflow-hidden min-w-0">
                                <p className="text-xs font-semibold text-[#20211F] truncate">
                                  {doc.title}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-[#6B6E66]">
                                  <span className="font-medium text-[#1D5FF0]">{doc.category}</span>
                                  <span>•</span>
                                  <span>{doc.fileSize}</span>
                                  {doc.expiryDate && (
                                    <>
                                      <span>•</span>
                                      <span className={doc.isExpiringSoon ? 'text-[#DC2626] font-semibold' : ''}>
                                        Exp: {doc.expiryDate}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {doc.isExpiringSoon && (
                                <Badge variant="warning" size="sm">
                                  Expiring
                                </Badge>
                              )}
                              <ChevronRight className={`w-4 h-4 ${isFocused ? 'text-[#1D5FF0] translate-x-0.5' : 'text-[#9B9E96]'} transition-all`} />
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
                    <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#9B9E96]">
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
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isFocused 
                                ? 'bg-[#E5EDFF] border border-[#1D5FF0]/30' 
                                : 'hover:bg-[#F6F6F2] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CategoryIcon category={folder.category} size="sm" />
                              <div>
                                <p className="text-xs font-semibold text-[#20211F]">{folder.name}</p>
                                <p className="text-[11px] text-[#9B9E96]">{folder.documentCount} documents stored</p>
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
          <div className="px-5 py-2.5 bg-[#F6F6F2] border-t border-[#E6E6E0] flex items-center justify-between text-[11px] text-[#6B6E66]">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E6E0] rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E6E0] rounded text-[10px]">↓</kbd></span>
              <span>Open <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E6E0] rounded text-[10px]">↵</kbd></span>
              <span>Close <kbd className="px-1.5 py-0.5 bg-white border border-[#E6E6E0] rounded text-[10px]">Esc</kbd></span>
            </div>
            <span className="font-semibold text-[#1D5FF0]">PaperTrail Vault Search</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

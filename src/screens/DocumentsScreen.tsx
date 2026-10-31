import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory } from '../types';

export const DocumentsScreen: React.FC = () => {
  const { 
    filteredDocuments, 
    setSelectedDocument, 
    setIsUploadModalOpen, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory 
  } = useDocumentContext();

  const [sortBy, setSortBy] = useState<'date' | 'title' | 'expiry'>('date');

  const categories: Array<string> = [
    'All',
    'Insurance',
    'Identity',
    'Vehicle',
    'Education',
    'Warranty',
    'Finance',
    'Medical',
  ];

  // Sorting logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'expiry') {
      const aDays = a.daysLeft ?? 99999;
      const bDays = b.daysLeft ?? 99999;
      return aDays - bDays;
    }
    // Default: date (newest first)
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  return (
    <div className="w-full px-6 pt-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Documents Vault
          </h2>
          <p className="text-xs font-semibold text-charcoal-500 mt-0.5">
            {sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''} stored securely
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3.5 py-2 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Doc</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, category, policy #..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-charcoal-200/80 text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-400 hover:text-charcoal-700 bg-neutral-100 rounded-full w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>

      {/* Horizontal Category Chips */}
      <div className="overflow-x-auto no-scrollbar -mx-6 px-6 mb-4">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white text-charcoal-700 hover:bg-neutral-50 border border-charcoal-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center justify-between mb-4 text-xs font-semibold text-charcoal-500">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-charcoal-900 border-none focus:outline-none cursor-pointer"
          >
            <option value="date">Newest First</option>
            <option value="expiry">Days Remaining (Expiry)</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

        <span className="text-[11px] text-charcoal-400">
          Showing {sortedDocuments.length}
        </span>
      </div>

      {/* Documents Grid / Stack */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedDocuments.map((doc, idx) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedDocument(doc)}
              className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                    style={{ backgroundColor: doc.accentColor || '#0861E8' }}
                  >
                    <FileText className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-charcoal-700">
                        {doc.category}
                      </span>
                      {doc.isExpiringSoon && (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                          {doc.daysLeft}d left
                        </span>
                      )}
                      {doc.isVerified && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 stroke-[2.2]" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-bold text-charcoal-900 group-hover:text-primary transition-colors mt-1.5 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs font-medium text-charcoal-500 mt-1 line-clamp-1">
                      {doc.issuer ? `${doc.issuer} • ` : ''}
                      {doc.policyNumber || 'No ID'} • {doc.fileSize}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-charcoal-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                  <ExternalLink className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Tags footer */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-charcoal-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <Tag className="w-3 h-3 text-charcoal-400 shrink-0" />
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10.5px] font-medium text-charcoal-500 bg-neutral-50 px-2 py-0.5 rounded-md shrink-0"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedDocuments.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-200/80 my-4">
            <FileText className="w-12 h-12 text-charcoal-300 mx-auto mb-2" />
            <h4 className="font-bold text-charcoal-800 text-sm">No matching documents</h4>
            <p className="text-xs text-charcoal-500 mt-1">
              Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-bold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

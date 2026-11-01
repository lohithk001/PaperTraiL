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
  Tag,
  LayoutGrid,
  List,
  Download,
  Trash2,
  Share2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory, DocumentItem } from '../types';

export const DocumentsScreen: React.FC = () => {
  const { 
    documents,
    filteredDocuments, 
    setSelectedDocument, 
    setIsUploadModalOpen, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    deleteDocument,
    deviceViewMode 
  } = useDocumentContext();

  const [sortBy, setSortBy] = useState<'date' | 'title' | 'expiry'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'expiring'>('all');

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

  // Filtering by status
  const statusFiltered = filteredDocuments.filter((doc) => {
    if (statusFilter === 'verified') return doc.isVerified;
    if (statusFilter === 'expiring') return doc.isExpiringSoon;
    return true;
  });

  // Sorting logic
  const sortedDocuments = [...statusFiltered].sort((a, b) => {
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
    <div className={`w-full ${deviceViewMode === 'mobile' ? 'px-6 pt-5 pb-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Document Directory
            </span>
            <span className="text-xs font-semibold text-charcoal-500">
              {sortedDocuments.length} files stored
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Vault Documents
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher (Grid vs Table) on desktop */}
          <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-charcoal-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-primary/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-charcoal-200/80 shadow-xs mb-6 space-y-4">
        
        {/* Search Input Row */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document title, issuer, policy number, or tag..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-neutral-50 border border-charcoal-200/70 text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-400 hover:text-charcoal-700 bg-neutral-200/60 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-neutral-100 text-charcoal-600 hover:bg-neutral-200/70'
              }`}
            >
              All ({documents.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setStatusFilter('expiring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'expiring'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Expiring Soon
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold text-charcoal-500 whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-100 py-1.5 px-3 rounded-xl font-bold text-charcoal-800 border-none focus:outline-none cursor-pointer"
            >
              <option value="date">Newest First</option>
              <option value="expiry">Expiring Soonest</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-charcoal-100">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-neutral-100 text-charcoal-600 hover:bg-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Document Content Area */}
      {sortedDocuments.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-charcoal-200/80 text-center">
          <FileText className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-charcoal-900">No documents found</h3>
          <p className="text-xs text-charcoal-500 mt-1 mb-4">
            Try adjusting your search query, status, or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-full bg-neutral-100 text-charcoal-700 text-xs font-bold hover:bg-neutral-200"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' && deviceViewMode !== 'mobile' ? (
        
        /* Table View on Desktop */
        <div className="bg-white rounded-3xl border border-charcoal-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal-200/70 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  <th className="py-3.5 px-6">Document Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Identifier / Policy</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Status & Expiry</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-xs font-medium text-charcoal-800">
                {sortedDocuments.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                          style={{ backgroundColor: doc.accentColor || '#0861E8' }}
                        >
                          <FileText className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal-900 group-hover:text-primary transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-charcoal-400 font-medium">{doc.issuer || 'Personal Vault'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-charcoal-700 text-[11px] font-semibold">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-charcoal-600">
                      {doc.policyNumber || '—'}
                    </td>

                    <td className="py-4 px-4 text-charcoal-500 font-medium">
                      {doc.fileSize}
                    </td>

                    <td className="py-4 px-4 text-charcoal-500 font-medium">
                      {doc.issueDate}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        {doc.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        )}
                        {doc.isExpiringSoon && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {doc.daysLeft}d left
                          </span>
                        )}
                        {!doc.isVerified && !doc.isExpiringSoon && (
                          <span className="text-[11px] text-charcoal-400">Valid</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-primary hover:text-white text-charcoal-700 font-bold text-[11px] transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${doc.title}?`)) {
                              deleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-charcoal-400 hover:text-rose-600 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* Grid View (Multi-column responsive) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedDocuments.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedDocument(doc)}
              className="p-5 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs hover:border-primary/40 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                    style={{ backgroundColor: doc.accentColor || '#0861E8' }}
                  >
                    <FileText className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {doc.isVerified && (
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60" title="Officially Verified">
                        <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                      </span>
                    )}
                    {doc.isExpiringSoon && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200/60">
                        {doc.daysLeft}d left
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-[15px] font-bold text-charcoal-900 group-hover:text-primary transition-colors line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-charcoal-500 font-medium mt-1">
                  {doc.issuer || 'Personal Vault Item'}
                </p>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {doc.tags.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] font-semibold text-charcoal-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                    {doc.tags.length > 2 && (
                      <span className="text-[10px] font-semibold text-charcoal-400 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                        +{doc.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-charcoal-100 flex items-center justify-between text-xs font-semibold text-charcoal-500">
                <span className="text-charcoal-700">{doc.category}</span>
                <span>{doc.fileSize}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

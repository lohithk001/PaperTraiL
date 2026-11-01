import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  UploadCloud, 
  FileText, 
  Shield, 
  GraduationCap, 
  CreditCard, 
  FileCheck,
  MoreVertical,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Download,
  Share2,
  Trash2,
  Star,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';

export const DocumentsScreen: React.FC = () => {
  const { 
    documents, 
    setActiveDocumentDetail, 
    setActiveTab, 
    setSelectedDocument,
    setIsActionSheetOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite
  } = useDocumentContext();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'All' | 'PDF' | 'Images' | 'Others'>('All');
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'expiring' | 'valid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'expiry'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Identity', 'Education', 'Finance', 'Insurance', 'Medical', 'Warranty'];

  const filteredList = useMemo(() => {
    let list = documents.filter((doc) => {
      // Type filter
      if (activeTypeFilter === 'PDF' && doc.fileType !== 'pdf') return false;
      if (activeTypeFilter === 'Images' && doc.fileType !== 'jpg' && doc.fileType !== 'png') return false;

      // Category filter
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;

      // Expiry filter
      if (expiryFilter === 'expiring' && !doc.isExpiringSoon) return false;
      if (expiryFilter === 'valid' && doc.isExpiringSoon) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          doc.issuer?.toLowerCase().includes(q) ||
          doc.notes?.toLowerCase().includes(q) ||
          doc.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      if (sortBy === 'oldest') return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'expiry') {
        const aExp = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
        const bExp = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
        return aExp - bExp;
      }
      return 0;
    });

    return list;
  }, [documents, activeTypeFilter, selectedCategory, expiryFilter, searchQuery, sortBy]);

  const handleDocumentClick = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  const handleActionSheetClick = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    setActiveDocumentDetail(doc);
    setSelectedDocument(doc);
    setIsActionSheetOpen(true);
  };

  const getDocIcon = (category: string) => {
    switch (category) {
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-[#7C3AED]" />;
      case 'Identity':
        return <FileCheck className="w-5 h-5 text-[#1D5FF0]" />;
      case 'Finance':
        return <CreditCard className="w-5 h-5 text-[#27A879]" />;
      case 'Warranty':
        return <FileText className="w-5 h-5 text-[#F5A623]" />;
      default:
        return <Shield className="w-5 h-5 text-[#1D5FF0]" />;
    }
  };

  const getDocBgColor = (category: string) => {
    switch (category) {
      case 'Education':
        return 'bg-[#F0EAFE]';
      case 'Identity':
        return 'bg-[#EAF1FF]';
      case 'Finance':
        return 'bg-[#E8F6EF]';
      case 'Warranty':
        return 'bg-[#FFF2E6]';
      default:
        return 'bg-[#EAF1FF]';
    }
  };

  return (
    <div className="w-full space-y-6 select-none pb-8">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
              All Documents
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#111827] text-white">
              {filteredList.length} of {documents.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
            Store, manage, verify and share your personal documents safely.
          </p>
        </div>

        {/* Upload Action Button */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* 2. Advanced Desktop Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E8F0] shadow-subtle space-y-3">
        
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, issuer, tag..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
            />
          </div>

          {/* Right Controls: Sort & Grid/List Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="expiry">Sort: Expiry Date</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center bg-[#F7F9FC] p-1 rounded-xl border border-[#E2E8F0]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#1D5FF0] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#1D5FF0] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Row 2: Category Chips & Expiry Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase text-[#94A3B8] mr-1">Category:</span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1D5FF0] text-white shadow-xs'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Type Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase text-[#94A3B8] mr-1">Type:</span>
            {(['All', 'PDF', 'Images'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  activeTypeFilter === t
                    ? 'bg-slate-900 text-white'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 3. Document Collection (Grid or List) */}
      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredList.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => handleDocumentClick(doc)}
              className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:shadow-card hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Badges + Favorite */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${getDocBgColor(doc.category)} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {getDocIcon(doc.category)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                      className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${
                        doc.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleActionSheetClick(e, doc)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2 min-h-[32px]">
                  {doc.notes || doc.issuer || 'Protected document in vault'}
                </p>

                {/* Category & Status Tags */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F9FC] text-[#0F172A] border border-[#E2E8F0]">
                    {doc.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {doc.fileType} • {doc.fileSize}
                  </span>
                  {doc.isVerified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Footer Info: Expiry or Added Date */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                {doc.expiryDate ? (
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={doc.isExpiringSoon ? 'text-[#F04452] font-bold' : ''}>
                      {doc.isExpiringSoon ? `Exp: ${doc.daysLeft}d left` : `Exp: ${doc.expiryDate}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Added {doc.issueDate}</span>
                )}

                <span className="text-xs font-bold text-[#1D5FF0] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider bg-[#F7F9FC]">
                  <th className="py-3.5 px-6">Document Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredList.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="hover:bg-[#F7F9FC] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${getDocBgColor(doc.category)} flex items-center justify-center shrink-0`}>
                          {getDocIcon(doc.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
                              {doc.title}
                            </span>
                            {doc.isFavorite && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#64748B]">
                            {doc.issuer || doc.policyNumber || 'Vault Item'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F7F9FC] text-[#0F172A] border border-[#E2E8F0]">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#64748B]">
                      {doc.issueDate}
                    </td>

                    <td className="py-4 px-4">
                      {doc.expiryDate ? (
                        <span className={`font-semibold ${doc.isExpiringSoon ? 'text-[#F04452]' : 'text-[#0F172A]'}`}>
                          {doc.expiryDate} {doc.isExpiringSoon && `(${doc.daysLeft}d)`}
                        </span>
                      ) : (
                        <span className="text-slate-400">Lifetime</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-[#64748B]">
                      <span className="uppercase font-bold text-slate-700">{doc.fileType}</span> • {doc.fileSize}
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDocumentClick(doc)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1D5FF0] hover:bg-[#EAF1FF] transition-colors cursor-pointer"
                          title="Open Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleActionSheetClick(e, doc)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredList.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-subtle">
          <FileText className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No documents found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Try adjusting your search keyword, category, or file type filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setActiveTypeFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#EAF1FF] text-[#1D5FF0] text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

    </div>
  );
};

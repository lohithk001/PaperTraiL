import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Star, 
  ExternalLink, 
  MoreVertical,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { 
  PageHeader, 
  DocumentCard, 
  CategoryIcon, 
  CategoryPill, 
  Badge, 
  EmptyState, 
  Button 
} from '../components/ui';

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
    toggleFavorite,
    setIsUploadModalOpen
  } = useDocumentContext();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'All' | 'PDF' | 'Images'>('All');
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'expiring' | 'valid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'expiry'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Identity', 'Education', 'Finance', 'Insurance', 'Medical', 'Warranty', 'Vehicle'];

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

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* 1. Page Header */}
      <PageHeader
        title="All Documents"
        subtitle={`Organize and inspect ${documents.length} secure vault records`}
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Add Document
          </Button>
        }
      />

      {/* 2. Controls Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6E6E0] shadow-xs space-y-3.5">
        
        {/* Row 1: Search & Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#646860] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, issuer, tag..."
              className="w-full h-9 pl-9 pr-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs text-[#20211F] placeholder:text-[#646860] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
            />
          </div>

          {/* Right Controls: Sort & Grid/List Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B6E66]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="expiry">Expiry Date</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F6F6F2] p-0.5 rounded-xl border border-[#E6E6E0]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#1D5FF0] shadow-xs' 
                    : 'text-[#6B6E66] hover:text-[#20211F]'
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
                    : 'text-[#6B6E66] hover:text-[#20211F]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Row 2: Category Filters & Type Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[#E6E6E0]">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                category={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              />
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#F6F6F2] p-0.5 rounded-xl border border-[#E6E6E0] text-xs">
            {(['All', 'PDF', 'Images'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTypeFilter === t
                    ? 'bg-white text-[#20211F] shadow-xs'
                    : 'text-[#6B6E66] hover:text-[#20211F]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 3. Document Collection */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-6 shadow-xs">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No documents found"
            description="Try clearing your search query or choosing a different category filter."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setActiveTypeFilter('All');
                }}
              >
                Clear all filters
              </Button>
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredList.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => handleDocumentClick(doc)}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-[#E6E6E0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-[#E6E6E0] text-[#646860] font-semibold text-[11px] bg-[#F6F6F2]">
                  <th className="py-3 px-5">Document</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E0]">
                {filteredList.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="hover:bg-[#F6F6F2] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={doc.category} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#20211F] group-hover:text-[#1D5FF0] transition-colors">
                              {doc.title}
                            </span>
                            {doc.isFavorite && (
                              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#646860]">
                            {doc.issuer || doc.policyNumber || 'Vault Item'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="default" size="sm">
                        {doc.category}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-[#6B6E66]">
                      {doc.issueDate}
                    </td>

                    <td className="py-3 px-4">
                      {doc.expiryDate ? (
                        <span className={`font-medium ${doc.isExpiringSoon ? 'text-[#DC2626] font-semibold' : 'text-[#20211F]'}`}>
                          {doc.expiryDate} {doc.isExpiringSoon && `(${doc.daysLeft}d)`}
                        </span>
                      ) : (
                        <span className="text-[#646860]">No Expiry</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#6B6E66]">
                      <span className="uppercase font-semibold text-[#20211F]">{doc.fileType}</span> • {doc.fileSize}
                    </td>

                    <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDocumentClick(doc)}
                          className="p-1.5 rounded-lg text-[#6B6E66] hover:text-[#1D5FF0] hover:bg-[#E5EDFF] transition-colors cursor-pointer"
                          title="Open Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleActionSheetClick(e, doc)}
                          className="p-1.5 rounded-lg text-[#6B6E66] hover:text-[#20211F] hover:bg-[#F0F0EA] transition-colors cursor-pointer"
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

    </div>
  );
};

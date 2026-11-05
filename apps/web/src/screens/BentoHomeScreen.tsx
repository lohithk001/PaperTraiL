import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  FileCheck, 
  GraduationCap, 
  CreditCard, 
  Shield, 
  Heart, 
  FileText, 
  Star, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Download,
  Share2,
  Eye,
  Plus,
  Search
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory, DocumentItem } from '../types';

export const BentoHomeScreen: React.FC = () => {
  const { 
    documents, 
    userProfile,
    setActiveDocumentDetail, 
    setActiveTab, 
    setSelectedCategory,
    setIsUploadModalOpen,
    setIsGlobalSearchOpen 
  } = useDocumentContext();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All', icon: LayoutGrid },
    { id: 'Education', label: 'Education', icon: GraduationCap },
    { id: 'Identity', label: 'Identity', icon: FileCheck },
    { id: 'Finance', label: 'Finance', icon: CreditCard },
    { id: 'Insurance', label: 'Insurance', icon: Shield },
    { id: 'Medical', label: 'Medical', icon: Heart },
    { id: 'Warranty', label: 'Warranty', icon: FileText },
  ];

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Education':
        return {
          bg: 'bg-[#FDE8E8]',
          border: 'border-[#FBD6D6]',
          tagBg: 'bg-white text-rose-800',
          icon: GraduationCap,
        };
      case 'Finance':
        return {
          bg: 'bg-[#FFF0DE]',
          border: 'border-[#FCE0C1]',
          tagBg: 'bg-white text-amber-900',
          icon: CreditCard,
        };
      case 'Identity':
        return {
          bg: 'bg-[#EDE8FF]',
          border: 'border-[#DDD5F7]',
          tagBg: 'bg-white text-purple-900',
          icon: FileCheck,
        };
      case 'Insurance':
      case 'Vehicle':
        return {
          bg: 'bg-[#DEF5E5]',
          border: 'border-[#C4EDCE]',
          tagBg: 'bg-white text-emerald-900',
          icon: Shield,
        };
      case 'Medical':
        return {
          bg: 'bg-[#FFE8EC]',
          border: 'border-[#FFD5DC]',
          tagBg: 'bg-white text-rose-900',
          icon: Heart,
        };
      default:
        return {
          bg: 'bg-[#EAF2FF]',
          border: 'border-[#D5E4FF]',
          tagBg: 'bg-white text-blue-900',
          icon: FileText,
        };
    }
  };

  const handleOpenDoc = (doc?: DocumentItem) => {
    if (!doc) return;
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  const filteredDocs = activeCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(d.category.toLowerCase()));

  // Active Priority / Focal documents for the 2x2 Bento grid (up to 4 items)
  const primaryCards = filteredDocs.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col gap-5 select-none pb-8">
      
      {/* Top Search Bar Pill */}
      <div className="pt-0.5">
        <div 
          onClick={() => setIsGlobalSearchOpen(true)}
          className="w-full max-w-md h-10 px-4 rounded-full bg-white hover:bg-white/95 border border-[#EBE4DA] shadow-2xs flex items-center justify-between text-xs text-[#78716C] cursor-pointer transition-all hover:border-slate-400"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#A8A29E]" />
            <span>Search documents, policies, marksheets...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#78716C] text-[10px] font-bold border border-[#EBE4DA]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 1. Large Editorial Headline matching reference typography */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#111827] tracking-tight font-display leading-[1.12]">
          Store & protect your<br />personal documents
        </h1>
      </div>

      {/* 2. Horizontal Category Filter Pills matching reference */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white text-[#4B5563] hover:text-[#111827] hover:bg-slate-50 border border-[#EBE4DA] shadow-2xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2]" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Section Title: Priority Documents & Action Required */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-[#6B7280]">
            Priority Documents & Expiry Status
          </span>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs font-semibold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all ({documents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. The 2x2 Bento Cards Grid dynamically driven by real vault documents */}
        {documents.length === 0 ? (
          <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#EBE4DA] shadow-card text-center max-w-2xl mx-auto my-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#1D5FF0] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-8 h-8 stroke-[2.2]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#111827] tracking-tight font-display">
                Welcome to your secure vault{userProfile.name ? `, ${userProfile.name.split(' ')[0]}` : ''}!
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
                Your sovereign document archive is ready. Upload your first document to enable automatic expiration tracking and smart categorization.
              </p>
            </div>

            {/* Quick-action category chips from onboarding */}
            {userProfile.selectedDocumentCategories && userProfile.selectedDocumentCategories.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider block mb-2">
                  Recommended first documents from your setup:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {userProfile.selectedDocumentCategories.map((catName) => (
                    <button
                      key={catName}
                      onClick={() => {
                        setSelectedCategory(catName);
                        setIsUploadModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE2] border border-[#E8DFD3] text-xs font-bold text-[#111827] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#1D5FF0]" />
                      <span>Add {catName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.98] text-white text-xs font-bold shadow-card transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Upload your first document</span>
              </button>
            </div>
          </div>
        ) : primaryCards.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-[#EBE4DA] text-center">
            <p className="text-sm font-bold text-[#111827]">No documents found in {activeCategory}</p>
            <p className="text-xs text-[#78716C] mt-1">Upload a document to securely store and protect it in this vault category.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#111827] text-white text-xs font-bold cursor-pointer hover:bg-black transition-all"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryCards.map((doc, idx) => {
              const styles = getCategoryStyles(doc.category);
              const Icon = styles.icon;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  whileHover={{ y: -3, scale: 1.006 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOpenDoc(doc)}
                  className={`${styles.bg} rounded-[28px] p-5 sm:p-6 border ${styles.border} hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[195px] group relative`}
                >
                  {/* Top Row: Category Pill & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5 ${styles.tagBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{doc.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {doc.isExpiringSoon ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-rose-700 shadow-2xs border border-rose-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <span>Expires in {doc.daysLeft}d</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-emerald-800 shadow-2xs border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Big Title & Subtitle */}
                  <div className="my-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight leading-snug group-hover:text-black transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#4B5563] mt-1 line-clamp-1">
                      {doc.issuer || doc.policyNumber || 'Encrypted Vault Record'}
                    </p>
                  </div>

                  {/* Bottom Row: Expiry / Issue Date & File Format/Size */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                      {doc.isExpiringSoon && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      )}
                      <span>
                        {doc.expiryDate ? `Expires ${doc.expiryDate}` : `Added ${doc.issueDate}`}
                      </span>
                    </div>

                    {/* Clean format and file size pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-black/5 text-[11px] font-bold text-[#111827] shadow-2xs">
                      <span className="uppercase">{doc.fileType}</span>
                      <span className="text-[#A8A29E]">•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. All Vault Records Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-[#6B7280]">
            All Vault Records ({filteredDocs.length})
          </span>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs font-bold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload New</span>
          </button>
        </div>

        {/* Horizontal Card Carousel or Compact Grid */}
        {filteredDocs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-[#EBE4DA] text-center">
            <p className="text-sm font-bold text-[#111827]">Vault is ready for documents</p>
            <p className="text-xs text-[#78716C] mt-1">
              Store IDs, insurance, marksheets and vehicle documents with zero-knowledge security.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-full bg-[#111827] text-white text-xs font-bold cursor-pointer hover:bg-black transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDocs.slice(0, 3).map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                onClick={() => handleOpenDoc(doc)}
                className="bg-white rounded-2xl p-4 border border-[#EBE4DA] hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center text-[#111827] shrink-0 font-bold text-xs uppercase">
                    {doc.fileType}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#57534E] border border-[#EBE4DA]">
                    {doc.category}
                  </span>
                </div>

                <div className="my-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#111827] truncate">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5 truncate">
                    {doc.issuer} • {doc.fileSize}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#F5EFE6] flex items-center justify-between text-xs font-semibold text-[#111827]">
                  <span className="text-[11px] text-[#78716C]">
                    {doc.expiryDate ? `Exp: ${doc.expiryDate}` : 'No Expiry'}
                  </span>
                  <span className="text-xs font-bold text-[#1D5FF0] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

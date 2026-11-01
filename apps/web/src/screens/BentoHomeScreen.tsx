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

  // The 4 Signature Bento Cards matching exact pastel tones, typography, badges, and layout
  const bentoCards = [
    {
      id: 'card-1',
      tag: 'Education',
      icon: GraduationCap,
      rating: '4.9',
      verified: true,
      title: 'College Marksheet: 8th Sem Degree',
      subtitle: 'Official VTU graduation transcript with certified distinction marks.',
      meta: 'Expires in 30 days • Nov 30',
      metaWarning: true,
      bg: 'bg-[#FDE8E8]',
      border: 'border-[#FBD6D6]',
      tagBg: 'bg-white text-rose-800',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      ],
      docRef: documents.find(d => d.title.includes('Marksheet')) || documents[0],
    },
    {
      id: 'card-2',
      tag: 'Finance',
      icon: CreditCard,
      rating: '5.0',
      verified: true,
      title: 'Annual Income Tax Return & Form 16',
      subtitle: 'Certified financial year audit statement & zero-deduction certificate.',
      meta: 'Verified Jan 2026 • 3.6 MB',
      metaWarning: false,
      bg: 'bg-[#FFF0DE]',
      border: 'border-[#FCE0C1]',
      tagBg: 'bg-white text-amber-900',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      ],
      docRef: documents.find(d => d.category === 'Finance') || documents[1],
    },
    {
      id: 'card-3',
      tag: 'Identity',
      icon: FileCheck,
      rating: '4.9',
      verified: true,
      title: 'International Passport & Biometric Travel ID',
      subtitle: '36-page national travel passport with embedded RFID biometric chip.',
      meta: 'Valid until 2034 • Encrypted',
      metaWarning: false,
      bg: 'bg-[#EDE8FF]',
      border: 'border-[#DDD5F7]',
      tagBg: 'bg-white text-purple-900',
      avatars: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      ],
      docRef: documents.find(d => d.category === 'Identity') || documents[2],
    },
    {
      id: 'card-4',
      tag: 'Insurance',
      icon: Shield,
      rating: '5.0',
      badge: 'Top Priority',
      verified: true,
      title: 'Vehicle Comprehensive Motor Policy',
      subtitle: 'Zero-depreciation bumper-to-bumper car insurance cover with roadside assistance.',
      meta: 'Renews in 12 days • Nov 15',
      metaWarning: true,
      bg: 'bg-[#DEF5E5]',
      border: 'border-[#C4EDCE]',
      tagBg: 'bg-white text-emerald-900',
      avatars: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=80',
      ],
      docRef: documents.find(d => d.category === 'Insurance') || documents[3],
    },
  ];

  const handleOpenDoc = (doc?: DocumentItem) => {
    if (!doc) return;
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  const filteredDocs = activeCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(d.category.toLowerCase()));

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

      {/* 3. Section Title: "Most popular" */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-[#6B7280]">
            Most popular
          </span>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs font-semibold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all ({documents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. The 2x2 Bento Cards Grid (Exact matching the 4 pastel cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bentoCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                whileHover={{ y: -3, scale: 1.006 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOpenDoc(card.docRef)}
                className={`${card.bg} rounded-[28px] p-5 sm:p-6 border ${card.border} hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[195px] group relative`}
              >
                {/* Top Row: Category Pill & Star Rating / Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs flex items-center gap-1.5 ${card.tagBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{card.tag}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {card.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-emerald-800 shadow-2xs border border-emerald-200">
                        {card.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 text-xs font-bold text-[#111827] shadow-2xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{card.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Big Title & Subtitle */}
                <div className="my-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight leading-snug group-hover:text-black transition-colors line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] mt-1 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>

                {/* Bottom Row: Metadata & Overlapping Avatars */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
                    {card.metaWarning && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                    <span>{card.meta}</span>
                  </div>

                  {/* Overlapping Avatars matching reference */}
                  <div className="flex items-center -space-x-2">
                    {card.avatars.map((img, aIdx) => (
                      <img
                        key={aIdx}
                        src={img}
                        alt="Author"
                        className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. Featured Documents Section (matching "Featured course") */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-[#6B7280]">
            Featured vault documents
          </span>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs font-bold text-[#1D5FF0] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload New</span>
          </button>
        </div>

        {/* Horizontal Card Carousel or Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredDocs.slice(0, 3).map((doc, idx) => (
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
      </div>

    </div>
  );
};

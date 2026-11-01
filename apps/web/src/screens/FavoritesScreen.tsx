import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Download,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';

export const FavoritesScreen: React.FC = () => {
  const { 
    documents, 
    toggleFavorite, 
    setActiveDocumentDetail, 
    setActiveTab 
  } = useDocumentContext();

  const favoriteDocs = documents.filter(d => d.isFavorite || d.isPriority);

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
              Favorite Documents
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
              {favoriteDocs.length} starred
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            Pinned and frequently accessed documents for instant availability.
          </p>
        </div>
      </div>

      {/* Grid of Starred Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {favoriteDocs.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => handleOpenDoc(doc)}
            className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:shadow-card hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#EAF1FF] flex items-center justify-center text-[#1D5FF0] font-bold text-xs uppercase">
                  {doc.fileType}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(doc.id);
                  }}
                  className="p-1.5 rounded-full text-amber-500 hover:bg-amber-50 transition-colors"
                >
                  <Star className="w-5 h-5 fill-amber-400" />
                </button>
              </div>

              <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors truncate">
                {doc.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2 min-h-[32px]">
                {doc.issuer || doc.notes || 'Vault Item'}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F9FC] text-[#0F172A] border border-[#E2E8F0]">
                  {doc.category}
                </span>
                <span className="text-[11px] text-[#64748B]">{doc.fileSize}</span>
                {doc.isVerified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 ml-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
              <span>View Document</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {favoriteDocs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-subtle">
          <Star className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No starred documents yet</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Click the star icon on any document card or detail screen to pin it here.
          </p>
        </div>
      )}

    </div>
  );
};

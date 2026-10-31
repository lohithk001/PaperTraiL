import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  FolderLock,
  ArrowUpRight
} from 'lucide-react';
import { Header } from '../components/Header';
import { Greeting } from '../components/Greeting';
import { FilterChips } from '../components/FilterChips';
import { LayeredDocumentCard } from '../components/LayeredDocumentCard';
import { useDocumentContext } from '../context/DocumentContext';

export const HomeScreen: React.FC = () => {
  const { 
    filteredDocuments, 
    setSelectedDocument, 
    setIsUploadModalOpen,
    setActiveTab 
  } = useDocumentContext();

  return (
    <div className="w-full">
      {/* 3.A Top Status and Profile Section */}
      <Header />

      {/* 3.B Greeting Section */}
      <Greeting />

      {/* 3.C Filter Chip Section */}
      <FilterChips />

      {/* 3.D & 3.E Signature Layered Document Card */}
      <LayeredDocumentCard />

      {/* Vault Quick Access & Documents Preview */}
      <section className="px-6 pt-5 pb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-extrabold text-charcoal-900 tracking-tight">
              Vault Documents
            </h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {filteredDocuments.length}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('documents')}
            className="text-[13px] font-bold text-primary flex items-center gap-0.5 hover:underline"
          >
            <span>See all</span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* List of Documents */}
        <div className="space-y-3">
          {filteredDocuments.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedDocument(doc)}
              className="p-4 rounded-2.5xl bg-white border border-charcoal-200/70 shadow-xs hover:border-primary/40 hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                  style={{
                    backgroundColor: doc.accentColor || '#0861E8'
                  }}
                >
                  <FileText className="w-6 h-6 stroke-[1.8]" />
                </div>

                <div>
                  <h4 className="text-[14.5px] font-bold text-charcoal-900 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] font-medium text-charcoal-500">
                    <span className="font-semibold text-charcoal-700">{doc.category}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    {doc.isExpiringSoon && (
                      <>
                        <span>•</span>
                        <span className="text-rose-500 font-bold">
                          {doc.daysLeft}d left
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {doc.isVerified && (
                  <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </span>
                )}
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-charcoal-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Quick Add Card */}
        <div className="mt-4 p-4 rounded-2.5xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
              <FolderLock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-[13.5px] font-bold text-charcoal-900">Add New Document</p>
              <p className="text-[11.5px] font-medium text-charcoal-500">Secure AES-256 cloud encryption</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload</span>
          </button>
        </div>
      </section>
    </div>
  );
};

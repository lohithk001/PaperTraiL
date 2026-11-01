import React from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';

export const ExpiringSoonSection: React.FC = () => {
  const { documents, setActiveDocumentDetail, setActiveTab } = useDocumentContext();

  const expiringDocs = documents.filter(d => d.isExpiringSoon || (d.daysLeft !== null && d.daysLeft <= 60)).slice(0, 3);

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF2E6] flex items-center justify-center text-[#F5A623]">
            <AlertTriangle className="w-4 h-4 stroke-[2.3]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight font-display">
              Expiring Soon
            </h3>
            <p className="text-xs text-[#64748B]">
              3 documents require renewal or verification
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('reminders')}
          className="flex items-center gap-1 text-xs font-bold text-[#1D5FF0] hover:text-[#0752D9] transition-colors cursor-pointer group"
        >
          <span>All Reminders</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Expiring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {expiringDocs.map((doc) => {
          const isCritical = (doc.daysLeft ?? 99) <= 15;
          return (
            <div
              key={doc.id}
              onClick={() => handleOpenDoc(doc)}
              className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC]/70 hover:bg-white hover:border-[#F5A623]/50 hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical 
                      ? 'bg-[#FCECF3] text-[#F04452] border border-[#F04452]/20' 
                      : 'bg-[#FFF2E6] text-[#F5A623] border border-[#F5A623]/20'
                  }`}>
                    {doc.daysLeft ? `in ${doc.daysLeft} days` : 'Expiring Soon'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {doc.expiryDate}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors truncate">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {doc.issuer || doc.category}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#1D5FF0]">
                <span>Review Document</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

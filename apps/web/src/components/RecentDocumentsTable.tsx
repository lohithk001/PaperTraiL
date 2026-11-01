import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Share2, 
  MoreHorizontal, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';

export const RecentDocumentsTable: React.FC = () => {
  const { 
    documents, 
    setActiveDocumentDetail, 
    setActiveTab, 
    setSelectedDocument, 
    setIsActionSheetOpen 
  } = useDocumentContext();

  // Grab the 6 requested realistic mock documents
  const recentDocs = documents.slice(0, 6);

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  const handleQuickActions = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    setSelectedDocument(doc);
    setIsActionSheetOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Education':
        return 'bg-[#F0EAFE] text-[#7C3AED] border-[#7C3AED]/20';
      case 'Insurance':
        return 'bg-[#FFF2E6] text-[#F5A623] border-[#F5A623]/20';
      case 'Identity':
        return 'bg-[#EAF1FF] text-[#1D5FF0] border-[#1D5FF0]/20';
      case 'Finance':
        return 'bg-[#E8F6EF] text-[#27A879] border-[#27A879]/20';
      case 'Medical':
        return 'bg-[#FCECF3] text-[#E11D48] border-[#E11D48]/20';
      default:
        return 'bg-[#F0F2F6] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight font-display">
            Recent Documents
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Quickly access your recently stored and updated vault files
          </p>
        </div>
        
        <button
          onClick={() => setActiveTab('documents')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1D5FF0] hover:text-[#0752D9] transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Responsive Table / Rows */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider bg-[#F7F9FC]/60">
              <th className="py-3 px-6">Document</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date Added</th>
              <th className="py-3 px-4">Expiry</th>
              <th className="py-3 px-4">File Type</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {recentDocs.map((doc) => (
              <tr 
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="hover:bg-[#F7F9FC] transition-colors cursor-pointer group"
              >
                {/* Document Column */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] border border-[#1D5FF0]/20 flex items-center justify-center text-[#1D5FF0] font-bold text-xs uppercase shrink-0">
                      {doc.fileType}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
                          {doc.title}
                        </span>
                        {doc.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Document" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate max-w-xs">
                        {doc.issuer || doc.policyNumber || 'Personal Vault File'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category Column */}
                <td className="py-3.5 px-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getCategoryBadge(doc.category)}`}>
                    {doc.category}
                  </span>
                </td>

                {/* Date Added */}
                <td className="py-3.5 px-4 text-[#64748B] font-medium">
                  {doc.issueDate}
                </td>

                {/* Expiry */}
                <td className="py-3.5 px-4">
                  {doc.expiryDate ? (
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold ${doc.isExpiringSoon ? 'text-[#F04452]' : 'text-[#0F172A]'}`}>
                        {doc.expiryDate}
                      </span>
                      {doc.isExpiringSoon && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFF2E6] text-[#F5A623]">
                          {doc.daysLeft}d left
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 font-medium">No Expiry</span>
                  )}
                </td>

                {/* File Type & Size */}
                <td className="py-3.5 px-4 text-[#64748B]">
                  <span className="uppercase font-bold text-[10px] text-slate-700">{doc.fileType}</span>
                  <span className="text-[11px] ml-1.5">({doc.fileSize})</span>
                </td>

                {/* Quick Actions */}
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenDoc(doc)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1D5FF0] hover:bg-[#EAF1FF] transition-colors cursor-pointer"
                      title="View Document Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => handleQuickActions(e, doc)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="More Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

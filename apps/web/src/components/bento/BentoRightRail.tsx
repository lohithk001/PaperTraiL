import React, { useMemo } from 'react';
import { 
  Bell, 
  Settings, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap, 
  Shield, 
  Lock,
  FileText,
  CreditCard,
  Heart
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';

export const BentoRightRail: React.FC = () => {
  const { 
    userProfile, 
    documents, 
    setActiveTab, 
    setIsNotificationsOpen, 
    unreadNotificationsCount,
    setActiveDocumentDetail 
  } = useDocumentContext();

  // Dynamic real storage calculation from actual vault documents
  const storageMetrics = useMemo(() => {
    let totalMb = 0;
    const categoryCounts: Record<string, number> = {};

    documents.forEach((d) => {
      // Calculate size
      const match = d.fileSize.match(/([\d.]+)\s*(MB|KB)/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        totalMb += unit === 'MB' ? val : val / 1024;
      }

      // Tally category
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    const usedFormatted = totalMb >= 1024 ? `${(totalMb / 1024).toFixed(2)} GB` : `${totalMb.toFixed(1)} MB`;
    const quotaMb = 500; // 500 MB Free Tier Vault Quota
    const percentUsed = Math.min(100, Math.max(1, Math.round((totalMb / quotaMb) * 100)));

    return {
      used: usedFormatted,
      quota: `${quotaMb} MB`,
      percent: percentUsed,
      categoryCounts,
    };
  }, [documents]);

  const handleOpenDoc = (idOrTitle: string) => {
    const doc = documents.find(d => d.id === idOrTitle || d.title.toLowerCase().includes(idOrTitle.toLowerCase())) || documents[0];
    if (doc) {
      setActiveDocumentDetail(doc);
      setActiveTab('document-detail');
    }
  };

  const pinnedDocs = useMemo(() => {
    const favorites = documents.filter(d => d.isFavorite || d.isPriority);
    return favorites.length > 0 ? favorites.slice(0, 2) : documents.slice(0, 2);
  }, [documents]);

  return (
    <aside className="w-[310px] bg-[#F2ECE2] rounded-[30px] p-5 flex flex-col gap-4.5 border border-[#E8DFD3] shrink-0 select-none overflow-y-auto no-scrollbar">
      
      {/* 1. Top Action Toolbar: Bell & Settings */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#111827] shadow-2xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7E86] ring-2 ring-white"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#111827] shadow-2xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* 2. User Profile Summary */}
      <div className="flex flex-col items-center text-center">
        
        {/* Profile Avatar with colorful ring halo */}
        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-400 to-indigo-500 shadow-md">
          <div className="w-full h-full rounded-full overflow-hidden bg-white ring-2 ring-white">
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* User Name */}
        <h2 className="text-base font-bold text-[#111827] tracking-tight mt-2.5">
          {userProfile.name}
        </h2>
        <p className="text-[11px] font-semibold text-[#78716C]">
          Personal Document Vault
        </p>

        {/* Vault Documents Button */}
        <button
          onClick={() => setActiveTab('documents')}
          className="mt-3 w-full py-2.5 px-3.5 bg-white rounded-2xl flex items-center justify-between shadow-2xs border border-[#EBE4DA] hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#111827]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-[#111827]">
              {documents.length} Vault Documents
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#57534E]">
              AES-256
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        </button>

      </div>

      {/* 3. Storage Allocation & Category Distribution (Derived from real documents) */}
      <div className="bg-white rounded-[24px] p-4 shadow-2xs border border-[#EBE4DA] space-y-3">
        
        {/* Header */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#6B7280]">Vault Storage</span>
          <span className="text-[11px] font-bold text-[#111827] bg-[#F5EFE6] px-2 py-0.5 rounded-lg">
            {storageMetrics.percent}% used
          </span>
        </div>

        {/* Dynamic Metric */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-[#111827] tracking-tight">
            {storageMetrics.used}
          </span>

          <div className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Storage Encrypted</span>
          </div>
        </div>

        {/* Real Progress Bar */}
        <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#EBE4DA]">
          <div 
            className="bg-[#111827] h-full rounded-full transition-all duration-500"
            style={{ width: `${storageMetrics.percent}%` }}
          />
        </div>

        {/* Real Category Distribution */}
        <div className="pt-1 grid grid-cols-2 gap-2 text-[11px]">
          {['Identity', 'Finance', 'Insurance', 'Education'].map((cat) => {
            const count = storageMetrics.categoryCounts[cat] || 0;
            return (
              <div key={cat} className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EBE4DA]/70">
                <span className="text-[#57534E] font-medium truncate">{cat}</span>
                <span className="font-bold text-[#111827] ml-1">{count}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. Pinned in Vault (Derived dynamically from real documents) */}
      <div className="space-y-2.5">
        
        <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
          <span>Pinned in vault</span>
          <button 
            onClick={() => setActiveTab('documents')}
            className="text-[11px] text-[#78716C] hover:text-[#111827] cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* Stacked Cards */}
        <div className="space-y-2.5">
          {pinnedDocs.map((doc, pIdx) => {
            const isFirst = pIdx === 0;
            const bgClass = isFirst ? 'bg-[#FDE8E8] border-[#FBD6D6]' : 'bg-[#DEF5E5] border-[#C4EDCE]';
            const tagColor = isFirst ? 'text-rose-800' : 'text-emerald-800';

            return (
              <div 
                key={doc.id}
                onClick={() => handleOpenDoc(doc.id)}
                className={`${bgClass} rounded-[22px] p-3.5 border hover:shadow-xs transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-white ${tagColor} flex items-center gap-1 shadow-2xs`}>
                    <Lock className="w-3 h-3 stroke-[2.2]" />
                    <span>{doc.category}</span>
                  </span>

                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#111827] group-hover:text-black transition-colors leading-snug line-clamp-1">
                  {doc.title}
                </h4>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5 text-[10px] text-[#6B7280]">
                  <span>{doc.expiryDate ? `Expires ${doc.expiryDate}` : `Added ${doc.issueDate}`}</span>
                  <span className="font-semibold text-[#111827] uppercase">{doc.fileType} • {doc.fileSize}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </aside>
  );
};

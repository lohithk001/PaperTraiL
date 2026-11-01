import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  GraduationCap, 
  Shield, 
  Star,
  Sparkles,
  FileText,
  Lock
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

  const [activeChartMonth, setActiveChartMonth] = useState('Dec');

  const chartData = [
    { month: 'Jan', h1: 18, h2: 12, h3: 8, h4: 10 },
    { month: 'Feb', h1: 22, h2: 15, h3: 10, h4: 6 },
    { month: 'Aug', h1: 16, h2: 10, h3: 14, h4: 12 },
    { month: 'Sep', h1: 24, h2: 18, h3: 12, h4: 14 },
    { month: 'Oct', h1: 14, h2: 8, h3: 6, h4: 8 },
    { month: 'Nov', h1: 20, h2: 16, h3: 12, h4: 10 },
    { month: 'Dec', h1: 28, h2: 20, h3: 16, h4: 14, active: true },
  ];

  const handleOpenDoc = (titleSubstring: string) => {
    const doc = documents.find(d => d.title.toLowerCase().includes(titleSubstring.toLowerCase())) || documents[0];
    if (doc) {
      setActiveDocumentDetail(doc);
      setActiveTab('document-detail');
    }
  };

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

      {/* 2. User Profile Summary matching reference */}
      <div className="flex flex-col items-center text-center">
        
        {/* Profile Avatar with colorful ring halo matching reference */}
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

        {/* Vault Documents Pill Button with overlapping avatars matching reference */}
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
            {/* Overlapping small avatar chips matching reference */}
            <div className="flex items-center -space-x-1.5">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" 
                className="w-5 h-5 rounded-full ring-2 ring-white object-cover" 
                alt="Doc"
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" 
                className="w-5 h-5 rounded-full ring-2 ring-white object-cover" 
                alt="Doc"
              />
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" 
                className="w-5 h-5 rounded-full ring-2 ring-white object-cover" 
                alt="Doc"
              />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        </button>

      </div>

      {/* 3. Activity Card matching reference 3.5h + stacked bar chart */}
      <div className="bg-white rounded-[24px] p-4 shadow-2xs border border-[#EBE4DA] space-y-3">
        
        {/* Header */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#6B7280]">Activity</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#111827] bg-[#F5EFE6] px-2 py-0.5 rounded-lg">
            <span>Year</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* 3.5 GB Metric & "Great result!" Pill */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-[#111827] tracking-tight">
            3.5 GB
          </span>

          <div className="px-2.5 py-1 rounded-full bg-[#FFF6E6] text-[#B45309] text-[11px] font-bold flex items-center gap-1">
            <span>👍 Storage Safe!</span>
          </div>
        </div>

        {/* Multi-Colored Stacked Bar Chart */}
        <div className="pt-2 flex items-end justify-between gap-1.5 h-26">
          {chartData.map((bar) => {
            const isSelected = activeChartMonth === bar.month;

            return (
              <div 
                key={bar.month}
                onClick={() => setActiveChartMonth(bar.month)}
                className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer transition-all ${
                  isSelected ? 'p-1 rounded-xl bg-white border-2 border-[#111827] shadow-xs' : 'hover:opacity-85'
                }`}
              >
                {/* Stacked Colored Segments */}
                <div className="w-full flex flex-col justify-end gap-0.5 rounded-t-md overflow-hidden">
                  <div style={{ height: `${bar.h4}px` }} className="w-full bg-[#FFE5A3] rounded-xs"></div>
                  <div style={{ height: `${bar.h3}px` }} className="w-full bg-[#C5EFE0] rounded-xs"></div>
                  <div style={{ height: `${bar.h2}px` }} className="w-full bg-[#FFD1D5] rounded-xs"></div>
                  <div style={{ height: `${bar.h1}px` }} className="w-full bg-[#D6D0F8] rounded-xs"></div>
                </div>

                {/* Month label */}
                <span className={`text-[10px] mt-1.5 leading-none transition-all ${
                  isSelected 
                    ? 'px-1.5 py-0.5 rounded-md bg-[#111827] text-white font-bold' 
                    : 'text-[#9CA3AF] font-semibold'
                }`}>
                  {bar.month}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. "My vault" Section (Matching reference stacked pastel cards) */}
      <div className="space-y-2.5">
        
        <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
          <span>Pinned in vault</span>
          <button 
            onClick={() => setActiveTab('documents')}
            className="text-[11px] text-[#78716C] hover:text-[#111827]"
          >
            See all
          </button>
        </div>

        {/* Stacked Pastel Cards */}
        <div className="space-y-2.5">
          
          {/* Card 1: Rose Pastel */}
          <div 
            onClick={() => handleOpenDoc('marksheet')}
            className="bg-[#FDE8E8] rounded-[22px] p-3.5 border border-[#FBD6D6] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-800 flex items-center gap-1 shadow-2xs">
                <GraduationCap className="w-3 h-3 stroke-[2.2]" />
                <span>Education</span>
              </span>

              <span className="flex items-center gap-1 text-[10px] font-bold text-[#111827] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                <span>4.9</span>
              </span>
            </div>

            <h4 className="text-xs font-bold text-[#111827] group-hover:text-black transition-colors leading-snug line-clamp-1">
              College Marksheet (VTU Degree)
            </h4>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5 text-[10px] text-[#6B7280]">
              <span>Verified • 2.4 MB</span>
              <div className="flex items-center -space-x-1.5">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" 
                  className="w-4 h-4 rounded-full ring-1 ring-white object-cover" 
                  alt="Issuer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" 
                  className="w-4 h-4 rounded-full ring-1 ring-white object-cover" 
                  alt="Issuer"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Apricot Pastel */}
          <div 
            onClick={() => handleOpenDoc('insurance')}
            className="bg-[#FFF0DE] rounded-[22px] p-3.5 border border-[#FCE0C1] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-amber-900 flex items-center gap-1 shadow-2xs">
                <Shield className="w-3 h-3 stroke-[2.2]" />
                <span>Insurance</span>
              </span>

              <span className="flex items-center gap-1 text-[10px] font-bold text-[#111827] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                <span>5.0</span>
              </span>
            </div>

            <h4 className="text-xs font-bold text-[#111827] group-hover:text-black transition-colors leading-snug line-clamp-1">
              Vehicle Comprehensive Motor Policy
            </h4>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5 text-[10px] text-[#6B7280]">
              <span>Renews Nov 15 • 1.8 MB</span>
              <div className="flex items-center -space-x-1.5">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" 
                  className="w-4 h-4 rounded-full ring-1 ring-white object-cover" 
                  alt="Issuer"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </aside>
  );
};

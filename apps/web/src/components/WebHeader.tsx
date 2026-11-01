import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const WebHeader: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsAssistantOpen,
    setIsGlobalSearchOpen,
    setActiveTab,
    activeTab,
    userProfile,
  } = useDocumentContext();

  // Hide on full-screen flows
  const hiddenTabs: TabScreen[] = ['splash', 'onboarding', 'auth', 'scan'];
  if (hiddenTabs.includes(activeTab)) {
    return null;
  }

  return (
    <header className="w-full pt-4 pb-3 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4 select-none">
      
      {/* Left: Wide Pill Search Bar (Matching Reference Spec) */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] stroke-[2.2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => setIsGlobalSearchOpen(true)}
          placeholder="Search documents... (e.g. insurance, marks card)"
          className="w-full h-11 pl-11 pr-12 rounded-full bg-white hover:bg-slate-50 focus:bg-white border border-[#E2E8F0] focus:border-[#1D5FF0]/50 text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-3 focus:ring-[#1D5FF0]/10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer"
        />
        {searchQuery ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery('');
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
          >
            ×
          </button>
        ) : (
          <span className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#94A3B8] px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
            ⌘K
          </span>
        )}
      </div>

      {/* Right Action Tools: Notifications Bell + User Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* PaperTrail AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsAssistantOpen(true)}
          title="PaperTrail AI Assistant"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EAF1FF] hover:bg-blue-100 text-[#1D5FF0] font-bold text-xs border border-[#1D5FF0]/20 transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Vault AI</span>
        </motion.button>

        {/* Circular Notification Bell Button with Red Dot */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
          
          {/* Notification Red Dot */}
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#F04452] ring-2 ring-white"></span>
          )}
        </motion.button>

        {/* User Profile Avatar with Down Chevron */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/80 cursor-pointer transition-colors group"
          title="Profile & Vault Settings"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-gradient-to-tr from-sky-100 to-indigo-100 flex items-center justify-center relative group-hover:ring-2 group-hover:ring-[#1D5FF0]/40 transition-all">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0F172A] transition-colors" />
        </div>

      </div>

    </header>
  );
};

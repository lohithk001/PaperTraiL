import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const WebHeader: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsAssistantOpen,
    setActiveTab,
    userProfile,
  } = useDocumentContext();

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      {/* Left: Wide Pill Search Bar */}
      <div className="relative flex-1 max-w-md sm:max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents... (e.g. insurance, marks card)"
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#EEF2F8]/75 hover:bg-[#EEF2F8] focus:bg-white border border-slate-200/50 focus:border-[#0861E8]/50 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-[#0861E8]/10 transition-all shadow-xs"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200/60 rounded-full w-4 h-4 flex items-center justify-center"
          >
            ×
          </button>
        ) : (
          <span className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-white/80 rounded border border-slate-200">
            ⌘K
          </span>
        )}
      </div>

      {/* Right Action Tools: Notifications Bell + User Profile Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* PaperTrail AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAssistantOpen(true)}
          title="PaperTrail AI Assistant"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-50/80 hover:bg-blue-100/80 text-[#0861E8] font-bold text-xs border border-blue-200/50 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Vault AI</span>
        </motion.button>

        {/* Circular Notification Bell Button with Red Dot */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 shadow-[0_4px_12px_rgba(20,40,90,0.04)] flex items-center justify-center text-slate-700 transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
          
          {/* Notification Red Dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </motion.button>

        {/* User Profile Avatar with Down Chevron */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/80 cursor-pointer transition-colors group"
          title="Profile & Vault Settings"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-200/80 shadow-[0_4px_12px_rgba(20,40,90,0.04)] bg-gradient-to-tr from-sky-100 to-indigo-100 flex items-center justify-center relative">
            {/* Illustrated young man matching reference image */}
            <svg className="w-9 h-9 transform translate-y-1" viewBox="0 0 100 100" fill="none">
              {/* Dark hair */}
              <path d="M26 38 C26 22, 74 22, 74 38 C74 44, 76 50, 70 54 L30 54 C24 50, 26 44, 26 38 Z" fill="#1E293B" />
              {/* Face */}
              <circle cx="50" cy="52" r="22" fill="#FED7AA" />
              {/* Smile */}
              <path d="M44 60 Q50 64 56 60" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Eyes */}
              <circle cx="43" cy="50" r="2" fill="#0F172A" />
              <circle cx="57" cy="50" r="2" fill="#0F172A" />
              {/* Blue collar shirt */}
              <path d="M25 80 C25 66, 75 66, 75 80 L75 90 L25 90 Z" fill="#0861E8" />
              <polygon points="50,68 44,78 56,78" fill="#FED7AA" />
            </svg>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>

      </div>

    </header>
  );
};

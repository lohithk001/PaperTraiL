import React from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Plus, 
  HelpCircle, 
  ChevronRight,
  Shield,
  Upload
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const TopHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsGlobalSearchOpen,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsAssistantOpen,
    setIsUploadModalOpen,
    userProfile,
  } = useDocumentContext();

  const getPageTitle = (tab: TabScreen) => {
    switch (tab) {
      case 'home':
      case 'overview':
        return { group: 'Workspace', title: 'Overview' };
      case 'documents':
        return { group: 'Workspace', title: 'All Documents' };
      case 'folders':
        return { group: 'Workspace', title: 'Folders' };
      case 'categories':
        return { group: 'Workspace', title: 'Categories' };
      case 'reminders':
        return { group: 'Manage', title: 'Reminders & Renewals' };
      case 'shared':
        return { group: 'Manage', title: 'Shared Documents' };
      case 'favorites':
        return { group: 'Manage', title: 'Favorites' };
      case 'storage':
        return { group: 'Vault', title: 'Storage & Encryption' };
      case 'settings':
        return { group: 'Preferences', title: 'Vault Settings' };
      case 'help':
        return { group: 'Preferences', title: 'Help & Knowledge Base' };
      case 'document-detail':
        return { group: 'Documents', title: 'Document Details' };
      case 'upload':
        return { group: 'Actions', title: 'Upload Document' };
      case 'scan':
        return { group: 'Actions', title: 'Smart Scanner' };
      default:
        return { group: 'Workspace', title: 'Overview' };
    }
  };

  const pageInfo = getPageTitle(activeTab);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 select-none">
      
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-[#94A3B8] tracking-tight">{pageInfo.group}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 stroke-[2.5]" />
        <h2 className="text-sm lg:text-base font-extrabold text-[#0F172A] tracking-tight font-display">
          {pageInfo.title}
        </h2>
      </div>

      {/* Center: Global Search Bar with ⌘K Badge */}
      <div className="flex-1 max-w-md hidden md:block">
        <div 
          onClick={() => setIsGlobalSearchOpen(true)}
          className="relative flex items-center w-full px-4 py-2 rounded-full bg-[#F7F9FC] hover:bg-[#EEF2F8] border border-[#E2E8F0] text-xs text-[#64748B] cursor-pointer transition-all group shadow-xs"
        >
          <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D5FF0] transition-colors mr-2.5 shrink-0 stroke-[2.2]" />
          <span className="truncate flex-1">Search documents... (e.g. marksheet, policy, aadhaar)</span>
          <div className="flex items-center gap-1 ml-2">
            <kbd className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#64748B] shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Tools: Assistant + Notifications + Upload Action + Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* PaperTrail AI Assistant */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EAF1FF] hover:bg-blue-100/80 text-[#1D5FF0] text-xs font-bold transition-all cursor-pointer border border-[#1D5FF0]/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Vault AI</span>
        </button>

        {/* Notification Bell with Unread Dot */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          className="relative w-9 h-9 rounded-full bg-[#F7F9FC] hover:bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F04452] ring-2 ring-white"></span>
          )}
        </button>

        {/* Primary "+ Upload Document" Button */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] text-white text-xs font-bold shadow-card transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setActiveTab('settings')}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-100 cursor-pointer hover:ring-2 hover:ring-[#1D5FF0]/30 transition-all shrink-0"
          title={`${userProfile.name} • Account Settings`}
        >
          <img 
            src={userProfile.avatarUrl} 
            alt={userProfile.name}
            className="w-full h-full object-cover" 
          />
        </div>

      </div>

    </header>
  );
};

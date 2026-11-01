import React from 'react';
import { 
  Home, 
  Files, 
  FolderTree, 
  LayoutGrid, 
  CalendarClock, 
  Share2, 
  Star, 
  Settings, 
  HelpCircle, 
  HardDrive, 
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const AppSidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    counts,
    setSelectedCategory
  } = useDocumentContext();

  const handleNav = (tab: TabScreen) => {
    if (tab === 'home' || tab === 'overview') {
      setSelectedCategory('All');
    }
    setActiveTab(tab);
  };

  const workspaceNav: Array<{ id: TabScreen; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'documents', label: 'All Documents', icon: Files },
    { id: 'folders', label: 'Folders', icon: FolderTree },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
  ];

  const manageNav: Array<{ id: TabScreen; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'reminders', label: 'Reminders', icon: CalendarClock, badge: counts.expiring },
    { id: 'shared', label: 'Shared Documents', icon: Share2 },
    { id: 'favorites', label: 'Favorites', icon: Star },
  ];

  const preferencesNav: Array<{ id: TabScreen; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 select-none z-30 sticky top-0">
      
      {/* Top Header & Brand */}
      <div className="flex flex-col">
        <div 
          onClick={() => handleNav('home')} 
          className="px-6 py-5 flex items-center gap-3 cursor-pointer group border-b border-slate-100/80"
        >
          {/* Folded PaperTrail Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1D5FF0] to-[#3B82F6] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(29,95,240,0.3)] relative overflow-hidden group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="white" fillOpacity="0.95" />
              <path d="M14 2V8H20L14 2Z" fill="#93C5FD" />
              <path d="M8 13H16M8 17H13" stroke="#1D5FF0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-[#0F172A] text-lg tracking-tight font-display">PaperTrail</h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D5FF0]"></span>
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Personal Document Vault</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3.5 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-270px)]">
          
          {/* Section 1: WORKSPACE */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-[#94A3B8]">Workspace</p>
            <div className="space-y-1">
              {workspaceNav.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'overview');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#EAF1FF] text-[#1D5FF0]' 
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-[#1D5FF0]' : 'text-[#94A3B8]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#1D5FF0]"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: MANAGE */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-[#94A3B8]">Manage</p>
            <div className="space-y-1">
              {manageNav.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#EAF1FF] text-[#1D5FF0]' 
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-[#1D5FF0]' : 'text-[#94A3B8]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF2E6] text-[#F5A623]">
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1D5FF0]"></div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: PREFERENCES */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-[#94A3B8]">Preferences</p>
            <div className="space-y-1">
              {preferencesNav.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#EAF1FF] text-[#1D5FF0]' 
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-[#1D5FF0]' : 'text-[#94A3B8]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#1D5FF0]"></div>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Storage Card + Lohith K Profile */}
      <div className="p-3.5 border-t border-slate-100 bg-white">
        
        {/* Storage Meter Card */}
        <div 
          onClick={() => handleNav('storage')}
          className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-2xl p-3.5 mb-3 hover:border-[#1D5FF0]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <HardDrive className="w-3.5 h-3.5 text-[#1D5FF0]" />
              Storage Used
            </span>
            <span className="text-[#1D5FF0] text-[11px]">72%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-[#1D5FF0] to-[#3B82F6] rounded-full transition-all duration-500" 
              style={{ width: `${userProfile.storageUsedPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span>{userProfile.storageUsed} / {userProfile.storageTotal}</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              AES-256
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div 
          onClick={() => handleNav('settings')}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F9FC] transition-colors cursor-pointer group"
          title="Account Settings"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-100 shrink-0">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#0F172A] truncate leading-tight group-hover:text-[#1D5FF0] transition-colors">
                {userProfile.name}
              </p>
              <p className="text-[11px] text-[#64748B] truncate leading-tight">
                {userProfile.email}
              </p>
            </div>
          </div>
          
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D5FF0] group-hover:translate-x-0.5 transition-all" />
        </div>

      </div>

    </aside>
  );
};

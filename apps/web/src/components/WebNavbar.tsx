import React from 'react';
import { 
  FileText, 
  Home, 
  ScanLine, 
  Calendar, 
  HardDrive, 
  Settings, 
  Search, 
  Sparkles, 
  Bell, 
  Plus, 
  Smartphone, 
  Monitor,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const WebNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsAssistantOpen,
    setIsUploadModalOpen,
    searchQuery,
    setSearchQuery,
    deviceViewMode,
    setDeviceViewMode,
  } = useDocumentContext();

  const navLinks: Array<{ id: TabScreen; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Document Vault', icon: FileText },
    { id: 'scan', label: 'Scanner & OCR', icon: ScanLine },
    { id: 'reminders', label: 'Renewals & Alerts', icon: Calendar },
    { id: 'storage', label: 'Cloud Storage', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-charcoal-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[17px] text-charcoal-900 tracking-tight group-hover:text-primary transition-colors">
                    PaperTrail
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
                    Vault v1.0
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>AES-256 Cloud Vault</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-neutral-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center Search (Medium & Large screens) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vault (e.g. passport, policy)..."
              className="w-full pl-10 pr-10 py-1.5 rounded-full bg-neutral-100/90 border border-charcoal-200/70 text-xs font-medium text-charcoal-800 placeholder:text-charcoal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-charcoal-400 px-1.5 py-0.5 bg-white border border-charcoal-200 rounded">
              ⌘K
            </span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Simulator Switch (Desktop vs Mobile Preview) */}
            <div className="hidden xl:flex items-center bg-neutral-100 p-1 rounded-full border border-charcoal-200 text-xs font-semibold">
              <button
                onClick={() => setDeviceViewMode('responsive')}
                title="Full Responsive Desktop SaaS View"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  deviceViewMode === 'responsive'
                    ? 'bg-white text-primary font-bold shadow-xs'
                    : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web App</span>
              </button>
              <button
                onClick={() => setDeviceViewMode('mobile')}
                title="Preview in Mobile Viewport Reference"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  deviceViewMode === 'mobile'
                    ? 'bg-white text-primary font-bold shadow-xs'
                    : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Sim</span>
              </button>
            </div>

            {/* AI Assistant */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-primary font-bold text-xs border border-primary/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Assistant</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200/70 border border-charcoal-200/80 flex items-center justify-center text-charcoal-600 transition-all active:scale-95"
            >
              <Bell className="w-4 h-4 stroke-[1.9]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Upload Doc</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* User Avatar */}
            <div 
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 pl-1 cursor-pointer group"
              title="Profile & Vault Settings"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-charcoal-200 ring-2 ring-primary/20 bg-gradient-to-tr from-indigo-100 to-pink-100 flex items-center justify-center font-bold text-xs text-primary">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="hidden 2xl:flex flex-col">
                <span className="text-xs font-bold text-charcoal-900 group-hover:text-primary transition-colors">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-charcoal-500 font-medium">Personal Vault</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

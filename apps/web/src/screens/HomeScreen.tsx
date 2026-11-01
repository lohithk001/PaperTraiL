import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Clock, 
  Calendar,
  Bell,
  Bookmark
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { HeroIllustration3D } from '../components/HeroIllustration3D';
import { LayeredDocumentCard } from '../components/LayeredDocumentCard';
import { UpcomingRemindersCard } from '../components/UpcomingRemindersCard';
import { DocumentCategoriesCard } from '../components/DocumentCategoriesCard';
import { ScanSaveHeroCard } from '../components/ScanSaveHeroCard';
import { FilterType } from '../types';

export const HomeScreen: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    userProfile,
    setActiveTab,
    setIsNotificationsOpen,
    unreadNotificationsCount
  } = useDocumentContext();

  const totalCount = 24;
  const recentCount = 12;
  const expiringCount = 3;

  const filterTabs: Array<{ id: FilterType; label: string; count: number; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'all', label: 'All Documents', count: totalCount, icon: LayoutGrid },
    { id: 'recent', label: 'Recent', count: recentCount, icon: Clock },
    { id: 'expiring', label: 'Expiring Soon', count: expiringCount, icon: Calendar },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-7 select-none">
      
      {/* 0. Mobile-Only Top Profile Bar */}
      <div className="flex md:hidden items-center justify-between pt-1 pb-1">
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 shadow-subtle">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
              <span>{userProfile.name}</span>
            </h2>
            <p className="text-[10px] font-medium text-[#64748B]">
              Personal Document Vault
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-subtle relative active:scale-95 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F04452] ring-2 ring-white"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shadow-subtle active:scale-95 transition-all cursor-pointer"
            title="Saved Documents"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Greeting + Filter Chips Section + Hero Illustration (Exact Reference Spec) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        
        {/* Left: Greeting & Quick Stat Chips */}
        <div className="flex-1 space-y-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight font-display"
            >
              Hi {userProfile.name.split(' ')[0]},
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-base sm:text-lg font-medium text-[#64748B] mt-1"
            >
              Your documents are safe with us!
            </motion.p>
          </div>

          {/* Filter Chips: All Documents 24 | Recent 12 | Expiring Soon 3 */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = filter === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setFilter(tab.id);
                    if (tab.id === 'all' || tab.id === 'recent') {
                      // Stay or filter docs
                    }
                  }}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1D5FF0] text-white shadow-card border border-[#1D5FF0]'
                      : 'bg-white text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0] shadow-subtle'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.4] text-white' : 'stroke-[2] text-[#64748B]'}`} />
                  
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[12px]">{tab.label}</span>
                    <span className={`text-[11px] font-semibold ${isActive ? 'text-white/85' : 'text-[#64748B]'}`}>
                      {tab.count}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: 3D Folder & Flying Documents Illustration */}
        <div className="hidden md:flex justify-center lg:justify-end shrink-0">
          <HeroIllustration3D />
        </div>

      </div>

      {/* 2. Middle Section: Signature 3D Layered Cobalt Card (Left) & Upcoming Reminders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (58% width / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <LayeredDocumentCard />
        </div>

        {/* Right Column (42% width / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <UpcomingRemindersCard />
        </div>

      </div>

      {/* 3. Bottom Section: Document Categories (Left) & Scan & Save Banner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (58% width / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <DocumentCategoriesCard />
        </div>

        {/* Right Column (42% width / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <ScanSaveHeroCard />
        </div>

      </div>

    </div>
  );
};

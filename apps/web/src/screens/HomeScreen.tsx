import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Clock, 
  Calendar 
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
    documents, 
    userProfile 
  } = useDocumentContext();

  const totalCount = 24; // Matching the reference badge count
  const recentCount = 12;
  const expiringCount = 3;

  const filterTabs: Array<{ id: FilterType; label: string; count: number; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'all', label: 'All Documents', count: totalCount, icon: LayoutGrid },
    { id: 'recent', label: 'Recent', count: recentCount, icon: Clock },
    { id: 'expiring', label: 'Expiring Soon', count: expiringCount, icon: Calendar },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 space-y-6 sm:space-y-7">
      
      {/* 1. Top Section: Greeting + Filter Pills on Left, 3D Folder Illustration on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        
        {/* Left: Greeting & Quick Stat Pills */}
        <div className="flex-1 space-y-5">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight"
            >
              Hi {userProfile.name},
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-base sm:text-lg font-medium text-slate-500 mt-1"
            >
              Your documents are safe with us!
            </motion.p>
          </div>

          {/* Quick Stat Filter Pills (All Documents 24 | Recent 12 | Expiring Soon 3) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = filter === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFilter(tab.id)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0861E8] text-white shadow-md shadow-blue-500/25 border border-[#0861E8]'
                      : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50/80 border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.4] text-white' : 'stroke-[2] text-slate-500'}`} />
                  
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[12px]">{tab.label}</span>
                    <span className={`text-[11px] font-semibold mt-0.5 ${isActive ? 'text-white/85' : 'text-slate-400'}`}>
                      {tab.count}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: 3D Folder & Flying Documents Illustration */}
        <div className="flex justify-center lg:justify-end shrink-0">
          <HeroIllustration3D />
        </div>

      </div>

      {/* 2. Middle Section: Signature 3D Cobalt Layered Card (Left) & Upcoming Reminders (Right) */}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pb-16">
        
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

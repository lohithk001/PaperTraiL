import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { BentoDock } from './BentoDock';
import { BentoRightRail } from './BentoRightRail';
import { BottomNav } from '../BottomNav';
import { cn } from '../../lib/utils';

const FULLSCREEN_TABS = new Set(['splash', 'onboarding', 'auth', 'landing']);

export const BentoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsUploadModalOpen,
  } = useDocumentContext();

  const isFullscreen = FULLSCREEN_TABS.has(activeTab);

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-[#F6F6F2] font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEBDF] flex items-center justify-center p-0 md:p-4 font-sans antialiased text-[#20211F]">
      {/* App frame */}
      <div className="
        w-full h-screen
        md:h-[92vh] md:max-w-[1600px] md:min-h-[640px]
        bg-[#F6F6F2]
        md:rounded-[28px] md:shadow-2xl md:shadow-black/10
        md:border md:border-[#DDD]
        flex flex-col md:flex-row
        overflow-hidden relative z-10
      ">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#F6F6F2] border-b border-[#E6E6E0] shrink-0 safe-top">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#20211F] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M4 3L14 8L8.5 12L4 3Z" /><path d="M14 8L21 5L16.5 15L14 8Z" /><path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-[#20211F] tracking-tight">PaperTraiL</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative w-9 h-9 rounded-xl bg-white border border-[#E6E6E0] flex items-center justify-center text-[#6B6E66] hover:text-[#20211F] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" strokeWidth={1.75} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1D5FF0]" />
              )}
            </button>
            <SignedOut>
              <button
                onClick={() => setActiveTab('auth')}
                className="h-9 px-3 rounded-xl bg-[#1D5FF0] text-white text-xs font-semibold cursor-pointer hover:bg-[#174FCB] transition-colors"
              >
                Sign in
              </button>
            </SignedOut>
          </div>
        </header>

        {/* Left dock — desktop only */}
        <div className="hidden md:flex shrink-0 p-3">
          <BentoDock />
        </div>

        {/* Center workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full px-4 sm:px-6 py-5 pb-28 md:pb-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right rail — xl+ screens */}
        <div className="hidden xl:flex shrink-0 p-3 pl-0">
          <BentoRightRail />
        </div>

      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

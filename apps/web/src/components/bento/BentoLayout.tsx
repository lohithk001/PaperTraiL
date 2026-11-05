import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { BentoDock } from './BentoDock';
import { BentoRightRail } from './BentoRightRail';
import { BottomNav } from '../BottomNav';

export const BentoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    unreadNotificationsCount, 
    setIsNotificationsOpen 
  } = useDocumentContext();
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);

  const isFullscreen = activeTab === 'splash' || activeTab === 'onboarding' || activeTab === 'auth';

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#111827] flex flex-col font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-0 md:p-4 lg:p-7 font-sans antialiased text-[#111827] selection:bg-[#111827] selection:text-white overflow-hidden bg-[#ECE7DE]">
      
      {/* Subtle Premium Canvas Depth (Clean architectural backdrop without neon AI-slop blobs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none hidden md:block">
        <div className="absolute inset-0 bg-radial-[at_50%_40%] from-[#FAF7F2]/60 via-[#ECE7DE] to-[#E3DDD1] opacity-90" />
      </div>

      {/* Application Container: Full-bleed on mobile, Floating Framed Card on desktop */}
      <div className="w-full h-screen md:h-[94vh] md:max-w-[1580px] md:min-h-[680px] md:max-h-[1040px] bg-[#FAF7F2] md:bg-[#FAF7F2]/95 md:backdrop-blur-md rounded-none md:rounded-[36px] shadow-none md:shadow-2xl md:shadow-stone-900/12 border-none md:border md:border-[#E5DDD0]/80 flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Mobile Top Header Bar (Visible on mobile < 768px: Origami Brand + Notification + Profile Avatar) */}
        <header className="md:hidden flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3]/70 shrink-0 safe-top select-none z-20">
          {/* Brand Origami Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            title="PaperTrail Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F2ECE2] border border-[#E8DFD3] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 3L14 8L8.5 12L4 3Z" fill="#111827" />
                <path d="M14 8L21 5L16.5 15L14 8Z" fill="#111827" />
                <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="#111827" />
              </svg>
            </div>
            <span className="font-extrabold text-sm text-[#111827] tracking-tight font-display">
              Paper<span className="text-[#FF6B6B]">TraiL</span>
            </span>
          </button>

          {/* Right Tools: Notification Bell & Profile Avatar at Top */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#57534E] hover:text-[#111827] relative shadow-2xs cursor-pointer active:scale-95 transition-transform"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B6B] ring-1.5 ring-white"></span>
              )}
            </button>

            {/* Profile Avatar / Clerk User Button placed prominently at the Top */}
            <SignedIn>
              <div className="w-9 h-9 flex items-center justify-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-9 h-9 ring-2 ring-indigo-500/30 rounded-full shadow-2xs',
                      userButtonTrigger: 'focus:outline-none',
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => setActiveTab('auth')}
                className="px-3 py-1.5 rounded-full bg-[#1D5FF0] hover:bg-[#1650D8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </SignedOut>
          </div>
        </header>

        {/* Zone 1: Left Dock (76px Floating Slim Dock - Visible on desktop/tablet) */}
        <div className="py-3.5 pl-3.5 hidden md:flex shrink-0 h-full">
          <BentoDock />
        </div>

        {/* Zone 2: Center Workspace (Fluid, Spacious, Seamless without scrollbars) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto no-scrollbar px-4 sm:px-8 py-4 sm:py-6 pb-28 md:pb-6 scroll-smooth">
          {children}
        </div>

        {/* Zone 3: Right Utility & Activity Rail (310px Panel - Visible on wide screens) */}
        {isRightRailOpen && (
          <div className="py-3.5 pr-3.5 hidden xl:flex shrink-0 h-full transition-all duration-300">
            <BentoRightRail />
          </div>
        )}

      </div>

      {/* Floating Bottom Navigation Bar (Visible only on mobile devices < 768px) */}
      <div className="md:hidden">
        <BottomNav />
      </div>

    </div>
  );
};

import React from 'react';
import { useDocumentContext } from '../context/DocumentContext';
import { WebHeader } from './WebHeader';
import { BottomNav } from './BottomNav';
import { TabScreen } from '../types';

export const WebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab } = useDocumentContext();

  const fullScreenTabs: TabScreen[] = ['splash', 'onboarding', 'auth', 'scan'];
  const isFullScreen = fullScreenTabs.includes(activeTab);

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] text-[#0F172A] flex flex-col font-sans antialiased selection:bg-[#1D5FF0]/20 selection:text-[#1D5FF0]">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#0F172A] flex flex-col font-sans antialiased selection:bg-[#1D5FF0]/20 selection:text-[#1D5FF0] relative overflow-x-hidden">
      
      {/* Top Header Navigation (Matching media_1793522933963_be958590.png: Search Pill + Notification Bell + Profile Avatar) */}
      <WebHeader />

      {/* Main Responsive Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 pb-32">
        {children}
      </main>

      {/* Centered Floating Bottom Navigation Bar (Matching media_1793522933963_be958590.png) */}
      <BottomNav />

    </div>
  );
};

import React from 'react';
import { useDocumentContext } from '../context/DocumentContext';
import { WebHeader } from './WebHeader';
import { BottomNav } from './BottomNav';

export const WebLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#0861E8]/20 selection:text-[#0861E8] relative overflow-x-hidden">
      
      {/* Top Header Navigation (Search Pill + Notification Bell + Profile Avatar) */}
      <WebHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-28">
        {children}
      </main>

      {/* Floating Bottom Navigation Bar (Centered Pill Container with Center (+) Button) */}
      <BottomNav />

    </div>
  );
};

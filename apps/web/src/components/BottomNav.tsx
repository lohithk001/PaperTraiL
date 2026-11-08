import React from 'react';
import { Home, Files, Plus, Calendar, Settings } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';
import { cn } from '../lib/utils';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsUploadModalOpen } = useDocumentContext();

  // Hide BottomNav on full-screen flows
  const hiddenTabs: TabScreen[] = ['splash', 'onboarding', 'auth', 'landing', 'scan'];
  if (hiddenTabs.includes(activeTab)) {
    return null;
  }

  const isNavActive = (tab: string) => {
    if (tab === 'home') return activeTab === 'home' || activeTab === 'overview';
    if (tab === 'documents') return activeTab === 'documents' || activeTab === 'document-detail';
    return activeTab === tab;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E6E6E0] safe-bottom select-none">
      <nav className="flex items-center justify-around px-2 py-1.5 h-16 max-w-lg mx-auto">
        
        {/* 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer',
            isNavActive('home') ? 'text-[#1D5FF0]' : 'text-[#6B6E66] hover:text-[#20211F]'
          )}
        >
          <Home className="w-5 h-5" strokeWidth={isNavActive('home') ? 2.2 : 1.75} />
          <span className="text-[11px] font-medium mt-1">Home</span>
        </button>

        {/* 2: Documents */}
        <button
          onClick={() => setActiveTab('documents')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer',
            isNavActive('documents') ? 'text-[#1D5FF0]' : 'text-[#6B6E66] hover:text-[#20211F]'
          )}
        >
          <Files className="w-5 h-5" strokeWidth={isNavActive('documents') ? 2.2 : 1.75} />
          <span className="text-[11px] font-medium mt-1">Docs</span>
        </button>

        {/* 3: Center Upload Action */}
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-[#1D5FF0] hover:bg-[#174FCB] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer -mt-3"
            title="Upload Document"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* 4: Reminders */}
        <button
          onClick={() => setActiveTab('reminders')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer',
            isNavActive('reminders') ? 'text-[#1D5FF0]' : 'text-[#6B6E66] hover:text-[#20211F]'
          )}
        >
          <Calendar className="w-5 h-5" strokeWidth={isNavActive('reminders') ? 2.2 : 1.75} />
          <span className="text-[11px] font-medium mt-1">Reminders</span>
        </button>

        {/* 5: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer',
            isNavActive('settings') ? 'text-[#1D5FF0]' : 'text-[#6B6E66] hover:text-[#20211F]'
          )}
        >
          <Settings className="w-5 h-5" strokeWidth={isNavActive('settings') ? 2.2 : 1.75} />
          <span className="text-[11px] font-medium mt-1">Settings</span>
        </button>

      </nav>
    </div>
  );
};

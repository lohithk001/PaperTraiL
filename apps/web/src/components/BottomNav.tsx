import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Files, 
  Folder, 
  Upload, 
  Calendar, 
  Settings 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsUploadModalOpen } = useDocumentContext();

  // Hide BottomNav on full-screen flows
  const hiddenTabs: TabScreen[] = ['splash', 'onboarding', 'auth', 'scan'];
  if (hiddenTabs.includes(activeTab)) {
    return null;
  }

  const isNavActive = (tab: string) => {
    if (tab === 'home') return activeTab === 'home' || activeTab === 'overview';
    if (tab === 'folders') return activeTab === 'folders' || activeTab === 'categories';
    return activeTab === tab;
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none safe-bottom select-none">
      <nav className="pointer-events-auto bg-[#F2ECE2]/95 backdrop-blur-xl border border-[#E8DFD3] shadow-xl rounded-full px-2.5 py-1.5 flex items-center gap-1.5 sm:gap-2.5 select-none">
        
        {/* Tab 1: Home */}
        <div className="relative">
          {isNavActive('home') ? (
            <motion.button
              layoutId="bentoBottomActive"
              onClick={() => setActiveTab('home')}
              className="w-11 h-11 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Home Dashboard"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('home')}
              className="w-11 h-11 rounded-full text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Tab 2: Documents */}
        <div className="relative">
          {isNavActive('documents') ? (
            <motion.button
              layoutId="bentoBottomActive"
              onClick={() => setActiveTab('documents')}
              className="w-11 h-11 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="All Documents"
            >
              <Files className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('documents')}
              className="w-11 h-11 rounded-full text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="All Documents"
            >
              <Files className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Tab 3: Raised Center Upload Action with Coral/Pink Pip */}
        <div className="relative px-0.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-12 h-12 rounded-[18px] bg-white hover:bg-white/90 text-[#374151] hover:text-[#111827] flex items-center justify-center shadow-md border border-[#E8DFD3] transition-all cursor-pointer transform -translate-y-1 active:scale-95"
            title="Upload Document"
          >
            <Upload className="w-5 h-5 stroke-[2]" />
          </button>
          <span className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-[#FF6B6B] ring-2 ring-[#F2ECE2]"></span>
        </div>

        {/* Tab 4: Vault Folders */}
        <div className="relative">
          {isNavActive('folders') ? (
            <motion.button
              layoutId="bentoBottomActive"
              onClick={() => setActiveTab('folders')}
              className="w-11 h-11 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Vault Folders"
            >
              <Folder className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('folders')}
              className="w-11 h-11 rounded-full text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Vault Folders"
            >
              <Folder className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Tab 5: Reminders */}
        <div className="relative">
          {isNavActive('reminders') ? (
            <motion.button
              layoutId="bentoBottomActive"
              onClick={() => setActiveTab('reminders')}
              className="w-11 h-11 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Lifecycle Reminders"
            >
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('reminders')}
              className="w-11 h-11 rounded-full text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Lifecycle Reminders"
            >
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Tab 6: Settings */}
        <div className="relative">
          {isNavActive('settings') ? (
            <motion.button
              layoutId="bentoBottomActive"
              onClick={() => setActiveTab('settings')}
              className="w-11 h-11 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Settings & Preferences"
            >
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('settings')}
              className="w-11 h-11 rounded-full text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Settings & Preferences"
            >
              <Settings className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

      </nav>
    </div>
  );
};

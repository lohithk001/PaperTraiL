import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Files, 
  Folder, 
  Settings, 
  Upload, 
  Calendar,
  LogOut
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { useVaultAuth } from '../../auth/ClerkAuthProvider';

export const BentoDock: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    setIsUploadModalOpen
  } = useDocumentContext();
  const { signOut } = useVaultAuth();

  const isNavActive = (tab: string) => {
    if (tab === 'home') return activeTab === 'home' || activeTab === 'overview';
    if (tab === 'folders') return activeTab === 'folders' || activeTab === 'categories';
    return activeTab === tab;
  };

  const handleLogout = async () => {
    if (confirm('Lock vault and log out?')) {
      await signOut();
    }
  };

  return (
    <aside className="w-[76px] bg-[#F2ECE2] rounded-[32px] py-5 px-2 flex flex-col items-center justify-between border border-[#E8DFD3] shrink-0 select-none h-full transition-all">
      
      {/* 1. Top Section: Origami Brand Mark & Floating Action Upload */}
      <div className="flex flex-col items-center gap-3">
        
        {/* PaperTrail Geometric Origami Brand Mark */}
        <button
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 flex items-center justify-center text-[#111827] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="PaperTrail Home"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 3L14 8L8.5 12L4 3Z" fill="#111827" />
            <path d="M14 8L21 5L16.5 15L14 8Z" fill="#111827" />
            <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="#111827" />
          </svg>
        </button>

        {/* Floating Quick Action Upload with Coral/Pink Pip */}
        <div className="relative">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-11 h-11 rounded-[18px] bg-white hover:bg-white/90 text-[#374151] hover:text-[#111827] flex items-center justify-center shadow-xs hover:shadow-sm transition-all cursor-pointer"
            title="Upload Document"
          >
            <Upload className="w-5 h-5 stroke-[2]" />
          </button>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF6B6B] ring-2 ring-[#F2ECE2]"></span>
        </div>

      </div>

      {/* 2. Middle Section: Clean Transparent Outlined Navigation Stack with Proper Icons */}
      <nav className="flex flex-col items-center gap-3.5 my-auto">
        
        {/* Item 1: Home */}
        <div className="relative">
          {isNavActive('home') ? (
            <motion.button
              layoutId="bentoDockActive"
              onClick={() => setActiveTab('home')}
              className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Home Dashboard"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('home')}
              className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Home Dashboard"
            >
              <Home className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Item 2: Documents (Files) */}
        <div className="relative">
          {isNavActive('documents') ? (
            <motion.button
              layoutId="bentoDockActive"
              onClick={() => setActiveTab('documents')}
              className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="All Documents"
            >
              <Files className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('documents')}
              className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="All Documents"
            >
              <Files className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Item 3: Folders (Proper Folder Icon) */}
        <div className="relative">
          {isNavActive('folders') ? (
            <motion.button
              layoutId="bentoDockActive"
              onClick={() => setActiveTab('folders')}
              className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Vault Folders"
            >
              <Folder className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('folders')}
              className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Vault Folders"
            >
              <Folder className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Item 4: Reminders (Calendar) */}
        <div className="relative">
          {isNavActive('reminders') ? (
            <motion.button
              layoutId="bentoDockActive"
              onClick={() => setActiveTab('reminders')}
              className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Lifecycle Reminders"
            >
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('reminders')}
              className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Lifecycle Reminders"
            >
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

      </nav>

      {/* 3. Bottom Section: Settings Gear, Logout Button & Profile Avatar */}
      <div className="flex flex-col items-center gap-2.5 mt-auto">
        
        {/* Settings Gear */}
        <div className="relative">
          {isNavActive('settings') ? (
            <motion.button
              layoutId="bentoDockActive"
              onClick={() => setActiveTab('settings')}
              className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md cursor-pointer"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              title="Settings & Preferences"
            >
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab('settings')}
              className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-[#111827] hover:bg-black/5 flex items-center justify-center transition-all cursor-pointer"
              title="Settings & Preferences"
            >
              <Settings className="w-5 h-5 stroke-[1.8]" />
            </button>
          )}
        </div>

        {/* Logout Action Button */}
        <button
          onClick={handleLogout}
          className="w-11 h-11 rounded-2xl text-[#57534E] hover:text-rose-600 hover:bg-rose-100/60 flex items-center justify-center transition-all cursor-pointer"
          title="Log Out & Lock Vault"
        >
          <LogOut className="w-5 h-5 stroke-[1.8]" />
        </button>

      </div>

    </aside>
  );
};

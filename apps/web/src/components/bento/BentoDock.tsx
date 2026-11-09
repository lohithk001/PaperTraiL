import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Files, 
  Folder, 
  Calendar, 
  Star, 
  Share2, 
  Settings, 
  Plus, 
  LogOut 
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { useVaultAuth } from '../../auth/ClerkAuthProvider';
import { ConfirmDialog, toast } from '../ui';

export const BentoDock: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsUploadModalOpen 
  } = useDocumentContext();
  const { signOut } = useVaultAuth();
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, match: ['home', 'overview'] },
    { id: 'documents', label: 'Documents', icon: Files, match: ['documents', 'document-detail'] },
    { id: 'folders', label: 'Folders', icon: Folder, match: ['folders', 'categories'] },
    { id: 'reminders', label: 'Reminders', icon: Calendar, match: ['reminders'] },
    { id: 'favorites', label: 'Favorites', icon: Star, match: ['favorites'] },
    { id: 'shared', label: 'Shared', icon: Share2, match: ['shared'] },
  ];

  const isNavActive = (matches: string[]) => matches.includes(activeTab);

  const handleLogout = () => {
    setShowSignoutConfirm(true);
  };

  return (
    <aside className="w-[74px] bg-white rounded-[26px] py-4 px-2.5 flex flex-col items-center justify-between border border-[#E6E6E0] shrink-0 select-none h-full shadow-xs">
      
      {/* Brand Icon & Upload Action */}
      <div className="flex flex-col items-center gap-3">
        {/* Origami Brand Mark */}
        <button
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#20211F] hover:bg-[#F0F0EA] transition-colors cursor-pointer group"
          title="PaperTraiL Vault"
        >
          <div className="w-8 h-8 rounded-lg bg-[#20211F] flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 3L14 8L8.5 12L4 3Z" fill="white" />
              <path d="M14 8L21 5L16.5 15L14 8Z" fill="white" />
              <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="white" />
            </svg>
          </div>
        </button>

        {/* Quick Upload CTA */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-11 h-11 rounded-2xl bg-[#1D5FF0] hover:bg-[#174FCB] text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Add new document"
        >
          <Plus className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex flex-col items-center gap-2 my-auto">
        {navItems.map((item) => {
          const active = isNavActive(item.match);
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              {active ? (
                <motion.button
                  layoutId="bentoDockActive"
                  onClick={() => setActiveTab(item.id as any)}
                  className="w-11 h-11 rounded-2xl bg-[#20211F] text-white flex items-center justify-center shadow-xs cursor-pointer"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              ) : (
                <button
                  onClick={() => setActiveTab(item.id as any)}
                  className="w-11 h-11 rounded-2xl text-[#6B6E66] hover:text-[#20211F] hover:bg-[#F0F0EA] flex items-center justify-center transition-all cursor-pointer"
                  title={item.label}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </button>
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#20211F] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Nav Items: Settings & Logout */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <div className="relative group">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#20211F] text-white shadow-xs'
                : 'text-[#6B6E66] hover:text-[#20211F] hover:bg-[#F0F0EA]'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#20211F] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
            Settings
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-11 h-11 rounded-2xl text-[#646860] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>

      <ConfirmDialog
        open={showSignoutConfirm}
        onClose={() => setShowSignoutConfirm(false)}
        onConfirm={async () => {
          setShowSignoutConfirm(false);
          await signOut();
          toast.info('Vault locked', 'You have been safely signed out of your session.');
        }}
        title="Lock Vault & Sign Out"
        description="Are you sure you want to lock your PaperTrail document vault and end your session?"
        confirmLabel="Lock & Sign Out"
        variant="primary"
      />

    </aside>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Folder, 
  Plus, 
  Calendar, 
  Settings 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsUploadModalOpen } = useDocumentContext();

  const navItems: Array<{
    id: TabScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'reminders', label: 'Reminders', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_16px_45px_rgba(20,40,90,0.10)] rounded-full px-5 py-2.5 sm:px-7 sm:py-3 flex items-center gap-3 sm:gap-7 select-none">
        
        {/* Tab 1: Home */}
        {(() => {
          const item = navItems[0];
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return isActive ? (
            <motion.button
              layoutId="activeBottomTab"
              onClick={() => setActiveTab(item.id)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0861E8] text-white flex items-center gap-2 font-bold text-xs shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <Icon className="w-4 h-4 stroke-[2.4]" />
              <span>{item.label}</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })()}

        {/* Tab 2: Documents */}
        {(() => {
          const item = navItems[1];
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return isActive ? (
            <motion.button
              layoutId="activeBottomTab"
              onClick={() => setActiveTab(item.id)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0861E8] text-white flex items-center gap-2 font-bold text-xs shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <Icon className="w-4 h-4 stroke-[2.4]" />
              <span>{item.label}</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })()}

        {/* Center Prominent Floating (+) Action Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsUploadModalOpen(true)}
          title="Upload New Document"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#0861E8] hover:bg-[#0752C5] text-white flex items-center justify-center shadow-lg shadow-blue-500/35 border-2 border-white transition-all cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </motion.button>

        {/* Tab 3: Reminders */}
        {(() => {
          const item = navItems[2];
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return isActive ? (
            <motion.button
              layoutId="activeBottomTab"
              onClick={() => setActiveTab(item.id)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0861E8] text-white flex items-center gap-2 font-bold text-xs shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <Icon className="w-4 h-4 stroke-[2.4]" />
              <span>{item.label}</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })()}

        {/* Tab 4: Settings */}
        {(() => {
          const item = navItems[3];
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return isActive ? (
            <motion.button
              layoutId="activeBottomTab"
              onClick={() => setActiveTab(item.id)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0861E8] text-white flex items-center gap-2 font-bold text-xs shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <Icon className="w-4 h-4 stroke-[2.4]" />
              <span>{item.label}</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })()}

      </nav>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  ScanLine, 
  Calendar, 
  Settings 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { TabScreen } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useDocumentContext();

  const navItems: Array<{
    id: TabScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isScan?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'scan', label: 'Scan', icon: ScanLine, isScan: true },
    { id: 'reminders', label: 'Alerts', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-lg border border-charcoal-200/80 shadow-nav rounded-full p-2 flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (isActive) {
            return (
              <motion.button
                key={item.id}
                layoutId="activeNavTab"
                onClick={() => setActiveTab(item.id)}
                className="relative px-4 py-2.5 rounded-full bg-primary text-white flex items-center gap-2 font-bold text-[13px] shadow-sm active:scale-95 transition-transform"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              >
                <Icon className="w-4 h-4 stroke-[2.4]" />
                <span>{item.label}</span>
              </motion.button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 ${
                item.isScan 
                  ? 'bg-blue-50 text-primary hover:bg-blue-100 hover:text-primary-dark font-semibold' 
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isScan ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {item.isScan && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

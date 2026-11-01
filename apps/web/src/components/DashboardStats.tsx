import React from 'react';
import { Files, Clock, CalendarClock, HardDrive } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const DashboardStats: React.FC = () => {
  const { counts, userProfile, setActiveTab, setFilter } = useDocumentContext();

  const stats = [
    {
      id: 'total',
      label: 'Total Documents',
      value: counts.all.toString(),
      subtext: 'Across 6 categories',
      icon: Files,
      color: 'text-[#1D5FF0]',
      bg: 'bg-[#EAF1FF]',
      border: 'hover:border-[#1D5FF0]/40',
      action: () => {
        setFilter('all');
        setActiveTab('documents');
      }
    },
    {
      id: 'recent',
      label: 'Recent Uploads',
      value: counts.recent.toString(),
      subtext: 'Last 30 days',
      icon: Clock,
      color: 'text-[#27A879]',
      bg: 'bg-[#E8F6EF]',
      border: 'hover:border-[#27A879]/40',
      action: () => {
        setFilter('recent');
        setActiveTab('documents');
      }
    },
    {
      id: 'expiring',
      label: 'Expiring Soon',
      value: counts.expiring.toString(),
      subtext: 'Requires attention',
      icon: CalendarClock,
      color: 'text-[#F5A623]',
      bg: 'bg-[#FFF2E6]',
      border: 'hover:border-[#F5A623]/40',
      action: () => {
        setFilter('expiring');
        setActiveTab('reminders');
      }
    },
    {
      id: 'storage',
      label: 'Storage Used',
      value: `${userProfile.storageUsed}`,
      subtext: `of ${userProfile.storageTotal} (72%)`,
      icon: HardDrive,
      color: 'text-[#7C3AED]',
      bg: 'bg-[#F0EAFE]',
      border: 'hover:border-[#7C3AED]/40',
      action: () => {
        setActiveTab('storage');
      }
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={stat.action}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E2E8F0] shadow-subtle hover:shadow-card transition-all cursor-pointer group ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#0F172A] transition-colors">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                <Icon className={`w-4 h-4 ${stat.color} stroke-[2.2]`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-[#64748B] truncate">
                {stat.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

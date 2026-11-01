import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from './Confetti';

export const UpcomingRemindersCard: React.FC = () => {
  const { setActiveTab, reminders, toggleReminder } = useDocumentContext();

  const reminderItems = [
    {
      id: 'rem-1',
      title: 'Vehicle Insurance Renewal',
      due: 'in 12 days • Nov 15, 2026',
      icon: Car,
      bgColor: 'bg-[#FFF2E6]',
      textColor: 'text-[#F5A623]',
      badgeColor: 'border-[#F5A623]/20',
    },
    {
      id: 'rem-2',
      title: 'Laptop Warranty Expiry',
      due: 'in 45 days • Dec 18, 2026',
      icon: ShieldCheck,
      bgColor: 'bg-[#EAF1FF]',
      textColor: 'text-[#1D5FF0]',
      badgeColor: 'border-[#1D5FF0]/20',
    },
    {
      id: 'rem-3',
      title: 'Credit Card Bill',
      due: 'in 1 month • Dec 25, 2026',
      icon: CreditCard,
      bgColor: 'bg-[#F0EAFE]',
      textColor: 'text-[#7C3AED]',
      badgeColor: 'border-[#7C3AED]/20',
    },
  ];

  const handleItemClick = (id: string) => {
    toggleReminder(id);
    triggerConfetti();
  };

  return (
    <div className="w-full h-full rounded-[28px] bg-white p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
          Upcoming Reminders
        </h2>
        <button
          onClick={() => setActiveTab('reminders')}
          className="text-xs font-semibold text-[#1D5FF0] hover:text-[#0752D9] flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Reminder Items List */}
      <div className="space-y-3 flex-1 flex flex-col justify-around">
        {reminderItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.012, x: 2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleItemClick(item.id)}
              className="p-3 rounded-2xl bg-[#F7F9FC] hover:bg-slate-100/80 border border-[#E2E8F0]/80 flex items-center justify-between gap-3 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon Container */}
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} border ${item.badgeColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Title & Expiry Subtitle */}
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-medium text-[#64748B] mt-0.5 truncate">
                    {item.due}
                  </p>
                </div>
              </div>

              {/* Chevron Arrow */}
              <div className="text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

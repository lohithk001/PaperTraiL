import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2
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
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-500',
      badgeColor: 'border-rose-100',
    },
    {
      id: 'rem-2',
      title: 'Laptop Warranty Expiry',
      due: 'in 45 days • Dec 18, 2026',
      icon: ShieldCheck,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      badgeColor: 'border-blue-100',
    },
    {
      id: 'rem-3',
      title: 'Credit Card Bill',
      due: 'in 1 month • Dec 25, 2026',
      icon: CreditCard,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500',
      badgeColor: 'border-purple-100',
    },
  ];

  const handleItemClick = (id: string) => {
    toggleReminder(id);
    triggerConfetti();
  };

  return (
    <div className="w-full h-full rounded-[32px] bg-white p-6 sm:p-7 border border-[#E9EEF5] shadow-[0_10px_30px_rgba(20,40,90,0.03)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Upcoming Reminders
        </h2>
        <button
          onClick={() => setActiveTab('reminders')}
          className="text-xs font-bold text-[#0861E8] hover:text-[#064ec0] flex items-center gap-1 group transition-colors"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Reminder Items List */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-around">
        {reminderItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleItemClick(item.id)}
              className="p-3.5 rounded-2xl bg-neutral-50/60 hover:bg-neutral-50 border border-slate-100/90 flex items-center justify-between gap-3.5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Icon Container */}
                <div className={`w-11 h-11 rounded-2xl ${item.bgColor} ${item.textColor} border ${item.badgeColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Title & Expiry Subtitle */}
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 group-hover:text-[#0861E8] transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5 truncate">
                    {item.due}
                  </p>
                </div>
              </div>

              {/* Chevron Arrow */}
              <div className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

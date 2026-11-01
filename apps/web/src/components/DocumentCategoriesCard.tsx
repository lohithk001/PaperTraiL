import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  GraduationCap, 
  Wallet, 
  Heart, 
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const DocumentCategoriesCard: React.FC = () => {
  const { setActiveTab, setSelectedCategory } = useDocumentContext();

  const categories = [
    {
      id: 'Identity',
      name: 'ID',
      count: 4,
      icon: CreditCard,
      cardBg: 'bg-[#F0F5FF]',
      iconColor: 'text-[#0861E8]',
      badgeBg: 'bg-white/80',
    },
    {
      id: 'Education',
      name: 'Education',
      count: 5,
      icon: GraduationCap,
      cardBg: 'bg-[#F0FDF4]',
      iconColor: 'text-[#16A34A]',
      badgeBg: 'bg-white/80',
    },
    {
      id: 'Finance',
      name: 'Finance',
      count: 6,
      icon: Wallet,
      cardBg: 'bg-[#FFFBEB]',
      iconColor: 'text-[#D97706]',
      badgeBg: 'bg-white/80',
    },
    {
      id: 'Medical',
      name: 'Medical',
      count: 3,
      icon: Heart,
      cardBg: 'bg-[#FAF5FF]',
      iconColor: 'text-[#9333EA]',
      badgeBg: 'bg-white/80',
    },
    {
      id: 'All',
      name: 'Others',
      count: 6,
      icon: MoreHorizontal,
      cardBg: 'bg-[#F8FAFC]',
      iconColor: 'text-[#64748B]',
      badgeBg: 'bg-white/80',
    },
  ];

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('documents');
  };

  return (
    <div className="w-full h-full rounded-[32px] bg-white p-6 sm:p-7 border border-[#E9EEF5] shadow-[0_10px_30px_rgba(20,40,90,0.03)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Your Document Categories
        </h2>
        <button
          onClick={() => setActiveTab('documents')}
          className="text-xs font-bold text-[#0861E8] hover:text-[#064ec0] flex items-center gap-1 group transition-colors"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 5 Category Cards in Responsive Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 flex-1">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCategorySelect(cat.id)}
              className={`${cat.cardBg} rounded-2.5xl p-4 flex flex-col items-center justify-center text-center cursor-pointer border border-black/5 hover:shadow-md transition-all group`}
            >
              {/* Category Icon */}
              <div className={`w-11 h-11 rounded-2xl bg-white shadow-xs flex items-center justify-center ${cat.iconColor} mb-2.5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Title & Count */}
              <p className="text-[13px] font-bold text-slate-800 tracking-tight">
                {cat.name}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                ({cat.count})
              </p>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

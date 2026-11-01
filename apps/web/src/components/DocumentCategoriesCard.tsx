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
      cardBg: 'bg-[#EAF1FF]',
      iconColor: 'text-[#1D5FF0]',
    },
    {
      id: 'Education',
      name: 'Education',
      count: 5,
      icon: GraduationCap,
      cardBg: 'bg-[#F0EAFE]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'Finance',
      name: 'Finance',
      count: 6,
      icon: Wallet,
      cardBg: 'bg-[#E8F6EF]',
      iconColor: 'text-[#27A879]',
    },
    {
      id: 'Medical',
      name: 'Medical',
      count: 3,
      icon: Heart,
      cardBg: 'bg-[#FCECF3]',
      iconColor: 'text-[#E11D48]',
    },
    {
      id: 'All',
      name: 'Others',
      count: 6,
      icon: MoreHorizontal,
      cardBg: 'bg-[#F0F2F6]',
      iconColor: 'text-[#64748B]',
    },
  ];

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('documents');
  };

  return (
    <div className="w-full h-full rounded-[28px] bg-white p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
          Your Document Categories
        </h2>
        <button
          onClick={() => setActiveTab('folders')}
          className="text-xs font-semibold text-[#1D5FF0] hover:text-[#0752D9] flex items-center gap-1 group transition-colors cursor-pointer"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Categories in Horizontal Scroll / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCategorySelect(cat.id)}
              className={`${cat.cardBg} rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer border border-black/5 hover:shadow-subtle transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center ${cat.iconColor} mb-2 shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] leading-tight">
                {cat.name}
              </span>
              <span className="text-[11px] font-medium text-[#64748B] mt-0.5">
                ({cat.count})
              </span>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { useDocumentContext } from '../context/DocumentContext';
import { FilterType } from '../types';

export const FilterChips: React.FC = () => {
  const { filter, setFilter, counts } = useDocumentContext();

  const filterOptions: Array<{ id: FilterType; label: string; count: number }> = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'recent', label: "Recent", count: counts.recent },
    { id: 'expiring', label: 'Expiring soon', count: counts.expiring },
  ];

  return (
    <div className="px-6 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max">
        {filterOptions.map((item) => {
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`relative px-4 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 flex items-center gap-1.5 active:scale-95 select-none ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-charcoal-700 hover:text-charcoal-900 border border-charcoal-200/60 shadow-xs'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[12px] font-bold ${
                  isActive ? 'text-white/90' : 'text-charcoal-400'
                }`}
              >
                {item.count}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeFilterIndicator"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

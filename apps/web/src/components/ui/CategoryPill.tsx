import React from 'react';
import { 
  FileText, Shield, GraduationCap, CreditCard, Heart, Wrench, Car, Receipt
} from 'lucide-react';
import { getCategoryColor } from '../../lib/tokens';
import { cn } from '../../lib/utils';

export interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function getCategoryIcon(category: string) {
  switch (category) {
    case 'Identity':    return Shield;
    case 'Education':   return GraduationCap;
    case 'Finance':     return CreditCard;
    case 'Insurance':   return Shield;
    case 'Medical':     return Heart;
    case 'Warranty':    return Wrench;
    case 'Vehicle':     return Car;
    case 'Bills and receipts': return Receipt;
    default:            return FileText;
  }
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 'md', className }) => {
  const colors = getCategoryColor(category);
  const Icon = getCategoryIcon(category);

  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
    lg: { container: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6' },
  };

  const { container, icon: iconSize } = sizeMap[size];

  return (
    <div
      className={cn('flex items-center justify-center shrink-0', container, className)}
      style={{ backgroundColor: colors.bg }}
    >
      <Icon className={iconSize} style={{ color: colors.icon }} strokeWidth={1.75} />
    </div>
  );
};

export interface CategoryPillProps {
  category: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  active = false,
  onClick,
  size = 'md',
}) => {
  const colors = getCategoryColor(category);

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all cursor-pointer border',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs',
        active
          ? 'bg-[#1D5FF0] text-white border-[#1D5FF0] shadow-sm'
          : 'bg-white text-[#6B6E66] border-[#E6E6E0] hover:border-[#CFCFC8] hover:text-[#20211F]',
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: active ? 'white' : colors.accent }}
      />
      {category}
    </button>
  );
};

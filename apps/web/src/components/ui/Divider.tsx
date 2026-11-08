import React from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className }) => {
  if (!label) {
    return <div className={cn('h-px bg-[#E6E6E0]', className)} />;
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-px bg-[#E6E6E0]" />
      <span className="text-xs text-[#9B9E96] font-medium">{label}</span>
      <div className="flex-1 h-px bg-[#E6E6E0]" />
    </div>
  );
};

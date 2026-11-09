import React from 'react';
import { cn } from '../../lib/utils';

export interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
  count?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  className,
  count,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-[#20211F]">{title}</h2>
        {count !== undefined && (
          <span className="text-xs text-[#646860] bg-[#F0F0EA] px-1.5 py-0.5 rounded-md font-medium">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
};

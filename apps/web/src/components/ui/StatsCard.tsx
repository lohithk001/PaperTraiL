import React from 'react';
import { cn } from '../../lib/utils';

export interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: string;
  onClick?: () => void;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  sub,
  icon,
  accent,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-[#E6E6E0] rounded-2xl p-4 flex flex-col gap-3',
        onClick && 'cursor-pointer hover:border-[#CFCFC8] hover:shadow-sm transition-all',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#9B9E96]">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent ? `${accent}18` : '#F0F0EA' }}>
            <span style={{ color: accent || '#9B9E96' }}>{icon}</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#20211F] tracking-tight">{value}</div>
        {sub && <div className="text-xs text-[#9B9E96] mt-0.5">{sub}</div>}
      </div>
    </div>
  );
};

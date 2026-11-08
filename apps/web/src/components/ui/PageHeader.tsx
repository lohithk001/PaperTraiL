import React from 'react';
import { cn } from '../../lib/utils';

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  back?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
  back,
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {back}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#20211F] tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#9B9E96] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};

export { SectionHeader } from './SectionHeader';
export { Divider } from './Divider';

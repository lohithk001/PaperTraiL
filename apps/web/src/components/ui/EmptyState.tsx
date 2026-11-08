import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center text-center',
        compact ? 'py-8 px-4 gap-3' : 'py-16 px-6 gap-4',
        className,
      )}
    >
      <div className={cn(
        'flex items-center justify-center rounded-2xl bg-[#F0F0EA] text-[#9B9E96]',
        compact ? 'w-12 h-12' : 'w-16 h-16',
      )}>
        {icon}
      </div>

      <div className="max-w-xs space-y-1">
        <h3 className={cn(
          'font-semibold text-[#20211F]',
          compact ? 'text-sm' : 'text-base',
        )}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#9B9E96] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-1">
          {action}
        </div>
      )}
    </motion.div>
  );
};

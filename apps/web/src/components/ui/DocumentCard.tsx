import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Shield, GraduationCap, CreditCard, Heart, Wrench, Car, Receipt, Folder
} from 'lucide-react';
import { getCategoryColor } from '../../lib/tokens';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';
import { CategoryIcon } from './CategoryPill';
import { type DocumentItem } from '../../types';

export { CategoryIcon, CategoryPill } from './CategoryPill';
export { StatsCard } from './StatsCard';
export { ProgressBar } from './ProgressBar';
export { Avatar } from './Avatar';
export { ReminderCard } from './ReminderCard';

// ─── DOCUMENT CARD ────────────────────────────────────────────────────────────

interface DocumentCardProps {
  doc: DocumentItem;
  onClick?: () => void;
  onAction?: (e: React.MouseEvent) => void;
  compact?: boolean;
  selected?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onClick,
  onAction,
  compact = false,
  selected = false,
}) => {
  const colors = getCategoryColor(doc.category);

  const expiringSoon = doc.isExpiringSoon;
  const daysLabel = doc.daysLeft !== null
    ? doc.daysLeft === 0 ? 'Expired' : `${doc.daysLeft}d`
    : null;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'group bg-white border rounded-2xl p-4 cursor-pointer transition-all',
        selected ? 'border-[#1D5FF0] ring-1 ring-[#1D5FF0]/20' : 'border-[#E6E6E0] hover:border-[#CFCFC8] hover:shadow-sm',
      )}
    >
      <div className={cn('flex gap-3', compact ? 'items-center' : 'items-start')}>
        {/* Category Icon */}
        <CategoryIcon category={doc.category} size={compact ? 'sm' : 'md'} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className={cn(
                'font-semibold text-[#20211F] truncate',
                compact ? 'text-sm' : 'text-sm',
              )}>
                {doc.title}
              </h3>
              <p className="text-xs text-[#9B9E96] mt-0.5 truncate">
                {doc.issuer || doc.category}
                {doc.issueDate && ` • ${doc.issueDate}`}
              </p>
            </div>

            {/* Action button */}
            {onAction && (
              <button
                onClick={onAction}
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#9B9E96] hover:text-[#20211F] hover:bg-[#F0F0EA] transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Document actions"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-md border"
                style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
              >
                {doc.category}
              </span>

              {expiringSoon && daysLabel && (
                <Badge variant={daysLabel === 'Expired' ? 'danger' : 'warning'} dot>
                  {daysLabel === 'Expired' ? 'Expired' : `Expires in ${daysLabel}`}
                </Badge>
              )}

              {doc.isFavorite && (
                <span className="text-xs text-[#9B9E96]">★ Starred</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* File info row */}
      {!compact && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0F0EA]">
          <span className="text-xs font-mono font-medium text-[#9B9E96] uppercase">
            {doc.fileType}
          </span>
          <span className="text-[#E6E6E0]">·</span>
          <span className="text-xs text-[#9B9E96]">
            {doc.fileSize || '—'}
          </span>
        </div>
      )}
    </motion.div>
  );
};


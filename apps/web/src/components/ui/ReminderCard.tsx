import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

export interface ReminderCardProps {
  title: string;
  documentTitle: string;
  dueDate: string;
  daysLeft: number;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  documentTitle,
  dueDate,
  daysLeft,
  isCompleted,
  onToggle,
  onDelete,
}) => {
  const urgency = daysLeft < 0 ? 'danger' : daysLeft < 15 ? 'warning' : 'default';

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-2xl border transition-all',
      isCompleted ? 'bg-[#F6F6F2] border-[#E6E6E0] opacity-60' : 'bg-white border-[#E6E6E0]',
      urgency === 'danger' && !isCompleted && 'border-[#FECACA] bg-[#FFF5F5]',
      urgency === 'warning' && !isCompleted && 'border-[#FDE68A] bg-[#FFFBEB]',
    )}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer',
          isCompleted ? 'bg-[#16A34A] border-[#16A34A]' : 'border-[#CFCFC8] hover:border-[#1D5FF0]',
        )}
      >
        {isCompleted && (
          <svg width="10" height="8" fill="none" viewBox="0 0 10 8">
            <path d="M1 4L3.5 7L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-[#20211F]', isCompleted && 'line-through text-[#646860]')}>
          {title}
        </p>
        <p className="text-xs text-[#646860] mt-0.5 truncate">{documentTitle}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-[#646860]">{dueDate}</span>
          {!isCompleted && (
            <Badge variant={urgency === 'danger' ? 'danger' : urgency === 'warning' ? 'warning' : 'default'} size="sm">
              {daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`}
            </Badge>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#646860] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-all cursor-pointer shrink-0"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

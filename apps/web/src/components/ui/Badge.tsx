import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:  'bg-[#F0F0EA] text-[#6B6E66] border-[#E6E6E0]',
  primary:  'bg-[#E5EDFF] text-[#1D5FF0] border-[#C7D9FB]',
  success:  'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
  warning:  'bg-[#FEF3C7] text-[#854D0E] border-[#FDE68A]',
  danger:   'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
  info:     'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
  neutral:  'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
};

const badgeSizes = {
  sm: 'text-xs px-1.5 py-0.5 rounded-md',
  md: 'text-xs px-2 py-1 rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold border',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      )}
      {children}
    </span>
  );
};

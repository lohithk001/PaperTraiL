import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ─── BUTTON ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[#1D5FF0] text-white hover:bg-[#174FCB] active:bg-[#1348AA] shadow-sm shadow-[#1D5FF0]/20',
  secondary: 'bg-[#F0F0EA] text-[#20211F] hover:bg-[#E6E6E0] active:bg-[#DEDED7]',
  ghost:     'bg-transparent text-[#6B6E66] hover:bg-[#F0F0EA] hover:text-[#20211F] active:bg-[#E6E6E0]',
  danger:    'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-sm shadow-red-200',
  outline:   'bg-transparent border border-[#E6E6E0] text-[#20211F] hover:bg-[#F6F6F2] hover:border-[#CFCFC8]',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-lg gap-1.5',
  sm: 'h-8 px-3 text-xs rounded-xl gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-sm rounded-2xl gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5FF0]/40 focus-visible:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </button>
  );
});

Button.displayName = 'Button';

// ─── ICON BUTTON ──────────────────────────────────────────────────────────────

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  variant = 'ghost',
  size = 'md',
  label,
  className,
  children,
  ...props
}, ref) => {
  const iconSizeMap: Record<ButtonSize, string> = {
    xs: 'h-7 w-7 rounded-lg',
    sm: 'h-8 w-8 rounded-xl',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  };

  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center transition-all cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5FF0]/40',
        variantClasses[variant],
        iconSizeMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

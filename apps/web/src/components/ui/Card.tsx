import React from 'react';
import { cn } from '../../lib/utils';

// ─── CARD ──────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'flat';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default:  'bg-white border border-[#E6E6E0]',
  elevated: 'bg-white border border-[#E6E6E0] shadow-sm',
  outline:  'bg-transparent border border-[#E6E6E0]',
  flat:     'bg-[#F6F6F2]',
};

const cardPadding = {
  none: '',
  sm:   'p-3',
  md:   'p-4 sm:p-5',
  lg:   'p-5 sm:p-6',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  interactive = false,
  padding = 'md',
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl',
        cardVariants[variant],
        cardPadding[padding],
        interactive && 'cursor-pointer transition-all hover:border-[#CFCFC8] hover:shadow-md active:scale-[0.995]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// ─── CARD HEADER / CONTENT / FOOTER ──────────────────────────────────────────

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className, children, ...props
}) => (
  <div className={cn('flex items-start justify-between gap-3 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className, children, ...props
}) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className, children, ...props
}) => (
  <div className={cn('flex items-center gap-2 mt-4 pt-4 border-t border-[#E6E6E0]', className)} {...props}>
    {children}
  </div>
);

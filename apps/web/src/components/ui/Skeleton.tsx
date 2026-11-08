import React from 'react';
import { cn } from '../../lib/utils';

// ─── SKELETON ─────────────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#EBEBEB] rounded-xl',
        variant === 'circle' && 'rounded-full',
        variant === 'line' && 'rounded-md h-4',
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
};

// ─── SKELETON DOCUMENT CARD ───────────────────────────────────────────────────

export const DocumentCardSkeleton: React.FC = () => (
  <div className="bg-white border border-[#E6E6E0] rounded-2xl p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton width={40} height={40} variant="rect" className="rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton height={14} className="w-3/4" />
        <Skeleton height={12} className="w-1/2" />
      </div>
    </div>
    <Skeleton height={12} className="w-full" />
    <div className="flex items-center gap-2">
      <Skeleton height={22} width={64} className="rounded-lg" />
      <Skeleton height={22} width={80} className="rounded-lg" />
    </div>
  </div>
);

// ─── SKELETON PAGE ────────────────────────────────────────────────────────────

export const PageSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton height={28} width={200} />
        <Skeleton height={16} width={280} />
      </div>
      <Skeleton height={40} width={140} className="rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

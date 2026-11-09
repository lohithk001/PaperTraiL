import React from 'react';
import { cn } from '../../lib/utils';

// ─── INPUT ────────────────────────────────────────────────────────────────────

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  prefix,
  suffix,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#20211F]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-[#646860] pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 bg-white border rounded-xl text-sm text-[#20211F] placeholder:text-[#646860]',
            'border-[#E6E6E0] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15',
            'transition-all disabled:opacity-50 disabled:bg-[#F6F6F2] disabled:cursor-not-allowed',
            prefix ? 'pl-9' : 'pl-3.5',
            suffix ? 'pr-9' : 'pr-3.5',
            error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15',
            className,
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 text-[#646860]">
            {suffix}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-[#646860]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[#DC2626]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  hint,
  error,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? `ta-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#20211F]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-white border rounded-xl text-sm text-[#20211F] placeholder:text-[#646860] p-3',
          'border-[#E6E6E0] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15',
          'transition-all resize-none disabled:opacity-50 disabled:bg-[#F6F6F2]',
          error && 'border-[#DC2626] focus:border-[#DC2626]',
          className,
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[#646860]">{hint}</p>}
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ─── SELECT ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  className,
  id,
  children,
  ...props
}, ref) => {
  const inputId = id ?? `select-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#20211F]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'w-full h-10 bg-white border rounded-xl text-sm text-[#20211F] px-3',
          'border-[#E6E6E0] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15',
          'transition-all appearance-none cursor-pointer',
          error && 'border-[#DC2626]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

// ─── TOGGLE / SWITCH ──────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const trackSize = size === 'sm' ? 'w-8 h-4.5' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'w-3 h-3 translate-x-0.5' : 'w-4 h-4 translate-x-0.5';
  const thumbOn = size === 'sm' ? 'translate-x-4' : 'translate-x-5.5';

  return (
    <label className={cn('flex items-center gap-3', !disabled && 'cursor-pointer')}>
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative flex-shrink-0 rounded-full transition-colors duration-200',
          trackSize,
          checked ? 'bg-[#1D5FF0]' : 'bg-[#CFCFC8]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-sm transition-transform duration-200',
            thumbSize,
            checked ? thumbOn : '',
          )}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col min-w-0">
          {label && <span className="text-sm font-medium text-[#20211F]">{label}</span>}
          {description && <span className="text-xs text-[#646860]">{description}</span>}
        </div>
      )}
    </label>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './Button';

// ─── DIALOG ───────────────────────────────────────────────────────────────────

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const dialogSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
            className={cn(
              'fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto',
              'bg-white rounded-2xl shadow-2xl border border-[#E6E6E0]',
              'flex flex-col max-h-[90vh]',
              dialogSizes[size],
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b border-[#E6E6E0]">
                <div>
                  {title && (
                    <h2 className="text-base font-semibold text-[#20211F]">{title}</h2>
                  )}
                  {description && (
                    <p className="text-sm text-[#6B6E66] mt-0.5">{description}</p>
                  )}
                </div>
                <IconButton
                  label="Close dialog"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-5 pt-4 border-t border-[#E6E6E0]">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── DRAWER (mobile bottom sheet) ─────────────────────────────────────────────

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="drawer-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full bg-[#CFCFC8]" />
            </div>

            {title && (
              <div className="px-5 py-3 border-b border-[#E6E6E0] shrink-0 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#20211F]">{title}</h2>
                <IconButton label="Close" variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </IconButton>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>

            {footer && (
              <div className="p-5 pt-0 safe-bottom shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
          />
          <motion.div
            key="cd-panel"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E6E6E0] p-5"
          >
            <h2 className="text-base font-semibold text-[#20211F] mb-1.5">{title}</h2>
            {description && (
              <p className="text-sm text-[#6B6E66] mb-5">{description}</p>
            )}
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={onClose}
                disabled={loading}
                className="h-9 px-4 rounded-xl text-sm font-medium text-[#6B6E66] hover:bg-[#F0F0EA] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'h-9 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5',
                  variant === 'danger' ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-[#1D5FF0] hover:bg-[#174FCB]',
                )}
              >
                {loading && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

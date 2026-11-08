import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let toastList: ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

function emit() {
  listeners.forEach((l) => l([...toastList]));
}

export interface ToastOptions {
  type?: ToastType;
  description?: string;
  duration?: number;
}

export const toast = (title: string, options?: ToastOptions) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const item: ToastItem = {
    id,
    title,
    type: options?.type || 'info',
    description: options?.description,
    duration: options?.duration !== undefined ? options.duration : 3500,
  };
  toastList = [...toastList, item];
  emit();

  if (item.duration && item.duration > 0) {
    setTimeout(() => {
      toast.dismiss(id);
    }, item.duration);
  }
  return id;
};

toast.success = (title: string, description?: string) => toast(title, { type: 'success', description });
toast.error = (title: string, description?: string) => toast(title, { type: 'error', description });
toast.info = (title: string, description?: string) => toast(title, { type: 'info', description });
toast.warning = (title: string, description?: string) => toast(title, { type: 'warning', description });

toast.dismiss = (id: string) => {
  toastList = toastList.filter((t) => t.id !== id);
  emit();
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>(toastList);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return (
    <div 
      aria-live="polite"
      className="fixed top-4 inset-x-0 z-[9999] flex flex-col items-center pointer-events-none px-4 space-y-2"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const iconMap = {
            success: <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />,
            info: <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />,
          };

          const borderMap = {
            success: 'border-[#10B981]/30',
            error: 'border-[#EF4444]/30',
            warning: 'border-[#F59E0B]/30',
            info: 'border-[#38BDF8]/30',
          };

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.94 }}
              transition={{ type: 'spring', damping: 24, stiffness: 380 }}
              className={`pointer-events-auto w-full max-w-sm sm:max-w-md bg-[#080E1E]/95 text-white backdrop-blur-md border ${borderMap[t.type]} shadow-2xl rounded-2xl p-3.5 flex items-start gap-3`}
            >
              {iconMap[t.type]}
              
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-bold text-white tracking-tight leading-snug">
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="w-5 h-5 rounded-md flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

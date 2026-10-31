import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const NotificationsModal: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    markAllNotificationsRead,
    markNotificationRead 
  } = useDocumentContext();

  if (!isNotificationsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-md bg-[#F7F7F7] rounded-t-[36px] sm:rounded-[36px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-charcoal-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-charcoal-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bell className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-charcoal-900 tracking-tight">
                Notifications
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-charcoal-700 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of notifications */}
          <div className="p-5 overflow-y-auto space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2.5xl transition-all cursor-pointer border ${
                  n.isRead
                    ? 'bg-white border-charcoal-200/60 text-charcoal-600'
                    : 'bg-white border-primary/40 shadow-xs ring-1 ring-primary/20 text-charcoal-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'alert'
                        ? 'bg-rose-100 text-rose-600'
                        : n.type === 'success'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-blue-100 text-primary'
                    }`}
                  >
                    {n.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{n.title}</h4>
                      <span className="text-[10px] text-charcoal-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 font-medium mt-1 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-200 text-charcoal-500 text-xs">
                No notifications right now.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

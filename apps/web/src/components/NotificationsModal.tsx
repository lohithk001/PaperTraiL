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
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs select-none"
        onClick={() => setIsNotificationsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#F6F6F2] rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#E6E6E0]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-white border-b border-[#E6E6E0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E5EDFF] text-[#1D5FF0] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#20211F]">
                Notifications
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="text-xs font-semibold text-[#1D5FF0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg text-[#9B9E96] hover:text-[#20211F] hover:bg-[#F0F0EA] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of notifications */}
          <div className="p-4 overflow-y-auto space-y-2 max-h-[60vh]">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-xl transition-all cursor-pointer border ${
                  n.isRead
                    ? 'bg-white border-[#E6E6E0] text-[#6B6E66]'
                    : 'bg-white border-[#1D5FF0]/40 shadow-xs ring-1 ring-[#1D5FF0]/20 text-[#20211F]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'alert'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : n.type === 'success'
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : 'bg-[#E5EDFF] text-[#1D5FF0]'
                    }`}
                  >
                    {n.type === 'alert' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : n.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold truncate">{n.title}</h4>
                      <span className="text-[10px] text-[#9B9E96] font-medium shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6E66] mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-[#9B9E96] mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium text-[#6B6E66]">No notifications</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ShieldAlert,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';

export const RemindersScreen: React.FC = () => {
  const { 
    reminders, 
    toggleReminder, 
    deleteReminder, 
    addReminder,
    documents,
    setSelectedDocument,
    deviceViewMode 
  } = useDocumentContext();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleReminder(id);
    if (!currentlyCompleted) {
      triggerConfetti();
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const doc = documents.find((d) => d.id === selectedDocId) || documents[0];
    const due = newDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const diffDays = Math.max(1, Math.ceil((new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    addReminder({
      documentId: doc ? doc.id : 'custom',
      documentTitle: doc ? doc.title : 'Custom Document',
      title: newTitle,
      dueDate: due,
      daysLeft: diffDays,
      urgency: diffDays < 15 ? 'critical' : diffDays < 45 ? 'warning' : 'normal',
      isCompleted: false,
      category: doc ? doc.category : 'Insurance',
    });

    setNewTitle('');
    setNewDueDate('');
    setIsAdding(false);
  };

  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  const urgentReminders = pendingReminders.filter((r) => r.daysLeft <= 15);
  const upcomingReminders = pendingReminders.filter((r) => r.daysLeft > 15 && r.daysLeft <= 45);
  const futureReminders = pendingReminders.filter((r) => r.daysLeft > 45);

  return (
    <div className={`w-full ${deviceViewMode === 'mobile' ? 'px-6 pt-5 pb-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
              Automated Alerts
            </span>
            <span className="text-xs font-semibold text-charcoal-500">
              {pendingReminders.length} pending renewals
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Renewals & Expirations
          </h1>
          <p className="text-xs sm:text-sm font-medium text-charcoal-500 mt-0.5">
            Auto-synced with document expiry dates. Email and push notifications configured.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-primary/25 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isAdding ? 'Cancel' : 'New Reminder'}</span>
        </button>
      </div>

      {/* Quick Add Form Drawer */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="mb-8 p-5 sm:p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-md space-y-4"
          >
            <h3 className="text-sm font-bold text-charcoal-900">Create Renewal Alert</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Renew Vehicle Insurance Policy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Linked Document
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Due Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-charcoal-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs"
              >
                Schedule Alert
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Desktop 3-Column Urgency Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Column 1: Critical Urgency (< 15 Days) */}
        <div className="p-5 rounded-3xl bg-white border border-rose-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
                Urgent Action (&lt; 15d)
              </h2>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {urgentReminders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {urgentReminders.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic py-6 text-center">
                No critical expirations due soon.
              </p>
            ) : (
              urgentReminders.map((r) => (
                <div 
                  key={r.id}
                  className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 flex items-start gap-3 hover:bg-rose-50 transition-colors"
                >
                  <button
                    onClick={() => handleToggle(r.id, r.isCompleted)}
                    className="mt-0.5 text-charcoal-400 hover:text-emerald-600 transition-colors shrink-0"
                    title="Mark completed"
                  >
                    <Circle className="w-5 h-5 stroke-[2]" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[11px] font-medium text-charcoal-500 truncate mt-0.5">
                      {r.documentTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                        {r.daysLeft} days left
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-medium">
                        Due {r.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Approaching (15 - 45 Days) */}
        <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
                Approaching (15 - 45d)
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {upcomingReminders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingReminders.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic py-6 text-center">
                No approaching renewals in this window.
              </p>
            ) : (
              upcomingReminders.map((r) => (
                <div 
                  key={r.id}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex items-start gap-3 hover:bg-amber-50 transition-colors"
                >
                  <button
                    onClick={() => handleToggle(r.id, r.isCompleted)}
                    className="mt-0.5 text-charcoal-400 hover:text-emerald-600 transition-colors shrink-0"
                    title="Mark completed"
                  >
                    <Circle className="w-5 h-5 stroke-[2]" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[11px] font-medium text-charcoal-500 truncate mt-0.5">
                      {r.documentTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                        {r.daysLeft} days left
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-medium">
                        Due {r.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Future & Healthy (> 45 Days) */}
        <div className="p-5 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
                Future / Healthy (&gt; 45d)
              </h2>
            </div>
            <span className="text-xs font-bold text-charcoal-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              {futureReminders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {futureReminders.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic py-6 text-center">
                All reminders fall into shorter windows.
              </p>
            ) : (
              futureReminders.map((r) => (
                <div 
                  key={r.id}
                  className="p-4 rounded-2xl bg-neutral-50/70 border border-charcoal-200/60 flex items-start gap-3 hover:bg-neutral-100/70 transition-colors"
                >
                  <button
                    onClick={() => handleToggle(r.id, r.isCompleted)}
                    className="mt-0.5 text-charcoal-400 hover:text-emerald-600 transition-colors shrink-0"
                    title="Mark completed"
                  >
                    <Circle className="w-5 h-5 stroke-[2]" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[11px] font-medium text-charcoal-500 truncate mt-0.5">
                      {r.documentTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-charcoal-600 bg-white px-2 py-0.5 rounded border border-charcoal-200">
                        {r.daysLeft} days left
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-medium">
                        Due {r.dueDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Completed Renewals Section */}
      {completedReminders.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-xs">
          <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed Renewals ({completedReminders.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedReminders.map((r) => (
              <div 
                key={r.id}
                className="p-3.5 rounded-2xl bg-neutral-50/70 border border-charcoal-200/60 flex items-center justify-between gap-3 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => handleToggle(r.id, r.isCompleted)}
                    className="text-emerald-600 shrink-0"
                    title="Mark active again"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                  </button>
                  <p className="text-xs font-semibold text-charcoal-700 line-through truncate">
                    {r.title}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

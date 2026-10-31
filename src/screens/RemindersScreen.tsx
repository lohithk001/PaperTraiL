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
  ChevronRight
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
    setSelectedDocument 
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

  return (
    <div className="w-full px-6 pt-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Expiration Alerts
          </h2>
          <p className="text-xs font-semibold text-charcoal-500 mt-0.5">
            Never miss a renewal deadline or warranty lapse
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 rounded-full bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Alert</span>
        </button>
      </div>

      {/* Add Reminder Card Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="p-4 rounded-3xl bg-white border border-charcoal-200 shadow-md mb-4 space-y-3 overflow-hidden"
          >
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
              Set New Expiration Reminder
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 mb-1">
                Reminder Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Renew auto insurance policy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 mb-1">
                  Linked Document
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 bg-white focus:outline-none focus:border-primary"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 bg-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-charcoal-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover active:scale-95"
              >
                Create Alert
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Pending Reminders */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-charcoal-500 px-1">
          <span>UPCOMING RENEWALS ({pendingReminders.length})</span>
        </div>

        {pendingReminders.map((rem) => {
          const isCritical = rem.urgency === 'critical';
          const isWarning = rem.urgency === 'warning';

          return (
            <motion.div
              key={rem.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-3xl bg-white border shadow-xs transition-all flex items-center justify-between ${
                isCritical
                  ? 'border-rose-200 hover:border-rose-300'
                  : isWarning
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-charcoal-200/80 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => handleToggle(rem.id, rem.isCompleted)}
                  className="text-charcoal-400 hover:text-emerald-500 active:scale-90 transition-transform"
                >
                  <Circle className="w-5 h-5 stroke-[2]" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {rem.daysLeft} DAYS LEFT
                    </span>
                    <span className="text-[11px] font-semibold text-charcoal-400">
                      {rem.dueDate}
                    </span>
                  </div>

                  <h3 className="text-[14.5px] font-bold text-charcoal-900 mt-1">
                    {rem.title}
                  </h3>

                  <button
                    onClick={() => {
                      const doc = documents.find((d) => d.id === rem.documentId);
                      if (doc) setSelectedDocument(doc);
                    }}
                    className="text-xs font-semibold text-primary flex items-center gap-1 mt-0.5 hover:underline"
                  >
                    <span>{rem.documentTitle}</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4 stroke-[1.8]" />
              </button>
            </motion.div>
          );
        })}

        {pendingReminders.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-200/80">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-charcoal-900">All renewals are up to date!</p>
            <p className="text-xs text-charcoal-500 mt-0.5">
              No pending expirations detected in your vault.
            </p>
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-charcoal-500 px-1">
            RESOLVED & RENEWED ({completedReminders.length})
          </div>

          {completedReminders.map((rem) => (
            <motion.div
              key={rem.id}
              layout
              className="p-3.5 rounded-2.5xl bg-neutral-100/70 border border-charcoal-200/60 flex items-center justify-between opacity-70"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(rem.id, rem.isCompleted)}
                  className="text-emerald-600 hover:text-charcoal-400 active:scale-90 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </button>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-700 line-through">
                    {rem.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-500">
                    Renewed • {rem.documentTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal-400 hover:text-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

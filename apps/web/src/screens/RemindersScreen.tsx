import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  ChevronRight, 
  Car, 
  Laptop, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2,
  AlertTriangle,
  Clock,
  X,
  Bell,
  CalendarCheck2
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';
import { ReminderItem } from '../types';

export const RemindersScreen: React.FC = () => {
  const { 
    reminders, 
    toggleReminder, 
    deleteReminder, 
    addReminder,
    documents
  } = useDocumentContext();

  const [activeTabType, setActiveTabType] = useState<'upcoming' | 'completed'>('upcoming');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');

  const upcomingList = reminders.filter(r => !r.isCompleted);
  const completedList = reminders.filter(r => r.isCompleted);
  const expiringSoonCount = upcomingList.filter(r => r.daysLeft <= 30).length;

  const displayedList = activeTabType === 'upcoming' ? upcomingList : completedList;

  const handleToggle = (id: string, currentlyDone: boolean) => {
    toggleReminder(id);
    if (!currentlyDone) {
      triggerConfetti();
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const doc = documents.find(d => d.id === selectedDocId) || documents[0];
    const due = newDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const diffDays = Math.max(1, Math.ceil((new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    addReminder({
      documentId: doc ? doc.id : 'custom',
      documentTitle: doc ? doc.title : 'Document',
      title: newTitle.trim(),
      dueDate: due,
      daysLeft: diffDays,
      urgency: diffDays < 15 ? 'critical' : diffDays < 45 ? 'warning' : 'normal',
      isCompleted: false,
      category: doc ? doc.category : 'Insurance',
    });

    setNewTitle('');
    setNewDueDate('');
    setIsAddOpen(false);
  };

  const getReminderIcon = (title: string, category: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('vehicle') || lower.includes('car') || category === 'Vehicle' || category === 'Insurance') {
      return {
        icon: <Car className="w-5 h-5 text-[#F5A623]" />,
        bg: 'bg-[#FFF2E6]',
      };
    }
    if (lower.includes('laptop') || lower.includes('warranty') || category === 'Warranty') {
      return {
        icon: <Laptop className="w-5 h-5 text-[#1D5FF0]" />,
        bg: 'bg-[#EAF1FF]',
      };
    }
    if (lower.includes('credit') || lower.includes('bill') || category === 'Finance') {
      return {
        icon: <CreditCard className="w-5 h-5 text-[#7C3AED]" />,
        bg: 'bg-[#F0EAFE]',
      };
    }
    return {
      icon: <Calendar className="w-5 h-5 text-[#1D5FF0]" />,
      bg: 'bg-[#EAF1FF]',
    };
  };

  return (
    <div className="w-full space-y-6 select-none pb-8">
      
      {/* 1. Header with Add Reminder Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
            Reminders & Lifecycle
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
            Track policy renewals, warranties, and official expirations.
          </p>
        </div>

        {/* Primary Add Reminder Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* 2. Three Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#64748B]">Expiring Soon</span>
            <p className="text-2xl font-black text-[#F5A623] mt-0.5">{expiringSoonCount}</p>
            <span className="text-[11px] text-[#64748B]">Next 30 days</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF2E6] flex items-center justify-center text-[#F5A623]">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#64748B]">Expired Items</span>
            <p className="text-2xl font-black text-[#64748B] mt-0.5">0</p>
            <span className="text-[11px] text-emerald-600 font-semibold">All up to date</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#64748B]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#64748B]">Completed</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{completedList.length}</p>
            <span className="text-[11px] text-[#64748B]">Successfully renewed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F6EF] flex items-center justify-center text-emerald-600">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <form
              onSubmit={handleCreate}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Add Document Reminder</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Reminder Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Car Insurance Policy Renewal"
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Linked Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] transition-colors cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Upcoming vs Completed Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-1 rounded-2xl bg-white border border-[#E2E8F0] shadow-subtle">
          <button
            onClick={() => setActiveTabType('upcoming')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabType === 'upcoming'
                ? 'bg-[#1D5FF0] text-white shadow-card'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Upcoming ({upcomingList.length})
          </button>
          <button
            onClick={() => setActiveTabType('completed')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabType === 'completed'
                ? 'bg-[#1D5FF0] text-white shadow-card'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Completed ({completedList.length})
          </button>
        </div>
      </div>

      {/* 4. Reminder List Rows */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-subtle divide-y divide-[#E2E8F0] overflow-hidden">
        {displayedList.map((rem, idx) => {
          const { icon, bg } = getReminderIcon(rem.title, rem.category);

          return (
            <motion.div
              key={rem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F7F9FC] transition-colors group"
            >
              {/* Left: Checkbox & Info */}
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => handleToggle(rem.id, rem.isCompleted)}
                  className="shrink-0 cursor-pointer"
                  title={rem.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {rem.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-[#1D5FF0] transition-colors" />
                  )}
                </button>

                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                  {icon}
                </div>

                <div className="min-w-0">
                  <h3 className={`text-sm sm:text-base font-bold text-[#0F172A] truncate ${rem.isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {rem.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#64748B]">
                    <span className="font-medium text-[#1D5FF0]">{rem.documentTitle}</span>
                    <span>•</span>
                    <span>Due: {rem.dueDate}</span>
                    <span>•</span>
                    <span className={rem.daysLeft <= 15 ? 'text-[#F04452] font-semibold' : 'text-[#F5A623] font-semibold'}>
                      {rem.daysLeft > 0 ? `in ${rem.daysLeft} days` : 'Due today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {displayedList.length === 0 && (
          <div className="text-center py-12 p-6">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#0F172A]">No {activeTabType} reminders</h4>
            <p className="text-xs text-[#64748B] mt-0.5">You're all caught up on document deadlines!</p>
          </div>
        )}
      </div>

    </div>
  );
};

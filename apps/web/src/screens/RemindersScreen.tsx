import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock, 
  X, 
  AlertTriangle,
  CalendarCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';
import { 
  PageHeader, 
  StatsCard, 
  Badge, 
  EmptyState, 
  Button, 
  CategoryIcon 
} from '../components/ui';

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

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* 1. Header */}
      <PageHeader
        title="Reminders & Lifecycle"
        subtitle="Automated alerts for expirations, policy renewals, and warranties"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            Add Reminder
          </Button>
        }
      />

      {/* 2. Three Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <StatsCard
          label="Expiring Soon"
          value={expiringSoonCount}
          sub="Within next 30 days"
          icon={<AlertTriangle className="w-4 h-4" />}
          accent="#F59E0B"
        />
        <StatsCard
          label="Pending Expirations"
          value={upcomingList.length}
          sub="Active alerts scheduled"
          icon={<Clock className="w-4 h-4" />}
          accent="#1D5FF0"
        />
        <StatsCard
          label="Completed"
          value={completedList.length}
          sub="Renewals addressed"
          icon={<CalendarCheck className="w-4 h-4" />}
          accent="#16A34A"
        />
      </div>

      {/* 3. Upcoming vs Completed Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-0.5 rounded-xl bg-white border border-[#E6E6E0] shadow-xs">
          <button
            onClick={() => setActiveTabType('upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTabType === 'upcoming'
                ? 'bg-[#20211F] text-white shadow-xs'
                : 'text-[#6B6E66] hover:text-[#20211F]'
            }`}
          >
            Upcoming ({upcomingList.length})
          </button>
          <button
            onClick={() => setActiveTabType('completed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTabType === 'completed'
                ? 'bg-[#20211F] text-white shadow-xs'
                : 'text-[#6B6E66] hover:text-[#20211F]'
            }`}
          >
            Completed ({completedList.length})
          </button>
        </div>
      </div>

      {/* 4. Reminder List */}
      <div className="bg-white rounded-2xl border border-[#E6E6E0] shadow-xs divide-y divide-[#E6E6E0] overflow-hidden">
        {displayedList.map((rem, idx) => {
          return (
            <motion.div
              key={rem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="p-4 sm:p-4.5 flex items-center justify-between gap-4 hover:bg-[#F6F6F2] transition-colors group"
            >
              {/* Left: Checkbox & Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggle(rem.id, rem.isCompleted)}
                  className="shrink-0 cursor-pointer"
                  title={rem.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {rem.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-[#DCFCE7]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#CFCFC8] hover:text-[#1D5FF0] transition-colors" />
                  )}
                </button>

                <CategoryIcon category={rem.category} size="sm" />

                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold text-[#20211F] truncate ${rem.isCompleted ? 'line-through text-[#646860]' : ''}`}>
                    {rem.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6B6E66]">
                    <span className="font-medium text-[#1D5FF0]">{rem.documentTitle}</span>
                    <span>•</span>
                    <span>Due: {rem.dueDate}</span>
                    <span>•</span>
                    <span className={rem.daysLeft <= 15 ? 'text-[#DC2626] font-semibold' : 'text-[#F59E0B] font-semibold'}>
                      {rem.daysLeft > 0 ? `in ${rem.daysLeft} days` : 'Due today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Badge & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={rem.isCompleted ? 'default' : rem.daysLeft <= 15 ? 'danger' : rem.daysLeft <= 45 ? 'warning' : 'default'}
                  size="sm"
                >
                  {rem.isCompleted ? 'Completed' : `${rem.daysLeft}d left`}
                </Badge>

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1.5 rounded-lg text-[#646860] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {displayedList.length === 0 && (
          <div className="py-12 p-6">
            <EmptyState
              compact
              icon={<Calendar className="w-6 h-6" />}
              title={`No ${activeTabType} reminders`}
              description={activeTabType === 'upcoming' ? "You're all caught up on document deadlines and renewals!" : 'No completed reminders yet.'}
            />
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleCreate}
              className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#20211F]">Add Document Reminder</h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-lg text-[#646860] hover:text-[#20211F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Reminder Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Car Insurance Policy Renewal"
                  className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Linked Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full mt-1.5 h-10 px-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Due Date</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Save Reminder
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

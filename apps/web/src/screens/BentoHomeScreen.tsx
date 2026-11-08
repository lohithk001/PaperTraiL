import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Scan, 
  Files, 
  HardDrive, 
  Clock, 
  Bell, 
  ChevronRight, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { 
  StatsCard, 
  DocumentCard, 
  EmptyState, 
  SectionHeader, 
  Button 
} from '../components/ui';

export const BentoHomeScreen: React.FC = () => {
  const { 
    documents, 
    reminders,
    storageStats,
    counts,
    userProfile,
    setActiveDocumentDetail, 
    setActiveTab, 
    setIsUploadModalOpen,
    setIsGlobalSearchOpen 
  } = useDocumentContext();

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocumentDetail(doc);
    setActiveTab('document-detail');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile?.name?.split(' ')[0] || '';
    if (hour < 12) return name ? `Good morning, ${name}` : 'Good morning';
    if (hour < 18) return name ? `Good afternoon, ${name}` : 'Good afternoon';
    return name ? `Good evening, ${name}` : 'Good evening';
  };

  const expiringDocs = documents.filter(d => d.isExpiringSoon || (d.daysLeft !== null && d.daysLeft <= 60));
  const recentDocs = documents.slice(0, 6);
  const activeRemindersCount = reminders.filter(r => !r.isCompleted).length;

  return (
    <div className="flex-1 flex flex-col gap-6 select-none max-w-5xl mx-auto">
      
      {/* Top Search Bar */}
      <div className="w-full">
        <button 
          onClick={() => setIsGlobalSearchOpen(true)}
          type="button"
          className="w-full max-w-md h-10 px-4 rounded-xl bg-white hover:bg-[#F0F0EA]/60 border border-[#E6E6E0] shadow-xs flex items-center justify-between text-xs text-[#6B6E66] cursor-pointer transition-all hover:border-[#CFCFC8]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#9B9E96]" />
            <span>Search documents, policies, vehicle papers...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[#F0F0EA] text-[#6B6E66] text-[11px] font-semibold border border-[#E6E6E0]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Greeting & Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#1D5FF0] uppercase tracking-wider">
            {getGreeting()}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20211F] tracking-tight mt-1">
            Store & protect your personal documents
          </h1>
          <p className="text-sm text-[#6B6E66] mt-1">
            Zero-knowledge encrypted. Automated expiration reminders and instant search.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Scan className="w-4 h-4" />}
            onClick={() => setActiveTab('scan')}
          >
            Scan
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Add Document
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatsCard
          label="Total Documents"
          value={documents.length}
          sub={documents.length === 1 ? '1 file in vault' : `${documents.length} files in vault`}
          icon={<Files className="w-4 h-4" />}
          accent="#1D5FF0"
          onClick={() => setActiveTab('documents')}
        />
        <StatsCard
          label="Vault Storage"
          value={storageStats.usedFormatted}
          sub={`${storageStats.percentUsed}% of ${storageStats.quotaFormatted}`}
          icon={<HardDrive className="w-4 h-4" />}
          accent="#8B5CF6"
          onClick={() => setActiveTab('storage')}
        />
        <StatsCard
          label="Expiring Soon"
          value={counts.expiring}
          sub={counts.expiring > 0 ? 'Requires attention' : 'All up to date'}
          icon={<Clock className="w-4 h-4" />}
          accent={counts.expiring > 0 ? '#DC2626' : '#16A34A'}
          onClick={() => setActiveTab('reminders')}
        />
        <StatsCard
          label="Active Reminders"
          value={activeRemindersCount}
          sub="Scheduled alerts"
          icon={<Bell className="w-4 h-4" />}
          accent="#F59E0B"
          onClick={() => setActiveTab('reminders')}
        />
      </div>

      {/* Main Content Area */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-6 shadow-xs my-2">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="Your personal vault is ready"
            description="Upload identity cards, insurance policies, academic certificates, vehicle RC, or warranties. PaperTrail secures them with zero-knowledge encryption and notifies you before renewals."
            action={
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Upload your first document
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Scan className="w-4 h-4" />}
                  onClick={() => setActiveTab('scan')}
                >
                  Scan with Camera
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Priority / Expiring Section (if any expiring) */}
          {expiringDocs.length > 0 && (
            <div className="space-y-3">
              <SectionHeader
                title="Priority Expirations & Action Required"
                count={expiringDocs.length}
                action={
                  <button
                    onClick={() => setActiveTab('reminders')}
                    className="text-xs font-semibold text-[#1D5FF0] hover:text-[#174FCB] flex items-center gap-0.5 cursor-pointer"
                  >
                    View reminders <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {expiringDocs.slice(0, 4).map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onClick={() => handleOpenDoc(doc)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Vault Documents */}
          <div className="space-y-3">
            <SectionHeader
              title="Recent Documents"
              count={documents.length}
              action={
                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-xs font-semibold text-[#20211F] hover:text-[#1D5FF0] flex items-center gap-1 cursor-pointer"
                >
                  <span>View all ({documents.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {recentDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onClick={() => handleOpenDoc(doc)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
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
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { 
  DocumentCard, 
  EmptyState, 
  SectionHeader, 
  Button,
  CategoryPill,
  Badge,
  ProgressBar
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
    setIsGlobalSearchOpen,
    toggleReminder
  } = useDocumentContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewDensity, setViewDensity] = useState<'grid' | 'list'>('grid');

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

  const expiringDocs = useMemo(() => 
    documents.filter(d => d.isExpiringSoon || (d.daysLeft !== null && d.daysLeft <= 60)),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    if (selectedCategory === 'All') return documents.slice(0, 6);
    return documents.filter(d => d.category === selectedCategory).slice(0, 6);
  }, [documents, selectedCategory]);

  const activeReminders = useMemo(() => 
    reminders.filter(r => !r.isCompleted).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3),
    [reminders]
  );

  const categories = ['All', 'Identity', 'Insurance', 'Vehicle', 'Education', 'Finance'];

  return (
    <div className="flex-1 flex flex-col gap-6 select-none max-w-5xl mx-auto">
      
      {/* 1. Header with Search & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input Trigger */}
        <button 
          onClick={() => setIsGlobalSearchOpen(true)}
          type="button"
          className="w-full max-w-md h-10 px-4 rounded-xl bg-white hover:bg-[#F0F0EA]/70 border border-[#E6E6E0] shadow-xs flex items-center justify-between text-xs text-[#545850] cursor-pointer transition-all hover:border-[#CFCFC8]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#646860]" />
            <span>Search documents, policies, vehicle papers...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[#F0F0EA] text-[#4A4E46] text-[11px] font-semibold border border-[#E6E6E0]">
            ⌘K
          </kbd>
        </button>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Scan className="w-4 h-4" />}
            onClick={() => setActiveTab('scan')}
          >
            Scan Document
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

      {/* 2. Vault Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-xs font-bold text-[#1D5FF0] uppercase tracking-wider">
              {getGreeting()} • Vault Secure
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E201D] tracking-tight mt-1">
            Personal Document Vault
          </h1>
          <p className="text-sm text-[#4A4E46] mt-0.5">
            Zero-knowledge encrypted documents with automated expiration and renewal tracking.
          </p>
        </div>
      </div>

      {/* 3. Priority Expiration Notice (Conditional Hero Banner) */}
      {expiringDocs.length > 0 && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#92400E]">
                  Attention Required
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold">
                  {expiringDocs.length} {expiringDocs.length === 1 ? 'document' : 'documents'}
                </span>
              </div>
              <p className="text-xs text-[#78350F] mt-0.5">
                "{expiringDocs[0]?.title}" expires in{' '}
                <span className="font-bold">{expiringDocs[0]?.daysLeft ?? 0} days</span>. Review renewal requirements.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reminders')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#FDE68A] text-xs font-bold text-[#92400E] hover:bg-[#FEF3C7] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
          >
            <span>View Expirations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Unified Vault Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Documents */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white border border-[#E6E6E0] rounded-2xl p-4 cursor-pointer hover:border-[#CFCFC8] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between text-[#646860] mb-2">
            <span className="text-xs font-semibold">Total Documents</span>
            <Files className="w-4 h-4 text-[#1D5FF0]" />
          </div>
          <div className="text-2xl font-bold text-[#1E201D] tracking-tight tabular-nums">
            {documents.length}
          </div>
          <span className="text-[11px] text-[#646860] mt-0.5 block truncate">
            {documents.length === 1 ? '1 record in vault' : `${documents.length} records in vault`}
          </span>
        </div>

        {/* Storage Allocation */}
        <div 
          onClick={() => setActiveTab('storage')}
          className="bg-white border border-[#E6E6E0] rounded-2xl p-4 cursor-pointer hover:border-[#CFCFC8] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between text-[#646860] mb-2">
            <span className="text-xs font-semibold">Vault Storage</span>
            <HardDrive className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-bold text-[#1E201D] tracking-tight tabular-nums">
            {storageStats.usedFormatted}
          </div>
          <span className="text-[11px] text-[#646860] mt-0.5 block truncate">
            {storageStats.percentUsed}% of {storageStats.quotaFormatted}
          </span>
        </div>

        {/* Expiring Count */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white border border-[#E6E6E0] rounded-2xl p-4 cursor-pointer hover:border-[#CFCFC8] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between text-[#646860] mb-2">
            <span className="text-xs font-semibold">Expiring Soon</span>
            <Clock className={`w-4 h-4 ${counts.expiring > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`} />
          </div>
          <div className="text-2xl font-bold text-[#1E201D] tracking-tight tabular-nums">
            {counts.expiring}
          </div>
          <span className={`text-[11px] mt-0.5 block truncate font-medium ${counts.expiring > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {counts.expiring > 0 ? 'Requires renewal' : 'All records up to date'}
          </span>
        </div>

        {/* Active Reminders */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white border border-[#E6E6E0] rounded-2xl p-4 cursor-pointer hover:border-[#CFCFC8] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between text-[#646860] mb-2">
            <span className="text-xs font-semibold">Scheduled Alerts</span>
            <Bell className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#1E201D] tracking-tight tabular-nums">
            {reminders.filter(r => !r.isCompleted).length}
          </div>
          <span className="text-[11px] text-[#646860] mt-0.5 block truncate">
            Active reminder queue
          </span>
        </div>
      </div>

      {/* 5. Asymmetric Workspace Layout */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-8 shadow-xs my-2">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="Your personal vault is ready"
            description="Upload passports, insurance policies, degree certificates, vehicle registration, or warranties. PaperTrail secures them with zero-knowledge encryption and notifies you before renewals."
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Left Registry (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Registry Header with Category Filters & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1E201D] tracking-tight">
                  Recent Vault Documents
                </h2>
                <p className="text-xs text-[#646860]">
                  Showing latest active records in your encrypted storage
                </p>
              </div>

              {/* View density toggle */}
              <div className="flex items-center bg-[#F0F0EA] p-0.5 rounded-xl border border-[#E6E6E0] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewDensity('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewDensity === 'grid' 
                      ? 'bg-white text-[#1D5FF0] shadow-xs' 
                      : 'text-[#646860] hover:text-[#1E201D]'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewDensity('list')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    viewDensity === 'list' 
                      ? 'bg-white text-[#1D5FF0] shadow-xs' 
                      : 'text-[#646860] hover:text-[#1E201D]'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  category={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                />
              ))}
            </div>

            {/* Document Collection Render */}
            {viewDensity === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onClick={() => handleOpenDoc(doc)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E6E6E0] shadow-xs overflow-hidden divide-y divide-[#E6E6E0]">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F6F6F2] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#F0F0EA] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-[#1D5FF0]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#1E201D] group-hover:text-[#1D5FF0] transition-colors truncate">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-[#646860] truncate">
                          {doc.issuer || doc.category} • {doc.issueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="default" size="sm">
                        {doc.category}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-[#CFCFC8] group-hover:text-[#1D5FF0] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Documents Link */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('documents')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#F0F0EA] border border-[#E6E6E0] text-xs font-bold text-[#1E201D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>View all vault documents ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#646860]" />
              </button>
            </div>
          </div>

          {/* Side Telemetry & Timeline Rail (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 1. Storage Category Allocation Card */}
            <div className="bg-white rounded-2xl border border-[#E6E6E0] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E201D]">
                  Storage Breakdown
                </span>
                <button
                  onClick={() => setActiveTab('storage')}
                  className="text-[11px] font-semibold text-[#1D5FF0] hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Storage Capacity Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#646860]">
                  <span>{storageStats.usedFormatted} used</span>
                  <span>{storageStats.remainingFormatted} remaining</span>
                </div>
                <ProgressBar value={storageStats.percentUsed} color="#1D5FF0" size="sm" />
              </div>

              {/* Category Rows */}
              <div className="space-y-2 pt-1 border-t border-[#F0F0EA]">
                {storageStats.categoryBreakdown.slice(0, 4).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#4A4E46] truncate max-w-[120px]">
                      {cat.category} ({cat.count})
                    </span>
                    <span className="text-[11px] text-[#646860] tabular-nums font-mono">
                      {cat.sizeFormatted}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Upcoming Renewals Timeline */}
            <div className="bg-white rounded-2xl border border-[#E6E6E0] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E201D]">
                  Upcoming Renewal Deadlines
                </span>
                <button
                  onClick={() => setActiveTab('reminders')}
                  className="text-[11px] font-semibold text-[#1D5FF0] hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>

              {activeReminders.length === 0 ? (
                <div className="py-4 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-[#1E201D]">No pending renewals</p>
                  <p className="text-[11px] text-[#646860]">All document policies are current.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeReminders.map((rem) => (
                    <div 
                      key={rem.id}
                      className="p-2.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] flex items-center justify-between gap-2.5"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-[#1E201D] truncate">
                          {rem.title}
                        </h4>
                        <p className="text-[10px] text-[#646860] truncate">
                          {rem.documentTitle} • Due {rem.dueDate}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                        rem.daysLeft <= 15
                          ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                          : rem.daysLeft <= 45
                          ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                          : 'bg-[#EFF6FF] text-[#1D5FF0] border-[#BFDBFE]'
                      }`}>
                        {rem.daysLeft}d left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Quick Ingestion Action Box */}
            <div className="bg-[#EBF0FD] border border-[#C7D9FB] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-[#0F3795]">
                  Need to secure a physical file?
                </h4>
                <p className="text-[11px] text-[#1D5FF0] mt-0.5">
                  Scan documents with your camera for instant zero-knowledge encryption.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('scan')}
                className="px-3.5 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#174FCB] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                Scan Now
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

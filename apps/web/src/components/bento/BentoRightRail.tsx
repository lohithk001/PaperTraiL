import React, { useMemo } from 'react';
import { 
  Bell, 
  Settings, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Star,
  HardDrive
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { Avatar, ProgressBar, SectionHeader, Badge, CategoryIcon } from '../ui';

export const BentoRightRail: React.FC = () => {
  const { 
    userProfile, 
    documents, 
    reminders,
    storageStats,
    setActiveTab, 
    setIsNotificationsOpen, 
    unreadNotificationsCount,
    setActiveDocumentDetail 
  } = useDocumentContext();

  const handleOpenDoc = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setActiveDocumentDetail(doc);
      setActiveTab('document-detail');
    }
  };

  const pinnedDocs = useMemo(() => {
    const favorites = documents.filter(d => d.isFavorite || d.isPriority);
    return favorites.length > 0 ? favorites.slice(0, 2) : documents.slice(0, 2);
  }, [documents]);

  const upcomingReminders = useMemo(() => {
    return reminders
      .filter(r => !r.isCompleted)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [reminders]);

  return (
    <aside className="w-[300px] bg-white rounded-[26px] p-5 flex flex-col gap-5 border border-[#E6E6E0] shrink-0 select-none overflow-y-auto no-scrollbar shadow-xs">
      
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="text-xs font-medium text-[#6B6E66]">Vault Online</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-8 h-8 rounded-xl bg-[#F0F0EA] hover:bg-[#E6E6E0] flex items-center justify-center text-[#6B6E66] hover:text-[#20211F] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D5FF0]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-xl bg-[#F0F0EA] hover:bg-[#E6E6E0] flex items-center justify-center text-[#6B6E66] hover:text-[#20211F] transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* 2. User Profile Summary */}
      <div className="flex flex-col items-center text-center pt-1 pb-2 border-b border-[#E6E6E0]">
        <Avatar 
          src={userProfile.avatarUrl} 
          name={userProfile.name} 
          size="lg" 
          className="ring-2 ring-[#E6E6E0] ring-offset-2 ring-offset-white"
        />

        <h2 className="text-base font-semibold text-[#20211F] tracking-tight mt-3">
          {userProfile.name || 'Vault Owner'}
        </h2>
        <p className="text-xs text-[#9B9E96] mt-0.5">
          {userProfile.email || 'Personal Sovereign Archive'}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8EDD8] text-[#3D5A14] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Knowledge Vault</span>
        </div>
      </div>

      {/* 3. Storage Allocation */}
      <div className="bg-[#F6F6F2] rounded-2xl p-4 border border-[#E6E6E0] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#6B6E66] flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-[#9B9E96]" />
            Vault Storage
          </span>
          <span className="font-semibold text-[#20211F]">
            {storageStats.percentUsed}%
          </span>
        </div>

        <ProgressBar 
          value={storageStats.percentUsed} 
          color="#1D5FF0" 
          size="sm"
        />

        <div className="flex items-center justify-between text-xs text-[#9B9E96] pt-1">
          <span>{storageStats.usedFormatted} used</span>
          <span>{storageStats.quotaFormatted} total</span>
        </div>
      </div>

      {/* 4. Upcoming Reminders */}
      <div className="space-y-3">
        <SectionHeader 
          title="Upcoming Reminders" 
          count={upcomingReminders.length}
          action={
            <button 
              onClick={() => setActiveTab('reminders')}
              className="text-xs font-medium text-[#1D5FF0] hover:text-[#174FCB] cursor-pointer flex items-center gap-0.5"
            >
              All <ChevronRight className="w-3 h-3" />
            </button>
          }
        />

        {upcomingReminders.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-center">
            <p className="text-xs text-[#9B9E96]">No upcoming expirations</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingReminders.map((rem) => (
              <div 
                key={rem.id}
                onClick={() => setActiveTab('reminders')}
                className="p-3 rounded-xl bg-white border border-[#E6E6E0] hover:border-[#CFCFC8] transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#F4EDD5] text-[#8C6D1F] flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#20211F] truncate">{rem.title}</p>
                    <p className="text-[11px] text-[#9B9E96] truncate">{rem.documentTitle}</p>
                  </div>
                </div>

                <Badge 
                  variant={rem.daysLeft <= 7 ? 'danger' : rem.daysLeft <= 30 ? 'warning' : 'default'} 
                  size="sm"
                >
                  {rem.daysLeft <= 0 ? 'Due' : `${rem.daysLeft}d`}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Pinned Documents */}
      <div className="space-y-3 mt-auto">
        <SectionHeader 
          title="Pinned Documents" 
          count={pinnedDocs.length}
          action={
            <button 
              onClick={() => setActiveTab('favorites')}
              className="text-xs font-medium text-[#1D5FF0] hover:text-[#174FCB] cursor-pointer flex items-center gap-0.5"
            >
              All <ChevronRight className="w-3 h-3" />
            </button>
          }
        />

        {pinnedDocs.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-center">
            <p className="text-xs text-[#9B9E96]">Star documents to pin them here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pinnedDocs.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => handleOpenDoc(doc.id)}
                className="p-3 rounded-xl bg-white border border-[#E6E6E0] hover:border-[#CFCFC8] transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CategoryIcon category={doc.category} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#20211F] group-hover:text-[#1D5FF0] transition-colors truncate">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-[#9B9E96] truncate">
                      {doc.issuer || doc.category}
                    </p>
                  </div>
                </div>

                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
};

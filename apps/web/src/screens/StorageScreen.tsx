import React from 'react';
import { 
  HardDrive, 
  ShieldCheck, 
  Database, 
  Lock, 
  Plus 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { 
  PageHeader, 
  StatsCard, 
  ProgressBar, 
  Button, 
  SectionHeader, 
  Badge 
} from '../components/ui';

export const StorageScreen: React.FC = () => {
  const { documents, setIsUploadModalOpen, storageStats } = useDocumentContext();

  const totalFiles = documents.length;
  const verifiedCount = documents.filter(d => d.isVerified).length;
  const storageCategories = storageStats.categoryBreakdown;

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* Header */}
      <PageHeader
        title="Encrypted Vault Storage"
        subtitle="Zero-knowledge AES-256 encrypted document storage powered directly by Neon PostgreSQL DB"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Add Encrypted File
          </Button>
        }
      />

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <StatsCard
          label="Storage Used"
          value={storageStats.usedFormatted}
          sub={`${storageStats.percentUsed}% of ${storageStats.quotaFormatted} allocated`}
          icon={<HardDrive className="w-4 h-4" />}
          accent="#1D5FF0"
        />
        <StatsCard
          label="Encrypted Records"
          value={totalFiles}
          sub={`${verifiedCount} cryptographic verified`}
          icon={<ShieldCheck className="w-4 h-4" />}
          accent="#16A34A"
        />
        <StatsCard
          label="Storage Architecture"
          value="Neon DB Vault"
          sub="Direct PostgreSQL storage, AES-256"
          icon={<Database className="w-4 h-4" />}
          accent="#8B5CF6"
        />
      </div>

      {/* Quota Progress */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#20211F]">Overall Vault Allocation</span>
          <span className="text-[#6B6E66]">{storageStats.remainingFormatted} remaining</span>
        </div>
        <ProgressBar value={storageStats.percentUsed} color="#1D5FF0" size="md" />
        <div className="flex items-center justify-between text-xs text-[#646860]">
          <span>{storageStats.usedFormatted} used</span>
          <span>{storageStats.quotaFormatted} total quota</span>
        </div>
      </div>

      {/* Category Storage Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs space-y-4">
        <SectionHeader title="Storage Breakdown by Category" />

        <div className="space-y-3">
          {storageCategories.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#20211F]">{item.category} ({item.count})</span>
                <span className="text-[#6B6E66]">{item.sizeFormatted}</span>
              </div>
              <div className="w-full bg-[#F0F0EA] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(2, item.percent))}%`,
                    backgroundColor: item.color || '#1D5FF0'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Security Details */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs space-y-3">
        <SectionHeader title="Cryptographic Pipeline & Verification" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6B6E66]">
          <div className="p-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0]">
            <p className="font-semibold text-[#20211F]">Direct Neon DB Storage</p>
            <p className="mt-0.5 text-[11px]">Documents and binaries reside directly inside secure Neon PostgreSQL TOAST storage, protected by cryptographic isolation and token validation.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0]">
            <p className="font-semibold text-[#20211F]">Relational Index & Integrity</p>
            <p className="mt-0.5 text-[11px]">Metadata, reminder schedules, and folder structures are indexed in Neon PostgreSQL with row-level ownership validation.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

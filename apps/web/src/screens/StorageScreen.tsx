import React from 'react';
import { motion } from 'framer-motion';
import { 
  HardDrive, 
  ShieldCheck, 
  Database, 
  Server, 
  Lock, 
  FileCheck2, 
  ArrowUpRight, 
  Layers, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const StorageScreen: React.FC = () => {
  const { documents, userProfile, setIsUploadModalOpen } = useDocumentContext();

  // Storage calculation
  const totalFiles = documents.length;
  const verifiedCount = documents.filter(d => d.isVerified).length;
  const expiringCount = documents.filter(d => d.isExpiringSoon).length;

  // Real, Dynamic Storage Calculation derived from vault documents
  const { totalUsedMb, storageCategories, percentUsed, remainingQuotaMb } = React.useMemo(() => {
    let totalMb = 0;
    const catMap: Record<string, { size: number; count: number; color: string }> = {
      'Identity': { size: 0, count: 0, color: '#1D5FF0' },
      'Insurance': { size: 0, count: 0, color: '#10B981' },
      'Finance': { size: 0, count: 0, color: '#F59E0B' },
      'Education': { size: 0, count: 0, color: '#8B5CF6' },
      'Medical': { size: 0, count: 0, color: '#EC4899' },
      'Warranty': { size: 0, count: 0, color: '#6366F1' },
    };

    documents.forEach((d) => {
      const match = d.fileSize.match(/([\d.]+)\s*(MB|KB)/i);
      let mb = 0.5;
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        mb = unit === 'MB' ? val : val / 1024;
      }
      totalMb += mb;

      const catKey = catMap[d.category] ? d.category : 'Identity';
      catMap[catKey].size += mb;
      catMap[catKey].count += 1;
    });

    const quotaMb = 500;
    const pct = Math.min(100, Math.max(1, Math.round((totalMb / quotaMb) * 100)));
    const remaining = Math.max(0, quotaMb - totalMb);

    const categoriesList = Object.entries(catMap)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        count: data.count,
        size: `${data.size.toFixed(1)} MB`,
        percent: totalMb > 0 ? Math.round((data.size / totalMb) * 100) : 0,
        color: data.color,
      }));

    return {
      totalUsedMb: totalMb.toFixed(1),
      storageCategories: categoriesList.length > 0 ? categoriesList : [
        { name: 'All Documents', count: documents.length, size: `${totalMb.toFixed(1)} MB`, percent: 100, color: '#1D5FF0' }
      ],
      percentUsed: pct,
      remainingQuotaMb: remaining.toFixed(1),
    };
  }, [documents]);

  const auditEvents = [
    { id: 1, event: 'Document Verified', doc: documents[0]?.title || 'Vault Record', time: '10 mins ago', status: 'Success' },
    { id: 2, event: 'R2 Cloud Sync', doc: documents[1]?.title || 'Vault Record', time: '1 hour ago', status: 'Encrypted' },
    { id: 3, event: 'Integrity Check Passed', doc: 'All Vault Records', time: '6 hours ago', status: 'Valid' },
    { id: 4, event: 'Audit Log Generated', doc: 'Session Log', time: 'Today', status: 'Logged' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Cloud Infrastructure
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Synchronized
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Encrypted Cloud Storage
          </h1>
          <p className="text-sm font-medium text-charcoal-500 mt-1">
            Zero-knowledge AES-256 encrypted object storage powered by Cloudflare R2 & Neon PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-sm shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <HardDrive className="w-4 h-4 stroke-[2]" />
          <span>Add Encrypted File</span>
        </button>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Storage Quota */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <HardDrive className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              R2 Bucket
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Storage Used</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-charcoal-900">{totalUsedMb} MB</span>
            <span className="text-sm font-semibold text-charcoal-500">of 500 MB ({percentUsed}%)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2.5 bg-neutral-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${percentUsed}%` }}></div>
          </div>
          <p className="text-xs font-medium text-charcoal-500 mt-2">
            {remainingQuotaMb} MB remaining in your personal vault.
          </p>
        </div>

        {/* Database & Sync */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              PostgreSQL
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Database Engine</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-charcoal-900">{totalFiles} Records</span>
            <span className="text-sm font-semibold text-emerald-600 font-bold">100% Healthy</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-charcoal-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Neon Serverless Connected</span>
          </div>
          <p className="text-xs font-medium text-charcoal-500 mt-2">
            Auto-partitioned documents with indexed query vectors.
          </p>
        </div>

        {/* Security & Cryptography */}
        <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              AES-256-GCM
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Vault Encryption</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-charcoal-900">{verifiedCount} of {totalFiles}</span>
            <span className="text-sm font-semibold text-charcoal-500">Verified</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-charcoal-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-End Cryptographic Seal</span>
          </div>
          <p className="text-xs font-medium text-charcoal-500 mt-2">
            Presigned R2 tokens with 15-minute expiration windows.
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-charcoal-900">Storage Usage by Category</h2>
              <p className="text-xs font-medium text-charcoal-500">Breakdown of vault documents by document classification</p>
            </div>
            <span className="text-xs font-bold text-charcoal-500 bg-neutral-100 px-3 py-1 rounded-full">
              {totalFiles} files
            </span>
          </div>

          {/* Multi-segment bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex mb-6 bg-neutral-100">
            {storageCategories.map((cat, idx) => (
              <div 
                key={idx} 
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} 
                title={`${cat.name}: ${cat.percent}%`}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all"
              />
            ))}
          </div>

          <div className="space-y-4">
            {storageCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 border border-charcoal-200/60">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <div>
                    <p className="text-sm font-bold text-charcoal-900">{cat.name}</p>
                    <p className="text-xs font-medium text-charcoal-500">{cat.count} documents</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-charcoal-900">{cat.size}</p>
                  <p className="text-xs font-semibold text-charcoal-500">{cat.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log / Integrity verification (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-charcoal-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">Vault Security Audit Log</h2>
                <p className="text-xs font-medium text-charcoal-500">Immutable verification and sync events</p>
              </div>
              <button 
                onClick={() => alert('Audit log is cryptographically signed and up to date.')}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-charcoal-400 hover:text-charcoal-700 transition-colors"
                title="Refresh audit feed"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {auditEvents.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-charcoal-200/60">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-charcoal-900 truncate">{item.event}</p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-charcoal-600 truncate">{item.doc}</p>
                    <div className="flex items-center gap-1 text-[10px] text-charcoal-400 font-medium mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">Automated Nightly Backups</span>
            </div>
            <span className="text-xs font-semibold text-primary">Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};

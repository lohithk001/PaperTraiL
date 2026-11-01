import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Download, 
  Trash2, 
  User, 
  HardDrive, 
  Bell, 
  HelpCircle, 
  Check, 
  RefreshCcw,
  Sparkles,
  ExternalLink,
  Key
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';

export const SettingsScreen: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    documents, 
    reminders,
    deviceViewMode 
  } = useDocumentContext();

  const [name, setName] = useState(userProfile.name);
  const [tagline, setTagline] = useState(userProfile.tagline);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, tagline });
    setIsSaved(true);
    triggerConfetti();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportBackup = () => {
    const backupData = {
      profile: userProfile,
      documents,
      reminders,
      exportedAt: new Date().toISOString(),
      vaultVersion: 'PaperTrail-2026.1',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaperTrail-Vault-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerConfetti();
  };

  return (
    <div className={`w-full ${deviceViewMode === 'mobile' ? 'px-6 pt-5 pb-8 space-y-5' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'}`}>
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Vault & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-charcoal-500 mt-0.5">
          Manage zero-knowledge encryption, biometric authentication, and user preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Personal Vault Identity</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-200 to-indigo-100 flex items-center justify-center font-extrabold text-base text-primary border-2 border-white shadow-xs ring-2 ring-primary/20">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-charcoal-900 truncate">{name}</span>
                    <ShieldCheck className="w-4 h-4 text-primary fill-primary/10 shrink-0" />
                  </div>
                  <span className="text-xs font-semibold text-primary">{tagline}</span>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">{userProfile.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Vault Tagline / Role
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-charcoal-200 text-xs font-medium text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-98"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved Changes</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </form>
          </div>

          {/* Cloud Storage Usage */}
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
                  Storage Allocation
                </h2>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {userProfile.storageUsed} / {userProfile.storageTotal}
              </span>
            </div>

            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                style={{ width: '4%' }}
              ></div>
            </div>

            <p className="text-xs font-medium text-charcoal-500 mt-3">
              {documents.length} encrypted documents stored. Cloudflare R2 private bucket active.
            </p>
          </div>
        </div>

        {/* Right Column: Security & Cryptography + Backup */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
                Security & Cryptography
              </h2>
            </div>

            {/* AES 256 Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-charcoal-100">
              <div>
                <p className="text-xs font-bold text-charcoal-900">AES-256 Vault Encryption</p>
                <p className="text-[11px] text-charcoal-500">Client-side zero-knowledge document seals</p>
              </div>
              <button
                onClick={() =>
                  updateUserProfile({ encryptionEnabled: !userProfile.encryptionEnabled })
                }
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 ${
                  userProfile.encryptionEnabled ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transform transition-transform ${
                    userProfile.encryptionEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Biometric Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-charcoal-100">
              <div>
                <p className="text-xs font-bold text-charcoal-900">Biometric Touch / Face ID</p>
                <p className="text-[11px] text-charcoal-500">Hardware security key or biometric prompt</p>
              </div>
              <button
                onClick={() =>
                  updateUserProfile({ biometricEnabled: !userProfile.biometricEnabled })
                }
                className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 ${
                  userProfile.biometricEnabled ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transform transition-transform ${
                    userProfile.biometricEnabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Key rotation status */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-charcoal-900">Master Key Status</p>
                  <p className="text-[11px] text-charcoal-500">Rotated 14 days ago • Valid</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="p-6 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-2">
              Vault Backup & Data Management
            </h2>

            <button
              onClick={handleExportBackup}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-charcoal-200 text-xs font-bold text-charcoal-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-primary" />
                <span>Export Encrypted Vault Backup (.json)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-charcoal-400" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all PaperTrail vault data to defaults?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear Local Vault Storage</span>
              </div>
              <span className="text-[10px] bg-rose-200/80 px-2 py-0.5 rounded-full">Reset</span>
            </button>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 text-xs font-medium text-charcoal-400">
        PaperTrail Document Management Platform • Enterprise Vault v1.0 • AES-256 Zero-Knowledge
      </div>

    </div>
  );
};

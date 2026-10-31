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
  ExternalLink
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';

export const SettingsScreen: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    documents, 
    reminders 
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
    <div className="w-full px-6 pt-5 pb-8 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
          Vault Settings
        </h2>
        <p className="text-xs font-semibold text-charcoal-500 mt-0.5">
          Privacy, end-to-end encryption & profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-gradient-to-tr from-pink-200 to-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 transform translate-y-1" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" fill="#F472B6" />
                <circle cx="42" cy="46" r="3" fill="#1F242D" />
                <circle cx="58" cy="46" r="3" fill="#1F242D" />
                <path d="M44 56 Q50 60 56 56" stroke="#1F242D" strokeWidth="2.5" fill="none" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-charcoal-900">{userProfile.name}</span>
                <ShieldCheck className="w-4 h-4 text-primary fill-primary/10" />
              </div>
              <span className="text-xs font-semibold text-primary">{userProfile.tagline}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Storage Gauge */}
      <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-charcoal-900">Vault Storage</span>
          </div>
          <span className="text-xs font-bold text-charcoal-500">
            {userProfile.storageUsed} / {userProfile.storageTotal}
          </span>
        </div>

        {/* Storage Bar */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
            style={{ width: '4%' }}
          ></div>
        </div>

        <p className="text-[11px] font-medium text-charcoal-400 mt-2">
          {documents.length} encrypted documents stored. Up to 500 MB included free.
        </p>
      </div>

      {/* Security & Encryption Section */}
      <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
            Security & Cryptography
          </h3>
        </div>

        {/* AES 256 Toggle */}
        <div className="flex items-center justify-between py-1">
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
        <div className="flex items-center justify-between py-1 border-t border-charcoal-100 pt-2.5">
          <div>
            <p className="text-xs font-bold text-charcoal-900">Biometric Touch / Face ID</p>
            <p className="text-[11px] text-charcoal-500">Require fingerprint or face recognition to unlock</p>
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
      </div>

      {/* Backup & Data Actions */}
      <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1">
          Vault Backup & Export
        </h3>

        <button
          onClick={handleExportBackup}
          className="w-full py-2.5 px-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-charcoal-200 text-xs font-bold text-charcoal-800 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
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
          className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Clear Local Vault Storage</span>
          </div>
          <span className="text-[10px] bg-rose-200/80 px-2 py-0.5 rounded-full">Reset</span>
        </button>
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-2 text-[11px] font-medium text-charcoal-400">
        PaperTrail Document Vault • Build 2026.10
        <br />
        Designed with precision from the reference UI standard.
      </div>
    </div>
  );
};

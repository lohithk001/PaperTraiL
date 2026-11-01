import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  HardDrive, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  ChevronRight, 
  LogOut, 
  Download, 
  Sparkles,
  Key,
  Smartphone,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';

export const SettingsScreen: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile,
    documents, 
    reminders,
    setActiveTab 
  } = useDocumentContext();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(userProfile.biometricEnabled);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: nameInput, email: emailInput });
    setActiveModal(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 select-none pb-8">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
          Vault Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
          Personal profile, vault encryption, storage allocation, and device sync.
        </p>
      </div>

      {/* 2. User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setActiveModal('profile')}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all flex items-center justify-between gap-4 cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-slate-100 shrink-0">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              {userProfile.name}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {userProfile.email}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              Verified Vault Owner
            </span>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-xl bg-[#F7F9FC] text-xs font-bold text-[#1D5FF0] group-hover:bg-[#EAF1FF] transition-colors">
          Edit Profile
        </button>
      </motion.div>

      {/* 3. Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Storage Card */}
        <div 
          onClick={() => setActiveTab('storage')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF1FF] text-[#1D5FF0] flex items-center justify-center">
                <HardDrive className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#1D5FF0]">72% used</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Storage Usage
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {userProfile.storageUsed} of {userProfile.storageTotal} used across PDFs, images and scans.
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#1D5FF0] rounded-full w-[72%]"></div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Manage Storage</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Security Card */}
        <div 
          onClick={() => setActiveModal('security')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F6EF] text-[#27A879] flex items-center justify-center">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-emerald-600">AES-256 Active</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Vault Security & Biometrics
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Zero-knowledge encryption keys and biometric app unlock on Android devices.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Security Settings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Notifications Card */}
        <div 
          onClick={() => setActiveModal('notifications')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2E6] text-[#F5A623] flex items-center justify-center">
                <Bell className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#F5A623]">Alerts On</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Notifications & Expiry Alerts
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Manage automatic reminder timelines (30 days, 15 days, 3 days).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Configure Alerts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Help & Support Card */}
        <div 
          onClick={() => setActiveTab('help')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0EAFE] text-[#7C3AED] flex items-center justify-center">
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#7C3AED]">Knowledge Base</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Help & Support
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Access PaperTrail AI assistant, security audit docs, and FAQ articles.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Open Help Center</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. Vault Backup & About PaperTrail */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">Export Encrypted Vault Backup</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Download an offline JSON snapshot of your 24 documents and reminders metadata.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 border border-[#E2E8F0] text-[#0F172A] text-xs font-bold transition-all shadow-subtle cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#1D5FF0]" />
          <span>Export Backup</span>
        </button>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <form
              onSubmit={handleSaveProfile}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Edit Profile Details</h3>
                <button 
                  type="button" 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Settings Modal */}
      <AnimatePresence>
        {activeModal === 'security' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Vault Security & Encryption</h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Biometric App Lock</p>
                    <p className="text-[11px] text-[#64748B]">Unlock with fingerprint or face recognition</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={biometricsEnabled} 
                    onChange={(e) => setBiometricsEnabled(e.target.checked)} 
                    className="w-4 h-4 text-[#1D5FF0] rounded cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E8F6EF] border border-[#27A879]/30 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#27A879]">
                    <Shield className="w-4 h-4" />
                    AES-256 Envelope Encryption Active
                  </div>
                  <p className="text-[#64748B] text-[11px] mt-1">
                    Every document is encrypted with a distinct master data key before being stored on Cloudflare R2 / Neon PostgreSQL.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {activeModal === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Notification Preferences</h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Expiry Reminders</p>
                    <p className="text-[11px] text-[#64748B]">Push notifications 30, 15, and 3 days before expiry</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled} 
                    onChange={(e) => setNotificationsEnabled(e.target.checked)} 
                    className="w-4 h-4 text-[#1D5FF0] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Email Digest</p>
                    <p className="text-[11px] text-[#64748B]">Monthly vault summary sent to {userProfile.email}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlertsEnabled} 
                    onChange={(e) => setEmailAlertsEnabled(e.target.checked)} 
                    className="w-4 h-4 text-[#1D5FF0] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

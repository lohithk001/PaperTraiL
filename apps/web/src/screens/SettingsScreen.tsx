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
  X,
  Globe,
  FolderArchive,
  Check,
  RotateCcw,
  Scale
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from '../components/Confetti';
import { useVaultAuth } from '../auth/ClerkAuthProvider';
import { ReminderPreferences } from '../types';
import { LegalModal } from '../components/LegalModal';
import { ConfirmDialog, toast } from '../components/ui';

const CATEGORIES_LIST = [
  'Identity',
  'Education',
  'Finance',
  'Insurance',
  'Health',
  'Bills and receipts',
  'Warranties',
  'Other documents',
];

const PREFERRED_LANGUAGES = [
  { code: 'en', label: 'English (US & International)', flag: '🌐' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

export const SettingsScreen: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile,
    saveOnboardingPreferences,
    saveOnboardingCategories,
    saveOnboardingProfile,
    saveOnboardingStep,
    documents, 
    reminders,
    storageStats,
    setActiveTab 
  } = useDocumentContext();
  const { signOut } = useVaultAuth();

  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const [showRelaunchConfirm, setShowRelaunchConfirm] = useState(false);

  const handleLogout = () => {
    setShowSignoutConfirm(true);
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [selectedLanguage, setSelectedLanguage] = useState(userProfile.preferredLanguage || 'en');
  const [selectedCats, setSelectedCats] = useState<string[]>(userProfile.selectedDocumentCategories || []);
  const [reminderPrefs, setReminderPrefs] = useState<ReminderPreferences>(
    userProfile.reminderPreferences || {
      documentExpiry: true,
      warrantyExpiry: true,
      insuranceRenewal: true,
      billPayment: true,
    }
  );

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
    saveOnboardingProfile({ name: nameInput, preferredLanguage: selectedLanguage });
    setActiveModal(null);
  };

  const handleSaveReminderPrefs = async () => {
    await saveOnboardingPreferences(reminderPrefs);
    setActiveModal(null);
  };

  const handleSaveCategories = async () => {
    await saveOnboardingCategories(selectedCats);
    await saveOnboardingProfile({ name: userProfile.name, preferredLanguage: selectedLanguage });
    setActiveModal(null);
  };

  const handleRelaunchOnboarding = () => {
    setShowRelaunchConfirm(true);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-full max-w-4xl space-y-6 select-none pb-8">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-display">
          Vault Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#78716C] mt-1">
          Personal profile, vault encryption, storage allocation, and onboarding preferences.
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
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
                {userProfile.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Vault
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">{userProfile.email || 'No email attached'}</p>
            <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">
              Language: {userProfile.preferredLanguage?.toUpperCase() || 'EN'} • {userProfile.selectedDocumentCategories?.length || 0} Categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#1D5FF0]">
          <span className="hidden sm:inline">Edit Profile</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </motion.div>

      {/* 3. Settings Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Storage Card */}
        <div 
          onClick={() => setActiveTab('storage')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center">
                <HardDrive className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#1D5FF0]">{storageStats.percentUsed}% Quota</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Vault Storage
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {storageStats.usedFormatted} of {storageStats.quotaFormatted} used across Cloudflare R2 vaults.
            </p>
            
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-[#1D5FF0] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, storageStats.percentUsed))}%` }}
              ></div>
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
              Vault Security & Architecture
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Private isolated R2 buckets, Clerk JWT verification, and encrypted rest/transit data.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Security Architecture</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Notifications & Expiry Alerts Card */}
        <div 
          onClick={() => setActiveModal('notifications')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2E6] text-[#F5A623] flex items-center justify-center">
                <Bell className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#F5A623]">Alerts Configured</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Reminder Preferences
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Manage automatic alerts for passports, insurance policies, warranties, and bills.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Configure Reminders</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Onboarding & Categories Preferences Card */}
        <div 
          onClick={() => setActiveModal('categories')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
                <FolderArchive className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#8B5CF6]">{userProfile.selectedDocumentCategories?.length || 0} Active</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Categories & Language
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Update preferred document categories and vault language formatting.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Edit Categories</span>
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

        {/* Review Onboarding Guide Card */}
        <div 
          onClick={handleRelaunchOnboarding}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#1D5FF0]">Guide</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Review Onboarding Guide
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Re-open the multi-step PaperTrail vault onboarding walkthrough.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>Relaunch Journey</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Legal & DPDP Compliance Card */}
        <div 
          onClick={() => setActiveModal('legal')}
          className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center">
                <Scale className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#6366F1]">Compliance</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Legal, Privacy & DPDP
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Privacy Policy, Terms of Service, DPDP Act (India) and Data Principal rights.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
            <span>View Disclosures</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. Vault Backup & About PaperTrail */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">Export Encrypted Vault Backup</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Download an offline JSON snapshot of your {documents.length} vault documents and reminders metadata.
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

      {/* 5. Session & Vault Lock */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-600">Lock Vault & Sign Out</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Safely terminate your active session and flush cached local credentials.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-all shadow-subtle cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Lock & Sign Out</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODALS
      ───────────────────────────────────────────────────────────── */}

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
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] cursor-pointer"
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

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Preferred Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white cursor-pointer"
                >
                  {PREFERRED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
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

      {/* Security Architecture Modal */}
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
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-[#0F172A]">Verified Security Architecture</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-left">
                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#0F172A]">Private Cloudflare R2 Storage</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    User files isolated under scoped storage paths with zero public bucket listing.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#0F172A]">Clerk Session Tokens & Row Authorization</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Every API request validates JWT sessions; database queries strictly verify owner IDs.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#0F172A]">AES-256 at Rest & TLS 1.3 in Transit</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Storage volumes use AES-256 server-side encryption; all network endpoints enforce TLS 1.3.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#0F172A]">Ephemeral Presigned URLs</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Upload URLs expire in 15 minutes; download URLs expire in 1 hour.
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

      {/* Reminder Preferences Modal */}
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
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#1D5FF0]" />
                  <h3 className="text-base font-bold text-[#0F172A]">Reminder Preferences</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#64748B]">
                Configure which automatic lifecycle reminders PaperTrail will generate for your documents:
              </p>

              <div className="space-y-2.5">
                {[
                  { key: 'documentExpiry' as const, label: 'Document Expiry Reminders', desc: 'Passports, IDs, and driver’s licenses' },
                  { key: 'insuranceRenewal' as const, label: 'Insurance Renewal Reminders', desc: 'Motor, health, and property cover' },
                  { key: 'warrantyExpiry' as const, label: 'Warranty Expiry Reminders', desc: 'Appliances and electronic devices' },
                  { key: 'billPayment' as const, label: 'Bill Payment Reminders', desc: 'Recurring bills, taxes, and utility dues' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F9FC] border border-[#E2E8F0]">
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{item.label}</p>
                      <p className="text-[11px] text-[#64748B]">{item.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={reminderPrefs[item.key]} 
                      onChange={(e) => setReminderPrefs(prev => ({ ...prev, [item.key]: e.target.checked }))} 
                      className="w-4 h-4 text-[#1D5FF0] rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminderPrefs}
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories & Language Preferences Modal */}
      <AnimatePresence>
        {activeModal === 'categories' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-[#0F172A]">Document Categories & Language</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Preferred Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] cursor-pointer"
                >
                  {PREFERRED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-2">
                  Selected Vault Categories ({selectedCats.length} active)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES_LIST.map((cat) => {
                    const isSelected = selectedCats.includes(cat);

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50/80 border-purple-300 text-purple-900'
                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-700 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleRelaunchOnboarding}
                  className="text-xs font-bold text-[#1D5FF0] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review full onboarding</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCategories}
                    className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal & DPDP Compliance Modal */}
      <LegalModal
        isOpen={activeModal === 'legal'}
        onClose={() => setActiveModal(null)}
      />

      {/* Lock Vault & Sign Out In-App Confirmation */}
      <ConfirmDialog
        open={showSignoutConfirm}
        onClose={() => setShowSignoutConfirm(false)}
        onConfirm={async () => {
          setShowSignoutConfirm(false);
          await signOut();
          toast.success('Signed out', 'Vault locked successfully.');
        }}
        title="Lock Vault & Sign Out"
        description="Are you sure you want to lock your PaperTrail vault and sign out of this session?"
        confirmLabel="Lock & Sign Out"
        variant="danger"
      />

      {/* Relaunch Onboarding In-App Confirmation */}
      <ConfirmDialog
        open={showRelaunchConfirm}
        onClose={() => setShowRelaunchConfirm(false)}
        onConfirm={async () => {
          setShowRelaunchConfirm(false);
          await saveOnboardingStep(1);
          setActiveTab('onboarding');
          toast.success('Onboarding restarted', 'Your stored documents and settings remain safe.');
        }}
        title="Review Onboarding"
        description="Would you like to review the PaperTrail onboarding journey? Your stored vault documents will remain completely safe."
        confirmLabel="Restart Onboarding"
        variant="primary"
      />

    </div>
  );
};

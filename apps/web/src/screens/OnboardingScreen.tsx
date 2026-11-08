import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  HardDrive, 
  Bell, 
  Check, 
  FileText, 
  CheckCircle2, 
  Globe, 
  User, 
  Camera, 
  Sparkles, 
  UploadCloud, 
  Compass, 
  AlertCircle, 
  ExternalLink,
  GraduationCap,
  CreditCard,
  Shield,
  Heart,
  Receipt,
  FileBadge,
  FolderArchive,
  RefreshCw
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { useVaultAuth, isClerkConfigured } from '../auth/ClerkAuthProvider';
import { HeroIllustration3D } from '../components/HeroIllustration3D';
import { DocumentCategory, ReminderPreferences } from '../types';

interface CategoryOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  badge: string;
}

const DOCUMENT_CATEGORIES: CategoryOption[] = [
  {
    id: 'Identity',
    label: 'Identity',
    description: 'Passports, national ID cards, driver’s licenses, birth records',
    icon: ShieldCheck,
    color: '#1D5FF0',
    bgLight: '#EAF1FF',
    badge: 'Crucial ID',
  },
  {
    id: 'Education',
    label: 'Education',
    description: 'University degrees, diplomas, transcripts, professional certificates',
    icon: GraduationCap,
    color: '#8B5CF6',
    bgLight: '#F3E8FF',
    badge: 'Academic',
  },
  {
    id: 'Finance',
    label: 'Finance',
    description: 'Tax filings, bank records, investments, tax deduction proofs',
    icon: CreditCard,
    color: '#F59E0B',
    bgLight: '#FEF3C7',
    badge: 'Financial',
  },
  {
    id: 'Insurance',
    label: 'Insurance',
    description: 'Motor insurance, health cover, property, and life policies',
    icon: Shield,
    color: '#10B981',
    bgLight: '#ECFDF5',
    badge: 'Active Cover',
  },
  {
    id: 'Health',
    label: 'Health',
    description: 'Medical reports, clinical prescriptions, vaccination certificates',
    icon: Heart,
    color: '#F43F5E',
    bgLight: '#FFE4E6',
    badge: 'Healthcare',
  },
  {
    id: 'Bills and receipts',
    label: 'Bills & Receipts',
    description: 'Monthly utility bills, rent receipts, major equipment invoices',
    icon: Receipt,
    color: '#6366F1',
    bgLight: '#EEF2FF',
    badge: 'Accounting',
  },
  {
    id: 'Warranties',
    label: 'Warranties',
    description: 'Consumer gadgets, appliance coverage, guarantee cards',
    icon: FileBadge,
    color: '#06B6D4',
    bgLight: '#ECFEFF',
    badge: 'Protection',
  },
  {
    id: 'Other documents',
    label: 'Other Documents',
    description: 'Rental leases, legal contracts, vehicle titles, club memberships',
    icon: FolderArchive,
    color: '#64748B',
    bgLight: '#F1F5F9',
    badge: 'General',
  },
];

const PREFERRED_LANGUAGES = [
  { code: 'en', label: 'English (US & International)', flag: '🌐' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
];

export const OnboardingScreen: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile,
    saveOnboardingStep,
    saveOnboardingCategories,
    saveOnboardingPreferences,
    saveOnboardingProfile,
    completeOnboardingJourney,
    setActiveTab,
    setIsUploadModalOpen
  } = useDocumentContext();

  const { isSignedIn } = useVaultAuth();

  // Restore saved step if user was midway through onboarding
  const initialStep = userProfile.onboardingStep && userProfile.onboardingStep >= 1 && userProfile.onboardingStep <= 6 
    ? userProfile.onboardingStep 
    : 1;

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Step 2 state: Selected Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    userProfile.selectedDocumentCategories && userProfile.selectedDocumentCategories.length > 0
      ? userProfile.selectedDocumentCategories
      : ['Identity', 'Insurance']
  );

  // Step 4 state: Profile Setup
  const [displayName, setDisplayName] = useState(userProfile.name || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || AVATAR_PRESETS[0]);
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile.preferredLanguage || 'en');
  const [nameError, setNameError] = useState('');

  // Step 5 state: Reminder Preferences
  const [reminderPrefs, setReminderPrefs] = useState<ReminderPreferences>(
    userProfile.reminderPreferences || {
      documentExpiry: true,
      warrantyExpiry: true,
      insuranceRenewal: true,
      billPayment: true,
    }
  );
  const [notificationPermissionState, setNotificationPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Synchronize initial values if profile updates from Clerk/backend
  useEffect(() => {
    if (userProfile.onboardingStep && userProfile.onboardingStep > currentStep) {
      setCurrentStep(userProfile.onboardingStep);
    }
    if (userProfile.name && !displayName) {
      setDisplayName(userProfile.name);
    }
    if (userProfile.avatarUrl) {
      setAvatarUrl(userProfile.avatarUrl);
    }
  }, [userProfile]);

  const handleNextStep = async (targetStep?: number) => {
    setApiError(null);
    const next = targetStep !== undefined ? targetStep : currentStep + 1;
    if (next > 6) return;

    setDirection('forward');
    setCurrentStep(next);
    saveOnboardingStep(next).catch((err) => {
      console.warn('Step persistence non-fatal warning:', err);
    });
  };

  const handlePrevStep = () => {
    setApiError(null);
    if (currentStep <= 1) return;
    setDirection('backward');
    const prev = currentStep - 1;
    setCurrentStep(prev);
    saveOnboardingStep(prev).catch(() => {});
  };

  // Step 2 handlers
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCategoriesContinue = async (skip = false) => {
    const catsToSave = skip ? [] : selectedCategories;
    setIsSubmitting(true);
    try {
      await saveOnboardingCategories(catsToSave);
      handleNextStep();
    } catch {
      handleNextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4 handlers
  const handleProfileContinue = async () => {
    if (!displayName.trim()) {
      setNameError('Please enter a display name for your vault.');
      return;
    }
    setNameError('');
    setIsSubmitting(true);
    try {
      await saveOnboardingProfile({
        name: displayName.trim(),
        avatarUrl,
        preferredLanguage,
      });
      handleNextStep();
    } catch {
      handleNextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 5 handlers
  const handleRequestNotificationPermission = async () => {
    setPermissionRequested(true);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermissionState(permission);
      } catch (e) {
        console.warn('Notification permission request error:', e);
      }
    }
  };

  const handleRemindersContinue = async () => {
    setIsSubmitting(true);
    try {
      await saveOnboardingPreferences(reminderPrefs);
      handleNextStep();
    } catch {
      handleNextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6 handlers
  const handleCompleteAndUpload = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboardingJourney();
      setIsUploadModalOpen(true);
    } catch {
      setActiveTab('home');
      setIsUploadModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteAndExplore = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboardingJourney();
    } catch {
      setActiveTab('home');
    } finally {
      setIsSubmitting(false);
    }
  };

  // When Clerk is configured, vault configuration steps (2-6) require an authenticated session
  if (isClerkConfigured && !isSignedIn && currentStep > 1) {
    return (
      <div className="min-h-screen w-full bg-[#F7F9FC] text-[#0F172A] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-card space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight font-display">
              Authentication Required
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              PaperTrail vaults are sovereign and privately encrypted. Please sign in or create an account to configure your vault categories and security preferences.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                window.location.hash = 'sign-up';
                setActiveTab('auth');
              }}
              className="w-full h-11 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] text-white font-bold text-xs shadow-card transition-all cursor-pointer"
            >
              Create Vault Account
            </button>
            <button
              onClick={() => {
                window.location.hash = 'sign-in';
                setActiveTab('auth');
              }}
              className="w-full py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Sign In to Existing Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Animation variants
  const stepVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? 24 : -24,
      scale: 0.99,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? -24 : 24,
      scale: 0.99,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F6F2] text-[#20211F] flex flex-col font-sans select-none antialiased">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP NAVBAR: Progress Tracker & Brand Identity
      ───────────────────────────────────────────────────────────── */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E6E6E0] sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D5FF0] text-white flex items-center justify-center shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 3L14 8L8.5 12L4 3Z" fill="white" />
                <path d="M14 8L21 5L16.5 15L14 8Z" fill="#93C5FD" />
                <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="#3B82F6" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#0F172A] font-display">
                Paper<span className="text-[#1D5FF0]">TraiL</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Vault Setup
              </span>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={6} aria-label={`Step ${currentStep} of 6`}>
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-7 bg-[#1D5FF0]'
                        : isCompleted
                        ? 'w-2.5 bg-[#1D5FF0]/40'
                        : 'w-2.5 bg-[#CBD5E1]'
                    }`}
                    title={`Step ${step} of 6`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-bold text-[#64748B] tabular-nums min-w-[50px] text-right">
              {currentStep} / 6
            </span>
          </div>

        </div>
      </header>

      {/* API Notice / Error Banner if any */}
      {apiError && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => handleNextStep(currentStep)}
              className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-950 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* ═════════════════════════════════════════════════════════
              STEP 1 — WELCOME
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-xl mx-auto flex flex-col items-center text-center py-6"
            >
              {/* PaperTrail 3D Document Emblem */}
              <div className="w-full flex justify-center mb-6">
                <HeroIllustration3D />
              </div>

              {/* Exact required headline & supporting text */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight font-display max-w-lg leading-tight">
                Your documents, finally in one place.
              </h1>
              
              <p className="text-sm sm:text-base text-[#64748B] mt-3.5 max-w-md leading-relaxed font-normal">
                Keep important documents organized, accessible and protected.
              </p>

              {/* Three Core Guarantees Pill Badges */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-md mt-6 pt-6 border-t border-slate-200/80 text-left">
                <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1D5FF0] flex items-center justify-center mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#0F172A]">Safe Vault</h4>
                  <p className="text-[10px] text-[#64748B]">Neon DB vault isolation</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center mb-1.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#0F172A]">Smart Expiry</h4>
                  <p className="text-[10px] text-[#64748B]">30, 15 & 3 day alert triggers</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#0F172A]">Clean Offline</h4>
                  <p className="text-[10px] text-[#64748B]">Works seamlessly across devices</p>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="w-full max-w-sm mt-8 space-y-3">
                {isSignedIn ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleNextStep(2)}
                      className="w-full h-13 rounded-2xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Continue to vault setup</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <p className="text-xs text-[#64748B]">
                      Signed in as <span className="font-semibold text-[#0F172A]">{userProfile.email || userProfile.name}</span>
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (isClerkConfigured) {
                          window.location.hash = 'sign-up';
                          setActiveTab('auth');
                        } else {
                          handleNextStep(2);
                        }
                      }}
                      className="w-full h-13 rounded-2xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={() => {
                        window.location.hash = 'sign-in';
                        setActiveTab('auth');
                      }}
                      className="w-full py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                    >
                      Already have an account? <span className="text-[#1D5FF0] font-bold underline underline-offset-4">Sign in</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════
              STEP 2 — DOCUMENT CATEGORIES (Skippable)
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-3xl mx-auto py-4"
            >
              {/* Header */}
              <div className="text-center max-w-lg mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D5FF0] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalize Your Vault</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                  What documents will you organize?
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                  Choose the categories relevant to you. We'll set up customized folders and renewal timelines.
                </p>
              </div>

              {/* Category Grid: 8 custom visual cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DOCUMENT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategories.includes(cat.id);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleCategory(cat.id);
                        }
                      }}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={isSelected}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#1D5FF0]/20 ${
                        isSelected
                          ? 'bg-white border-[#1D5FF0] shadow-card ring-1 ring-[#1D5FF0]'
                          : 'bg-white hover:bg-slate-50/80 border-[#E2E8F0] shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      {/* Top Row: Icon + Check Indicator */}
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                          style={{ backgroundColor: cat.bgLight, color: cat.color }}
                        >
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>

                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#1D5FF0] text-white shadow-xs'
                            : 'border-2 border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                            {cat.label}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleCategoriesContinue(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer text-center"
                  >
                    Skip for now
                  </button>

                  <button
                    onClick={() => handleCategoriesContinue(false)}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-bold shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue ({selectedCategories.length} selected)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════
              STEP 3 — PRIVACY & SECURITY ARCHITECTURE
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-2xl mx-auto py-4"
            >
              {/* Header */}
              <div className="text-center max-w-lg mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security & Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                  How PaperTrail protects your documents
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                  Transparent, verifiable security built into every layer of the platform.
                </p>
              </div>

              {/* 4 Verified Architectural Pillars (No false E2EE claims) */}
              <div className="space-y-3.5">
                
                {/* Pillar 1: Private Document Storage */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center shrink-0 mt-0.5">
                    <HardDrive className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0F172A]">Private Document Storage</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1D5FF0]">Neon DB Vault</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Every file is saved inside encrypted Neon PostgreSQL database storage scoped strictly to your authenticated identity. Vault records are protected by row-level isolation and are never publicly indexed or accessible.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Authentication & Access Controls */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0F172A]">Authentication & Access Controls</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#8B5CF6]">Clerk Auth</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      All API interactions require cryptographically verified Clerk JWT session tokens. Every database read and write explicitly enforces owner verification, ensuring no user can ever inspect or alter another user's documents.
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Encryption at Rest & In Transit */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0F172A]">Encryption at Rest & In Transit</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#10B981]">TLS 1.3 + AES-256</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      All communications between your device and the PaperTrail backend use TLS 1.3 transport encryption. Uploaded documents are automatically encrypted at rest in Neon PostgreSQL using industry-standard AES-256.
                    </p>
                  </div>
                </div>

                {/* Pillar 4: Ephemeral Access & Controlled Sharing */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0F172A]">Ephemeral Access & Revocable Sharing</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#F59E0B]">Presigned URLs</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Documents are never accessed via static public URLs. PaperTrail generates temporary presigned URLs (15-minute upload, 1-hour view) that expire automatically. Shared links can be time-limited and revoked instantly at any time.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => handleNextStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-bold shadow-card flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>I understand & agree</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════
              STEP 4 — PROFILE SETUP
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-lg mx-auto py-4"
            >
              {/* Header */}
              <div className="text-center max-w-md mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D5FF0] text-xs font-bold mb-2">
                  <User className="w-3.5 h-3.5" />
                  <span>Vault Identity</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                  Set up your profile
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                  How your name and vault persona will appear across PaperTrail.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-card space-y-5">
                
                {/* Avatar Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-2.5">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-3 ring-[#1D5FF0]/20 shadow-md shrink-0">
                      <img
                        src={avatarUrl}
                        alt="Profile avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#64748B] block">
                        Select an avatar preset:
                      </span>
                      <div className="flex items-center gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(preset)}
                            className={`w-8 h-8 rounded-xl overflow-hidden ring-2 transition-all cursor-pointer ${
                              avatarUrl === preset ? 'ring-[#1D5FF0] scale-110' : 'ring-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Name Input */}
                <div>
                  <label htmlFor="displayName" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Lohith Kumar"
                    className={`w-full h-11 px-4 rounded-xl border text-xs font-semibold text-[#0F172A] transition-all focus:outline-none ${
                      nameError
                        ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500'
                        : 'border-[#E2E8F0] bg-[#F7F9FC] focus:border-[#1D5FF0] focus:bg-white'
                    }`}
                  />
                  {nameError && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Preferred Language Selector */}
                <div>
                  <label htmlFor="preferredLang" className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Preferred Language (Optional)
                  </label>
                  <div className="relative">
                    <select
                      id="preferredLang"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full h-11 px-4 pr-8 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white cursor-pointer appearance-none"
                    >
                      {PREFERRED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    System dates, categories, and notifications will be formatted accordingly.
                  </p>
                </div>

              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleProfileContinue}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-bold shadow-card flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════
              STEP 5 — REMINDER PREFERENCES
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-xl mx-auto py-4"
            >
              {/* Header */}
              <div className="text-center max-w-md mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D5FF0] text-xs font-bold mb-2">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Never Miss a Renewal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                  Reminder preferences
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                  Configure proactive alerts so your passports, insurance, and warranties never lapse.
                </p>
              </div>

              {/* Explanatory Banner: Why notifications are needed BEFORE asking permission */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 mb-5 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1D5FF0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#0F172A]">Why PaperTrail needs notification permissions</h4>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      We send automatic advance reminders <strong>30 days, 15 days, and 3 days</strong> before critical document expirations. This prevents severe financial penalties, travel disruption, and voided insurance coverage.
                    </p>
                    {notificationPermissionState !== 'granted' ? (
                      <button
                        type="button"
                        onClick={handleRequestNotificationPermission}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D5FF0] hover:bg-[#1650D8] text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Enable Device Notifications</span>
                      </button>
                    ) : (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Notifications enabled on this device</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4 Granular Toggles */}
              <div className="space-y-3">
                {[
                  {
                    key: 'documentExpiry' as const,
                    title: 'Document Expiry Reminders',
                    desc: 'Advance alerts for passports, national IDs, and driver’s licenses.',
                    icon: ShieldCheck,
                    badge: 'Critical',
                  },
                  {
                    key: 'insuranceRenewal' as const,
                    title: 'Insurance Renewal Reminders',
                    desc: 'Timely notifications for vehicle, health, and property policy renewals.',
                    icon: Shield,
                    badge: 'Coverage',
                  },
                  {
                    key: 'warrantyExpiry' as const,
                    title: 'Warranty Expiry Reminders',
                    desc: 'Notices before consumer electronics and appliance warranties expire.',
                    icon: FileBadge,
                    badge: 'Protection',
                  },
                  {
                    key: 'billPayment' as const,
                    title: 'Bill Payment Reminders',
                    desc: 'Monthly alerts for utilities, property taxes, and recurring invoices.',
                    icon: Receipt,
                    badge: 'Finance',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isChecked = reminderPrefs[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() => setReminderPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#0F172A]">{item.title}</h4>
                            <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      {/* Custom iOS-style toggle */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        aria-label={`Toggle ${item.title}`}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          isChecked ? 'bg-[#1D5FF0]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleRemindersContinue}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-bold shadow-card flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════
              STEP 6 — FIRST DOCUMENT
          ═════════════════════════════════════════════════════════ */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-xl mx-auto py-4 text-center"
            >
              {/* Milestone Icon */}
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
                Your PaperTrail vault is ready!
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-md mx-auto leading-relaxed">
                Take the next step: add your first document now, or enter your personal dashboard to explore first.
              </p>

              {/* Two Clear Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
                
                {/* Option 1: Upload First Document */}
                <div
                  onClick={handleCompleteAndUpload}
                  className="p-5 rounded-3xl bg-white border-2 border-[#1D5FF0] shadow-card hover:shadow-hero hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center mb-3.5 group-hover:bg-[#1D5FF0] group-hover:text-white transition-colors">
                      <UploadCloud className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight">
                      Upload your first document
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                      Upload a PDF or image of your passport, motor insurance, or tax filing. We'll extract details and set reminders automatically.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
                    <span>Start Upload</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option 2: Explore PaperTrail First */}
                <div
                  onClick={handleCompleteAndExplore}
                  className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-slate-300 hover:shadow-subtle hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3.5 group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                      <Compass className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0F172A] tracking-tight">
                      Explore PaperTrail first
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                      Enter your personal dashboard, browse folder categories, and discover search, sharing, and storage capabilities at your own pace.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#0F172A]">
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <span className="text-[11px] font-semibold text-[#64748B]">
                  Preferences saved & synced to your account
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
};

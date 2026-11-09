import React, { useState, useEffect, useRef } from 'react';
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
  GraduationCap,
  CreditCard,
  Shield,
  Heart,
  Receipt,
  FileBadge,
  FolderArchive,
  RefreshCw,
  Upload
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { useVaultAuth, isClerkConfigured } from '../auth/ClerkAuthProvider';
import { HeroIllustration3D } from '../components/HeroIllustration3D';
import { ReminderPreferences } from '../types';

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
    description: 'University degrees, diplomas, transcripts, certificates',
    icon: GraduationCap,
    color: '#8B5CF6',
    bgLight: '#F3E8FF',
    badge: 'Academic',
  },
  {
    id: 'Finance',
    label: 'Finance',
    description: 'Tax filings, bank records, investments, deduction proofs',
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
    description: 'Medical reports, clinical prescriptions, vaccination cards',
    icon: Heart,
    color: '#F43F5E',
    bgLight: '#FFE4E6',
    badge: 'Healthcare',
  },
  {
    id: 'Bills and receipts',
    label: 'Bills & Receipts',
    description: 'Monthly utility bills, rent receipts, equipment invoices',
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
    description: 'Rental leases, contracts, vehicle titles, memberships',
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

const createSvgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const VAULT_AVATAR_PRESETS = [
  {
    id: 'sovereign',
    label: 'Sovereign',
    dataUri: createSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#18181B"/><path d="M12 10L28 20L18 28L12 10Z" fill="white"/><path d="M28 20L38 14L32 32L28 20Z" fill="#93C5FD"/><path d="M18 28L28 20L32 32L20 38L18 28Z" fill="#1D5FF0"/></svg>`
    ),
  },
  {
    id: 'emerald',
    label: 'Shield',
    dataUri: createSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#064E3B"/><path d="M24 10L35 15V24C35 30.5 30.3 36.5 24 38C17.7 36.5 13 30.5 13 24V15L24 10Z" fill="#10B981"/><path d="M19 24L22.5 27.5L29 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    ),
  },
  {
    id: 'obsidian',
    label: 'Vault',
    dataUri: createSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#0F172A"/><circle cx="24" cy="22" r="8" stroke="#94A3B8" stroke-width="2.5"/><path d="M24 30V35M20 35H28" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#38BDF8"/></svg>`
    ),
  },
  {
    id: 'amber',
    label: 'Key',
    dataUri: createSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#78350F"/><circle cx="20" cy="21" r="6" stroke="#FBBF24" stroke-width="2.5"/><path d="M25 25L35 35M31 31L34 34M34 28L37 31" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round"/></svg>`
    ),
  },
  {
    id: 'cobalt',
    label: 'Archive',
    dataUri: createSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#1E1B4B"/><path d="M14 16H34M14 24H34M14 32H26" stroke="#818CF8" stroke-width="2.8" stroke-linecap="round"/><circle cx="32" cy="32" r="3.5" fill="#6366F1"/></svg>`
    ),
  },
];

export const OnboardingScreen: React.FC = () => {
  const { 
    userProfile, 
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
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || VAULT_AVATAR_PRESETS[0].dataUri);
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile.preferredLanguage || 'en');
  const [nameError, setNameError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Step 4 handlers: Profile & Avatar Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setNameError('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setNameError('');
      }
    };
    reader.readAsDataURL(file);
  };

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

  // Step 5 handlers: Reminders
  const handleRequestNotificationPermission = async () => {
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

  // Step 6 handlers: Completion
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
      <div className="min-h-screen w-full bg-[#F6F6F2] text-[#20211F] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E6E6E0] shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
              Authentication Required
            </h2>
            <p className="text-xs text-[#646860] leading-relaxed">
              PaperTrail vaults are sovereign and privately encrypted. Please sign in or create an account to configure your vault categories and security preferences.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                window.location.hash = 'sign-up';
                setActiveTab('auth');
              }}
              className="w-full h-11 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              Create Vault Account
            </button>
            <button
              onClick={() => {
                window.location.hash = 'sign-in';
                setActiveTab('auth');
              }}
              className="w-full py-2 text-xs font-semibold text-[#646860] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              Sign In to Existing Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Animation variants
  const stepVariants: any = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      y: dir === 'forward' ? 12 : -12,
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      y: dir === 'forward' ? -12 : 12,
      transition: { duration: 0.16 },
    }),
  };

  const STEP_TITLES = [
    'Welcome',
    'Organization',
    'Security',
    'Vault Identity',
    'Reminders',
    'Vault Activation',
  ];

  return (
    <div className="min-h-screen w-full bg-[#F6F6F2] text-[#20211F] flex flex-col font-sans select-none antialiased">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP NAVBAR: Streamlined Header with Progress
      ───────────────────────────────────────────────────────────── */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E6E6E0] sticky top-0 z-30 px-4 sm:px-8 py-3 transition-all">
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
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#18181B] font-display">
                Paper<span className="text-[#1D5FF0]">TraiL</span>
              </span>
              <span className="text-[11px] font-semibold text-[#646860] uppercase tracking-wider bg-[#F0F0EB] px-2 py-0.5 rounded-md hidden sm:inline-block">
                Vault Setup
              </span>
            </div>
          </div>

          {/* Segmented Step Tracker */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-1.5" 
              role="progressbar" 
              aria-valuenow={currentStep} 
              aria-valuemin={1} 
              aria-valuemax={6} 
              aria-label={`Step ${currentStep} of 6: ${STEP_TITLES[currentStep - 1]}`}
            >
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-7 bg-[#1D5FF0]'
                        : isCompleted
                        ? 'w-2.5 bg-[#1D5FF0]/50'
                        : 'w-2.5 bg-[#D4D4CE]'
                    }`}
                    title={`Step ${step}: ${STEP_TITLES[step - 1]}`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-semibold text-[#646860] tabular-nums min-w-[42px] text-right">
              {currentStep}/6
            </span>
          </div>

        </div>
      </header>

      {/* API Notice / Error Banner if any */}
      {apiError && (
        <div className="max-w-xl mx-auto w-full px-4 pt-4">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
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
          MAIN CONTENT WORKSPACE: Centered Setup Card Architecture
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full transition-all duration-300 ${
          currentStep === 2 || currentStep === 3 ? 'max-w-2xl' : 'max-w-xl'
        }`}>
          
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
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden"
              >
                <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                  
                  {/* Cryptographic Vault Credential Seal */}
                  <HeroIllustration3D />

                  {/* Headline & supporting text */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight font-display mt-4 leading-tight">
                    Your documents, finally in one place.
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-[#646860] mt-2 max-w-md leading-relaxed font-normal">
                    Keep important documents organized, accessible and protected with zero-knowledge vault isolation.
                  </p>

                  {/* Three Core Guarantees: Integrated Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mt-6 text-left">
                    <div className="p-3 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6]">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1D5FF0] flex items-center justify-center mb-1.5">
                        <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#18181B]">Safe Vault</h4>
                      <p className="text-[11px] text-[#646860] mt-0.5">Neon DB vault isolation</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6]">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center mb-1.5">
                        <Bell className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#18181B]">Smart Expiry</h4>
                      <p className="text-[11px] text-[#646860] mt-0.5">30, 15 & 3 day alert triggers</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6]">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center mb-1.5">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#18181B]">Clean Offline</h4>
                      <p className="text-[11px] text-[#646860] mt-0.5">Works seamlessly across devices</p>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="w-full mt-7 space-y-3">
                    {isSignedIn ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleNextStep(2)}
                          className="w-full h-11 sm:h-12 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Continue to vault setup</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#646860]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Signed in as <strong className="text-[#18181B] font-medium">{userProfile.email || userProfile.name}</strong></span>
                        </div>
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
                          className="w-full h-11 sm:h-12 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Get started</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        <button
                          onClick={() => {
                            window.location.hash = 'sign-in';
                            setActiveTab('auth');
                          }}
                          className="w-full py-2 text-xs font-semibold text-[#646860] hover:text-[#18181B] transition-colors cursor-pointer"
                        >
                          Already have an account? <span className="text-[#1D5FF0] font-bold underline underline-offset-4">Sign in</span>
                        </button>
                      </>
                    )}
                  </div>

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
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 sm:p-7 border-b border-[#E6E6E0]">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D5FF0] text-[11px] font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Step 2 of 6 • Vault Organization</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight font-display">
                    What documents will you organize?
                  </h2>
                  <p className="text-xs text-[#646860] mt-1">
                    Select the categories relevant to you. We'll set up customized folders and renewal timelines.
                  </p>
                </div>

                {/* Category Grid: Responsive 2-column Layout */}
                <div className="p-6 sm:p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
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
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-[#1D5FF0]/20 ${
                            isSelected
                              ? 'bg-[#F8FAFF] border-[#1D5FF0] shadow-xs ring-1 ring-[#1D5FF0]'
                              : 'bg-white hover:bg-[#F9FAF8] border-[#E6E6E0]'
                          }`}
                        >
                          {/* Icon */}
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5"
                            style={{ backgroundColor: cat.bgLight, color: cat.color }}
                          >
                            <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-xs font-bold text-[#18181B] tracking-tight truncate">
                                {cat.label}
                              </h3>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-[#1D5FF0] text-white'
                                  : 'border border-[#CBD5E1] bg-white'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-[#646860] mt-0.5 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Integrated Action Footer */}
                <div className="border-t border-[#E6E6E0] bg-[#FAFBF9] px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] hover:bg-[#EFEFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCategoriesContinue(true)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] transition-colors cursor-pointer"
                    >
                      Skip for now
                    </button>

                    <button
                      onClick={() => handleCategoriesContinue(false)}
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Continue ({selectedCategories.length} selected)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 sm:p-7 border-b border-[#E6E6E0]">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Step 3 of 6 • Privacy Architecture</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight font-display">
                    How PaperTrail protects your documents
                  </h2>
                  <p className="text-xs text-[#646860] mt-1">
                    Transparent, verifiable security built into every layer of the platform.
                  </p>
                </div>

                {/* 4 Architectural Pillars */}
                <div className="p-6 sm:p-7 space-y-3">
                  
                  {/* Pillar 1: Private Document Storage */}
                  <div className="p-3.5 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6] flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D5FF0] flex items-center justify-center shrink-0 mt-0.5">
                      <HardDrive className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="space-y-0.5 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#18181B]">Private Document Storage</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100/70 text-[#1D5FF0]">Neon DB Vault</span>
                      </div>
                      <p className="text-[11px] text-[#646860] leading-relaxed">
                        Every file is saved inside encrypted Neon PostgreSQL database storage scoped strictly to your authenticated identity with row-level isolation.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2: Authentication & Access Controls */}
                  <div className="p-3.5 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6] flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                      <KeyRound className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="space-y-0.5 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#18181B]">Authentication & Access Controls</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100/70 text-[#8B5CF6]">Clerk Auth</span>
                      </div>
                      <p className="text-[11px] text-[#646860] leading-relaxed">
                        All API interactions require cryptographically verified Clerk JWT session tokens with strict user ownership enforcement.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3: Encryption at Rest & In Transit */}
                  <div className="p-3.5 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6] flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="space-y-0.5 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#18181B]">Encryption at Rest & In Transit</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100/70 text-[#10B981]">TLS 1.3 + AES-256</span>
                      </div>
                      <p className="text-[11px] text-[#646860] leading-relaxed">
                        All communications use TLS 1.3 transport encryption. Uploaded documents are automatically encrypted at rest using industry-standard AES-256.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4: Ephemeral Access & Controlled Sharing */}
                  <div className="p-3.5 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6] flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="space-y-0.5 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#18181B]">Ephemeral Access & Revocable Sharing</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100/70 text-[#B45309]">Presigned URLs</span>
                      </div>
                      <p className="text-[11px] text-[#646860] leading-relaxed">
                        Documents are never accessed via static public URLs. Temporary signed URLs expire automatically and shared links can be revoked instantly.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Integrated Action Footer */}
                <div className="border-t border-[#E6E6E0] bg-[#FAFBF9] px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] hover:bg-[#EFEFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => handleNextStep(4)}
                    className="px-5 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>I understand & agree</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 sm:p-7 border-b border-[#E6E6E0]">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D5FF0] text-[11px] font-bold mb-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Step 4 of 6 • Vault Identity</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight font-display">
                    Set up your profile
                  </h2>
                  <p className="text-xs text-[#646860] mt-1">
                    How your name and vault persona will appear across PaperTrail.
                  </p>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  
                  {/* Profile Avatar Selection Section */}
                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-2.5">
                      Vault Avatar & Persona
                    </label>

                    {/* Hidden Native File Picker */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-[#F9FAF8] border border-[#EBEBE6]">
                      {/* Active Avatar Preview */}
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white flex items-center justify-center">
                          <img
                            src={avatarUrl}
                            alt="Profile avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload custom avatar image"
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1D5FF0] text-white flex items-center justify-center shadow-xs hover:bg-[#1650D8] transition-all cursor-pointer"
                        >
                          <Camera className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Presets and Upload CTA */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-[#646860]">
                            Select a vault emblem or upload your own:
                          </span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D5FF0] hover:text-[#1650D8] transition-colors cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload photo</span>
                          </button>
                        </div>

                        {/* 5 Curated Vector Vault Monograms */}
                        <div className="flex items-center gap-2">
                          {VAULT_AVATAR_PRESETS.map((preset) => {
                            const isSelected = avatarUrl === preset.dataUri;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => setAvatarUrl(preset.dataUri)}
                                title={preset.label}
                                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex items-center justify-center bg-white ${
                                  isSelected
                                    ? 'border-[#1D5FF0] ring-2 ring-[#1D5FF0]/20 scale-105 shadow-xs'
                                    : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#CBD5E1]'
                                }`}
                              >
                                <img 
                                  src={preset.dataUri} 
                                  alt={preset.label} 
                                  className="w-full h-full object-contain p-0.5" 
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Name Input */}
                  <div>
                    <label htmlFor="displayName" className="block text-xs font-bold text-[#18181B] mb-1.5">
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
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs font-semibold text-[#18181B] transition-all focus:outline-none ${
                        nameError
                          ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500'
                          : 'border-[#E6E6E0] bg-[#FAFAF8] focus:border-[#1D5FF0] focus:bg-white focus:ring-2 focus:ring-[#1D5FF0]/15'
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
                    <label htmlFor="preferredLang" className="block text-xs font-bold text-[#18181B] mb-1.5">
                      Preferred Language (Optional)
                    </label>
                    <div className="relative">
                      <select
                        id="preferredLang"
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full h-11 px-3.5 pr-8 rounded-xl border border-[#E6E6E0] bg-[#FAFAF8] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#1D5FF0] focus:bg-white focus:ring-2 focus:ring-[#1D5FF0]/15 cursor-pointer appearance-none"
                      >
                        {PREFERRED_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                    <p className="text-[11px] text-[#646860] mt-1">
                      System dates, categories, and notifications will be formatted accordingly.
                    </p>
                  </div>

                </div>

                {/* Integrated Action Footer */}
                <div className="border-t border-[#E6E6E0] bg-[#FAFBF9] px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] hover:bg-[#EFEFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleProfileContinue}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 sm:p-7 border-b border-[#E6E6E0]">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D5FF0] text-[11px] font-bold mb-2">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Step 5 of 6 • Proactive Alerts</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight font-display">
                    Reminder preferences
                  </h2>
                  <p className="text-xs text-[#646860] mt-1">
                    Configure proactive alerts so your passports, insurance, and warranties never lapse.
                  </p>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  {/* Explanatory Banner: Why notifications are needed */}
                  <div className="p-3.5 rounded-xl bg-[#F0F5FF] border border-blue-200/80 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#1D5FF0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#18181B]">Why PaperTrail needs notification permissions</h4>
                        <p className="text-[11px] text-[#475569] leading-relaxed">
                          We send automatic advance reminders <strong>30 days, 15 days, and 3 days</strong> before critical document expirations. This prevents severe financial penalties, travel disruption, and voided insurance coverage.
                        </p>
                        {notificationPermissionState !== 'granted' ? (
                          <button
                            type="button"
                            onClick={handleRequestNotificationPermission}
                            className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1D5FF0] hover:bg-[#1650D8] text-white text-[11px] font-semibold shadow-2xs transition-all cursor-pointer"
                          >
                            <Bell className="w-3 h-3" />
                            <span>Enable Device Notifications</span>
                          </button>
                        ) : (
                          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Notifications enabled on this device</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Granular Toggles */}
                  <div className="space-y-2.5">
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
                          className="p-3 rounded-xl bg-white border border-[#E6E6E0] hover:border-[#CBD5E1] transition-all flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F6F6F2] text-[#4A4E46] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 stroke-[2.2]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#18181B]">{item.title}</h4>
                                <span className="text-[10px] font-semibold text-[#646860] bg-[#F0F0EB] px-1.5 py-0.2 rounded">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#646860] mt-0.5">{item.desc}</p>
                            </div>
                          </div>

                          {/* Custom iOS-style toggle */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isChecked}
                            aria-label={`Toggle ${item.title}`}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                              isChecked ? 'bg-[#1D5FF0]' : 'bg-[#D4D4CE]'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs ${
                                isChecked ? 'translate-x-4.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Integrated Action Footer */}
                <div className="border-t border-[#E6E6E0] bg-[#FAFBF9] px-6 py-4 flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] hover:bg-[#EFEFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleRemindersContinue}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#1D5FF0] hover:bg-[#1650D8] active:scale-[0.99] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 6 — FIRST DOCUMENT & DASHBOARD ENTRY
            ═════════════════════════════════════════════════════════ */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-2xl border border-[#E6E6E0] shadow-sm overflow-hidden flex flex-col text-center"
              >
                <div className="p-6 sm:p-8">
                  {/* Milestone Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight font-display">
                    Your PaperTrail vault is ready!
                  </h2>

                  <p className="text-xs sm:text-sm text-[#646860] mt-1.5 max-w-md mx-auto leading-relaxed">
                    Take the next step: add your first document now, or enter your personal dashboard to explore first.
                  </p>

                  {/* Two Clear Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 text-left">
                    
                    {/* Option 1: Upload First Document */}
                    <div
                      onClick={handleCompleteAndUpload}
                      className="p-4 rounded-xl bg-[#F8FAFF] border-2 border-[#1D5FF0] hover:bg-blue-50/70 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-[#1D5FF0] text-white flex items-center justify-center mb-3 transition-colors">
                          <UploadCloud className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h3 className="text-xs font-bold text-[#18181B] tracking-tight">
                          Upload your first document
                        </h3>
                        <p className="text-[11px] text-[#646860] mt-1 leading-relaxed">
                          Upload a PDF or image of your passport, motor insurance, or tax filing. We'll set reminders automatically.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-bold text-[#1D5FF0]">
                        <span>Start Upload</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Option 2: Explore PaperTrail First */}
                    <div
                      onClick={handleCompleteAndExplore}
                      className="p-4 rounded-xl bg-white border border-[#E6E6E0] hover:bg-[#F9FAF8] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-[#F6F6F2] text-[#4A4E46] flex items-center justify-center mb-3 group-hover:bg-[#18181B] group-hover:text-white transition-colors">
                          <Compass className="w-5 h-5 stroke-[2]" />
                        </div>
                        <h3 className="text-xs font-bold text-[#18181B] tracking-tight">
                          Explore PaperTrail first
                        </h3>
                        <p className="text-[11px] text-[#646860] mt-1 leading-relaxed">
                          Enter your personal dashboard, browse folder categories, and discover search and storage capabilities.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E6E6E0] flex items-center justify-between text-xs font-semibold text-[#646860] group-hover:text-[#18181B]">
                        <span>Enter Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Integrated Action Footer */}
                <div className="border-t border-[#E6E6E0] bg-[#FAFBF9] px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#646860] hover:text-[#18181B] hover:bg-[#EFEFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Vault encrypted & synchronized</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

    </div>
  );
};

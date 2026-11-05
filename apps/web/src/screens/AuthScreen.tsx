import React, { useState, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, X, Lock, KeyRound, UserCheck } from 'lucide-react';
import { AuthLayout } from '../auth/AuthLayout';
import { isClerkConfigured } from '../auth/ClerkAuthProvider';

// PaperTrail Custom Clerk Component Theme
const clerkAppearance = {
  variables: {
    colorPrimary: '#1D5FF0',
    colorText: '#0F172A',
    colorTextSecondary: '#64748B',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#0F172A',
    colorDanger: '#EF4444',
    colorSuccess: '#10B981',
    borderRadius: '0.85rem',
    fontFamily: 'inherit',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'shadow-card rounded-3xl border border-[#E2E8F0] p-6 sm:p-9 bg-white w-full',
    headerTitle: 'text-2xl font-extrabold text-[#0F172A] tracking-tight font-display',
    headerSubtitle: 'text-xs text-[#64748B] mt-1',
    logoBox: 'hidden',
    formButtonPrimary: 'bg-[#1D5FF0] hover:bg-[#1650D8] text-white font-semibold rounded-xl h-11 text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer',
    formFieldInput: 'rounded-xl border border-[#E2E8F0] focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15 h-11 text-sm transition-all shadow-2xs',
    formFieldLabel: 'text-xs font-semibold text-[#0F172A]',
    socialButtonsBlockButton: 'rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all h-11 text-sm font-medium shadow-2xs',
    socialButtonsBlockButtonText: 'text-xs font-semibold text-[#0F172A]',
    dividerLine: 'bg-[#E2E8F0]',
    dividerText: 'text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider',
    footerActionLink: 'text-[#1D5FF0] font-semibold hover:underline',
    footerActionText: 'text-xs text-[#64748B]',
    footer: 'pt-4 border-t border-slate-100 flex justify-center text-xs text-[#64748B]',
    badge: 'hidden',
    identityPreviewText: 'text-xs font-medium text-[#0F172A]',
    identityPreviewEditButton: 'text-[#1D5FF0] text-xs font-semibold hover:underline',
  },
};

export const AuthScreen: React.FC = () => {
  // Support hash-based view initial state (e.g. #sign-up or #sign-in)
  const initialMode = typeof window !== 'undefined' && window.location.hash === '#sign-up' ? 'sign-up' : 'sign-in';
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>(initialMode);
  const [showConfigNotice, setShowConfigNotice] = useState(!isClerkConfigured);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('sign-up')) {
        setAuthMode('sign-up');
      } else if (window.location.hash.includes('sign-in')) {
        setAuthMode('sign-in');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-4">
        
        {/* Development notice if Clerk Publishable Key is not yet configured */}
        {!isClerkConfigured && showConfigNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-left">
                <span className="font-semibold block text-amber-950">Clerk API Key Required</span>
                <span className="text-amber-800 text-[11px] leading-relaxed block">
                  Add <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-semibold">VITE_CLERK_PUBLISHABLE_KEY</code> to your <code className="font-mono">apps/web/.env</code> to connect live authentication.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowConfigNotice(false)}
              className="text-amber-700 hover:text-amber-950 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Dismiss note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Branded Toggle Tab between Sign In and Sign Up */}
        <div className="flex p-1 rounded-2xl bg-slate-200/60 border border-slate-200/80 backdrop-blur-xs shadow-inner">
          <button
            onClick={() => {
              setAuthMode('sign-in');
              window.location.hash = 'sign-in';
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === 'sign-in'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('sign-up');
              window.location.hash = 'sign-up';
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === 'sign-up'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Native Clerk React Authentication Form */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {authMode === 'sign-in' ? (
              <motion.div
                key="clerk-sign-in"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <SignIn
                  routing="hash"
                  signUpUrl="#sign-up"
                  appearance={clerkAppearance}
                />
              </motion.div>
            ) : (
              <motion.div
                key="clerk-sign-up"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <SignUp
                  routing="hash"
                  signInUrl="#sign-in"
                  appearance={clerkAppearance}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </AuthLayout>
  );
};

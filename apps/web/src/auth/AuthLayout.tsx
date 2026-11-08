import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Fingerprint, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white text-[#20211F] flex flex-col lg:flex-row antialiased font-sans select-none overflow-x-hidden safe-top safe-bottom">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL (Desktop: Branded Sovereign Vault Showcase)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-[#080E1E] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden shrink-0 border-r border-slate-800/80">
        
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#1D5FF0]/20 via-[#1D5FF0]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-[#3B82F6]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

        {/* 1. Header: Brand Mark & Pill */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#18233C] border border-white/10 flex items-center justify-center text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 3L14 8L8.5 12L4 3Z" fill="white" />
              <path d="M14 8L21 5L16.5 15L14 8Z" fill="#93C5FD" />
              <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="#3B82F6" />
            </svg>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-xl tracking-tight font-display text-white">
              PaperTrail
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 border border-white/10 tracking-wider uppercase">
              VAULT 2026
            </span>
          </div>
        </div>

        {/* 2. Centerpiece: Vault Narrative & Stacked Vault Card */}
        <div className="relative z-10 my-auto py-10 space-y-8 max-w-lg">
          
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.2] font-display"
            >
              Your documents, sovereign and protected.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm xl:text-base text-slate-300/80 mt-3 font-normal leading-relaxed"
            >
              Store, organize, verify, and time-share passports, motor insurance, tax filings, and critical credentials with zero-knowledge encryption.
            </motion.p>
          </div>

          {/* Layered Stacked Vault Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative pt-6 pb-2"
          >
            {/* Background layered card */}
            <div className="absolute inset-x-6 top-1 h-28 rounded-2xl bg-[#0D182E]/60 border border-slate-700/40 -rotate-1 transform scale-98 opacity-60 shadow-lg pointer-events-none" />

            {/* Foreground Featured Vault Card */}
            <div className="relative rounded-2xl bg-[#0C152B] p-5 border border-slate-700/70 shadow-2xl space-y-3.5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">Republic Travel Passport</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Biometric ID • Verified</p>
                  </div>
                </div>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid</span>
                </span>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>AES-256</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
                  <span>Biometrics</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero-Knowledge</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Guarantees */}
          <div className="space-y-3 pt-2">
            {[
              'Client-side zero-knowledge encryption guarantees your files remain private.',
              'Time-limited cryptographic sharing links with automatic access revocation.',
              'Native biometric unlock integration for Android fingerprint and face authentication.',
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300/80">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

        </div>

        {/* 3. Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>End-to-End Encrypted Document Vault</span>
          <span className="font-semibold text-slate-300">Clerk Auth • Neon DB</span>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL (Form Workspace)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 min-h-screen bg-white overflow-y-auto">
        <div className="w-full max-w-md my-auto py-6">
          {children}
        </div>
      </div>

    </div>
  );
};

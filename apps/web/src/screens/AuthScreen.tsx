import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const AuthScreen: React.FC = () => {
  const { setActiveTab, userProfile, updateUserProfile } = useDocumentContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      updateUserProfile({
        name: name.trim() ? name.trim() : userProfile.name,
        email: email.trim() ? email.trim() : userProfile.email,
      });
      setIsLoading(false);
      setActiveTab('home');
    }, 350);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateUserProfile({
        name: userProfile.name || 'Lohith Kumar',
        email: 'lohit.k@gmail.com',
      });
      setIsLoading(false);
      setActiveTab('home');
    }, 450);
  };

  return (
    <div className="relative w-full min-h-[820px] h-full bg-[#F7F9FC] text-[#0F172A] flex flex-col justify-between p-6 sm:p-8 select-none">
      
      {/* Top spacer */}
      <div className="h-4"></div>

      {/* Main Form Container */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        
        {/* Centered PaperTrail Logo (Screen 3 Spec) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#1D5FF0] shadow-card flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                fill="currentColor"
              />
              <path
                d="M14 2V8H20"
                fill="#EAF1FF"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">PaperTrail</h2>
        </motion.div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-xs font-normal text-[#64748B] mt-1.5">
            {isSignUp ? 'Start protecting your personal documents.' : 'Sign in to access your document vault.'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {isSignUp && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 text-left"
            >
              <label className="text-xs font-semibold text-[#0F172A] ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lohith K"
                className="w-full h-[50px] px-4 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15 transition-all shadow-subtle"
              />
            </motion.div>
          )}

          {/* Email field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-[#0F172A] ml-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-[50px] px-4 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15 transition-all shadow-subtle"
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-[#0F172A]">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setAuthNotice('Password reset instruction will be sent to your registered email.')}
                  className="text-[11px] font-medium text-[#1D5FF0] hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[50px] px-4 pr-11 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D5FF0] focus:ring-2 focus:ring-[#1D5FF0]/15 transition-all shadow-subtle"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {authNotice && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center justify-between"
            >
              <span>{authNotice}</span>
              <button 
                type="button" 
                onClick={() => setAuthNotice(null)} 
                className="font-bold ml-2 text-blue-900"
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* Sign In Button (Screen 3 Spec) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] active:scale-[0.98] text-white font-semibold text-sm shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <span className="relative px-3 bg-[#F7F9FC] text-[11px] font-medium text-[#64748B]">
              or continue with
            </span>
          </div>

          {/* Outlined Continue with Google button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-[50px] px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] active:scale-[0.98] text-[#0F172A] font-semibold text-xs shadow-subtle transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

        </form>

      </div>

      {/* Footer with Sign up link */}
      <div className="w-full text-center py-4 z-10">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs font-normal text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          {isSignUp ? (
            <span>Already have an account? <strong className="text-[#1D5FF0] font-semibold">Sign in</strong></span>
          ) : (
            <span>Don't have an account? <strong className="text-[#1D5FF0] font-semibold">Sign up</strong></span>
          )}
        </button>
      </div>

    </div>
  );
};

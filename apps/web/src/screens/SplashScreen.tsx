import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const SplashScreen: React.FC = () => {
  const { setActiveTab } = useDocumentContext();

  // Auto transition after 2.5s or on tap
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab('onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, [setActiveTab]);

  return (
    <div 
      onClick={() => setActiveTab('onboarding')}
      className="relative w-full min-h-[820px] h-full bg-gradient-to-b from-[#1D5FF0] via-[#1656E6] to-[#0752D9] text-white flex flex-col justify-between p-8 overflow-hidden select-none cursor-pointer"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/12 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top spacer */}
      <div className="h-10"></div>

      {/* Center Brand Identity (Screen 1 Spec) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10"
      >
        {/* White Folded Document Emblem */}
        <div className="w-18 h-18 rounded-3xl bg-white shadow-2xl shadow-blue-950/40 flex items-center justify-center mb-6 relative">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
              fill="#1D5FF0"
            />
            <path
              d="M14 2V8H20"
              fill="#EAF1FF"
            />
            <path
              d="M8 13H16M8 17H13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
          PaperTrail
        </h1>

        <p className="text-sm font-medium text-white/90 mt-2.5 max-w-[260px] leading-relaxed">
          Never lose an important document again.
        </p>
      </motion.div>

      {/* Bottom Layered Folded Paper Shapes Illustration (Screen 1 Spec) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-full max-w-[340px] h-48 flex items-end justify-center">
          
          {/* Back folded sheet */}
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: -8 }}
            animate={{ opacity: 0.25, y: 0, rotate: -8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-8 w-68 h-40 rounded-t-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg"
          />

          {/* Middle folded sheet */}
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: 6 }}
            animate={{ opacity: 0.35, y: 0, rotate: 6 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-4 w-72 h-40 rounded-t-3xl bg-white/40 backdrop-blur-md border border-white/25 shadow-lg"
          />

          {/* Front folded sheet */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-76 h-32 rounded-t-3xl bg-white/25 backdrop-blur-xl border border-white/35 flex items-center justify-center shadow-xl"
          >
            <span className="text-[11px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 opacity-90">
              <span>Tap to Enter Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

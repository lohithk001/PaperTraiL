import React from 'react';
import { motion } from 'framer-motion';

export const HeroIllustration3D: React.FC = () => {
  return (
    <div className="relative w-full max-w-[420px] h-[220px] flex items-center justify-center select-none pointer-events-none sm:pointer-events-auto">
      
      {/* Background Soft Cloud Puffs */}
      <motion.div 
        animate={{ scale: [1, 1.03, 1], opacity: [0.85, 0.95, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg className="w-full h-full" viewBox="0 0 420 220" fill="none">
          <ellipse cx="280" cy="140" rx="110" ry="60" fill="#EBF2FE" />
          <ellipse cx="340" cy="110" rx="60" ry="50" fill="#E3EDFC" />
          <ellipse cx="220" cy="130" rx="70" ry="50" fill="#EDF4FE" />
          <circle cx="280" cy="90" r="45" fill="#E8F1FD" />
        </svg>
      </motion.div>

      {/* Twinkling 4-Point Sparkle Stars */}
      {/* Sparkle 1 (Top Left) */}
      <motion.div
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-16 text-[#0861E8]"
      >
        <svg className="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Sparkle 2 (Center Left) */}
      <motion.div
        animate={{ scale: [1, 0.7, 1], opacity: [0.9, 0.4, 0.9] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-28 left-24 text-[#0861E8]"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Sparkle 3 (Far Right) */}
      <motion.div
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-16 right-4 text-[#0861E8]"
      >
        <svg className="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Floating 3D Documents Stack */}
      <div className="relative z-10 w-[300px] h-[190px] flex items-center justify-center">
        
        {/* Document 1: Red PDF File (Flying Left) */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-14, -12, -14] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.08, rotate: -8, transition: { duration: 0.2 } }}
          className="absolute left-6 top-6 w-20 h-24 bg-white rounded-2xl shadow-[0_12px_28px_rgba(239,68,68,0.18)] border border-rose-100 flex flex-col items-center justify-between p-2.5 z-10 cursor-pointer"
        >
          <div className="w-full flex items-center justify-end">
            <span className="w-3 h-3 bg-neutral-100 rounded-tr-lg"></span>
          </div>
          {/* Red PDF Emblem */}
          <div className="w-10 h-7 rounded-lg bg-rose-500 text-white font-black text-[9px] flex items-center justify-center tracking-wider shadow-sm">
            PDF
          </div>
          {/* Subtle text lines */}
          <div className="w-full space-y-1">
            <div className="w-full h-1 bg-neutral-200 rounded-full"></div>
            <div className="w-3/4 h-1 bg-neutral-200 rounded-full"></div>
          </div>
        </motion.div>

        {/* Document 2: Image/Photo Document (Flying Center) */}
        <motion.div
          animate={{ y: [0, -11, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          whileHover={{ scale: 1.08, y: -16, transition: { duration: 0.2 } }}
          className="absolute left-24 top-0 w-22 h-26 bg-white rounded-2xl shadow-[0_16px_32px_rgba(8,97,232,0.16)] border border-blue-100 flex flex-col items-center justify-between p-2.5 z-20 cursor-pointer"
        >
          <div className="w-full h-16 rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Sun */}
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300 absolute top-2 right-3 shadow-sm"></div>
            {/* Mountain silhouette */}
            <div className="absolute -bottom-2 -left-2 w-16 h-12 bg-white/30 rounded-t-full transform rotate-12"></div>
            <div className="absolute -bottom-3 right-0 w-14 h-10 bg-white/40 rounded-t-full transform -rotate-12"></div>
          </div>
          <div className="w-full flex items-center gap-1.5 pt-1">
            <div className="w-full h-1.5 bg-neutral-200 rounded-full"></div>
          </div>
        </motion.div>

        {/* Document 3: Text Document (Flying Right) */}
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [12, 15, 12] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          whileHover={{ scale: 1.08, rotate: 8, transition: { duration: 0.2 } }}
          className="absolute right-8 top-8 w-20 h-24 bg-white rounded-2xl shadow-[0_12px_28px_rgba(59,130,246,0.16)] border border-slate-100 flex flex-col justify-between p-2.5 z-10 cursor-pointer"
        >
          <div className="space-y-1.5 pt-1">
            <div className="w-8 h-2 bg-blue-500/20 rounded-full"></div>
            <div className="w-full h-1 bg-neutral-200 rounded-full"></div>
            <div className="w-full h-1 bg-neutral-200 rounded-full"></div>
            <div className="w-3/4 h-1 bg-neutral-200 rounded-full"></div>
            <div className="w-5/6 h-1 bg-neutral-200 rounded-full"></div>
          </div>
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center self-end">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        </motion.div>

        {/* 3D Blue Vault Folder (Foreground Anchor) */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1 w-52 h-36 z-30 flex items-end justify-center filter drop-shadow-[0_20px_35px_rgba(8,97,232,0.28)]"
        >
          {/* Back tab of folder */}
          <div className="absolute top-2 left-4 w-20 h-6 bg-[#0752C5] rounded-t-xl"></div>
          
          {/* Main Folder Body with Curved Gradient Pocket */}
          <div className="relative w-full h-32 rounded-3xl bg-gradient-to-br from-[#0861E8] via-[#0957D0] to-[#0447AC] p-3 shadow-xl flex flex-col justify-between overflow-hidden border border-white/20">
            
            {/* Folder Interior / White Document Lip */}
            <div className="w-full h-3 bg-white/90 rounded-full shadow-inner opacity-90"></div>

            {/* Subtle Folder Crease / Curve Accent */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>

            {/* Folder Emblem (PaperTrail Shield Icon) */}
            <div className="flex items-center justify-between z-10 pt-4 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-xs"></div>
                </div>
                <span className="text-[11px] font-extrabold text-white tracking-wide">
                  PaperTrail Vault
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            </div>

            <div className="h-1"></div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

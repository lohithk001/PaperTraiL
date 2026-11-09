import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Database } from 'lucide-react';

export const HeroIllustration3D: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      {/* Central Sovereign Vault Emblem */}
      <div className="relative flex items-center justify-center">
        {/* Ambient subtle glow */}
        <div className="absolute w-28 h-28 rounded-full bg-[#1D5FF0]/10 blur-xl pointer-events-none" />

        {/* Concentric boundary rings */}
        <div className="relative w-24 h-24 rounded-3xl bg-white border border-[#E6E6E0] shadow-sm flex items-center justify-center p-2.5">
          {/* Inner dark vault tile */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-full h-full rounded-2xl bg-[#18181B] text-white flex items-center justify-center shadow-md relative overflow-hidden"
          >
            {/* Subtle grid watermark */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* PaperTrail Origami Mark */}
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-xs">
              <path d="M4 3L14 8L8.5 12L4 3Z" fill="white" />
              <path d="M14 8L21 5L16.5 15L14 8Z" fill="#93C5FD" />
              <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="#1D5FF0" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Anchored Cryptographic Verification Strip */}
      <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F6F2] border border-[#E6E6E0] text-[11px] font-medium text-[#4A4E46] shadow-2xs">
        <span className="inline-flex items-center gap-1 font-semibold text-[#18181B]">
          <Lock className="w-3 h-3 text-[#1D5FF0]" />
          AES-256
        </span>
        <span className="text-[#CBD5E1]">•</span>
        <span className="inline-flex items-center gap-1">
          <Database className="w-3 h-3 text-[#1D5FF0]" />
          Neon DB
        </span>
        <span className="text-[#CBD5E1]">•</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero-Knowledge
        </span>
      </div>
    </div>
  );
};

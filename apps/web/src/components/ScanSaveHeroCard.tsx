import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Scan, Sparkles } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const ScanSaveHeroCard: React.FC = () => {
  const { setActiveTab } = useDocumentContext();

  return (
    <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-[#EBF2FE] via-[#E4EFFD] to-[#DCE8FC] p-6 sm:p-7 border border-[#D5E3F9] shadow-[0_10px_30px_rgba(8,97,232,0.06)] relative overflow-hidden flex flex-col justify-between">
      
      {/* Decorative Cloud Shapes & Ambient Glow in Background */}
      <div className="absolute top-2 right-4 w-36 h-36 rounded-full bg-white/40 blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full bg-blue-400/10 blur-2xl pointer-events-none"></div>

      {/* Twinkling Sparkles */}
      <motion.div
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 right-28 text-[#0861E8]"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>
      <motion.div
        animate={{ scale: [1, 0.7, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute bottom-8 right-4 text-[#0861E8]"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Main Content & Phone Graphic Row */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        
        {/* Left Information */}
        <div className="flex-1 max-w-[210px]">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Scan & Save
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
            Capture documents instantly with PaperTrail
          </p>

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('scan')}
            className="mt-5 px-4 py-2 rounded-full bg-[#0861E8] hover:bg-[#0752C5] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all group"
          >
            <span>Scan Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Right: 3D Smartphone Illustration with Animated Document Scanner */}
        <div className="relative w-36 h-40 flex items-center justify-center shrink-0">
          
          {/* Tilted Smartphone Chassis */}
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [-2, 0, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-38 rounded-3xl bg-white border-4 border-[#0861E8] shadow-[0_16px_36px_rgba(8,97,232,0.22)] p-2 relative overflow-hidden flex flex-col items-center justify-between"
          >
            {/* Phone Speaker Notch */}
            <div className="w-8 h-1 bg-slate-300 rounded-full mb-1"></div>

            {/* Phone Screen Viewport */}
            <div className="relative w-full flex-1 rounded-2xl bg-[#E8F1FC] border border-blue-200/60 p-2 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Document Sheet Inside Screen */}
              <div className="relative w-18 h-22 bg-white rounded-lg shadow-sm border border-slate-200/80 p-1.5 flex flex-col justify-between">
                
                {/* 4 Corner Crop Brackets */}
                <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-[#0861E8]"></div>
                <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-[#0861E8]"></div>
                <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-[#0861E8]"></div>
                <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-[#0861E8]"></div>

                {/* Subtle text lines on document */}
                <div className="space-y-1 pt-1 px-1">
                  <div className="w-6 h-1 bg-[#0861E8]/40 rounded-full"></div>
                  <div className="w-full h-0.5 bg-slate-200 rounded-full"></div>
                  <div className="w-4/5 h-0.5 bg-slate-200 rounded-full"></div>
                  <div className="w-full h-0.5 bg-slate-200 rounded-full"></div>
                </div>

                {/* Sweeping Laser Line Animation */}
                <motion.div
                  animate={{ y: [0, 48, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 top-1 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                />

                <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center self-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
              </div>

            </div>

            {/* Home Indicator line */}
            <div className="w-7 h-0.5 bg-slate-300 rounded-full mt-1"></div>
          </motion.div>

        </div>

      </div>

    </div>
  );
};

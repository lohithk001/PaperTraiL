import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const ScanSaveHeroCard: React.FC = () => {
  const { setActiveTab } = useDocumentContext();

  return (
    <div className="w-full h-full rounded-[28px] bg-gradient-to-br from-[#EAF1FF] via-[#E4EFFD] to-[#DCE8FC] p-5 sm:p-6 border border-[#CBD5E1]/70 shadow-subtle relative overflow-hidden flex flex-col justify-between">
      
      {/* Ambient Glow in Background */}
      <div className="absolute top-2 right-4 w-36 h-36 rounded-full bg-white/40 blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full bg-blue-400/10 blur-2xl pointer-events-none"></div>

      {/* Sparkles */}
      <motion.div
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-5 right-24 text-[#1D5FF0]"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Main Content & Phone Graphic Row */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        
        {/* Left Information */}
        <div className="flex-1 max-w-[210px]">
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
            Scan & Save
          </h2>
          <p className="text-xs font-normal text-[#64748B] mt-1.5 leading-relaxed">
            Capture documents instantly with PaperTrail
          </p>

          <motion.button
            whileHover={{ scale: 1.04, x: 2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('scan')}
            className="mt-4 px-4 py-2 rounded-full bg-[#1D5FF0] hover:bg-[#0752D9] text-white font-semibold text-xs shadow-card flex items-center gap-1.5 transition-all group cursor-pointer"
          >
            <span>Scan Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Right: 3D Smartphone Illustration with Animated Document Scanner */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          {/* Smartphone Frame */}
          <div className="relative w-28 h-36 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-1.5 shadow-xl border-2 border-slate-700/60 transform rotate-3 hover:rotate-0 transition-transform">
            
            {/* Screen Viewport */}
            <div className="w-full h-full rounded-xl bg-slate-950 p-2 flex flex-col justify-between relative overflow-hidden">
              
              {/* Document Inside Phone */}
              <div className="w-full h-22 bg-white/95 rounded-md p-1.5 flex flex-col justify-between shadow-xs">
                <div className="h-1 bg-slate-300 rounded w-10"></div>
                <div className="space-y-1">
                  <div className="h-0.5 bg-slate-200 rounded w-full"></div>
                  <div className="h-0.5 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-0.5 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="h-1 bg-[#1D5FF0] rounded w-6"></div>
              </div>

              {/* Blue Scanner Corner Guides */}
              <div className="absolute inset-x-2 inset-y-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#1D5FF0]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#1D5FF0]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#1D5FF0]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#1D5FF0]"></div>
                
                {/* Scanning laser sweep */}
                <motion.div
                  animate={{ top: ['0%', '85%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-[#1D5FF0] shadow-[0_0_8px_#1D5FF0]"
                />
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

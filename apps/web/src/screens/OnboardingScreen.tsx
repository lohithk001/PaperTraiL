import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { HeroIllustration3D } from '../components/HeroIllustration3D';

export const OnboardingScreen: React.FC = () => {
  const { setActiveTab } = useDocumentContext();

  return (
    <div className="relative w-full min-h-[820px] h-full bg-[#F7F9FC] text-[#0F172A] flex flex-col justify-between p-6 sm:p-8 select-none">
      
      {/* Top spacer */}
      <div className="h-4"></div>

      {/* Center 3D Illustration & Copy */}
      <div className="flex flex-col items-center text-center z-10 max-w-sm mx-auto">
        
        {/* Large Blue Document Folder Illustration with Floating PDF, Image and Doc Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center mb-6"
        >
          <HeroIllustration3D />
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl sm:text-[28px] font-bold text-[#0F172A] tracking-tight leading-snug px-2"
        >
          All your important documents in one place
        </motion.h1>

        {/* Supporting description */}
        <motion.p 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-sm font-normal text-[#64748B] mt-3 max-w-[290px] leading-relaxed"
        >
          Store, organize and access your documents securely — anytime, anywhere.
        </motion.p>

        {/* 3 Pagination Dots (Active dot elongated and blue) */}
        <div className="flex items-center gap-2 mt-8">
          <div className="w-6 h-2 rounded-full bg-[#1D5FF0] transition-all"></div>
          <div className="w-2 h-2 rounded-full bg-[#CBD5E1]"></div>
          <div className="w-2 h-2 rounded-full bg-[#CBD5E1]"></div>
        </div>

      </div>

      {/* Bottom Action Area */}
      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 z-10 pb-6"
      >
        <button
          onClick={() => setActiveTab('auth')}
          className="w-full h-[52px] rounded-2xl bg-[#1D5FF0] hover:bg-[#0752D9] active:scale-[0.98] text-white font-semibold text-sm shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className="text-xs font-semibold text-[#1D5FF0] hover:text-[#0752D9] active:scale-95 transition-all py-1 underline underline-offset-4 cursor-pointer"
        >
          I already have an account
        </button>
      </motion.div>

    </div>
  );
};

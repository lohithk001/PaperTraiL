import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Edit3, 
  Check, 
  GraduationCap, 
  CreditCard, 
  FileCode,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { triggerConfetti } from './Confetti';

export const LayeredDocumentCard: React.FC = () => {
  const { 
    documents, 
    setSelectedDocument, 
    markDocumentVerified,
    setActiveDocumentDetail,
    setActiveTab,
    setIsActionSheetOpen
  } = useDocumentContext();

  // Find the primary hero document (College Marksheet or first priority document)
  const heroDoc = documents.find(d => d.title.includes('Marksheet') || d.id === 'doc-hero') || documents[0];

  // Mouse 3D Tilt Motion Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [isVerifiedAnim, setIsVerifiedAnim] = useState(false);

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVerifiedAnim(true);
    triggerConfetti();
    if (heroDoc) {
      markDocumentVerified(heroDoc.id);
    }
    setTimeout(() => setIsVerifiedAnim(false), 2000);
  };

  if (!heroDoc) return null;

  return (
    <div className="relative w-full pt-4 pb-2 select-none">
      
      {/* 3D Stacked Card Layers (Peeking out behind the top edge) */}
      <div className="relative w-full max-w-[620px] mx-auto">
        
        {/* Layer 3: Farthest back card layer */}
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3.5 inset-x-6 h-12 rounded-[28px] bg-gradient-to-r from-[#2B79EF]/60 to-[#1864DB]/60 border border-white/20 shadow-sm transform scale-[0.93] origin-bottom"
        />

        {/* Layer 2: Middle back card layer */}
        <motion.div 
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="absolute -top-2 inset-x-3 h-12 rounded-[30px] bg-gradient-to-r from-[#176EEF]/80 to-[#0A5BD7]/80 border border-white/25 shadow-md transform scale-[0.97] origin-bottom"
        />

        {/* Layer 1: Foreground Signature Cobalt Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.012 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setActiveDocumentDetail(heroDoc);
            setActiveTab('document-detail');
          }}
          className="relative w-full rounded-[32px] bg-gradient-to-br from-[#0861E8] via-[#095FE2] to-[#0448AF] p-6 sm:p-7 text-white shadow-[0_20px_50px_rgba(8,97,232,0.32)] border border-white/25 overflow-hidden cursor-pointer group"
        >
          {/* Subtle Ambient Glow Effect inside card */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-white/15 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-blue-300/10 blur-2xl pointer-events-none"></div>

          {/* Faint Document Outline Watermark Graphic on Bottom Right */}
          <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none transform rotate-3">
            <svg className="w-40 h-44" viewBox="0 0 160 180" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="15" y="15" width="130" height="150" rx="16" />
              <line x1="35" y1="50" x2="105" y2="50" strokeLinecap="round" strokeWidth="4" />
              <line x1="35" y1="72" x2="125" y2="72" strokeLinecap="round" strokeWidth="3" />
              <line x1="35" y1="92" x2="125" y2="92" strokeLinecap="round" strokeWidth="3" />
              <line x1="35" y1="112" x2="95" y2="112" strokeLinecap="round" strokeWidth="3" />
            </svg>
          </div>

          {/* Top Row: Overlapping Avatars + Status Pill + Date Pill */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
            
            <div className="flex items-center gap-3">
              {/* Overlapping Avatar Badges (PDF, ID, Cap) */}
              <div className="flex items-center -space-x-2.5">
                {/* 1. Red PDF Badge */}
                <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
                  <span className="font-black text-[9px] tracking-wider">PDF</span>
                </div>
                {/* 2. Blue ID Card Badge */}
                <div className="w-10 h-10 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
                  <CreditCard className="w-5 h-5 stroke-[2]" />
                </div>
                {/* 3. Dark Blue Graduation Cap Badge */}
                <div className="w-10 h-10 rounded-full bg-[#1A365D] border-2 border-white flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>

              {/* Status Pill: Expiring Soon */}
              <motion.div 
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="px-3 py-1 rounded-full bg-white text-rose-600 font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Expiring Soon</span>
              </motion.div>
            </div>

            {/* Date Pill: Nov 30, 2026 */}
            <div className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs flex items-center gap-1.5 border border-white/25 shadow-xs">
              <Calendar className="w-3.5 h-3.5 opacity-90 stroke-[2]" />
              <span>Nov 30, 2026</span>
            </div>

          </div>

          {/* Middle: Document Title & Expiration Line */}
          <div className="relative z-10 mb-8 mt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-xs">
              {heroDoc.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-white/90 text-sm font-medium">
              <Calendar className="w-4 h-4 opacity-80 stroke-[2]" />
              <span>Expires in {heroDoc.daysLeft ?? 30} days</span>
            </div>
          </div>

          {/* Bottom Action Row: Translucent Pill on left + Pure White Circular Button on right */}
          <div className="relative z-10 flex items-center justify-between pt-1">
            
            {/* View Document Pill */}
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDocumentDetail(heroDoc);
                setActiveTab('document-detail');
              }}
              className="px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm flex items-center gap-2.5 border border-white/30 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 stroke-[2.2]" />
              <span>View Document</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            {/* Circular White Edit Button */}
            <motion.button
              whileHover={{ scale: 1.08, rotate: 6 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDocumentDetail(heroDoc);
                setSelectedDocument(heroDoc);
                setIsActionSheetOpen(true);
              }}
              title="Document Options & Actions"
              className="w-12 h-12 rounded-full bg-white text-[#0861E8] shadow-lg shadow-black/15 flex items-center justify-center transition-all group-hover:shadow-xl"
            >
              <Edit3 className="w-5 h-5 stroke-[2.2] text-[#0861E8]" />
            </motion.button>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

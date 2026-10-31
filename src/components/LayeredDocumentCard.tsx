import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Clock, 
  Flag, 
  Check, 
  ChevronRight, 
  PenTool, 
  ShieldCheck, 
  Car, 
  FileText,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentItem } from '../types';
import { triggerConfetti } from './Confetti';

export const LayeredDocumentCard: React.FC = () => {
  const { 
    heroDocument, 
    stackedDocuments, 
    setSelectedDocument, 
    markDocumentVerified 
  } = useDocumentContext();

  const [activeHeroId, setActiveHeroId] = useState<string | null>(null);
  const [sliderCompleted, setSliderCompleted] = useState(false);

  // Current active document (either user-selected stacked document or default hero)
  const currentDoc: DocumentItem | null = activeHeroId 
    ? (stackedDocuments.find(d => d.id === activeHeroId) || heroDocument)
    : heroDocument;

  // Background stacked documents (excluding the active one)
  const backgroundCards = stackedDocuments.filter(d => d.id !== currentDoc?.id);

  // Slider motion values for interactive drag-to-verify
  const dragX = useMotionValue(0);
  const maxDrag = 140; // drag distance
  const dragProgress = useTransform(dragX, [0, maxDrag], [0, 1]);
  const textOpacity = useTransform(dragX, [0, maxDrag / 2], [1, 0.2]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x >= maxDrag * 0.75) {
      handleComplete();
    } else {
      dragX.set(0);
    }
  };

  const handleComplete = () => {
    if (currentDoc) {
      setSliderCompleted(true);
      triggerConfetti();
      markDocumentVerified(currentDoc.id);
      setTimeout(() => {
        setSliderCompleted(false);
        dragX.set(0);
      }, 1500);
    }
  };

  if (!currentDoc) {
    return (
      <div className="mx-6 my-4 p-8 rounded-3xl bg-white border border-charcoal-200/80 text-center">
        <FileText className="w-10 h-10 text-charcoal-400 mx-auto mb-2" />
        <p className="text-charcoal-600 font-semibold">No documents found</p>
      </div>
    );
  }

  return (
    <div className="relative px-6 pt-5 pb-3">
      {/* Container for 3D Layered Cards */}
      <div className="relative w-full max-w-md mx-auto">
        
        {/* Layer 3 - Farthest Back Card (Deepest Stack) */}
        {backgroundCards[1] && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.88 }}
            animate={{ opacity: 0.65, y: -28, scale: 0.88 }}
            whileHover={{ y: -34, opacity: 0.85 }}
            onClick={() => setActiveHeroId(backgroundCards[1].id)}
            className="absolute top-0 left-0 right-0 h-44 rounded-3.5xl bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md cursor-pointer -z-20 transform origin-top flex items-start justify-between px-6 pt-3 text-white/80"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wide">
                {backgroundCards[1].title}
              </span>
            </div>
            <span className="text-[11px] font-medium bg-white/20 px-2.5 py-0.5 rounded-full">
              Tap to view
            </span>
          </motion.div>
        )}

        {/* Layer 2 - Middle Stacked Card */}
        {backgroundCards[0] && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 0.88, y: -16, scale: 0.94 }}
            whileHover={{ y: -22, opacity: 1 }}
            onClick={() => setActiveHeroId(backgroundCards[0].id)}
            className="absolute top-0 left-0 right-0 h-48 rounded-3.5xl bg-gradient-to-r from-primary-dark via-primary to-blue-600 shadow-lg cursor-pointer -z-10 transform origin-top flex items-start justify-between px-6 pt-3 text-white"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-200" />
              <span className="text-xs font-bold tracking-tight truncate max-w-[200px]">
                {backgroundCards[0].title}
              </span>
            </div>
            <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              {backgroundCards[0].category}
            </span>
          </motion.div>
        )}

        {/* Layer 1 - FOREGROUND PRIMARY COBALT BLUE CARD (Signature Hero) */}
        <motion.div
          layout
          key={currentDoc.id}
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3.5xl bg-primary text-white p-6 shadow-card overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0961E8 0%, #0654CF 100%)',
          }}
        >
          {/* Subtle decorative background watermarks */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/[0.04] pointer-events-none blur-2xl" />
          <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-white/[0.06] pointer-events-none blur-xl" />

          {/* Card Top Row: 3 Avatar Badges + Expiry Pill */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            {/* 3 Circular Badges / Avatars overlapping */}
            <div className="flex items-center -space-x-2.5">
              {/* Badge 1: Identity / Shield */}
              <div className="w-10 h-10 rounded-full bg-[#FFE4E6] border-2 border-primary flex items-center justify-center shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" fill="#F472B6" />
                  <circle cx="14" cy="16" r="1.5" fill="#1F242D" />
                  <circle cx="22" cy="16" r="1.5" fill="#1F242D" />
                  <path d="M15 21 C16.5 23, 19.5 23, 21 21" stroke="#1F242D" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="18" cy="11" r="3" fill="#FBCFE8" />
                </svg>
              </div>

              {/* Badge 2: Auto / Category */}
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-primary flex items-center justify-center shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" fill="#FBBF24" />
                  <circle cx="14" cy="16" r="1.5" fill="#1F242D" />
                  <circle cx="22" cy="16" r="1.5" fill="#1F242D" />
                  <path d="M15 21 C16.5 22.5, 19.5 22.5, 21 21" stroke="#1F242D" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 11 L18 8 L24 11" stroke="#92400E" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Badge 3: Policy / Security */}
              <div className="w-10 h-10 rounded-full bg-[#E0E7FF] border-2 border-primary flex items-center justify-center shadow-sm">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="14" fill="#818CF8" />
                  <circle cx="14" cy="16" r="1.5" fill="#1F242D" />
                  <circle cx="22" cy="16" r="1.5" fill="#1F242D" />
                  <path d="M15 21 C16.5 22.5, 19.5 22.5, 21 21" stroke="#1F242D" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="18" cy="10" r="2.5" fill="#C7D2FE" />
                </svg>
              </div>
            </div>

            {/* Time / Date / Expiry Pill on right */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[12.5px] font-semibold border border-white/20">
              <Clock className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>
                {currentDoc.daysLeft !== null
                  ? `${currentDoc.daysLeft} Days Left`
                  : currentDoc.issueDate}
              </span>
            </div>
          </div>

          {/* Status Badge: e.g. "🏳 High" or "EXPIRING SOON" */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[12px] font-extrabold tracking-tight text-rose-500 shadow-xs">
              <Flag className="w-3 h-3 fill-rose-500" />
              <span>{currentDoc.badgeLabel || 'EXPIRING SOON'}</span>
            </span>
          </div>

          {/* Main Title: Large Bold Typography */}
          <div className="mb-6">
            <h2 className="text-[28px] sm:text-[30px] font-extrabold text-white leading-[1.12] tracking-tight">
              {currentDoc.title.includes(' ') ? (
                <>
                  {currentDoc.title.split(' ').map((word, i) => (
                    <span key={i} className="block">
                      {word}
                    </span>
                  ))}
                </>
              ) : (
                currentDoc.title
              )}
            </h2>

            {/* Supporting Information */}
            <p className="text-[13px] font-medium text-white/80 mt-2 flex items-center gap-1.5">
              <span>{currentDoc.issuer || 'Official Document'}</span>
              <span>•</span>
              <span>{currentDoc.policyNumber || 'Verified ID'}</span>
            </p>
          </div>

          {/* Bottom Action Row: Translucent slider pill + White circular options button */}
          <div className="flex items-center gap-3 relative z-10 pt-1">
            {/* Draggable / Slide-to-verify pill matching reference exact layout */}
            <div className="relative flex-1 h-13 rounded-full bg-white/20 backdrop-blur-md p-1.5 flex items-center border border-white/20 overflow-hidden select-none">
              
              {/* Text label inside pill */}
              <motion.div 
                style={{ opacity: textOpacity }}
                className="absolute inset-0 flex items-center justify-center pl-10 pr-4 pointer-events-none"
              >
                <div className="flex items-center gap-1.5 text-white text-[13px] font-bold tracking-tight">
                  <span>
                    {sliderCompleted
                      ? 'Verified & Safe!'
                      : currentDoc.isVerified
                      ? 'Drag to verify again'
                      : 'Drag to mark done'}
                  </span>
                  <span className="text-white/70 tracking-widest text-[11px] font-extrabold">
                    &gt;&gt;&gt;
                  </span>
                </div>
              </motion.div>

              {/* Draggable Circle Handle */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ x: dragX }}
                onDragEnd={handleDragEnd}
                onClick={handleComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md cursor-grab active:cursor-grabbing z-20 border border-white/30"
              >
                {sliderCompleted ? (
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                ) : (
                  <Check className="w-5 h-5 stroke-[3]" />
                )}
              </motion.div>
            </div>

            {/* Separate White Circular Action Button (Edit / View details) */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedDocument(currentDoc)}
              title="View & Edit Document"
              className="w-12 h-12 rounded-full bg-white text-charcoal-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <PenTool className="w-5 h-5 stroke-[2] text-charcoal-800" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

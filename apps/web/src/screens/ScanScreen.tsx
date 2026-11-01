import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Zap, 
  ZapOff, 
  Image as ImageIcon, 
  RefreshCw, 
  Check, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { captureDocumentPhoto, pickGalleryPhoto } from '../services/nativeService';

export const ScanScreen: React.FC = () => {
  const { setActiveTab, addDocument } = useDocumentContext();

  const [streamActive, setStreamActive] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanMode, setScanMode] = useState<'QR' | 'Document' | 'Photo'>('Document');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 } },
            audio: false,
          });
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreamActive(true);
          }
        }
      } catch (err) {
        console.warn('Live camera stream not supported in current environment:', err);
        setStreamActive(false);
      }
    };

    if (!capturedImage) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage, facingMode]);

  const handleCapture = async () => {
    // If native platform, attempt native camera first
    const nativePhoto = await captureDocumentPhoto();
    if (nativePhoto) {
      setCapturedImage(nativePhoto);
      processScannedDoc(nativePhoto);
      return;
    }

    // If live HTML5 stream active
    if (streamActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
        processScannedDoc(dataUrl);
        return;
      }
    }

    // Fallback simulated document capture
    setCapturedImage('captured');
    processScannedDoc('captured');
  };

  const processScannedDoc = (imgUri: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      addDocument({
        title: `${scanMode === 'QR' ? 'QR Code Scanned Doc' : scanMode === 'Document' ? 'Scanned Document' : 'Photo Document'}`,
        category: scanMode === 'QR' ? 'Identity' : 'Insurance',
        fileType: 'jpg',
        fileSize: '1.4 MB',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '2027-11-30',
        daysLeft: 365,
        isExpiringSoon: false,
        isVerified: true,
        tags: [scanMode.toLowerCase(), 'camera-scan'],
        badgeLabel: 'SCANNED',
        badgeType: 'info',
      });
      setActiveTab('documents');
    }, 1000);
  };

  const handleGalleryPick = async () => {
    const photo = await pickGalleryPhoto();
    if (photo) {
      setCapturedImage(photo);
      processScannedDoc(photo);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setCapturedImage(result);
        processScannedDoc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="relative w-full min-h-[820px] h-full bg-[#0D0E15] text-white flex flex-col justify-between overflow-hidden select-none safe-top safe-bottom">
      
      {/* Hidden File Input for fallback gallery pick */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* 1. Top Bar (Close button left, Flash button right) */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-4">
        <button
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
            flashOn ? 'text-[#F5A623] bg-black/70' : 'text-white/90 hover:text-white'
          }`}
        >
          {flashOn ? <Zap className="w-5 h-5 fill-[#F5A623]" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Camera Viewport & Document Detection Frame */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        
        {/* Live Camera Video Feed */}
        {streamActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Viewport Ambient Background */
          <div className="absolute inset-0 bg-gradient-to-b from-[#12141F] to-[#0A0B10] flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
        )}

        {/* High-Contrast Blue Corner Brackets Framing (Screen 8 Spec: #1D5FF0) */}
        <div className="relative w-full max-w-[320px] aspect-[3/4] z-10 flex flex-col items-center justify-center">
          
          {/* Top-Left */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#1D5FF0] rounded-tl-xl pointer-events-none"></div>
          {/* Top-Right */}
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#1D5FF0] rounded-tr-xl pointer-events-none"></div>
          {/* Bottom-Left */}
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#1D5FF0] rounded-bl-xl pointer-events-none"></div>
          {/* Bottom-Right */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#1D5FF0] rounded-br-xl pointer-events-none"></div>

          {/* Sweeping Laser Scan Line */}
          <motion.div
            animate={{ top: ['5%', '92%', '5%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-2 right-2 h-[2px] bg-[#1D5FF0] shadow-[0_0_12px_#1D5FF0] z-20 pointer-events-none"
          />

          {/* Document Framing Viewfinder Canvas (Screen 8 Spec) */}
          <div className="w-[88%] h-[88%] bg-[#EFECE6]/90 rounded-lg shadow-2xl p-5 flex flex-col justify-between text-slate-800 pointer-events-none">
            
            {/* Document Header */}
            <div className="border-b border-slate-300 pb-2 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">
                INSURANCE POLICY
              </span>
              <p className="text-[7px] text-[#64748B] font-mono mt-0.5">
                POLICY NO: HDF-ERGO-88492041-02
              </p>
            </div>

            {/* Document Body Lines */}
            <div className="space-y-1.5 py-2">
              <div className="h-1.5 bg-slate-400/40 rounded w-full"></div>
              <div className="h-1.5 bg-slate-400/40 rounded w-11/12"></div>
              <div className="h-1.5 bg-slate-400/30 rounded w-4/5"></div>
              <div className="h-1.5 bg-slate-400/30 rounded w-10/12"></div>
              <div className="h-1.5 bg-slate-400/30 rounded w-3/4"></div>
              <div className="h-1.5 bg-slate-400/30 rounded w-5/6"></div>
            </div>

            {/* Document Bottom */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-300 text-[7px] font-mono text-[#64748B]">
              <span>VALID UNTIL: NOV 30, 2026</span>
              <span className="text-[#1D5FF0] font-bold">COVERAGE: ₹15,00,000</span>
            </div>

          </div>

        </div>

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#1D5FF0] animate-spin"></div>
            <p className="text-xs font-semibold text-white tracking-wide">
              Analyzing & OCR Extracting Document...
            </p>
          </div>
        )}

      </div>

      {/* 3. Bottom Controls & Mode Selector (Screen 8 Spec: QR / Document / Photo) */}
      <div className="relative z-20 flex flex-col items-center gap-6 p-6 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent">
        
        {/* Mode Selector: QR / Document / Photo */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-semibold">
          {(['QR', 'Document', 'Photo'] as const).map((mode) => {
            const isActive = scanMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setScanMode(mode)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1D5FF0] text-white shadow-card'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* Bottom Shutter & Action Row */}
        <div className="w-full max-w-xs flex items-center justify-between px-4">
          
          {/* Gallery Thumbnail (Left) */}
          <button
            onClick={handleGalleryPick}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
            title="Import from Gallery"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Large White Shutter Button (Center) */}
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 active:scale-90 transition-transform cursor-pointer shadow-float"
          >
            <div className="w-full h-full rounded-full bg-white active:bg-slate-200 transition-colors"></div>
          </button>

          {/* Camera Flip Control (Right) */}
          <button
            onClick={toggleCameraFacing}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
};

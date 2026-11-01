import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  RotateCw, 
  Check, 
  X, 
  Upload, 
  Sparkles, 
  Zap, 
  FileText, 
  Scan,
  RefreshCw
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { DocumentCategory } from '../types';
import { triggerConfetti } from '../components/Confetti';

export const ScanScreen: React.FC = () => {
  const { addDocument, setActiveTab, setSelectedDocument, deviceViewMode } = useDocumentContext();

  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // Form fields extracted from scanned document
  const [scannedTitle, setScannedTitle] = useState('Medical Dental Coverage Card');
  const [scannedCategory, setScannedCategory] = useState<DocumentCategory>('Medical');
  const [scannedIssuer, setScannedIssuer] = useState('BlueCross BlueShield');
  const [scannedExpiry, setScannedExpiry] = useState('2027-10-31');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera stream if available
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 } },
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
        console.warn('Camera stream not accessible, using scanner simulation mode:', err);
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
  }, [capturedImage]);

  // Capture shutter action
  const handleCapture = () => {
    if (streamActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        simulateOCR();
        return;
      }
    }

    // Fallback simulated document capture
    setCapturedImage(
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    );
    simulateOCR();
  };

  // Gallery upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        simulateOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Auto-extract metadata
      setScannedTitle('Property Tax Receipt 2026');
      setScannedCategory('Finance');
      setScannedIssuer('Municipal Tax Directorate');
      setScannedExpiry('2027-03-31');
    }, 1200);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setRotation(0);
  };

  const handleSaveScanned = () => {
    const newDoc = addDocument({
      title: scannedTitle,
      category: scannedCategory,
      fileType: 'jpg',
      fileSize: '1.4 MB',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: scannedExpiry,
      daysLeft: 365,
      isExpiringSoon: false,
      isVerified: true,
      policyNumber: `SCAN-${Math.floor(100000 + Math.random() * 900000)}`,
      issuer: scannedIssuer,
      notes: 'Captured via PaperTrail High-Res Mobile Document Scanner.',
      tags: ['Scanned', scannedCategory, 'Instant Vault'],
      badgeLabel: 'SCANNED & VERIFIED',
      badgeType: 'success',
      accentColor: '#0861E8',
      thumbnailUrl: capturedImage || undefined,
    });

    triggerConfetti();
    setSelectedDocument(newDoc);
    setActiveTab('documents');
  };

  return (
    <div className={`w-full ${deviceViewMode === 'mobile' ? 'px-6 pt-5 pb-8' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Scanner Vault
          </h2>
          <p className="text-xs font-semibold text-charcoal-500 mt-0.5">
            Auto-detect edges & OCR text extraction
          </p>
        </div>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            flashOn
              ? 'bg-amber-400 text-charcoal-900 border-amber-400 shadow-md'
              : 'bg-white text-charcoal-700 border-charcoal-200/80 shadow-xs'
          }`}
          title="Toggle Flash"
        >
          <Zap className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {!capturedImage ? (
        /* Camera Viewport */
        <div className="relative rounded-3.5xl overflow-hidden bg-charcoal-900 aspect-[3/4] max-h-[460px] shadow-lg flex flex-col justify-between p-4">
          {/* Live Video Stream or Realistic Scanner Canvas */}
          <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: streamActive ? 'block' : 'none' }}
            />
            {!streamActive && (
              <div className="w-full h-full bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white/80">
                <Scan className="w-16 h-16 text-primary mb-3 animate-pulse" />
                <p className="text-sm font-bold text-white">Scanner Active & Ready</p>
                <p className="text-xs text-charcoal-400 max-w-xs mt-1">
                  Point camera at document or upload an image file
                </p>
              </div>
            )}
          </div>

          {/* Flashlight glow simulation */}
          {flashOn && (
            <div className="absolute inset-0 bg-white/10 pointer-events-none z-10" />
          )}

          {/* Document Framing Bounds / Edge Guides */}
          <div className="relative z-10 m-3 flex-1 border-2 border-dashed border-white/60 rounded-2xl flex flex-col justify-between p-3 pointer-events-none">
            <div className="flex justify-between items-center text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              <span>Align corners inside frame</span>
            </div>

            {/* Glowing Laser Scan Line */}
            <motion.div
              animate={{ y: [0, 260, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]"
            />

            <div className="flex justify-end">
              <span className="text-[10px] font-bold text-primary-muted bg-primary/80 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                Auto-Crop Active
              </span>
            </div>
          </div>

          {/* Bottom Controls: Shutter Button & File Import */}
          <div className="relative z-20 flex items-center justify-around pt-2">
            {/* Gallery Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 hover:bg-white/30 active:scale-90 transition-all"
              title="Upload file or photo"
            >
              <Upload className="w-5 h-5 stroke-[2]" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {/* Big Shutter Button */}
            <button
              onClick={handleCapture}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center shadow-float active:scale-90 transition-transform bg-primary hover:bg-primary-hover"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary">
                <Camera className="w-7 h-7 stroke-[2.2]" />
              </div>
            </button>

            {/* Helper toggle */}
            <button
              onClick={handleCapture}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 hover:bg-white/30 active:scale-90 transition-all"
              title="Auto Sample"
            >
              <Sparkles className="w-5 h-5 stroke-[2] text-amber-300" />
            </button>
          </div>
        </div>
      ) : (
        /* Scanned Document Preview & OCR Review */
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 shadow-md">
            <div className="aspect-[4/3] flex items-center justify-center overflow-hidden bg-neutral-900">
              <img
                src={capturedImage}
                alt="Scanned Preview"
                className="w-full h-full object-contain transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </div>

            {/* Rotation / Retake Actions floating on preview */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={handleRotate}
                title="Rotate 90 degrees"
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 active:scale-90 transition-all"
              >
                <RotateCw className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                onClick={handleRetake}
                title="Retake photo"
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 active:scale-90 transition-all"
              >
                <RefreshCw className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* OCR Processing Banner */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                <p className="text-sm font-bold">Scanning text & metadata...</p>
              </div>
            )}
          </div>

          {/* Extracted Details Form */}
          <div className="p-4 rounded-3xl bg-white border border-charcoal-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Sparkles className="w-4 h-4" />
              <span>AI Extracted Details</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={scannedTitle}
                onChange={(e) => setScannedTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={scannedCategory}
                  onChange={(e) => setScannedCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary bg-white"
                >
                  <option value="Insurance">Insurance</option>
                  <option value="Identity">Identity</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Education">Education</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Finance">Finance</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={scannedExpiry}
                  onChange={(e) => setScannedExpiry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                Issuer / Authority
              </label>
              <input
                type="text"
                value={scannedIssuer}
                onChange={(e) => setScannedIssuer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-900 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 rounded-full border border-charcoal-200 font-bold text-xs text-charcoal-700 hover:bg-neutral-50 active:scale-95 transition-all"
              >
                Retake
              </button>
              <button
                onClick={handleSaveScanned}
                className="flex-2 py-3 px-5 rounded-full bg-primary font-bold text-xs text-white shadow-md shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save to Vault</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone, 
  Maximize2, 
  PlusCircle, 
  RotateCcw 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    deviceViewMode, 
    setDeviceViewMode, 
    setIsUploadModalOpen 
  } = useDocumentContext();

  const handleReset = () => {
    if (window.confirm('Reset PaperTrail vault data to initial sample documents?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#EBECEF] text-charcoal-800 flex flex-col items-center justify-start p-0 md:p-6 lg:p-8 font-sans antialiased selection:bg-primary/20 selection:text-primary">
      
      {/* Top Desktop Utility Bar (Only visible on md+ screens) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 text-xs font-semibold text-charcoal-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-charcoal-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-bold text-charcoal-900">PaperTrail Vault</span>
            <span className="text-charcoal-400">|</span>
            <span className="text-charcoal-500">AES-256 Encrypted</span>
          </div>
          <span className="text-charcoal-500 text-[11px]">
            Design Reference Recreated Pixel-for-Pixel
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/90 backdrop-blur-sm p-1 rounded-full border border-charcoal-200 shadow-xs">
            <button
              onClick={() => setDeviceViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                deviceViewMode === 'mobile'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Reference Mobile View</span>
            </button>
            <button
              onClick={() => setDeviceViewMode('responsive')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                deviceViewMode === 'responsive'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expanded View</span>
            </button>
          </div>

          {/* Quick Add Document button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-full text-xs font-bold shadow-xs hover:bg-primary-hover active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Upload Doc</span>
          </button>

          {/* Reset sample data */}
          <button
            onClick={handleReset}
            title="Reset vault demo data"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-charcoal-200 flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 shadow-xs active:scale-90 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceViewMode === 'mobile'
            ? 'max-w-[430px] rounded-[0px] md:rounded-[48px] bg-[#F7F7F7] shadow-none md:shadow-device md:border-[7px] md:border-[#1F242D]/10 overflow-hidden relative min-h-screen md:min-h-[890px] flex flex-col justify-between'
            : 'max-w-5xl rounded-[32px] bg-[#F7F7F7] shadow-xl border border-charcoal-200 overflow-hidden relative min-h-[890px] flex flex-col justify-between'
        }`}
      >
        {/* iOS Top Status Bar (Only in mobile viewport mode) */}
        {deviceViewMode === 'mobile' && (
          <div className="pt-3 pb-1 px-7 flex items-center justify-between text-[14px] font-semibold text-charcoal-900 select-none bg-transparent">
            <span>9:41</span>
            
            {/* Dynamic Island / speaker notch simulation */}
            <div className="w-24 h-4 bg-charcoal-900/10 rounded-full hidden md:block"></div>

            <div className="flex items-center gap-1.5 text-charcoal-900">
              <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
              <Battery className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        )}

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto pb-28 relative">
          {children}
        </div>

        {/* Bottom Home Indicator Bar (Mobile mode) */}
        {deviceViewMode === 'mobile' && (
          <div className="w-full pb-2 pt-1 flex justify-center pointer-events-none select-none">
            <div className="w-36 h-1.5 bg-charcoal-900/80 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

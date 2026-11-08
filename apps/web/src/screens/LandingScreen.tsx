import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Bell, 
  FileText, 
  Sparkles, 
  Clock, 
  GraduationCap, 
  CreditCard, 
  Heart, 
  Car, 
  Receipt, 
  Wrench,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { useVaultAuth } from '../auth/ClerkAuthProvider';
import { Button, CategoryIcon, Badge } from '../components/ui';

export const LandingScreen: React.FC = () => {
  const { setActiveTab } = useDocumentContext();
  const { isSignedIn } = useVaultAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      setActiveTab('home');
    } else {
      window.location.hash = 'sign-up';
      setActiveTab('auth');
    }
  };

  const handleSignIn = () => {
    if (isSignedIn) {
      setActiveTab('home');
    } else {
      window.location.hash = 'sign-in';
      setActiveTab('auth');
    }
  };

  const categories = [
    { name: 'Identity', desc: 'Passports, National ID, Driver Licenses', icon: 'Identity' },
    { name: 'Insurance', desc: 'Health, Term Life, Property & Motor', icon: 'Insurance' },
    { name: 'Education', desc: 'Degree Certificates, Marksheets, Diplomas', icon: 'Education' },
    { name: 'Vehicle', desc: 'Registration Certificate, Pollution, Permits', icon: 'Vehicle' },
    { name: 'Finance', desc: 'Tax Filings, Investment Records, Bank Proofs', icon: 'Finance' },
    { name: 'Medical', desc: 'Prescriptions, Diagnostic Reports, Immunizations', icon: 'Medical' },
    { name: 'Warranties', desc: 'Electronics, Appliances, Hardware Claims', icon: 'Warranty' },
    { name: 'Bills and receipts', desc: 'Invoices, Utility Bills, Property Tax Receipts', icon: 'Bills and receipts' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F6F6F2] text-[#20211F] font-sans antialiased selection:bg-[#1D5FF0] selection:text-white">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E6E6E0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#20211F] text-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 3L14 8L8.5 12L4 3Z" fill="white" />
                <path d="M14 8L21 5L16.5 15L14 8Z" fill="white" />
                <path d="M8.5 12L14 8L16.5 15L9.5 21L8.5 12Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-[#20211F]">
              PaperTraiL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#6B6E66]">
            <a href="#features" className="hover:text-[#20211F] transition-colors">Features</a>
            <a href="#categories" className="hover:text-[#20211F] transition-colors">Categories</a>
            <a href="#security" className="hover:text-[#20211F] transition-colors">Security</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E6E6E0] text-xs font-semibold text-[#6B6E66] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1D5FF0]" />
            <span>Personal Sovereign Document Vault</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#20211F] leading-[1.12]">
            Every important document.<br />
            <span className="text-[#1D5FF0]">One secure place.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#6B6E66] max-w-2xl mx-auto leading-relaxed">
            PaperTrail acts as your digital vault. Upload passports, degree certificates, vehicle registration, and insurance policies with automatic expiration alerts, smart categorization, and zero-knowledge cloud encryption.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4" />}
              onClick={handleGetStarted}
            >
              Create Your Vault Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSignIn}
            >
              Sign In with Existing Account
            </Button>
          </div>

          {/* Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-[#6B6E66]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              500 MB Free Encrypted Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#1D5FF0]" />
              AES-256 Storage at Rest
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1D5FF0]" />
              Automated Renewal Reminders
            </span>
          </div>

        </div>

        {/* Realistic Vault Preview Graphic */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          <div className="bg-white rounded-3xl border border-[#E6E6E0] p-5 sm:p-7 shadow-lg shadow-black/5 space-y-4">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-[#E6E6E0] pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span className="font-semibold text-[#20211F]">Encrypted Vault Preview</span>
              </div>
              <span className="font-medium text-[#9B9E96]">Zero-Knowledge AES-256</span>
            </div>

            {/* Mock Document Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-2">
                <div className="flex items-center justify-between">
                  <CategoryIcon category="Identity" size="sm" />
                  <Badge variant="success" size="sm">Verified</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#20211F]">International Passport</h4>
                  <p className="text-[11px] text-[#9B9E96] mt-0.5">Government of India • Exp: 2032</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-2">
                <div className="flex items-center justify-between">
                  <CategoryIcon category="Insurance" size="sm" />
                  <Badge variant="warning" size="sm">24d left</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#20211F]">Comprehensive Motor Policy</h4>
                  <p className="text-[11px] text-[#9B9E96] mt-0.5">HDFC ERGO • Policy #481920</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-2">
                <div className="flex items-center justify-between">
                  <CategoryIcon category="Education" size="sm" />
                  <Badge variant="default" size="sm">Academic</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#20211F]">B.Tech Degree Certificate</h4>
                  <p className="text-[11px] text-[#9B9E96] mt-0.5">IIT Madras • Added 2024</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="py-16 bg-white border-y border-[#E6E6E0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#20211F]">
              Designed for life's vital documents
            </h2>
            <p className="text-sm text-[#6B6E66]">
              Simple enough for anyone to use, while the architecture handles security, storage, and lifecycle tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] text-[#1D5FF0] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#20211F]">Automated Expiry Alerts</h3>
              <p className="text-xs text-[#6B6E66] leading-relaxed">
                Never miss an insurance renewal, vehicle pollution test, or passport expiry. PaperTrail alerts you 30, 15, and 3 days before any deadline.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EDD8] text-[#3D5A14] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#20211F]">Zero-Knowledge Storage</h3>
              <p className="text-xs text-[#6B6E66] leading-relaxed">
                Files are encrypted at rest with AES-256 and stored directly in secure Neon PostgreSQL DB. Only your authenticated key decrypts your vault.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4EDD5] text-[#8C6D1F] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#20211F]">Smart OCR & Instant Search</h3>
              <p className="text-xs text-[#6B6E66] leading-relaxed">
                Metadata, policy numbers, and dates are extracted upon upload. Search for any document in milliseconds using keyboard shortcuts.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SUPPORTED CATEGORIES */}
      <section id="categories" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#20211F]">
              Everything in its proper place
            </h2>
            <p className="text-sm text-[#6B6E66]">
              PaperTrail categorizes documents into standard vault domains:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {categories.map((c) => (
              <div 
                key={c.name}
                className="p-4 rounded-2xl bg-white border border-[#E6E6E0] shadow-2xs space-y-2"
              >
                <CategoryIcon category={c.name} size="sm" />
                <h4 className="text-xs font-semibold text-[#20211F]">{c.name}</h4>
                <p className="text-[11px] text-[#9B9E96]">{c.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SECURITY ARCHITECTURE */}
      <section id="security" className="py-16 bg-white border-t border-[#E6E6E0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="w-12 h-12 rounded-2xl bg-[#E8EDD8] text-[#3D5A14] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20211F]">
              Cryptographic Guarantees
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6E66]">
              Security by architecture, not promises. Every layer of PaperTrail is built on audited standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-1">
              <span className="font-semibold text-xs text-[#20211F]">AES-256 Encryption</span>
              <p className="text-[11px] text-[#6B6E66]">Stored files are encrypted at rest with military-grade AES-256.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-1">
              <span className="font-semibold text-xs text-[#20211F]">TLS 1.3 In Transit</span>
              <p className="text-[11px] text-[#6B6E66]">All uploads and downloads are strictly tunneled over encrypted TLS.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] space-y-1">
              <span className="font-semibold text-xs text-[#20211F]">Clerk Authentication</span>
              <p className="text-[11px] text-[#6B6E66]">JWT session signatures enforce row-level ownership on Neon DB.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-8 bg-[#F6F6F2] border-t border-[#E6E6E0] text-xs text-[#9B9E96]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#20211F]">PaperTraiL Vault</span>
            <span>•</span>
            <span>Sovereign Personal Document Storage</span>
          </div>
          <div>
            © {new Date().getFullYear()} PaperTrail. Zero-knowledge encrypted personal vault.
          </div>
        </div>
      </footer>

    </div>
  );
};

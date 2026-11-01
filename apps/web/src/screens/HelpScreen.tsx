import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Key, 
  FileCheck, 
  Share2, 
  HardDrive, 
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Mail
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const HelpScreen: React.FC = () => {
  const { setIsAssistantOpen } = useDocumentContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is my personal document vault encrypted?',
      a: 'All files stored in PaperTrail are encrypted both in transit (TLS 1.3) and at rest using AES-256 military-grade encryption with unique zero-knowledge envelope keys.',
    },
    {
      q: 'Can I share a document without exposing my full vault?',
      a: 'Yes. PaperTrail allows you to generate signed, time-limited download links with permission controls (View Only or Download) that automatically expire after your chosen duration.',
    },
    {
      q: 'How do document expiry reminders work?',
      a: 'PaperTrail automatically extracts expiration dates via OCR for insurance policies, warranties, and identity cards, and sends push or email notifications 30, 15, and 3 days before deadline.',
    },
    {
      q: 'Does PaperTrail work offline on my Android device?',
      a: 'Yes! The native Capacitor Android application caches your documents securely on your device storage, enabling instant viewing even when you have no cellular connection.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
          Help & Knowledge Base
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
          Everything you need to know about PaperTrail vault security, features, and setup.
        </p>
      </div>

      {/* Support Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => setIsAssistantOpen(true)}
          className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/50 transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] text-[#1D5FF0] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1D5FF0] transition-colors">
              Ask PaperTrail AI Assistant
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Ask natural questions about your documents, policies, or marksheet scores.
            </p>
          </div>
        </div>

        <div 
          onClick={() => alert('Support team contact: support@papertrail.io')}
          className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-subtle hover:border-[#1D5FF0]/50 transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8F6EF] text-[#27A879] flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#27A879] transition-colors">
              Contact Vault Support
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Need assistance with your vault? Email our dedicated engineering support.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-subtle space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A]">Frequently Asked Questions</h2>
        
        <div className="divide-y divide-[#E2E8F0]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-[#0F172A] hover:text-[#1D5FF0] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#1D5FF0]' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

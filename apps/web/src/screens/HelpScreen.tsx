import React, { useState } from 'react';
import { 
  ChevronDown, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Clock 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { PageHeader, SectionHeader, Button, toast } from '../components/ui';

export const HelpScreen: React.FC = () => {
  const { setIsAssistantOpen } = useDocumentContext();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is my personal document vault encrypted?',
      a: 'All documents stored in PaperTrail are encrypted in transit via TLS 1.3 and at rest directly in Neon PostgreSQL DB using AES-256 with tenant-isolated user ownership.',
    },
    {
      q: 'Can I share a document without exposing my full vault?',
      a: 'Yes. PaperTrail allows you to generate signed, time-limited share links with granular permission controls (View Only or View & Download) that automatically expire after your chosen duration.',
    },
    {
      q: 'How do document expiry reminders work?',
      a: 'PaperTrail extracts expiration dates via OCR during document upload for insurance policies, warranties, and identity cards, and sends push or email notifications 30, 15, and 3 days before deadline.',
    },
    {
      q: 'Does PaperTrail work offline on mobile devices?',
      a: 'Yes! The native Capacitor Android application caches your documents securely on your device storage, enabling instant viewing even when you have no network connection.',
    },
  ];

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* Header */}
      <PageHeader
        title="Help & Knowledge Base"
        subtitle="Guides, security details, and direct support for your personal vault"
      />

      {/* Support Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => setIsAssistantOpen(true)}
          className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs hover:border-[#CFCFC8] transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] text-[#1D5FF0] flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#20211F] group-hover:text-[#1D5FF0] transition-colors">
              Vault AI Assistant
            </h3>
            <p className="text-xs text-[#6B6E66] mt-0.5">
              Ask natural questions about your documents, policies, or coverage terms.
            </p>
          </div>
        </div>

        <div 
          onClick={() => toast.info('Engineering Support', 'Reach our team directly at support@papertrail.io (available 24/7)')}
          className="bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xs hover:border-[#CFCFC8] transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8EDD8] text-[#3D5A14] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#20211F] group-hover:text-[#1D5FF0] transition-colors">
              Contact Engineering Support
            </h3>
            <p className="text-xs text-[#6B6E66] mt-0.5">
              Email our dedicated engineering team for assistance with account or data queries.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E6E0] shadow-xs space-y-4">
        <SectionHeader title="Frequently Asked Questions" />
        
        <div className="divide-y divide-[#E6E6E0]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#20211F] hover:text-[#1D5FF0] transition-colors cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#646860] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-[#6B6E66] mt-2 leading-relaxed">
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Lock, 
  UserCheck, 
  Trash2, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'retention' | 'dpdp';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D5FF0] flex items-center justify-center">
                <Scale className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Legal & Compliance Center
                </h3>
                <p className="text-xs text-slate-500">
                  Transparency, privacy rights & regulatory disclosures
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'privacy'
                  ? 'border-[#1D5FF0] text-[#1D5FF0]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('dpdp')}
              className={`px-3.5 py-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'dpdp'
                  ? 'border-[#1D5FF0] text-[#1D5FF0]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              DPDP Act (India)
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'terms'
                  ? 'border-[#1D5FF0] text-[#1D5FF0]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('retention')}
              className={`px-3.5 py-2.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'retention'
                  ? 'border-[#1D5FF0] text-[#1D5FF0]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Retention & Erasure
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1D5FF0] shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <p className="font-bold">Zero-Knowledge Storage Model</p>
                    <p className="mt-0.5">
                      PaperTrail uses AES-256-GCM envelope encryption. Document binaries are encrypted with user-derived keys before writing to database storage.
                    </p>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
                  <p className="text-xs text-slate-600">
                    We collect your authenticated Clerk profile (display name, email address), uploaded document metadata (titles, issuer names, expiry dates), and encrypted document payloads necessary to operate your personal vault.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">2. Purpose Limitation</h4>
                  <p className="text-xs text-slate-600">
                    Your personal information and documents are processed strictly for: providing secure vault storage, generating document expiry notifications, enabling search and OCR metadata extraction, and fulfilling user-initiated shares. We never sell, monetize, or train third-party public models on your private documents.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">3. Security Architecture</h4>
                  <p className="text-xs text-slate-600">
                    All network traffic is encrypted via TLS 1.3. Ingestion enforces magic-byte signature validation to reject unauthorized executables. Stored documents reside in tenant-isolated database rows with strict owner-validation checks on every API request.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'dpdp' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <p className="font-bold">Digital Personal Data Protection Act, 2023 (DPDP)</p>
                    <p className="mt-0.5">
                      Compliant with India's DPDP Act 2023. You retain full sovereign ownership as the Data Principal.
                    </p>
                  </div>
                </div>

                <section className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Data Principal Rights</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li><strong className="text-slate-800">Right to Information:</strong> You can review all documents, categories, and audit logs stored in your vault at any time.</li>
                    <li><strong className="text-slate-800">Right to Correction & Erasure:</strong> You can edit metadata or immediately permanently delete documents and associated reminders.</li>
                    <li><strong className="text-slate-800">Right of Grievance Redressal:</strong> Dedicated Grievance Officer available to resolve data protection inquiries within statutory timelines.</li>
                    <li><strong className="text-slate-800">Right to Nominate:</strong> Capability to designate emergency sharing contacts for critical credentials.</li>
                  </ul>
                </section>

                <section className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-xs text-slate-800">Data Protection Grievance Officer</p>
                  <p className="text-xs text-slate-600">Email: <a href="mailto:grievance@papertrail.app" className="text-[#1D5FF0] font-medium underline">grievance@papertrail.app</a></p>
                  <p className="text-[11px] text-slate-500">Response time: Within 72 business hours</p>
                </section>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">1. Acceptable Use</h4>
                  <p className="text-xs text-slate-600">
                    PaperTrail is intended solely for personal and family document custody (such as passports, vehicle insurance, educational certificates, warranties, and medical summaries). Users must not upload malicious software, illicit content, or third-party proprietary data without authorization.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">2. Ownership & Intellectual Property</h4>
                  <p className="text-xs text-slate-600">
                    You retain 100% ownership and copyright in all uploaded documents. PaperTrail claims zero rights, licenses, or ownership over your content.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">3. Availability & Service Guarantees</h4>
                  <p className="text-xs text-slate-600">
                    We maintain regular backups, automated database health probes, and redundancy. Users are encouraged to maintain local offline copies of irreplaceable legal records via the one-click Export Archive feature.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'retention' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-900">
                    <p className="font-bold">Permanent Deletion Guarantee</p>
                    <p className="mt-0.5">
                      When you delete a document or delete your entire account, all database records, file data, and cryptographic keys are erased immediately with no hidden archival recovery.
                    </p>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">Document Lifecycle Policy</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    <li><strong className="text-slate-800">Active Storage:</strong> Retained until the user initiates deletion or marks an item expired.</li>
                    <li><strong className="text-slate-800">Temporary Shares:</strong> Cryptographic share tokens automatically revoke after their configured expiry duration (1 hour to 30 days).</li>
                    <li><strong className="text-slate-800">Account Deletion:</strong> Irreversible cascade deletes user profile, document binaries, reminders, notifications, and sharing permissions.</li>
                  </ul>
                </section>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>PaperTrail Vault • Version 2026.1 (Production)</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1D5FF0] text-white font-bold rounded-xl hover:bg-[#1546B8] transition-colors cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

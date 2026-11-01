import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Plus, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  X, 
  Trash2, 
  Copy, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const SharedDocumentsScreen: React.FC = () => {
  const { 
    sharedDocuments, 
    documents, 
    createShare, 
    revokeShare 
  } = useDocumentContext();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'download' | 'edit'>('view');
  const [expiresAt, setExpiresAt] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail) return;

    createShare(selectedDocId, recipientName, recipientEmail, permission, expiresAt);
    setRecipientName('');
    setRecipientEmail('');
    setIsShareModalOpen(false);
  };

  const handleCopyLink = (shareId: string) => {
    const link = `https://vault.papertrail.io/share/${shareId}`;
    navigator.clipboard?.writeText(link);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">
            Shared Documents
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            Manage time-limited access links, view permissions and audit active shares.
          </p>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D5FF0] hover:bg-[#0752D9] text-white text-xs font-bold shadow-card transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Secure Share Link</span>
        </button>
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          >
            <form
              onSubmit={handleCreate}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Share Document</h3>
                <button 
                  type="button" 
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Select Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.fileSize})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Infosys HR / Bank Underwriter"
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. hr@infosys.com"
                  className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0F172A]">Access Permission</label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as any)}
                    className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
                  >
                    <option value="view">View Only</option>
                    <option value="download">View & Download</option>
                    <option value="edit">Full Access</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A]">Link Expiration</label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full mt-1.5 h-11 px-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D5FF0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1D5FF0] text-white font-bold text-xs shadow-card hover:bg-[#0752D9] cursor-pointer"
                >
                  Generate Share Link
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Shared Documents Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider bg-[#F7F9FC]">
                <th className="py-3.5 px-6">Document</th>
                <th className="py-3.5 px-4">Shared With</th>
                <th className="py-3.5 px-4">Permission</th>
                <th className="py-3.5 px-4">Date Shared</th>
                <th className="py-3.5 px-4">Link Expiry</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sharedDocuments.map((share) => {
                const isRevoked = share.status === 'revoked';
                const isExpired = share.status === 'expired';

                return (
                  <tr key={share.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] text-[#1D5FF0] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {share.fileType}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">{share.documentTitle}</p>
                          <span className="text-[11px] text-[#64748B]">{share.fileSize} • {share.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-[#0F172A]">{share.recipientName}</p>
                        <p className="text-[11px] text-[#64748B]">{share.recipientEmail}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {share.permission}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#64748B]">
                      {share.sharedDate}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`font-semibold ${isExpired ? 'text-rose-500' : 'text-[#0F172A]'}`}>
                        {share.expiresAt}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {isRevoked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Revoked
                        </span>
                      ) : isExpired ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isRevoked && (
                          <button
                            onClick={() => handleCopyLink(share.id)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1D5FF0] hover:bg-[#EAF1FF] transition-colors cursor-pointer"
                            title="Copy link"
                          >
                            {copiedId === share.id ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {!isRevoked && !isExpired && (
                          <button
                            onClick={() => revokeShare(share.id)}
                            className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

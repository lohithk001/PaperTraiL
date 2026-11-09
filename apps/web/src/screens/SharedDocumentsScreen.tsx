import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Plus, 
  CheckCircle2, 
  X, 
  Copy, 
  FileText 
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';
import { 
  PageHeader, 
  Badge, 
  Button, 
  EmptyState, 
  CategoryIcon 
} from '../components/ui';

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
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      
      {/* 1. Header */}
      <PageHeader
        title="Shared Documents"
        subtitle="Manage time-limited access links, view permissions and audit active shares"
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsShareModalOpen(true)}
          >
            Create Share Link
          </Button>
        }
      />

      {/* 2. Shared Documents Table / List */}
      {sharedDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] p-8 shadow-xs">
          <EmptyState
            icon={<Share2 className="w-8 h-8" />}
            title="No shared links generated"
            description="You haven't shared any documents yet. Generate an encrypted, time-limited link to share specific records with third parties."
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsShareModalOpen(true)}
              >
                Create First Share Link
              </Button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6E6E0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E6E6E0] text-[#646860] font-semibold text-[11px] bg-[#F6F6F2]">
                  <th className="py-3 px-5">Document</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Permission</th>
                  <th className="py-3 px-4">Shared Date</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E0]">
                {sharedDocuments.map((share) => {
                  const isRevoked = share.status === 'revoked';
                  const isExpired = share.status === 'expired';

                  return (
                    <tr key={share.id} className="hover:bg-[#F6F6F2] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={share.category} size="sm" />
                          <div>
                            <p className="font-semibold text-[#20211F]">{share.documentTitle}</p>
                            <span className="text-[11px] text-[#646860]">{share.fileSize} • {share.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-medium text-[#20211F]">{share.recipientName}</p>
                          <p className="text-[11px] text-[#646860]">{share.recipientEmail}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase bg-[#F0F0EA] text-[#20211F]">
                          {share.permission}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#6B6E66]">
                        {share.sharedDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-medium ${isExpired ? 'text-[#DC2626]' : 'text-[#20211F]'}`}>
                          {share.expiresAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={isRevoked ? 'default' : isExpired ? 'danger' : 'success'}
                          size="sm"
                        >
                          {isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isRevoked && (
                            <button
                              onClick={() => handleCopyLink(share.id)}
                              className="p-1.5 rounded-lg text-[#6B6E66] hover:text-[#1D5FF0] hover:bg-[#E5EDFF] transition-colors cursor-pointer"
                              title="Copy link"
                            >
                              {copiedId === share.id ? (
                                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {!isRevoked && !isExpired && (
                            <button
                              onClick={() => revokeShare(share.id)}
                              className="px-2.5 py-1 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] text-xs font-semibold transition-colors cursor-pointer"
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
      )}

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onSubmit={handleCreate}
              className="w-full max-w-md bg-white rounded-2xl p-5 border border-[#E6E6E0] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#20211F]">Share Document</h3>
                <button 
                  type="button" 
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1 rounded-lg text-[#646860] hover:text-[#20211F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Select Document</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full mt-1.5 h-10 px-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0]"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.fileSize})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Bank Underwriter, HR Dept"
                  className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#6B6E66]">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. hr@company.com"
                  className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6B6E66]">Access Level</label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as any)}
                    className="w-full mt-1.5 h-10 px-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0]"
                  >
                    <option value="view">View Only</option>
                    <option value="download">View & Download</option>
                    <option value="edit">Full Access</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6B6E66]">Link Expiration</label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full mt-1.5 h-10 px-3 rounded-xl bg-[#F6F6F2] border border-[#E6E6E0] text-xs font-medium text-[#20211F] focus:outline-none focus:border-[#1D5FF0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Generate Share Link
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

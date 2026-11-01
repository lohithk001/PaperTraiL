import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  FileText, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  matchedDocId?: string;
}

export const AssistantModal: React.FC = () => {
  const { 
    isAssistantOpen, 
    setIsAssistantOpen, 
    documents, 
    setSelectedDocument 
  } = useDocumentContext();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hi Lohith! I am your PaperTrail AI Vault Assistant. You can ask me about expiring documents, policies, or request instant lookups.',
    },
  ]);

  if (!isAssistantOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process intelligent assistant answer
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let docId: string | undefined = undefined;

      if (q.includes('expir') || q.includes('renew') || q.includes('soon')) {
        const expiring = documents.filter((d) => d.isExpiringSoon);
        if (expiring.length > 0) {
          reply = `You have ${expiring.length} document(s) expiring soon: ${expiring
            .map((d) => `${d.title} (${d.daysLeft} days left)`)
            .join(', ')}. Would you like me to open the insurance renewal details?`;
          docId = expiring[0]?.id;
        } else {
          reply = 'Good news! None of your documents are expiring in the next 30 days.';
        }
      } else if (q.includes('car') || q.includes('insurance') || q.includes('vehicle')) {
        const carDoc = documents.find((d) => d.category === 'Insurance' || d.category === 'Vehicle');
        if (carDoc) {
          reply = `Found your "${carDoc.title}" issued by ${carDoc.issuer || 'GEICO'}. Policy #${carDoc.policyNumber || 'N/A'}, expiring in ${carDoc.daysLeft ?? 'unknown'} days.`;
          docId = carDoc.id;
        } else {
          reply = "I couldn't locate an auto insurance document in the vault.";
        }
      } else if (q.includes('passport') || q.includes('travel') || q.includes('identity')) {
        const passDoc = documents.find((d) => d.title.toLowerCase().includes('passport') || d.category === 'Identity');
        if (passDoc) {
          reply = `Your ${passDoc.title} is active, encrypted, and valid until ${passDoc.expiryDate || '2034'}. Policy #${passDoc.policyNumber}.`;
          docId = passDoc.id;
        } else {
          reply = 'No passport document found in your vault.';
        }
      } else {
        reply = `I scanned your PaperTrail vault (${documents.length} encrypted documents). You can check warranties, identity records, and insurance renewal schedules.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: reply,
          matchedDocId: docId,
        },
      ]);
    }, 600);
  };

  const quickPrompts = [
    'Which documents are expiring soon?',
    'Show my Vehicle Insurance details',
    'How secure is my vault encryption?',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="w-full max-w-md bg-[#F7F7F7] rounded-t-[36px] sm:rounded-[36px] h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-charcoal-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-charcoal-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-charcoal-900 tracking-tight">
                  PaperTrail Assistant
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Vault Intelligence</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAssistantOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-charcoal-700 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2.5xl text-xs font-medium leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-charcoal-800 border border-charcoal-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}

                  {m.matchedDocId && (
                    <button
                      onClick={() => {
                        const doc = documents.find((d) => d.id === m.matchedDocId);
                        if (doc) {
                          setSelectedDocument(doc);
                          setIsAssistantOpen(false);
                        }
                      }}
                      className="mt-2.5 w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-primary font-bold text-[11px] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Document Record</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 overflow-x-auto no-scrollbar border-t border-charcoal-200/60 bg-white/70">
            <div className="flex items-center gap-2 min-w-max">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 border border-charcoal-200 text-[11px] font-bold text-charcoal-700 active:scale-95 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-charcoal-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask PaperTrail about any document..."
              className="flex-1 px-4 py-2.5 rounded-full bg-neutral-100 text-xs font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover active:scale-90 transition-all shadow-xs"
            >
              <Send className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

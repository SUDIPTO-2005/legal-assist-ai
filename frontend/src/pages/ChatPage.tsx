import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  Scale, 
  Sparkles, 
  AlertTriangle,
  Send,
  BookOpen
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { ModeToggle } from '../components/common/ModeToggle';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const docIdParam = searchParams.get('docId');

  const { documents } = useDocuments();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>(docIdParam || '');
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'professional'>('beginner');

  const {
    sessions,
    currentSession,
    isLoadingSessions,
    createSession,
    sendMessage,
    isSending
  } = useChat(selectedSessionId || undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleNewChat = async () => {
    const doc = documents.find(d => d.id === selectedDocId);
    const newSession = await createSession({
      documentId: selectedDocId || undefined,
      title: doc ? `Inquiry: ${doc.title.slice(0, 30)}` : 'General Legal Inquiry'
    });
    setSelectedSessionId(newSession.id);
  };

  const handleSendMessage = async (msgText: string) => {
    let sId = selectedSessionId;
    if (!sId) {
      const newSession = await createSession({
        documentId: selectedDocId || undefined,
        title: msgText.slice(0, 30)
      });
      sId = newSession.id;
      setSelectedSessionId(sId);
    }
    await sendMessage({ sId, message: msgText });
  };

  const sampleQuestions = [
    "What are my main obligations under this contract?",
    "Can I terminate this agreement early without penalty?",
    "What happens if payment is delayed by 15 days?",
    "Is there an automatic renewal clause in this document?"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Left Sidebar: Sessions & Document Context (w-80) */}
      <div className="w-full md:w-80 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-4">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 bg-legal-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-legal-gold" />
            <span>New Chat Session</span>
          </button>

          {/* Document Context Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Document Context
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
            >
              <option value="">No Document (General Assistance)</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          {/* Session History List */}
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Inquiries
            </span>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSessionId(s.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-2 ${
                    selectedSessionId === s.id
                      ? 'bg-slate-100 text-legal-navy font-bold border border-slate-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-legal-gold shrink-0" />
                  <span className="truncate">{s.title || 'Legal Inquiry'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <ModeToggle mode={explanationMode} onChange={setExplanationMode} className="w-full justify-center" />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-legal-gold" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 leading-snug">
                {currentSession?.title || 'LexAssist Legal Companion'}
              </h2>
              <span className="text-[10px] text-slate-500 block">
                {currentSession?.document_title ? `Grounded in: ${currentSession.document_title}` : 'General legal information mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {currentSession?.messages && currentSession.messages.length > 0 ? (
            currentSession.messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-12">
              <div className="p-4 bg-slate-100 text-legal-navy rounded-full w-16 h-16 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-legal-gold" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800">Ask any legal question</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  LexAssist AI answers questions about contract termination, penalties, indemnity, and deadlines with safety guardrails.
                </p>
              </div>

              {/* Sample starter chips */}
              <div className="space-y-2 w-full pt-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <Sparkles className="w-3 h-3 text-legal-gold shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <ChatInput onSend={handleSendMessage} isLoading={isSending} />
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Non-lawyer legal information tool. Always review high-stakes actions with a certified attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

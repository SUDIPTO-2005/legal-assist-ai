import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading = false, disabled = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your document (e.g. 'Can I terminate early with 30 days notice?')..."
        disabled={disabled || isLoading}
        rows={2}
        className="w-full resize-none bg-white border border-slate-300 focus:border-legal-navy focus:ring-2 focus:ring-legal-navy/10 rounded-2xl p-3.5 pr-14 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition-all disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={!text.trim() || isLoading || disabled}
        className="absolute right-3 bottom-3.5 p-2.5 bg-legal-navy hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
      >
        {isLoading ? (
          <Sparkles className="w-4 h-4 text-legal-gold animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};

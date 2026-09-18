import React from 'react';
import { Scale, User, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../../types';
import { SourceCitation } from './SourceCitation';
import { formatDate } from '../../lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3.5 my-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-legal-navy text-legal-gold flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Scale className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
        isAssistant
          ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
          : 'bg-legal-navy text-white shadow'
      }`}>
        {/* Escalation banner if triggered */}
        {message.escalation_suggested && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">Professional Legal Review Advised for this inquiry</span>
          </div>
        )}

        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Source citation */}
        {message.sources && message.sources.length > 0 && (
          <SourceCitation sources={message.sources} />
        )}

        <div className={`text-[10px] mt-2 flex items-center justify-between ${
          isAssistant ? 'text-slate-400' : 'text-slate-300'
        }`}>
          <span>{formatDate(message.created_at)}</span>
          {isAssistant && message.model_used && (
            <span>LexAssist Engine • {message.model_used}</span>
          )}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

// src/features/chat/components/FloatingChat/ChatMessages.tsx
// ✅ INTEGRADO: Tu código ya está perfecto, no requiere cambios

import { useEffect, useRef } from 'react';
import { Message } from '../../types/message.types';
import { MessageCard } from './MessageCard';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  isTyping?: boolean;
  userRole?: 'creadora' | 'espectador';
}

export const ChatMessages = ({ 
  messages, 
  currentUserId, 
  isLoading,
  isTyping,
  userRole = 'espectador',
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 px-4 py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Sin mensajes aún</p>
          <p className="text-xs text-slate-500 mt-1">Envía un mensaje para comenzar</p>
        </div>
      </div>
    );
  }

  // Mensajes
  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-4 py-4 space-y-3">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
          userRole={userRole}
        />
      ))}

      {/* Indicador de escritura */}
      {isTyping && (
        <div className="flex gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Referencia para auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

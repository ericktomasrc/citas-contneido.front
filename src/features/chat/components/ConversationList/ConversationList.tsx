// src/features/chat/components/ConversationList/ConversationList.tsx
// ✅ SOLO AGREGADO: Ordenamiento automático
// ✅ MANTIENE: Todas tus props y lógica original

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Conversation } from '../../types/chat.types';
import { ConversationCard } from './ConversationCard';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
}

export const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onPinConversation,
  onArchiveConversation,
  onDeleteConversation,
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ⭐ NUEVO: Ordenamiento automático por lastMessageAt
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      // 1. Pinned siempre primero
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 2. Por fecha del último mensaje (más reciente primero)
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [conversations]);

  // Filtrar por búsqueda
  const filteredConversations = sortedConversations.filter(conv =>
    conv.participant.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header con búsqueda */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Mensajes</h2>
        
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conversación..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {searchQuery ? 'No se encontraron conversaciones' : 'No tienes mensajes aún'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'Intenta con otro nombre' : 'Tus conversaciones aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredConversations.map((conversation, index) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
                onPin={() => onPinConversation?.(conversation.id)}
                onArchive={() => onArchiveConversation?.(conversation.id)}
                onDelete={() => onDeleteConversation?.(conversation.id)}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

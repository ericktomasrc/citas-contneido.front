// src/features/chat/components/ConversationSidebar/ConversationSidebar.tsx
// ✅ Lista de conversaciones - Elegante y premium

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Conversation } from '../../types/chat.types';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [conversations]);

  const filteredConversations = sortedConversations.filter(conv =>
    conv.participant.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conversación..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {searchQuery ? 'No se encontraron conversaciones' : 'No tienes conversaciones'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem key={conversation.id} conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const { participant, lastMessage, unreadCount } = conversation;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Ahora';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <button onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-all ${
        isSelected ? 'bg-violet-50 hover:bg-violet-50' : ''
      }`}>
      <div className="relative flex-shrink-0">
        <img src={participant.avatar} alt={participant.nombre}
          className="w-12 h-12 rounded-full object-cover" />
        {participant.estado === 'online' && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-violet-600 text-white text-xs font-bold rounded-full px-1.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-semibold truncate ${
            isSelected ? 'text-violet-700' : 'text-slate-800'
          }`}>
            {participant.nombre}
          </h3>
          <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
            {lastMessage && formatTime(lastMessage.timestamp)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {participant.badge && (
            <span className="text-xs flex-shrink-0">{participant.badge.icon}</span>
          )}
          <p className={`text-xs truncate flex-1 ${
            unreadCount > 0 ? 'text-slate-700 font-medium' : 'text-slate-500'
          }`}>
            {lastMessage?.content || 'Sin mensajes'}
          </p>
        </div>
      </div>
    </button>
  );
};

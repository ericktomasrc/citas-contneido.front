// src/pages/Messages/MessagesContent.tsx
// ✅ Contenido del chat SIN navbar/sidebar - Para integrar en Dashboard

import { useState } from 'react';
import { Gift, DollarSign } from 'lucide-react';
import { ConversationSidebar } from '@/features/chat/components/ConversationSidebar/ConversationSidebar';
import { ChatWindow } from '@/features/chat/components/ChatWindow/ChatWindow';
import { GiftsReportModal } from '@/features/chat/components/Reports/GiftsReportModal';
import { TipsReportModal } from '@/features/chat/components/Reports/TipsReportModal';
import { useUserRole } from '@/features/chat/hooks/useUserRole';
import { defaultChatSettings } from '@/features/chat/types/chat.types';

export const MessagesContent = () => {
  const { role } = useUserRole();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showGiftsReport, setShowGiftsReport] = useState(false);
  const [showTipsReport, setShowTipsReport] = useState(false);

  // Mock conversations
  const mockConversations = [
    {
      id: 'conv-1',
      participant: {
        id: 'user-1',
        nombre: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?img=11',
        estado: 'online' as const,
        role: 'espectador' as const,
        badge: { level: 'premium', name: 'Premium', color: 'violet', icon: '💎', price: 150 },
      },
      lastMessage: {
        id: 'msg-1', conversationId: 'conv-1', senderId: 'user-1',
        senderName: 'Juan Pérez', senderAvatar: 'https://i.pravatar.cc/150?img=11',
        type: 'text' as const, content: 'Hola! ¿Cómo estás?',
        timestamp: new Date(), read: false,
      },
      lastMessageAt: new Date(), unreadCount: 3,
      isPinned: false, isMuted: false, isArchived: false,
    },
    {
      id: 'conv-2',
      participant: {
        id: 'user-2',
        nombre: 'Carlos López',
        avatar: 'https://i.pravatar.cc/150?img=12',
        estado: 'online' as const,
        role: 'espectador' as const,
        badge: { level: 'vip', name: 'VIP', color: 'amber', icon: '👑', price: 300 },
      },
      lastMessage: {
        id: 'msg-2', conversationId: 'conv-2', senderId: 'user-2',
        senderName: 'Carlos López', senderAvatar: 'https://i.pravatar.cc/150?img=12',
        type: 'text' as const, content: '¿Disponible para videollamada?',
        timestamp: new Date(Date.now() - 300000), read: true,
      },
      lastMessageAt: new Date(Date.now() - 300000), unreadCount: 1,
      isPinned: true, isMuted: false, isArchived: false,
    },
    {
      id: 'conv-3',
      participant: {
        id: 'user-3',
        nombre: 'Miguel Torres',
        avatar: 'https://i.pravatar.cc/150?img=13',
        estado: 'offline' as const,
        role: 'espectador' as const,
        badge: { level: 'basico', name: 'Básico', color: 'slate', icon: '🥉', price: 0 },
      },
      lastMessage: {
        id: 'msg-3', conversationId: 'conv-3', senderId: 'user-3',
        senderName: 'Miguel Torres', senderAvatar: 'https://i.pravatar.cc/150?img=13',
        type: 'text' as const, content: 'Gracias por el contenido!',
        timestamp: new Date(Date.now() - 3600000), read: true,
      },
      lastMessageAt: new Date(Date.now() - 3600000), unreadCount: 0,
      isPinned: false, isMuted: false, isArchived: false,
    },
  ];

  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header con botones (solo para creadora) */}
      {role === 'creadora' && (
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGiftsReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 rounded-xl text-sm font-medium text-pink-700 transition-all"
            >
              <Gift className="w-4 h-4" />
              Mis Regalos
            </button>
            
            <button
              onClick={() => setShowTipsReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              Mis Propinas
            </button>
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversaciones (derecha) */}
        <div className="w-96 flex-shrink-0 border-r border-slate-200 bg-white">
          <ConversationSidebar
            conversations={mockConversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Chat principal (centro) */}
        <div className="flex-1 bg-slate-50">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              recipientSettings={defaultChatSettings}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-sm text-slate-500">
                  Elige un chat para comenzar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showGiftsReport && (
        <GiftsReportModal onClose={() => setShowGiftsReport(false)} />
      )}

      {showTipsReport && (
        <TipsReportModal onClose={() => setShowTipsReport(false)} />
      )}
    </div>
  );
};

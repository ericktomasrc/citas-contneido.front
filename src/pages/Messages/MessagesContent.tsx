// src/pages/Messages/MessagesContent.tsx
// ✅ MEJORADO: Elementos más compactos y pequeños

import { useState } from 'react';
import { Gift, DollarSign } from 'lucide-react';
import { ConversationSidebar } from '@/features/chat/components/ConversationSidebar/ConversationSidebar';
import { ChatWindow } from '@/features/chat/components/ChatWindow/ChatWindow';
import { GiftsReportModal } from '@/features/chat/components/Reports/GiftsReportModal';
import { TipsReportModal } from '@/features/chat/components/Reports/TipsReportModal';
import { SentGiftsModal } from '@/features/chat/components/Reports/SentGiftsModal';
import { SentTipsModal } from '@/features/chat/components/Reports/SentTipsModal';
import { useUserRole } from '@/features/chat/hooks/useUserRole';
import { defaultChatSettings } from '@/features/chat/types/chat.types';

interface MessagesContentProps {
  onVideoCallStart?: () => void;
}

export const MessagesContent = ({ onVideoCallStart }: MessagesContentProps) => {
  const { role } = useUserRole();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Modales para creadora
  const [showGiftsReport, setShowGiftsReport] = useState(false);
  const [showTipsReport, setShowTipsReport] = useState(false);
  
  // Modales para espectador
  const [showSentGifts, setShowSentGifts] = useState(false);
  const [showSentTips, setShowSentTips] = useState(false);

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
  ];

  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  return (
    <div className="h-full flex overflow-hidden bg-slate-50">
      {/* ✅ Sidebar más estrecho: w-80 en lugar de w-96 */}
      <div className="w-80 flex-shrink-0 border-r border-slate-200 bg-white">
        <ConversationSidebar
          conversations={mockConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      {/* Área principal derecha */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* ✅ Header compacto h-12 */}
        <div className="flex-shrink-0 bg-white border-b border-slate-100">
          <div className="h-12 px-3 flex items-center gap-1.5">
            {role === 'creadora' ? (
              <>
                <button
                  onClick={() => setShowGiftsReport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 rounded-lg text-xs font-medium text-pink-700 transition-all"
                >
                  <Gift className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Mis Regalos
                </button>
                
                <button
                  onClick={() => setShowTipsReport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Mis Propinas
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSentGifts(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-200 rounded-lg text-xs font-medium text-violet-700 transition-all"
                >
                  <Gift className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Regalos Enviados
                </button>
                
                <button
                  onClick={() => setShowSentTips(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Propinas Enviadas
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenido: ChatWindow o placeholder */}
        <div className="flex-1 overflow-hidden">
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation} 
              recipientSettings={defaultChatSettings}
              onVideoCallStart={onVideoCallStart}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                {/* ✅ Icono más pequeño */}
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">Selecciona una conversación</h3>
                <p className="text-xs text-slate-400">Elige un chat para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showGiftsReport && <GiftsReportModal onClose={() => setShowGiftsReport(false)} />}
      {showTipsReport && <TipsReportModal onClose={() => setShowTipsReport(false)} />}
      {showSentGifts && <SentGiftsModal onClose={() => setShowSentGifts(false)} />}
      {showSentTips && <SentTipsModal onClose={() => setShowSentTips(false)} />}
    </div>
  );
};

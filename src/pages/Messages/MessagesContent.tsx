// src/pages/Messages/MessagesContent.tsx
// ✅ VIP PREMIUM: Diseño elegante y sofisticado

import { useState } from 'react';
import { Gift, DollarSign, Sparkles } from 'lucide-react';
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
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-slate-50 via-rose-50/10 to-violet-50/10">
      {/* ✅ Sidebar Premium con borde elegante */}
      <div className="w-80 flex-shrink-0 border-r border-rose-100/50 bg-white/95 backdrop-blur-sm">
        <ConversationSidebar
          conversations={mockConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      {/* ✅ Área principal VIP Premium */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Header Premium con gradiente sutil */}
        <div className="flex-shrink-0 bg-gradient-to-r from-white via-rose-50/20 to-violet-50/20 border-b border-rose-100/50 backdrop-blur-sm">
          <div className="h-14 px-4 flex items-center gap-2">
            {role === 'creadora' ? (
              <>
                <button
                  onClick={() => setShowGiftsReport(true)}
                  className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 hover:from-rose-100 hover:via-pink-100 hover:to-violet-100 border border-rose-200/60 rounded-xl text-xs font-semibold text-rose-700 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-pink-400/5 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
                    <Gift className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <span className="relative">Mis Regalos</span>
                  <Sparkles className="relative w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button
                  onClick={() => setShowTipsReport(true)}
                  className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 hover:from-rose-100 hover:via-pink-100 hover:to-violet-100 border border-rose-200/60 rounded-xl text-xs font-semibold text-rose-700 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-pink-400/5 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
                    <DollarSign className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <span className="relative">Mis Propinas</span>
                  <Sparkles className="relative w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSentGifts(true)}
                  className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 hover:from-violet-100 hover:via-purple-100 hover:to-pink-100 border border-violet-200/60 rounded-xl text-xs font-semibold text-violet-700 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                    <Gift className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <span className="relative">Regalos Enviados</span>
                  <Sparkles className="relative w-3 h-3 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button
                  onClick={() => setShowSentTips(true)}
                  className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 hover:from-violet-100 hover:via-purple-100 hover:to-pink-100 border border-violet-200/60 rounded-xl text-xs font-semibold text-violet-700 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-purple-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                    <DollarSign className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                  <span className="relative">Propinas Enviadas</span>
                  <Sparkles className="relative w-3 h-3 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ✅ Contenido con fondo elegante */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fondo decorativo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/5 to-violet-50/5 pointer-events-none" />
          
          {selectedConversation ? (
            <div className="relative h-full">
              <ChatWindow 
                conversation={selectedConversation} 
                recipientSettings={defaultChatSettings}
                onVideoCallStart={onVideoCallStart}
              />
            </div>
          ) : (
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                {/* ✅ Placeholder Premium elegante */}
                <div className="relative mb-6">
                  {/* Círculo exterior decorativo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 rounded-full blur-2xl opacity-30 scale-110" />
                  
                  {/* Círculo principal */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 rounded-full flex items-center justify-center mx-auto border-2 border-rose-200/50 shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-white to-rose-50/50 rounded-full flex items-center justify-center">
                      <span className="text-4xl">💬</span>
                    </div>
                  </div>
                  
                  {/* Sparkles decorativos */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -left-2 w-5 h-5 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Elige un chat para comenzar a conversar con tu comunidad VIP
                </p>
                
                {/* Indicador decorativo */}
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  <div className="w-2 h-2 rounded-full bg-rose-300 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-violet-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
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
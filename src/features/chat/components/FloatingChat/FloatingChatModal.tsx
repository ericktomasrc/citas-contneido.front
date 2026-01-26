// src/features/chat/components/FloatingChat/FloatingChatModal.tsx
// ✅ INTEGRADO: Mantiene TODO + agrega animaciones de regalos/propinas

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { GiftPanel } from '../Gifts/GiftPanel';
import { useChat } from '../../hooks/useChat';
import { useUserRole } from '../../hooks/useUserRole';
import { useChatPermissions } from '../../hooks/useChatPermissions';
import { ChatSettings } from '../../types/chat.types';
import { User } from '../../types/user.types';
// ✨ NUEVO: Imports para animaciones 
import { GiftAnimation } from '../Animations/GiftAnimation';
import { TipAnimation } from '../Animations/TipAnimation';
import { ConfettiEffect } from '../Animations/ConfettiEffect';
import { useGiftAnimations } from '@/hooks/useGiftAnimations';

interface FloatingChatModalProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientSettings?: ChatSettings;
  isOnline?: boolean;
  onClose: () => void;
}

export const FloatingChatModal = ({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientSettings,
  isOnline = true,
  onClose,
}: FloatingChatModalProps) => {
  const { role, user: currentUser } = useUserRole();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  // ✨ NUEVO: Hook para animaciones de regalos/propinas
  // Nota: Necesitarás un conversationId, por ahora uso recipientId como placeholder
  const conversationId = `conv-${recipientId}`;
  const { currentGift, showConfetti, handleAnimationComplete } = 
    useGiftAnimations(conversationId);

  // Obtener permisos según el rol
  const { permissions } = useChatPermissions(role, recipientSettings);

  // Hook del chat
  const {
    messages,
    isLoading,
    isSending,
    sendTextMessage,
    sendImageMessage,
    sendVideoMessage,
    sendAudioMessage,
    sendGift,
    sendTip,
    startTyping,
    stopTyping,
  } = useChat(recipientId);

  const [isTyping] = useState(false);

  const handleSendGift = (giftId: string, giftName: string, giftEmoji: string, amount: number) => {
    if (giftId === 'tip') {
      sendTip(amount);
    } else {
      sendGift(giftId, giftName, giftEmoji, amount);
    }
    setShowGiftPanel(false);
  };

  const handleSendTip = (amount: number) => {
    sendTip(amount);
  };

  // Construir objeto User para ChatHeader
  const recipientUser: User = {
    id: recipientId,
    nombre: recipientName,
    avatar: recipientAvatar,
    estado: isOnline ? 'online' : 'offline',
    role: 'espectador',
    badge: undefined,
  };

  return (
    <>
      {/* Modal del chat (tu código original sin cambios) */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            height: isMinimized ? 'auto' : '600px'
          }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 lg:right-28 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0">
            <ChatHeader
              user={recipientUser}
              userRole={role}
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onClose={onClose}
            />
          </div>

          {/* Contenido */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <ChatMessages
                messages={messages}
                currentUserId={currentUser?.id || ''}
                isLoading={isLoading}
                isTyping={isTyping}
                userRole={role}
              />

              {/* Input con panel */}
              <div className="flex-shrink-0 relative">
                {/* Panel de regalos */}
                <AnimatePresence>
                  {showGiftPanel && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 right-0 bg-white rounded-t-2xl border-t border-l border-r border-slate-200 overflow-hidden"
                      style={{ 
                        maxHeight: '400px',
                        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <GiftPanel
                        onSendGift={handleSendGift}
                        onClose={() => setShowGiftPanel(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ChatInput */}
                <ChatInput
                  userRole={role}
                  permissions={permissions}
                  onSendMessage={sendTextMessage}
                  onSendGift={handleSendGift}
                  onSendTip={handleSendTip}
                  onSendImage={sendImageMessage}
                  onSendVideo={sendVideoMessage}
                  onSendAudio={sendAudioMessage}
                  isSending={isSending}
                  showGiftPanel={showGiftPanel}
                  onToggleGiftPanel={() => setShowGiftPanel(!showGiftPanel)}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ✨ NUEVO: Animaciones de regalo (se muestran encima de todo) */}
      {currentGift?.type === 'gift' && currentGift.giftEmoji && currentGift.giftName && (
        <GiftAnimation
          giftEmoji={currentGift.giftEmoji}
          giftName={currentGift.giftName}
          amount={currentGift.amount}
          senderName={currentGift.senderName}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* ✨ NUEVO: Animaciones de propina (se muestran encima de todo) */}
      {currentGift?.type === 'tip' && (
        <TipAnimation
          amount={currentGift.amount}
          senderName={currentGift.senderName}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* ✨ NUEVO: Confetti (se muestra encima de todo) */}
      <ConfettiEffect
        trigger={showConfetti}
        type={currentGift?.type || 'gift'}
      />
    </>
  );
};

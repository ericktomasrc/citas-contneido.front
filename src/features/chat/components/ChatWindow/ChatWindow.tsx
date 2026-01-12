// src/features/chat/components/ChatWindow/ChatWindow.tsx
// ✅ MEJORADO: Propaga callback de videollamada

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatHeaderWhatsApp } from './ChatHeaderWhatsApp';
import { ChatMessages } from '../FloatingChat/ChatMessages';
import { ChatInput } from '../FloatingChat/ChatInput';
import { GiftPanel } from '../Gifts/GiftPanel';
import { TipPanel } from '../Tips/TipPanel';
import { QuickSettingsPanel } from '../Settings/QuickSettingsPanel';
import { useChat } from '../../hooks/useChat';
import { useUserRole } from '../../hooks/useUserRole';
import { useChatPermissions } from '../../hooks/useChatPermissions';
import { Conversation, ChatSettings } from '../../types/chat.types';

interface ChatWindowProps {
  conversation: Conversation;
  recipientSettings?: ChatSettings;
  onVideoCallStart?: () => void; // ✅ NUEVO
}

export const ChatWindow = ({ 
  conversation, 
  recipientSettings,
  onVideoCallStart // ✅ NUEVO
}: ChatWindowProps) => {
  const { role, user: currentUser } = useUserRole();
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showTipPanel, setShowTipPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const { permissions } = useChatPermissions(role, recipientSettings);

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
  } = useChat(conversation.participant.id);

  const [isTyping] = useState(false);

  const handleSendGift = (giftId: string, giftName: string, giftEmoji: string, amount: number) => {
    sendGift(giftId, giftName, giftEmoji, amount);
    setShowGiftPanel(false);
  };

  const handleSendTip = (amount: number) => {
    sendTip(amount);
    setShowTipPanel(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <ChatHeaderWhatsApp
        participant={{
          ...conversation.participant,
          badge: conversation.participant.badge
            ? {
                ...conversation.participant.badge,
                // Cast or map level to BadgeLevel if needed
                level: conversation.participant.badge.level as any, // Replace 'any' with 'BadgeLevel' if imported
              }
            : undefined,
        }}
        userRole={role}
        onOpenSettings={role === 'creadora' ? () => setShowSettingsPanel(true) : undefined}
      />

      {/* Mensajes */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          messages={messages}
          currentUserId={currentUser?.id || ''}
          isLoading={isLoading}
          isTyping={isTyping}
          userRole={role}
        />
      </div>

      {/* Input con paneles */}
      <div className="flex-shrink-0 relative bg-white border-t border-slate-200">
        {/* Panel de regalos */}
        <AnimatePresence>
          {showGiftPanel && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0"
            >
              <GiftPanel
                onSendGift={handleSendGift}
                onClose={() => setShowGiftPanel(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel de propinas */}
        <AnimatePresence>
          {showTipPanel && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0"
            >
              <TipPanel
                onSendTip={handleSendTip}
                onClose={() => setShowTipPanel(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
          onToggleGiftPanel={() => {
            setShowGiftPanel(!showGiftPanel);
            setShowTipPanel(false);
          }}
          showTipPanel={showTipPanel}
          onToggleTipPanel={() => {
            setShowTipPanel(!showTipPanel);
            setShowGiftPanel(false);
          }}
          onVideoCallStart={onVideoCallStart} // ✅ PASAR CALLBACK
        />
      </div>

      {/* Panel de configuración (modal) */}
      {showSettingsPanel && (
        <QuickSettingsPanel
          onClose={() => setShowSettingsPanel(false)}
        />
      )}
    </div>
  );
};

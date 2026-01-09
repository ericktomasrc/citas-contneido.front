// src/features/chat/hooks/useChat.ts
// ✅ CORREGIDO: Usa updateMessage para evitar duplicados

import { useState, useCallback, useEffect } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { Message } from '../types/message.types';
import { useCurrentUser } from './useUserRole';

export const useChat = (recipientId: string) => {
  const currentUser = useCurrentUser();
  const { messagesByChat, addMessage, updateMessage, setTyping } = useChatStore();
  
  const chatId = `${currentUser?.id}_${recipientId}`;
  const messages = messagesByChat[chatId] || [];
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      console.log('🔥 Cargando mensajes del chat:', chatId);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar mensaje de texto
  const sendTextMessage = useCallback(async (text: string) => {
    if (!currentUser || !text.trim()) return;

    setIsSending(true);

    const messageId = `msg_${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
      type: 'text',
      content: text.trim(),
      status: 'sending',
      createdAt: new Date(),
    };

    // ✅ Agregar mensaje con status: sending
    addMessage(chatId, newMessage);

    try {
      console.log('📤 Enviando mensaje:', newMessage);
      
      // ✅ Actualizar status a sent (no agregar nuevo)
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      updateMessage(chatId, messageId, { status: 'failed' });
      setIsSending(false);
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Enviar imagen
  const sendImageMessage = useCallback(async (file: File) => {
    if (!currentUser) return;

    setIsSending(true);

    try {
      console.log('📤 Enviando imagen:', file.name);

      const messageId = `msg_${Date.now()}`;
      const newMessage: Message = {
        id: messageId,
        chatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
        type: 'image',
        content: 'Imagen enviada',
        mediaUrl: URL.createObjectURL(file),
        metadata: {
          fileName: file.name,
          fileSize: file.size,
        },
        status: 'sending',
        createdAt: new Date(),
      };

      addMessage(chatId, newMessage);
      
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error('Error enviando imagen:', error);
      setIsSending(false);
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Enviar video
  const sendVideoMessage = useCallback(async (file: File) => {
    if (!currentUser) return;

    setIsSending(true);

    try {
      console.log('📤 Enviando video:', file.name);

      const messageId = `msg_${Date.now()}`;
      const newMessage: Message = {
        id: messageId,
        chatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
        type: 'video',
        content: 'Video enviado',
        mediaUrl: URL.createObjectURL(file),
        metadata: {
          fileName: file.name,
          fileSize: file.size,
        },
        status: 'sending',
        createdAt: new Date(),
      };

      addMessage(chatId, newMessage);
      
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error('Error enviando video:', error);
      setIsSending(false);
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Enviar audio
  const sendAudioMessage = useCallback(async (file: File) => {
    if (!currentUser) return;

    setIsSending(true);

    try {
      console.log('📤 Enviando audio:', file.name);

      const messageId = `msg_${Date.now()}`;
      const newMessage: Message = {
        id: messageId,
        chatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
        type: 'audio',
        content: 'Audio enviado',
        mediaUrl: URL.createObjectURL(file),
        metadata: {
          fileName: file.name,
          fileSize: file.size,
        },
        status: 'sending',
        createdAt: new Date(),
      };

      addMessage(chatId, newMessage);
      
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
        setIsSending(false);
      }, 500);
    } catch (error) {
      console.error('Error enviando audio:', error);
      setIsSending(false);
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Enviar regalo
  const sendGift = useCallback(async (giftId: string, giftName: string, giftEmoji: string, amount: number) => {
    if (!currentUser) return;

    const messageId = `msg_${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
      type: 'gift',
      content: `Envió un regalo: ${giftName}`,
      gift: {
        id: giftId,
        name: giftName,
        emoji: giftEmoji,
        amount,
      },
      status: 'sending',
      createdAt: new Date(),
    };

    // ✅ Agregar mensaje
    addMessage(chatId, newMessage);

    try {
      console.log('🎁 Enviando regalo:', giftName, amount);
      
      // ✅ Actualizar status (no agregar nuevo)
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
      }, 500);
    } catch (error) {
      console.error('Error enviando regalo:', error);
      updateMessage(chatId, messageId, { status: 'failed' });
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Enviar propina
  const sendTip = useCallback(async (amount: number, message?: string) => {
    if (!currentUser) return;

    const messageId = `msg_${Date.now()}`;
    const newMessage: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderType: currentUser.role === 'creadora' ? 'creator' : 'subscriber',
      type: 'tip',
      content: message || `Envió una propina de S/. ${amount}`,
      gift: {
        id: 'tip',
        name: 'Propina',
        emoji: '💰',
        amount,
      },
      status: 'sending',
      createdAt: new Date(),
    };

    addMessage(chatId, newMessage);

    try {
      console.log('💰 Enviando propina:', amount);
      
      setTimeout(() => {
        updateMessage(chatId, messageId, { status: 'sent' });
      }, 500);
    } catch (error) {
      console.error('Error enviando propina:', error);
      updateMessage(chatId, messageId, { status: 'failed' });
    }
  }, [currentUser, chatId, addMessage, updateMessage]);

  // Indicador de escritura
  const startTyping = useCallback(() => {
    setTyping(chatId, true);
  }, [chatId, setTyping]);

  const stopTyping = useCallback(() => {
    setTyping(chatId, false);
  }, [chatId, setTyping]);

  return {
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
  };
};

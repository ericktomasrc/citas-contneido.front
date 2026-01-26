// src/features/chat/services/mock/MockChatService.ts
// ✅ Chat en tiempo real usando BroadcastChannel (funciona entre pestañas)

import { IChatService, SendMessageData } from '../interfaces/IChatService';
import { Message } from '../../types/message.types';

export class MockChatService implements IChatService {
  private channel: BroadcastChannel;
  private listeners: Set<(message: Message) => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel('citascontenido-chat');
    this.setupListeners();
  }

  private setupListeners() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'new_message') {
        this.listeners.forEach(callback => callback(event.data.message));
      }
    };
  }

  async sendMessage(messageData: SendMessageData): Promise<void> {
    // Construir el objeto Message completo con todas las propiedades requeridas
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatId: messageData.conversationId, // chatId es lo mismo que conversationId
      conversationId: messageData.conversationId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderAvatar: messageData.senderAvatar,
      type: messageData.type,
      content: messageData.content,
      createdAt: new Date(),
      status: 'sent', // Estado inicial
      // Propiedades opcionales
      ...(messageData.mediaUrl && { mediaUrl: messageData.mediaUrl }),
      ...(messageData.thumbnailUrl && { thumbnailUrl: messageData.thumbnailUrl }),
      ...(messageData.metadata && { metadata: messageData.metadata }),
      ...(messageData.giftId && { 
        gift: {
          id: messageData.giftId,
          name: messageData.giftName || '',
          emoji: messageData.giftEmoji || '',
          amount: messageData.amount || 0,
        }
      }),
      ...(messageData.price && { price: messageData.price }),
    } as Message;

    // Guardar en localStorage
    const storageKey = `messages-${message.conversationId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingMessages.push(message);
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));

    // Notificar a todas las pestañas
    this.channel.postMessage({
      type: 'new_message',
      message,
    });

    // Notificar a listeners locales
    this.listeners.forEach(callback => callback(message));
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const storageKey = `messages-${conversationId}`;
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Convertir createdAt de string a Date
    return messages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    }));
  }

  async markAsRead(conversationId: string): Promise<void> {
    // Esta función es opcional ya que el tipo Message puede no tener 'read'
    // Si tu tipo Message tiene 'status', podrías actualizar el status aquí
    const storageKey = `messages-${conversationId}`;
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Solo actualizar si el mensaje tiene la propiedad 'status'
    const updatedMessages = messages.map((msg: any) => ({
      ...msg,
      status: 'read', // Cambiar el status a 'read' si existe
    }));

    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    
    // Notificar a otras pestañas
    this.channel.postMessage({
      type: 'messages_read',
      conversationId,
    });
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.listeners.add(callback);
  }

  cleanup(): void {
    this.listeners.clear();
    this.channel.close();
  }
}

// src/features/chat/services/interfaces/IChatService.ts
// ✅ Contrato que NUNCA cambia (Mock y SignalR lo implementan)

import { Message } from '../../types/message.types';

// Tipo flexible para enviar mensajes (solo las propiedades mínimas requeridas)
export interface SendMessageData {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: Message['type'];
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  metadata?: any;
  giftId?: string;
  giftName?: string;
  giftEmoji?: string;
  amount?: number;
  price?: number;
}

export interface IChatService {
  /**
   * Enviar un mensaje
   * Usa SendMessageData en lugar de Omit<Message> para mayor flexibilidad
   */
  sendMessage(message: SendMessageData): Promise<void>;

  /**
   * Escuchar mensajes nuevos
   */
  onMessageReceived(callback: (message: Message) => void): void;

  /**
   * Obtener mensajes de una conversación
   */
  getMessages(conversationId: string): Promise<Message[]>;

  /**
   * Marcar mensajes como leídos (si el tipo Message lo soporta)
   */
  markAsRead?(conversationId: string): Promise<void>;

  /**
   * Limpiar listeners
   */
  cleanup(): void;
}

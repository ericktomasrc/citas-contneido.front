// src/features/chat/types/message.types.ts

export type MessageType = 
  | 'text'           // Mensaje de texto simple
  | 'image'          // Imagen/Foto
  | 'video'          // Video
  | 'audio'          // Audio/Nota de voz
  | 'gift'           // Regalo virtual
  | 'tip'            // Propina
  | 'premium'        // Contenido premium bloqueado
  | 'system'         // Mensaje del sistema
  | 'videocall';     // Invitación a videollamada

export type MessageStatus = 
  | 'sending'        // Enviando
  | 'sent'           // Enviado
  | 'delivered'      // Entregado
  | 'read'           // Leído
  | 'failed'         // Falló el envío
  | 'blocked';       // Bloqueado por filtro

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderType: 'creator' | 'subscriber';
  type: MessageType;
  content: string;
  
  // Media
  mediaUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number;
    width?: number;
    height?: number;
  };
  
  // Premium Content
  isPremium?: boolean;
  isPurchased?: boolean;
  price?: number;
  previewText?: string;
  
  // Gift/Tip
  gift?: {
    id: string;
    name: string;
    emoji: string;
    amount: number;
  };
  
  // Status
  status: MessageStatus;
  isBlocked?: boolean;
  blockReason?: string;
  
  // Timestamps
  createdAt: Date;
  readAt?: Date;
  
  // Reactions
  reactions?: Array<{
    userId: string;
    emoji: string;
  }>;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'creator' | 'subscriber';
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  createdAt: Date;
  updatedAt: Date;
}

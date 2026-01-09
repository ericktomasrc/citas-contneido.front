// src/features/chat/types/chat.types.ts
// ✅ TIPOS COMPLETOS CON DEFAULTS

export type UserRole = 'creadora' | 'espectador';

// ✅ Configuración COMPLETA de la creadora
export interface ChatSettings {
  // Permisos de envío del espectador
  subscriberCanSendImages: boolean;
  subscriberCanSendVideos: boolean;
  subscriberCanSendAudio: boolean;
  
  // Palabras bloqueadas
  blockedWords: string[];
  autoBlockEnabled: boolean;
  
  // Videollamadas
  videocallsEnabled: boolean;
  videocallPrice: number;
  videocallSettings: {
    audioEnabled: boolean;
    videoEnabled: boolean;
    maxDuration: number; // minutos
  };
  
  // Propinas
  allowAnonymousTips: boolean;
  minTipAmount: number;
  
  // Regalos (siempre habilitados para espectadores)
  allowGifts: boolean;
  allowTips: boolean;
  
  // Contenido premium
  allowPremiumContent: boolean;
}

// ✅ VALORES POR DEFECTO
export const defaultChatSettings: ChatSettings = {
  // Envío de multimedia (deshabilitado por defecto)
  subscriberCanSendImages: false,
  subscriberCanSendVideos: false,
  subscriberCanSendAudio: false,
  
  // Palabras bloqueadas (vacío por defecto)
  blockedWords: [],
  autoBlockEnabled: true,
  
  // Videollamadas (deshabilitadas por defecto)
  videocallsEnabled: false,
  videocallPrice: 10, // S/. 10 por minuto
  videocallSettings: {
    audioEnabled: true,
    videoEnabled: true,
    maxDuration: 30, // 30 minutos máximo
  },
  
  // Propinas (habilitadas por defecto)
  allowAnonymousTips: false,
  minTipAmount: 5, // S/. 5 mínimo
  
  // Regalos (siempre habilitados)
  allowGifts: true,
  allowTips: true,
  
  // Premium
  allowPremiumContent: false,
};

// Permisos calculados para el usuario actual
export interface ChatPermissions {
  canSendMessages: boolean;
  canSendGifts: boolean;
  canSendTips: boolean;
  canSendPhotos: boolean;
  canSendVideos: boolean;
  canSendAudios: boolean;
  canRequestVideocall: boolean;
  canSendPremiumContent: boolean;
}

// Configuración completa del chat
export interface ChatConfig {
  permissions: ChatPermissions;
  settings?: ChatSettings;
  userRole: UserRole;
}

// Tipos de mensajes
export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'gift' 
  | 'tip' 
  | 'premium';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  giftData?: {
    giftId: string;
    giftName: string;
    giftEmoji: string;
    amount: number;
  };
  tipData?: {
    amount: number;
    message?: string;
  };
  timestamp: Date;
  read: boolean;
}

// ✅ TIPO CONVERSATION COMPLETO (faltaba)
export interface Conversation {
  id: string;
  participant: {
    id: string;
    nombre: string;
    avatar: string;
    estado: 'online' | 'offline';
    role: 'creadora' | 'espectador';
    badge?: {
      level: string;
      name: string;
      color: string;
      icon: string;
      price: number;
    };
  };
  lastMessage?: Message;
  lastMessageAt: Date;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  // ✅ Configuración individual del chat (override de la general)
  individualSettings?: Partial<ChatSettings>;
}

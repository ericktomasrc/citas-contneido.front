// src/pages/TransmisionExterna/types/transmision.types.ts

export interface ChatMessage {
  id: string;
  user: string;
  mensaje: string;
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
}

export interface GiftMessage {
  id: string;
  user: string;
  isVIP: boolean;
  avatar: string;
  gift: {
    id: string;
    nombre: string;
    emoji: string;
    valor: number;
  };
  timestamp: Date;
}

export interface TipMessage {
  id: string;
  user: string;
  monto: number;
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
}

export interface SuperChatMessage {
  id: string;
  user: string;
  mensaje: string;
  monto: number;
  tier: 'basic' | 'premium' | 'elite';
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
  expiresAt?: Date;
}

export interface ScreenNotification {
  id: string;
  type: 'gift' | 'message';
  user: string;
  isVIP: boolean;
  content: string;
  title: string;
  valor?: number;
  tier: 'small' | 'medium' | 'large' | 'mega';
  timestamp: Date;
  isExiting?: boolean;
}

export interface Donador {
  user: string;
  total: number;
  avatar?: string;
}

export interface GiftTierConfig {
  tier: 'small' | 'medium' | 'large' | 'mega';
  gradient: string;
  border: string;
  textSize: string;
  padding: string;
  duration: number;
  sound: 'small' | 'medium' | 'large';
}

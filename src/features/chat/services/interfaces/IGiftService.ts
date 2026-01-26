// src/features/chat/services/interfaces/IGiftService.ts
// ✅ Servicio de regalos y propinas

export interface Gift {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  type: 'gift' | 'tip';
  giftId?: string;
  giftName?: string;
  giftEmoji?: string;
  amount: number;
  timestamp: Date;
  conversationId: string;
}

export interface IGiftService {
  /**
   * Enviar un regalo
   */
  sendGift(
    receiverId: string,
    conversationId: string,
    giftId: string,
    giftName: string,
    giftEmoji: string,
    amount: number
  ): Promise<void>;

  /**
   * Enviar una propina
   */
  sendTip(
    receiverId: string,
    conversationId: string,
    amount: number
  ): Promise<void>;

  /**
   * Obtener regalos/propinas de una conversación
   */
  getGifts(conversationId: string): Promise<Gift[]>;

  /**
   * Escuchar nuevos regalos/propinas
   */
  onGiftReceived(callback: (gift: Gift) => void): void;

  /**
   * Limpiar listeners
   */
  cleanup(): void;
}

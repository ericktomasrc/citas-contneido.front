// src/features/chat/services/interfaces/IReactionService.ts
// ✅ Servicio de reacciones a mensajes

export interface Reaction {
  messageId: string;
  userId: string;
  userName: string;
  emoji: string;
  timestamp: Date;
}

export interface IReactionService {
  /**
   * Enviar reacción a un mensaje
   */
  sendReaction(messageId: string, emoji: string): Promise<void>;

  /**
   * Quitar reacción de un mensaje
   */
  removeReaction(messageId: string, emoji: string): Promise<void>;

  /**
   * Obtener reacciones de un mensaje
   */
  getReactions(messageId: string): Promise<Reaction[]>;

  /**
   * Escuchar nuevas reacciones
   */
  onReactionReceived(callback: (reaction: Reaction) => void): void;

  /**
   * Escuchar reacciones eliminadas
   */
  onReactionRemoved(callback: (messageId: string, emoji: string) => void): void;

  /**
   * Limpiar listeners
   */
  cleanup(): void;
}

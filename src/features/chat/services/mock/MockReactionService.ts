// src/features/chat/services/mock/MockReactionService.ts
// ✅ Reacciones en tiempo real

import { IReactionService, Reaction } from '../interfaces/IReactionService';

export class MockReactionService implements IReactionService {
  private channel: BroadcastChannel;
  private addListeners: Set<(reaction: Reaction) => void> = new Set();
  private removeListeners: Set<(messageId: string, emoji: string) => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel('citascontenido-reactions');
    this.setupListeners();
  }

  private setupListeners() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'reaction_added') {
        this.addListeners.forEach(callback => callback(event.data.reaction));
      } else if (event.data.type === 'reaction_removed') {
        this.removeListeners.forEach(callback => 
          callback(event.data.messageId, event.data.emoji)
        );
      }
    };
  }

  private getCurrentUser() {
    const userParam = new URLSearchParams(window.location.search).get('user');
    const mockUsers: Record<string, { id: string; nombre: string }> = {
      creadora: { id: 'user-creadora', nombre: 'María' },
      espectador1: { id: 'user-espectador1', nombre: 'Carlos' },
      espectador2: { id: 'user-espectador2', nombre: 'Juan' },
      espectador3: { id: 'user-espectador3', nombre: 'Pedro' },
    };
    return mockUsers[userParam || 'creadora'] || mockUsers.creadora;
  }

  async sendReaction(messageId: string, emoji: string): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    const reaction: Reaction = {
      messageId,
      userId: currentUser.id,
      userName: currentUser.nombre,
      emoji,
      timestamp: new Date(),
    };

    // Guardar en localStorage
    const storageKey = `reactions-${messageId}`;
    const existingReactions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Verificar si ya existe esta reacción del mismo usuario
    const existingIndex = existingReactions.findIndex(
      (r: Reaction) => r.userId === currentUser.id && r.emoji === emoji
    );
    
    if (existingIndex === -1) {
      existingReactions.push(reaction);
      localStorage.setItem(storageKey, JSON.stringify(existingReactions));

      // Notificar a todas las pestañas
      this.channel.postMessage({
        type: 'reaction_added',
        reaction,
      });

      // Notificar a listeners locales
      this.addListeners.forEach(callback => callback(reaction));
    }
  }

  async removeReaction(messageId: string, emoji: string): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    // Remover de localStorage
    const storageKey = `reactions-${messageId}`;
    const existingReactions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const filteredReactions = existingReactions.filter(
      (r: Reaction) => !(r.userId === currentUser.id && r.emoji === emoji)
    );
    
    localStorage.setItem(storageKey, JSON.stringify(filteredReactions));

    // Notificar a todas las pestañas
    this.channel.postMessage({
      type: 'reaction_removed',
      messageId,
      emoji,
    });

    // Notificar a listeners locales
    this.removeListeners.forEach(callback => callback(messageId, emoji));
  }

  async getReactions(messageId: string): Promise<Reaction[]> {
    const storageKey = `reactions-${messageId}`;
    const reactions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Convertir timestamps de string a Date
    return reactions.map((reaction: any) => ({
      ...reaction,
      timestamp: new Date(reaction.timestamp),
    }));
  }

  onReactionReceived(callback: (reaction: Reaction) => void): void {
    this.addListeners.add(callback);
  }

  onReactionRemoved(callback: (messageId: string, emoji: string) => void): void {
    this.removeListeners.add(callback);
  }

  cleanup(): void {
    this.addListeners.clear();
    this.removeListeners.clear();
    this.channel.close();
  }
}

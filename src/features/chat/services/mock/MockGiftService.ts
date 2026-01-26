// src/features/chat/services/mock/MockGiftService.ts
// ✅ Regalos/Propinas en tiempo real con animaciones

import { IGiftService, Gift } from '../interfaces/IGiftService';

export class MockGiftService implements IGiftService {
  private channel: BroadcastChannel;
  private listeners: Set<(gift: Gift) => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel('citascontenido-gifts');
    this.setupListeners();
  }

  private setupListeners() {
    this.channel.onmessage = (event) => {
      if (event.data.type === 'new_gift') {
        this.listeners.forEach(callback => callback(event.data.gift));
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

  async sendGift(
    receiverId: string,
    conversationId: string,
    giftId: string,
    giftName: string,
    giftEmoji: string,
    amount: number
  ): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    const gift: Gift = {
      id: `gift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      senderName: currentUser.nombre,
      receiverId,
      type: 'gift',
      giftId,
      giftName,
      giftEmoji,
      amount,
      timestamp: new Date(),
      conversationId,
    };

    // Guardar en localStorage
    const storageKey = `gifts-${conversationId}`;
    const existingGifts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingGifts.push(gift);
    localStorage.setItem(storageKey, JSON.stringify(existingGifts));

    // Notificar a todas las pestañas
    this.channel.postMessage({
      type: 'new_gift',
      gift,
    });

    // Notificar a listeners locales
    this.listeners.forEach(callback => callback(gift));
  }

  async sendTip(
    receiverId: string,
    conversationId: string,
    amount: number
  ): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    const tip: Gift = {
      id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      senderName: currentUser.nombre,
      receiverId,
      type: 'tip',
      amount,
      timestamp: new Date(),
      conversationId,
    };

    // Guardar en localStorage
    const storageKey = `gifts-${conversationId}`;
    const existingGifts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingGifts.push(tip);
    localStorage.setItem(storageKey, JSON.stringify(existingGifts));

    // Notificar a todas las pestañas
    this.channel.postMessage({
      type: 'new_gift',
      gift: tip,
    });

    // Notificar a listeners locales
    this.listeners.forEach(callback => callback(tip));
  }

  async getGifts(conversationId: string): Promise<Gift[]> {
    const storageKey = `gifts-${conversationId}`;
    const gifts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Convertir timestamps de string a Date
    return gifts.map((gift: any) => ({
      ...gift,
      timestamp: new Date(gift.timestamp),
    }));
  }

  onGiftReceived(callback: (gift: Gift) => void): void {
    this.listeners.add(callback);
  }

  cleanup(): void {
    this.listeners.clear();
    this.channel.close();
  }
}

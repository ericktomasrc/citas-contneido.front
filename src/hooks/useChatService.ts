// src/features/chat/hooks/useChatServices.ts
// ✅ Hook para acceder a todos los servicios

import { useEffect, useRef } from 'react';
import { MockChatService } from '../features/chat/services/mock/MockChatService';
import { MockGiftService } from '../features/chat/services/mock/MockGiftService';
import { MockReactionService } from '../features/chat/services/mock/MockReactionService';

// Instancias únicas de los servicios
let chatServiceInstance: MockChatService | null = null;
let giftServiceInstance: MockGiftService | null = null;
let reactionServiceInstance: MockReactionService | null = null;

export const useChatServices = () => {
  const servicesRef = useRef({
    chat: chatServiceInstance || (chatServiceInstance = new MockChatService()),
    gift: giftServiceInstance || (giftServiceInstance = new MockGiftService()),
    reaction: reactionServiceInstance || (reactionServiceInstance = new MockReactionService()),
  });

  useEffect(() => {
    // Cleanup al desmontar el componente raíz
    return () => {
      // No limpiamos aquí porque los servicios son compartidos
      // Solo se limpian cuando se cierra toda la app
    };
  }, []);

  return servicesRef.current;
};

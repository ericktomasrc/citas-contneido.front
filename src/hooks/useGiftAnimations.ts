// src/features/chat/hooks/useGiftAnimations.ts
// ✅ Hook para gestionar animaciones de regalos/propinas

import { useState, useEffect } from 'react'; 
import { Gift } from '@/features/chat/services/interfaces/IGiftService';
import { useChatServices } from './useChatService';

export const useGiftAnimations = (conversationId: string) => {
  const { gift: giftService } = useChatServices();
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Escuchar nuevos regalos/propinas
    giftService.onGiftReceived((gift) => {
      if (gift.conversationId === conversationId) {
        setCurrentGift(gift);
        setShowConfetti(true);
        
        // Resetear confetti después de 1 segundo
        setTimeout(() => setShowConfetti(false), 1000);
      }
    });

    return () => {
      // Cleanup si es necesario
    };
  }, [conversationId, giftService]);

  const handleAnimationComplete = () => {
    setCurrentGift(null);
  };

  return {
    currentGift,
    showConfetti,
    handleAnimationComplete,
  };
};

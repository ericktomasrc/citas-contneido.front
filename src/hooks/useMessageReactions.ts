// src/features/chat/hooks/useMessageReactions.ts
// ✅ Hook para gestionar reacciones de mensajes

import { useState, useEffect } from 'react'; 
import { Reaction } from '@/features/chat/services/interfaces/IReactionService';
import { useChatServices } from './useChatService';

export const useMessageReactions = (messageId: string) => {
  const { reaction: reactionService } = useChatServices();
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    // Cargar reacciones iniciales
    reactionService.getReactions(messageId).then(setReactions);

    // Escuchar nuevas reacciones
    reactionService.onReactionReceived((reaction) => {
      if (reaction.messageId === messageId) {
        setReactions((prev) => [...prev, reaction]);
      }
    });

    // Escuchar reacciones eliminadas
    reactionService.onReactionRemoved((msgId, emoji) => {
      if (msgId === messageId) {
        setReactions((prev) => 
          prev.filter((r) => !(r.messageId === msgId && r.emoji === emoji))
        );
      }
    });

    return () => {
      // Cleanup si es necesario
    };
  }, [messageId, reactionService]);

  const addReaction = async (emoji: string) => {
    await reactionService.sendReaction(messageId, emoji);
  };

  const removeReaction = async (emoji: string) => {
    await reactionService.removeReaction(messageId, emoji);
  };

  const toggleReaction = async (emoji: string, currentUserId: string) => {
    const hasReacted = reactions.some(
      (r) => r.userId === currentUserId && r.emoji === emoji
    );

    if (hasReacted) {
      await removeReaction(emoji);
    } else {
      await addReaction(emoji);
    }
  };

  return {
    reactions,
    addReaction,
    removeReaction,
    toggleReaction,
  };
};

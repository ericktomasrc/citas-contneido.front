// src/features/chat/hooks/useConversationSorting.ts
// ✅ ORDENAMIENTO AUTOMÁTICO POR MENSAJE MÁS RECIENTE

import { useCallback, useMemo } from 'react';
import { Conversation } from '../types/chat.types';

export const useConversationSorting = (conversations: Conversation[]) => {
  
  // Ordenar conversaciones por última actividad
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      // Primero los pinneados
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Luego por fecha del último mensaje (más reciente primero)
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      
      return dateB - dateA;
    });
  }, [conversations]);

  // Función para actualizar timestamp cuando se recibe/envía mensaje
  const updateConversationTimestamp = useCallback((conversationId: string) => {
    return new Date();
  }, []);

  // Helper para obtener el ID de la conversación que debería estar arriba
  const getTopConversationId = useCallback(() => {
    if (sortedConversations.length === 0) return null;
    return sortedConversations[0].id;
  }, [sortedConversations]);

  return {
    sortedConversations,
    updateConversationTimestamp,
    getTopConversationId,
  };
};

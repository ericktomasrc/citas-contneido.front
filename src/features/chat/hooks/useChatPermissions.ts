// src/features/chat/hooks/useChatPermissions.ts
// ✅ ACTUALIZADO para usar los nuevos nombres de ChatSettings

import { useMemo } from 'react';
import { ChatSettings, ChatPermissions, UserRole, defaultChatSettings } from '../types/chat.types';

/**
 * Hook para calcular los permisos del chat según el rol del usuario
 * y la configuración de la creadora
 */
export const useChatPermissions = (
  userRole: UserRole,
  recipientSettings?: ChatSettings
) => {
  const permissions = useMemo<ChatPermissions>(() => {
    // CREADORA: Permisos completos
    if (userRole === 'creadora') {
      return {
        canSendMessages: true,
        canSendPhotos: true,
        canSendVideos: true,
        canSendAudios: true,
        canSendGifts: false,           // Ella recibe, no envía
        canSendTips: false,            // Ella recibe, no envía
        canRequestVideocall: false,    // Ella acepta, no solicita
        canSendPremiumContent: true,   // Solo ella puede enviar contenido premium
      };
    }

    // ESPECTADOR: Permisos según configuración de la creadora
    const settings = recipientSettings || defaultChatSettings;

    return {
      canSendMessages: true,                              // Siempre puede enviar texto
      canSendPhotos: settings.subscriberCanSendImages,    // ✅ Nuevo nombre
      canSendVideos: settings.subscriberCanSendVideos,    // ✅ Nuevo nombre
      canSendAudios: settings.subscriberCanSendAudio,     // ✅ Nuevo nombre
      canSendGifts: settings.allowGifts,
      canSendTips: settings.allowTips,
      canRequestVideocall: settings.videocallsEnabled,    // ✅ Nuevo nombre
      canSendPremiumContent: false,                       // No puede enviar contenido premium
    };
  }, [userRole, recipientSettings]);

  return { permissions };
};

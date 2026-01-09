// src/features/chat/hooks/useUserRole.ts
// ✅ CORREGIDO: Rol unificado creadora/espectador

import { useAuthStore } from '../../../stores/auth.store';
import { UserRole, CurrentUser } from '../types/user.types';

/**
 * Hook para obtener el rol del usuario actual
 * Detecta automáticamente si es creadora o espectador
 */
export const useUserRole = () => {
  const user = useAuthStore(state => state.user);
  
  // ⭐ Convertir rol del backend a nuestro tipo
  const role: UserRole = user?.role === 'creator' ? 'creadora' : 'espectador';
  const isCreator = role === 'creadora';
  const isSubscriber = role === 'espectador';

  return {
    user,
    role,
    isCreator,
    isSubscriber,
  };
};

/**
 * Hook para obtener el usuario actual completo
 */
export const useCurrentUser = (): CurrentUser | null => {
  const user = useAuthStore(state => state.user);
  
  if (!user) return null;

  return {
    id: user.id,
    role: user.role === 'creator' ? 'creadora' : 'espectador',
    name: user.name,
    avatar: user.avatar,
    username: user.username,
    isPremium: user.isPremium,
  };
};

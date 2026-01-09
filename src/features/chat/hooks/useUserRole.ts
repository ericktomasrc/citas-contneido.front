// src/features/chat/hooks/useUserRole.ts
// ✅ ACTUALIZADO: Soporta modo de desarrollo

import { useAuthStore } from '../../../stores/auth.store';
import { useDevStore } from '../../../stores/dev.store';
import { UserRole, CurrentUser } from '../types/user.types';

// ⚠️ Cambiar a true para usar modo de desarrollo
const DEV_MODE = true;

/**
 * Hook para obtener el rol del usuario actual
 * En modo DEV usa el dev.store, en producción usa auth.store
 */
export const useUserRole = () => {
  // Modo desarrollo
  if (DEV_MODE) {
    const devUser = useDevStore(state => state.getCurrentUser());
    const devRole = useDevStore(state => state.currentRole);
    
    const role: UserRole = devRole;
    const isCreator = role === 'creadora';
    const isSubscriber = role === 'espectador';

    return {
      user: devUser,
      role,
      isCreator,
      isSubscriber,
    };
  }

  // Modo producción
  const user = useAuthStore(state => state.user);
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
  // Modo desarrollo
  if (DEV_MODE) {
    const devUser = useDevStore(state => state.getCurrentUser());
    const devRole = useDevStore(state => state.currentRole);
    
    return {
      id: devUser.id,
      role: devRole,
      name: devUser.name,
      avatar: devUser.avatar,
      username: devUser.username,
      isPremium: devUser.isPremium,
    };
  }

  // Modo producción
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

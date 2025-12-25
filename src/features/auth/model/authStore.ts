import { create } from 'zustand';
import { User } from '@shared/types';
import { STORAGE_KEYS } from '@shared/config/constants';
import { authApi } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Sesión automática
  sessionTimeout: NodeJS.Timeout | null;
  
  // Actions
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  initAuth: () => void;
  updateActivity: () => void;
  setupSessionTimeout: () => void;
  clearSessionTimeout: () => void;
}

const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutos

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  sessionTimeout: null,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });

    // Configurar auto-logout por inactividad
    get().setupSessionTimeout();
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    get().clearSessionTimeout();
    
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    window.location.href = '/login';
  },

  initAuth: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        get().setupSessionTimeout();
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem(STORAGE_KEYS.USER);
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  // Actualizar última actividad
  updateActivity: () => {
    const { user } = get();
    if (user) {
      // Reiniciar timeout
      get().clearSessionTimeout();
      get().setupSessionTimeout();
    }
  },

  // Configurar auto-logout por inactividad
  setupSessionTimeout: () => {
    const timeout = setTimeout(() => {
      console.log('Sesión expirada por inactividad');
      get().logout();
    }, INACTIVITY_TIME);

    set({ sessionTimeout: timeout });
  },

  // Limpiar timeout
  clearSessionTimeout: () => {
    const { sessionTimeout } = get();
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      set({ sessionTimeout: null });
    }
  },
}));
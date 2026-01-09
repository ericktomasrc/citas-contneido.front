// src/stores/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  role: 'creator' | 'subscriber';
  name: string;
  username: string;
  avatar: string;
  email: string;
  isPremium?: boolean;
  isVerified?: boolean;
  chatSettings?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: (user, token) => {
        set({ 
          user, 
          token,
          isAuthenticated: true 
        });
        console.log('✅ Usuario autenticado:', user.name, `(${user.role})`);
      },

      logout: () => {
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });
        console.log('👋 Sesión cerrada');
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook helper para obtener el rol del usuario
export const useUserRole = () => {
  const user = useAuthStore(state => state.user);
  return user?.role || null;
};

// Hook helper para saber si está autenticado
export const useIsAuthenticated = () => {
  return useAuthStore(state => state.isAuthenticated);
};

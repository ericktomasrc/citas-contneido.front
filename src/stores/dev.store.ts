// src/stores/dev.store.ts
// ⚠️ SOLO PARA DESARROLLO - Permite cambiar entre roles

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DevRole = 'creadora' | 'espectador';

interface DevUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'creator' | 'subscriber';
  isPremium?: boolean;
}

interface DevStore {
  // Rol actual (para cambiar en dev)
  currentRole: DevRole;
  
  // Usuarios mock
  users: {
    creadora: DevUser;
    espectador: DevUser;
  };
  
  // Acciones
  setRole: (role: DevRole) => void;
  getCurrentUser: () => DevUser;
}

// Usuarios de prueba
const MOCK_USERS = {
  creadora: {
    id: 'creadora-1',
    name: 'María Rodriguez',
    username: 'maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'creator' as const,
    isPremium: true,
  },
  espectador: {
    id: 'espectador-1',
    name: 'Juan Pérez',
    username: 'juan_perez',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'subscriber' as const,
    isPremium: false,
  },
};

export const useDevStore = create<DevStore>()(
  persist(
    (set, get) => ({
      currentRole: 'creadora', // Por defecto creadora
      users: MOCK_USERS,

      setRole: (role) => set({ currentRole: role }),

      getCurrentUser: () => {
        const { currentRole, users } = get();
        return users[currentRole];
      },
    }),
    {
      name: 'dev-store', // localStorage key
    }
  )
);

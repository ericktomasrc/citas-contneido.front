// src/features/chat/types/user.types.ts
// ✅ ACTUALIZADO CON ROLES Y BADGES
 
export type UserRole = 'creadora' | 'espectador';

export type BadgeLevel = 'basico' | 'pro' | 'premium' | 'vip' | 'super-vip';

// ⭐ Estado del usuario
export type UserStatus = 'online' | 'offline' | 'away';

export interface Badge {
  level: BadgeLevel;
  name: string;
  color: string;
  icon: string;
  price: number; // Precio en soles
}

// export interface User {
//   id: string;
//   nombre: string;
//   avatar: string;
//   estado: 'online' | 'offline' | 'ausente';
//   role: UserRole;
//   badge?: Badge; // Solo espectadores tienen badge
//   verificado?: boolean;
// }

export interface User {
  id: string;
  nombre: string;
  avatar: string;
  estado: UserStatus;
  role: UserRole;
  badge?: Badge;
  username?: string;
  isPremium?: boolean;
}

export interface Espectador extends User {
  role: 'espectador';
  badge?: Badge;
  gastado: number; // Total gastado en la plataforma
  suscripcionActiva: boolean;
}

export interface Creadora extends User {
  role: 'creadora';
  verificada: boolean;
  seguidores: number;
}

// ⭐ Usuario actual (para hooks)
export interface CurrentUser {
  id: string;
  role: UserRole;
  name: string;
  avatar: string;
  username: string;
  isPremium?: boolean;
}


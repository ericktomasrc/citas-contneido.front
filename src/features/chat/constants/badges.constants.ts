// src/features/chat/constants/badges.constants.ts
// ✅ INSIGNIAS DE SOLVENCIA PARA ESPECTADORES

import { Badge } from '../types/user.types';

export const BADGES: Record<string, Badge> = {
  BASICO: {
    level: 'basico',
    name: 'Básico',
    color: '#64748b', // Slate
    icon: '🥉',
    price: 0, // Gratis
  },
  PRO: {
    level: 'pro',
    name: 'Pro',
    color: '#3b82f6', // Blue
    icon: '🥈',
    price: 50,
  },
  PREMIUM: {
    level: 'premium',
    name: 'Premium',
    color: '#8b5cf6', // Violet
    icon: '💎',
    price: 150,
  },
  VIP: {
    level: 'vip',
    name: 'VIP',
    color: '#f59e0b', // Amber/Gold
    icon: '👑',
    price: 300,
  },
  SUPER_VIP: {
    level: 'super-vip',
    name: 'Super VIP',
    color: '#ec4899', // Pink
    icon: '⭐',
    price: 500,
  },
};

// Helper para obtener badge por nivel
export const getBadgeByLevel = (level: string): Badge => {
  return BADGES[level.toUpperCase().replace('-', '_')] || BADGES.BASICO;
};

// Helper para obtener badge según gasto total
export const getBadgeBySpending = (totalSpent: number): Badge => {
  if (totalSpent >= 500) return BADGES.SUPER_VIP;
  if (totalSpent >= 300) return BADGES.VIP;
  if (totalSpent >= 150) return BADGES.PREMIUM;
  if (totalSpent >= 50) return BADGES.PRO;
  return BADGES.BASICO;
};

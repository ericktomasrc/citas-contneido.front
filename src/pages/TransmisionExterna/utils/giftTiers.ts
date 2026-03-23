// src/pages/TransmisionExterna/utils/giftTiers.ts

import { GiftTierConfig } from '../types/transmision.types';

export const getGiftTierConfig = (valor: number) => {
 if (valor >= 500) return {
    tier: 'mega' as const,
    gradient: 'from-violet-50 via-pink-50 to-rose-50',
    border: 'border-violet-200',
    textSize: 'text-7xl',
    padding: 'p-8',
    duration: 6000,
    sound: 'large' as const,
    shadow: 'shadow-xl shadow-violet-200/50'
  };
  if (valor >= 200) return {
    tier: 'large' as const,
    gradient: 'from-amber-50 via-yellow-50 to-orange-50',
    border: 'border-amber-200',
    textSize: 'text-6xl',
    padding: 'p-6',
    duration: 5000,
    sound: 'large' as const,
    shadow: 'shadow-xl shadow-amber-200/50'
  };
  if (valor >= 50) return {
    tier: 'medium' as const,
    gradient: 'from-pink-50 via-rose-50 to-violet-50',
    border: 'border-pink-200',
    textSize: 'text-5xl',
    padding: 'p-5',
    duration: 4000,
    sound: 'medium' as const,
    shadow: 'shadow-lg shadow-pink-200/50'
  };
  return {
    tier: 'small' as const,
    gradient: 'from-blue-50 via-violet-50 to-purple-50',
    border: 'border-blue-200',
    textSize: 'text-3xl',
    padding: 'p-4',
    duration: 3000,
    sound: 'small' as const,
    shadow: 'shadow-md shadow-blue-200/50'
  };
};

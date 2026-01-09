// src/features/chat/constants/gifts.constants.ts

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'basic' | 'premium' | 'vip';
}

export const GIFTS: Gift[] = [
  // BASIC (S/. 5-15) - Colores suaves
  { 
    id: 'rose', 
    name: 'Rosa', 
    emoji: '🌹', 
    price: 5, 
    category: 'basic' 
  },
  { 
    id: 'heart', 
    name: 'Corazón', 
    emoji: '❤️', 
    price: 10, 
    category: 'basic' 
  },
  { 
    id: 'kiss', 
    name: 'Beso', 
    emoji: '💋', 
    price: 15, 
    category: 'basic' 
  },
  
  // PREMIUM (S/. 20-50) - Colores elegantes
  { 
    id: 'diamond', 
    name: 'Diamante', 
    emoji: '💎', 
    price: 25, 
    category: 'premium' 
  },
  { 
    id: 'ring', 
    name: 'Anillo', 
    emoji: '💍', 
    price: 30, 
    category: 'premium' 
  },
  { 
    id: 'champagne', 
    name: 'Champagne', 
    emoji: '🍾', 
    price: 40, 
    category: 'premium' 
  },
  { 
    id: 'crown', 
    name: 'Corona', 
    emoji: '👑', 
    price: 50, 
    category: 'premium' 
  },
  
  // VIP (S/. 75-200) - Premium máximo
  { 
    id: 'rocket', 
    name: 'Cohete', 
    emoji: '🚀', 
    price: 75, 
    category: 'vip' 
  },
  { 
    id: 'fire', 
    name: 'Fuego', 
    emoji: '🔥', 
    price: 100, 
    category: 'vip' 
  },
  { 
    id: 'star', 
    name: 'Estrella VIP', 
    emoji: '⭐', 
    price: 150, 
    category: 'vip' 
  },
  { 
    id: 'unicorn', 
    name: 'Unicornio', 
    emoji: '🦄', 
    price: 200, 
    category: 'vip' 
  },
];

// Montos sugeridos para propinas
export const TIP_AMOUNTS = [5, 10, 20, 50, 100, 200, 500];

// Colores por categoría (diseño premium)
export const GIFT_CATEGORY_COLORS = {
  basic: {
    bg: 'from-pink-50 to-rose-50',
    hover: 'hover:from-pink-100 hover:to-rose-100',
    border: 'border-pink-200',
    text: 'text-pink-600',
  },
  premium: {
    bg: 'from-violet-50 to-purple-50',
    hover: 'hover:from-violet-100 hover:to-purple-100',
    border: 'border-violet-200',
    text: 'text-violet-600',
  },
  vip: {
    bg: 'from-amber-50 to-yellow-50',
    hover: 'hover:from-amber-100 hover:to-yellow-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
  },
};

// src/features/chat/components/Gifts/GiftPanel.tsx
// ✅ CORREGIDO: SOLO REGALOS (sin propinas)

import { useState } from 'react';
import { X } from 'lucide-react';
import { GIFTS, GIFT_CATEGORY_COLORS } from '../../constants/gifts.constants';

interface GiftPanelProps {
  onSendGift: (giftId: string, giftName: string, giftEmoji: string, amount: number) => void;
  onClose: () => void;
}

export const GiftPanel = ({ onSendGift, onClose }: GiftPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'premium' | 'vip'>('all');

  const filteredGifts = selectedCategory === 'all' 
    ? GIFTS 
    : GIFTS.filter(gift => gift.category === selectedCategory);

  const handleGiftClick = (gift: typeof GIFTS[0]) => {
    onSendGift(gift.id, gift.name, gift.emoji, gift.price);
    onClose();
  };

  return (
    <div className="bg-white border-t border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-lg">🎁</span>
          Enviar Regalo
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Filtros de categoría */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'all' as const, label: 'Todos' },
            { id: 'basic' as const, label: 'Básicos' },
            { id: 'premium' as const, label: 'Premium' },
            { id: 'vip' as const, label: 'VIP' },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid de regalos */}
        <div className="grid grid-cols-4 gap-2">
          {filteredGifts.map((gift) => {
            const colors = GIFT_CATEGORY_COLORS[gift.category];
            return (
              <button
                key={gift.id}
                onClick={() => handleGiftClick(gift)}
                className={`flex flex-col items-center p-3 rounded-xl bg-gradient-to-br ${colors.bg} ${colors.hover} border ${colors.border} transition group`}
              >
                <span className="text-3xl mb-1 group-hover:scale-125 transition">
                  {gift.emoji}
                </span>
                <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight mb-1">
                  {gift.name}
                </span>
                <span className={`text-xs font-bold ${colors.text}`}>
                  S/. {gift.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

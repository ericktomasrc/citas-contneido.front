// src/features/chat/components/Gifts/GiftPanel.tsx
// ✅ PANEL DE REGALOS Y PROPINAS

import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { GIFTS, TIP_AMOUNTS, GIFT_CATEGORY_COLORS } from '../../constants/gifts.constants';

interface GiftPanelProps {
  onSendGift: (giftId: string, giftName: string, giftEmoji: string, amount: number) => void;
  onClose: () => void;
}

export const GiftPanel = ({ onSendGift, onClose }: GiftPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'premium' | 'vip'>('all');
  const [customTipAmount, setCustomTipAmount] = useState('');

  const filteredGifts = selectedCategory === 'all' 
    ? GIFTS 
    : GIFTS.filter(gift => gift.category === selectedCategory);

  const handleGiftClick = (gift: typeof GIFTS[0]) => {
    onSendGift(gift.id, gift.name, gift.emoji, gift.price);
    onClose();
  };

  const handleQuickTip = (amount: number) => {
    onSendGift('tip', 'Propina', '💰', amount);
    onClose();
  };

  const handleCustomTip = () => {
    const amount = Number(customTipAmount);
    if (amount >= 5) {
      onSendGift('tip', 'Propina', '💰', amount);
      setCustomTipAmount('');
      onClose();
    }
  };

  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-lg">🎁</span>
          Enviar Regalo
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

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
      <div className="grid grid-cols-4 gap-2 mb-4">
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

      {/* Separador */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs font-medium text-slate-500 bg-white">
            O envía una propina
          </span>
        </div>
      </div>

      {/* Propinas rápidas */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {TIP_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handleQuickTip(amount)}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 transition group"
          >
            <span className="text-lg mb-1 block group-hover:scale-110 transition">💰</span>
            <span className="text-xs font-bold text-emerald-600 block">
              S/. {amount}
            </span>
          </button>
        ))}
      </div>

      {/* Propina personalizada */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-2 block">
          Propina Personalizada
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              value={customTipAmount}
              onChange={(e) => setCustomTipAmount(e.target.value)}
              placeholder="0.00"
              min="5"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleCustomTip}
            disabled={!customTipAmount || Number(customTipAmount) < 5}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg font-semibold text-sm transition shadow-md hover:shadow-lg disabled:shadow-none"
          >
            Enviar
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Mínimo S/. 5
        </p>
      </div>
    </div>
  );
};

// src/features/chat/components/Reports/GiftsReportModal.tsx
// ✅ CORREGIDO: Usa React Portal para overlay en toda la pantalla

import { createPortal } from 'react-dom';
import { X, Gift, TrendingUp, Award } from 'lucide-react';

interface GiftsReportModalProps {
  onClose: () => void;
}

export const GiftsReportModal = ({ onClose }: GiftsReportModalProps) => {
  const giftsData = {
    total: 1250,
    count: 24,
    topGift: {
      sender: 'Carlos López',
      gift: 'Corona',
      amount: 50,
      emoji: '👑',
    },
    recentGifts: [
      { id: '1', sender: 'Carlos López', gift: 'Corona', amount: 50, emoji: '👑', time: 'Hace 2h' },
      { id: '2', sender: 'Juan Pérez', gift: 'Diamante', amount: 25, emoji: '💎', time: 'Hace 5h' },
      { id: '3', sender: 'Miguel Torres', gift: 'Corazón', amount: 10, emoji: '❤️', time: 'Ayer' },
    ],
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Mis Regalos</h3>
                <p className="text-[10px] text-slate-400">Resumen de ingresos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-md hover:bg-slate-200/60 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3 max-h-[320px] overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Total Acumulado</p>
              <p className="text-lg font-bold text-slate-700">S/. {giftsData.total}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Recibidos</p>
              <p className="text-lg font-bold text-slate-700">{giftsData.count}</p>
            </div>
          </div>

          {/* Top Gift */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
              <h4 className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Mejor Regalo</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{giftsData.topGift.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700">{giftsData.topGift.gift}</p>
                <p className="text-[10px] text-slate-400">De {giftsData.topGift.sender}</p>
              </div>
              <span className="text-sm font-bold text-amber-600">S/. {giftsData.topGift.amount}</span>
            </div>
          </div>

          {/* Recent Gifts */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Recientes</h4>
            <div className="space-y-1.5">
              {giftsData.recentGifts.map((gift) => (
                <div key={gift.id} className="flex items-center gap-2 py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <span className="text-base">{gift.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{gift.sender}</p>
                    <p className="text-[10px] text-slate-400">{gift.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-rose-500">+S/. {gift.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100">
          <button
            className="w-full py-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-lg font-medium text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            Reclamar S/. {giftsData.total}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

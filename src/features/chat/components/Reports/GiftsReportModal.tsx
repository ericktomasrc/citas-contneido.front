// src/features/chat/components/Reports/GiftsReportModal.tsx
// ✅ Modal de regalos - Bonito, premium, suave, elegante

import { X, Gift, TrendingUp, Award } from 'lucide-react';

interface GiftsReportModalProps {
  onClose: () => void;
}

export const GiftsReportModal = ({ onClose }: GiftsReportModalProps) => {
  // Mock data
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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Mis Regalos</h3>
                <p className="text-sm text-slate-500">Resumen de ingresos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
              <p className="text-sm text-violet-600 font-medium mb-1">Total Acumulado</p>
              <p className="text-2xl font-bold text-violet-700">S/. {giftsData.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium mb-1">Regalos Recibidos</p>
              <p className="text-2xl font-bold text-emerald-700">{giftsData.count}</p>
            </div>
          </div>

          {/* Top Gift */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">Mejor Regalo</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{giftsData.topGift.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {giftsData.topGift.gift}
                </p>
                <p className="text-xs text-slate-500">
                  De {giftsData.topGift.sender}
                </p>
              </div>
              <span className="text-lg font-bold text-amber-700">
                S/. {giftsData.topGift.amount}
              </span>
            </div>
          </div>

          {/* Recent Gifts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Regalos Recientes</h4>
            <div className="space-y-2">
              {giftsData.recentGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {gift.sender}
                    </p>
                    <p className="text-xs text-slate-500">{gift.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-violet-600">
                    +S/. {gift.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Reclamar S/. {giftsData.total}
          </button>
        </div>
      </div>
    </div>
  );
};

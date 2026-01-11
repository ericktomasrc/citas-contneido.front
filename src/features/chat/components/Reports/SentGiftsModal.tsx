// src/features/chat/components/Reports/SentGiftsModal.tsx
// ✅ Modal para ESPECTADOR - Regalos enviados

import { X, Gift } from 'lucide-react';

interface SentGiftsModalProps {
  onClose: () => void;
}

export const SentGiftsModal = ({ onClose }: SentGiftsModalProps) => {
  // Mock data
  const sentGifts = {
    total: 350,
    count: 12,
    recipients: [
      { name: 'María Rodriguez', amount: 150, gifts: 5 },
      { name: 'Ana García', amount: 120, gifts: 4 },
      { name: 'Sofia Martínez', amount: 80, gifts: 3 },
    ],
    recent: [
      { id: '1', recipient: 'María Rodriguez', gift: 'Corona', amount: 50, emoji: '👑', time: 'Hace 1h' },
      { id: '2', recipient: 'Ana García', gift: 'Diamante', amount: 25, emoji: '💎', time: 'Hace 3h' },
      { id: '3', recipient: 'María Rodriguez', gift: 'Champagne', amount: 40, emoji: '🍾', time: 'Ayer' },
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
                <h3 className="text-lg font-bold text-slate-800">Regalos Enviados</h3>
                <p className="text-sm text-slate-500">Tu historial</p>
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
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
              <p className="text-sm text-violet-600 font-medium mb-1">Total Gastado</p>
              <p className="text-2xl font-bold text-violet-700">S/. {sentGifts.total}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
              <p className="text-sm text-pink-600 font-medium mb-1">Regalos Enviados</p>
              <p className="text-2xl font-bold text-pink-700">{sentGifts.count}</p>
            </div>
          </div>

          {/* Top Recipients */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Principales Destinatarias</h4>
            <div className="space-y-2">
              {sentGifts.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{recipient.name}</p>
                    <p className="text-xs text-slate-500">{recipient.gifts} regalos</p>
                  </div>
                  <span className="text-sm font-semibold text-violet-600">S/. {recipient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Gifts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Regalos Recientes</h4>
            <div className="space-y-2">
              {sentGifts.recent.map((gift) => (
                <div key={gift.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xl">{gift.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{gift.recipient}</p>
                    <p className="text-xs text-slate-500">{gift.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-pink-600">S/. {gift.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-sm transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

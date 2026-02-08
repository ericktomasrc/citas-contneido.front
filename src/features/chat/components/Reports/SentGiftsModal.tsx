// src/features/chat/components/Reports/SentGiftsModal.tsx
// ✅ CORREGIDO: Usa React Portal para overlay en toda la pantalla

import { createPortal } from 'react-dom';
import { X, Gift } from 'lucide-react';

interface SentGiftsModalProps {
  onClose: () => void;
}

export const SentGiftsModal = ({ onClose }: SentGiftsModalProps) => {
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
                <h3 className="text-sm font-semibold text-slate-800">Regalos Enviados</h3>
                <p className="text-[10px] text-slate-400">Tu historial</p>
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
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Total Gastado</p>
              <p className="text-lg font-bold text-slate-700">S/. {sentGifts.total}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Regalos</p>
              <p className="text-lg font-bold text-slate-700">{sentGifts.count}</p>
            </div>
          </div>

          {/* Top Recipients */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Principales</h4>
            <div className="space-y-1.5">
              {sentGifts.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-slate-700">{recipient.name}</p>
                    <p className="text-[10px] text-slate-400">{recipient.gifts} regalos</p>
                  </div>
                  <span className="text-xs font-semibold text-rose-500">S/. {recipient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Gifts */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Recientes</h4>
            <div className="space-y-1.5">
              {sentGifts.recent.map((gift) => (
                <div key={gift.id} className="flex items-center gap-2 py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <span className="text-base">{gift.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{gift.recipient}</p>
                    <p className="text-[10px] text-slate-400">{gift.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-rose-500">S/. {gift.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-medium text-xs transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

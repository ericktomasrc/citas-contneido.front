// src/features/chat/components/Reports/SentTipsModal.tsx
// ✅ CORREGIDO: Usa React Portal para overlay en toda la pantalla

import { createPortal } from 'react-dom';
import { X, DollarSign } from 'lucide-react';

interface SentTipsModalProps {
  onClose: () => void;
}

export const SentTipsModal = ({ onClose }: SentTipsModalProps) => {
  const sentTips = {
    total: 520,
    count: 15,
    recipients: [
      { name: 'María Rodriguez', amount: 200 },
      { name: 'Ana García', amount: 180 },
      { name: 'Sofia Martínez', amount: 140 },
    ],
    recent: [
      { id: '1', recipient: 'María Rodriguez', amount: 50, message: '¡Eres increíble!', time: 'Hace 2h' },
      { id: '2', recipient: 'Ana García', amount: 30, message: '', time: 'Hace 4h' },
      { id: '3', recipient: 'María Rodriguez', amount: 20, message: 'Gracias por el contenido', time: 'Ayer' },
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
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Propinas Enviadas</h3>
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
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Total Enviado</p>
              <p className="text-lg font-bold text-slate-700">S/. {sentTips.total}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Propinas</p>
              <p className="text-lg font-bold text-slate-700">{sentTips.count}</p>
            </div>
          </div>

          {/* Top Recipients */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Principales</h4>
            <div className="space-y-1.5">
              {sentTips.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <p className="text-xs font-medium text-slate-700">{recipient.name}</p>
                  <span className="text-xs font-semibold text-emerald-600">S/. {recipient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tips */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Recientes</h4>
            <div className="space-y-1.5">
              {sentTips.recent.map((tip) => (
                <div key={tip.id} className="py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-slate-700">{tip.recipient}</p>
                    <span className="text-xs font-semibold text-emerald-600">S/. {tip.amount}</span>
                  </div>
                  {tip.message && (
                    <p className="text-[10px] text-slate-400 italic">"{tip.message}"</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">{tip.time}</p>
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

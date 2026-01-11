// src/features/chat/components/Reports/SentTipsModal.tsx
// ✅ Modal para ESPECTADOR - Propinas enviadas

import { X, DollarSign } from 'lucide-react';

interface SentTipsModalProps {
  onClose: () => void;
}

export const SentTipsModal = ({ onClose }: SentTipsModalProps) => {
  // Mock data
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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Propinas Enviadas</h3>
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
              <p className="text-sm text-violet-600 font-medium mb-1">Total Enviado</p>
              <p className="text-2xl font-bold text-violet-700">S/. {sentTips.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium mb-1">Propinas Enviadas</p>
              <p className="text-2xl font-bold text-emerald-700">{sentTips.count}</p>
            </div>
          </div>

          {/* Top Recipients */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Principales Destinatarias</h4>
            <div className="space-y-2">
              {sentTips.recipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-800">{recipient.name}</p>
                  <span className="text-sm font-semibold text-emerald-600">S/. {recipient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tips */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Propinas Recientes</h4>
            <div className="space-y-2">
              {sentTips.recent.map((tip) => (
                <div key={tip.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800">{tip.recipient}</p>
                    <span className="text-sm font-semibold text-emerald-600">S/. {tip.amount}</span>
                  </div>
                  {tip.message && (
                    <p className="text-xs text-slate-500 italic">"{tip.message}"</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{tip.time}</p>
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

// src/features/chat/components/Reports/TipsReportModal.tsx
// ✅ CORREGIDO: Usa React Portal para overlay en toda la pantalla

import { createPortal } from 'react-dom';
import { X, DollarSign, TrendingUp, Crown } from 'lucide-react';

interface TipsReportModalProps {
  onClose: () => void;
}

export const TipsReportModal = ({ onClose }: TipsReportModalProps) => {
  const tipsData = {
    total: 850,
    count: 18,
    topTipper: {
      name: 'Juan Pérez',
      amount: 150,
    },
    recentTips: [
      { id: '1', sender: 'Juan Pérez', amount: 50, message: '¡Eres increíble!', time: 'Hace 1h' },
      { id: '2', sender: 'Carlos López', amount: 30, message: 'Gracias por el contenido', time: 'Hace 3h' },
      { id: '3', sender: 'Miguel Torres', amount: 20, message: '', time: 'Ayer' },
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
                <h3 className="text-sm font-semibold text-slate-800">Mis Propinas</h3>
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
              <p className="text-lg font-bold text-slate-700">S/. {tipsData.total}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Recibidas</p>
              <p className="text-lg font-bold text-slate-700">{tipsData.count}</p>
            </div>
          </div>

          {/* Top Tipper */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-2.5 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
              <h4 className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Mejor Seguidor</h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700">{tipsData.topTipper.name}</p>
                <p className="text-[10px] text-slate-400">Ha dado más propinas</p>
              </div>
              <span className="text-sm font-bold text-amber-600">S/. {tipsData.topTipper.amount}</span>
            </div>
          </div>

          {/* Recent Tips */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Recientes</h4>
            <div className="space-y-1.5">
              {tipsData.recentTips.map((tip) => (
                <div key={tip.id} className="py-1.5 px-2.5 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-slate-700">{tip.sender}</p>
                    <span className="text-xs font-semibold text-emerald-600">+S/. {tip.amount}</span>
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
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            Reclamar S/. {tipsData.total}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

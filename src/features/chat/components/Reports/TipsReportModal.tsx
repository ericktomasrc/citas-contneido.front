// src/features/chat/components/Reports/TipsReportModal.tsx
// ✅ Modal de propinas - Bonito, premium, suave, elegante

import { X, DollarSign, TrendingUp, Users } from 'lucide-react';

interface TipsReportModalProps {
  onClose: () => void;
}

export const TipsReportModal = ({ onClose }: TipsReportModalProps) => {
  // Mock data
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
                <h3 className="text-lg font-bold text-slate-800">Mis Propinas</h3>
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
              <p className="text-2xl font-bold text-violet-700">S/. {tipsData.total}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-600 font-medium mb-1">Propinas Recibidas</p>
              <p className="text-2xl font-bold text-blue-700">{tipsData.count}</p>
            </div>
          </div>

          {/* Top Tipper */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">Mejor Seguidor</h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {tipsData.topTipper.name}
                </p>
                <p className="text-xs text-slate-500">Ha dado más propinas</p>
              </div>
              <span className="text-lg font-bold text-amber-700">
                S/. {tipsData.topTipper.amount}
              </span>
            </div>
          </div>

          {/* Recent Tips */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Propinas Recientes</h4>
            <div className="space-y-2">
              {tipsData.recentTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800">{tip.sender}</p>
                    <span className="text-sm font-semibold text-emerald-600">
                      +S/. {tip.amount}
                    </span>
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
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Reclamar S/. {tipsData.total}
          </button>
        </div>
      </div>
    </div>
  );
};

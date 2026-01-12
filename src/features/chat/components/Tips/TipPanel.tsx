// src/features/chat/components/Tips/TipPanel.tsx
// ✅ MEJORADO: Header más compacto y presentable

import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface TipPanelProps {
  onSendTip: (amount: number) => void;
  onClose: () => void;
}

export const TipPanel = ({ onSendTip, onClose }: TipPanelProps) => {
  const [customAmount, setCustomAmount] = useState('');

  const predefinedAmounts = [1, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 70, 90, 100, 150, 200, 300, 500, 800, 1000];

  const handleSendTip = (amount: number) => {
    if (amount > 0) {
      onSendTip(amount);
    }
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (amount >= 1) {
      handleSendTip(amount);
      setCustomAmount('');
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 overflow-hidden">
      {/* Header compacto */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-emerald-800">Enviar Propina</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
        >
          <X className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 max-h-96 overflow-y-auto">
        {/* Cantidades predefinidas */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleSendTip(amount)}
              className="p-2 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-lg transition-all group"
            >
              <div className="text-xl mb-0.5">💰</div>
              <p className="text-xs font-bold text-emerald-700">S/. {amount}</p>
            </button>
          ))}
        </div>

        {/* Propina personalizada */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Propina Personalizada</h4>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">S/.</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.01"
                className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button
              onClick={handleCustomTip}
              disabled={!customAmount || parseFloat(customAmount) < 1}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg font-semibold text-xs transition shadow-sm"
            >
              Enviar
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">Mínimo S/. 1</p>
        </div>
      </div>
    </div>
  );
};

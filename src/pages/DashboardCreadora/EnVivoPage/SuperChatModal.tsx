import React from 'react';
import { DollarSign, Sparkles, X, Send } from 'lucide-react';

type TierType = 'brillante' | 'plus' | 'legendario';

interface SuperChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (mensaje: string, tier: 'basic' | 'premium' | 'elite') => void;
  coinsBalance?: number;
  onRecargarCoins?: () => void;
}

function getPreviewBg(tier: TierType) {
  if (tier === 'brillante') return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/60';
  if (tier === 'plus') return 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200/60';
  return 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/60';
}

function getEstrellasPorTier(tier: TierType) {
  if (tier === 'brillante') return '5';
  if (tier === 'plus') return '10';
  return '20';
}

function getTierColor(tier: TierType) {
  if (tier === 'brillante') return 'text-blue-600';
  if (tier === 'plus') return 'text-violet-600';
  return 'text-rose-600';
}

function getTierGradient(tier: TierType) {
  if (tier === 'brillante') return 'from-blue-500 to-cyan-500';
  if (tier === 'plus') return 'from-violet-500 to-purple-500';
  return 'from-rose-500 to-pink-500';
}

export const SuperChatModal = ({ 
  isOpen, 
  onClose, 
  onSend, 
  coinsBalance = 0, 
  onRecargarCoins 
}: SuperChatModalProps) => {
  const [mensaje, setMensaje] = React.useState('');
  const [tierSeleccionado, setTierSeleccionado] = React.useState<TierType>('brillante');

  if (!isOpen) return null;

  const previewBg = getPreviewBg(tierSeleccionado);
  const estrellasPorTier = getEstrellasPorTier(tierSeleccionado);
  const tierColor = getTierColor(tierSeleccionado);

  const handleEnviar = () => {
    if (!mensaje.trim()) return;
    const tierMap: any = { brillante: 'basic', plus: 'premium', legendario: 'elite' };
    onSend(mensaje, tierMap[tierSeleccionado]);
    setMensaje('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/50">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Mensaje Destacado</h2>
                <p className="text-[10px] text-slate-500">Haz que tu mensaje brille</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Selección de Tier */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-2 block">Selecciona el nivel</label>
            <div className="grid grid-cols-3 gap-2">
              {/* Tier Brillante */}
              <button
                onClick={() => setTierSeleccionado('brillante')}
                className={`relative group p-3 rounded-lg border-2 transition-all ${
                  tierSeleccionado === 'brillante'
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg shadow-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1">💎</div>
                  <div className="text-[10px] font-bold text-slate-700">Brillante</div>
                  <div className="text-[10px] text-blue-600 font-semibold">5 coins</div>
                  <div className="text-[9px] text-slate-500">30 seg</div>
                </div>
              </button>

              {/* Tier Plus */}
              <button
                onClick={() => setTierSeleccionado('plus')}
                className={`relative group p-3 rounded-lg border-2 transition-all ${
                  tierSeleccionado === 'plus'
                    ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg shadow-violet-500/20'
                    : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-[10px] font-bold text-slate-700">Plus</div>
                  <div className="text-[10px] text-violet-600 font-semibold">10 coins</div>
                  <div className="text-[9px] text-slate-500">60 seg</div>
                </div>
              </button>

              {/* Tier Legendario */}
              <button
                onClick={() => setTierSeleccionado('legendario')}
                className={`relative group p-3 rounded-lg border-2 transition-all ${
                  tierSeleccionado === 'legendario'
                    ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg shadow-rose-500/20'
                    : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1">👑</div>
                  <div className="text-[10px] font-bold text-slate-700">Legendario</div>
                  <div className="text-[10px] text-rose-600 font-semibold">20 coins</div>
                  <div className="text-[9px] text-slate-500">120 seg</div>
                </div>
              </button>
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Escribe tu mensaje</label>
            <div className="relative">
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Tu mensaje destacado aparecerá fijado en la transmisión..."
                maxLength={200}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 text-sm placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 resize-none transition"
                rows={3}
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-medium">
                {mensaje.length}/200
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Vista previa</label>
            <div className={`relative rounded-lg border-2 p-3 overflow-hidden ${previewBg}`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className={`text-[10px] font-bold mb-1.5 ${tierColor}`}>
                  {tierSeleccionado === 'brillante' && '💎 Mensaje Brillante'}
                  {tierSeleccionado === 'plus' && '⭐ Mensaje Plus'}
                  {tierSeleccionado === 'legendario' && '👑 Mensaje Legendario'}
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {mensaje || 'Tu mensaje aparecerá destacado aquí...'}
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all hover:scale-[1.02]"
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={!mensaje.trim()}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r ${getTierGradient(tierSeleccionado)} hover:shadow-xl text-white`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar {estrellasPorTier} coins</span>
            </button>
          </div>

          {/* Balance y Recarga */}
          <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-600">Balance actual</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-bold text-slate-800">{coinsBalance.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">coins</span>
              </div>
            </div>
            {onRecargarCoins && (
              <button
                onClick={onRecargarCoins}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
              >
                Recargar Coins
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

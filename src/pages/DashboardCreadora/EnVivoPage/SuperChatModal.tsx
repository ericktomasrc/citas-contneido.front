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
  if (tier === 'brillante') return 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/40';
  if (tier === 'plus') return 'bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/40';
  return 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/40';
}

function getEstrellasPorTier(tier: TierType) {
  if (tier === 'brillante') return '5';
  if (tier === 'plus') return '10';
  return '20';
}

function getTierColor(tier: TierType) {
  if (tier === 'brillante') return 'text-blue-400';
  if (tier === 'plus') return 'text-purple-400';
  return 'text-amber-400';
}

function getTierGradient(tier: TierType) {
  if (tier === 'brillante') return 'from-blue-600 to-cyan-600';
  if (tier === 'plus') return 'from-purple-600 to-violet-600';
  return 'from-amber-600 to-yellow-600';
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mensaje Destacado</h2>
                <p className="text-xs text-slate-400">Haz que tu mensaje brille</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Selección de Tier */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-3 block">Selecciona el nivel</label>
            <div className="grid grid-cols-3 gap-3">
              {/* Tier Brillante */}
              <button
                onClick={() => setTierSeleccionado('brillante')}
                className={`relative group p-4 rounded-xl border-2 transition-all ${
                  tierSeleccionado === 'brillante'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1.5">💎</div>
                  <div className="text-xs font-semibold text-white">Brillante</div>
                  <div className="text-xs text-blue-400 font-medium">5 coins</div>
                  <div className="text-[10px] text-slate-400">30 seg</div>
                </div>
              </button>

              {/* Tier Plus */}
              <button
                onClick={() => setTierSeleccionado('plus')}
                className={`relative group p-4 rounded-xl border-2 transition-all ${
                  tierSeleccionado === 'plus'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1.5">⭐</div>
                  <div className="text-xs font-semibold text-white">Plus</div>
                  <div className="text-xs text-purple-400 font-medium">10 coins</div>
                  <div className="text-[10px] text-slate-400">60 seg</div>
                </div>
              </button>

              {/* Tier Legendario */}
              <button
                onClick={() => setTierSeleccionado('legendario')}
                className={`relative group p-4 rounded-xl border-2 transition-all ${
                  tierSeleccionado === 'legendario'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-amber-500/50'
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl mb-1.5">👑</div>
                  <div className="text-xs font-semibold text-white">Legendario</div>
                  <div className="text-xs text-amber-400 font-medium">20 coins</div>
                  <div className="text-[10px] text-slate-400">120 seg</div>
                </div>
              </button>
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Escribe tu mensaje</label>
            <div className="relative">
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Tu mensaje destacado aparecerá fijado en la transmisión..."
                maxLength={200}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {mensaje.length}/200
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Vista previa</label>
            <div className={`relative rounded-xl border-2 p-4 overflow-hidden ${previewBg}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className={`text-xs font-medium mb-1.5 ${tierColor}`}>
                  {tierSeleccionado === 'brillante' && '💎 Mensaje Brillante'}
                  {tierSeleccionado === 'plus' && '⭐ Mensaje Plus'}
                  {tierSeleccionado === 'legendario' && '👑 Mensaje Legendario'}
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {mensaje || 'Tu mensaje aparecerá destacado aquí...'}
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all hover:scale-[1.02]"
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={!mensaje.trim()}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r ${getTierGradient(tierSeleccionado)} hover:shadow-xl text-white`}
            >
              <Send className="w-4 h-4" />
              <span>Enviar {estrellasPorTier} coins</span>
            </button>
          </div>

          {/* Balance y Recarga */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Balance actual</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-white">{coinsBalance.toLocaleString()}</span>
                <span className="text-xs text-slate-400">coins</span>
              </div>
            </div>
            {onRecargarCoins && (
              <button
                onClick={onRecargarCoins}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium transition-all hover:scale-[1.02] shadow-lg shadow-emerald-600/20"
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

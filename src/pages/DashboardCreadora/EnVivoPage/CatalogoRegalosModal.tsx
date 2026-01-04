import React, { useState } from 'react';
import { DollarSign, Gift, X, Check } from 'lucide-react';

interface CatalogoRegalosModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogoRegalos: Array<{ id: string; emoji: string; nombre: string; valor: number }>;
  coinsBalance: number;
  onEnviarRegalo: (regalo: any) => void;
  onRecargarCoins: () => void;
}

export const CatalogoRegalosModal = ({
  isOpen,
  onClose,
  catalogoRegalos,
  coinsBalance,
  onEnviarRegalo,
  onRecargarCoins,
}: CatalogoRegalosModalProps) => {
  const [regaloSeleccionado, setRegaloSeleccionado] = useState<null | { id: string; emoji: string; nombre: string; valor: number }>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackGift, setFeedbackGift] = useState<{ emoji: string; nombre: string } | null>(null);
  
  if (!isOpen) return null;

  const handleEnviar = (regalo: { id: string; emoji: string; nombre: string; valor: number }) => {
    onEnviarRegalo(regalo);
    setRegaloSeleccionado(null);
    setFeedbackGift({ emoji: regalo.emoji, nombre: regalo.nombre });
    setFeedbackVisible(true);
    setTimeout(() => setFeedbackVisible(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-pink-600/10 via-rose-600/10 to-pink-600/10 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Catálogo de Regalos</h2>
                <p className="text-xs text-slate-400">Envía regalos exclusivos a la creadora</p>
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

        <div className="p-6">
          {regaloSeleccionado ? (
            /* Vista de Confirmación */
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-2xl"></div>
                <div className="relative text-7xl filter drop-shadow-lg">{regaloSeleccionado.emoji}</div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{regaloSeleccionado.nombre}</h3>
              
              <div className="flex items-center gap-2 mb-8">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span className="text-xl font-bold text-white">{regaloSeleccionado.valor}</span>
                <span className="text-sm text-slate-400">coins</span>
              </div>

              <div className="flex gap-3 w-full max-w-md">
                <button
                  onClick={() => setRegaloSeleccionado(null)}
                  className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all hover:scale-[1.02]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEnviar(regaloSeleccionado)}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Enviar Regalo</span>
                </button>
              </div>
            </div>
          ) : (
            /* Vista de Catálogo */
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {catalogoRegalos.map((regalo) => (
                  <button
                    key={regalo.id}
                    onClick={() => setRegaloSeleccionado(regalo)}
                    className="group relative rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-pink-500/50 p-4 transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10"
                  >
                    <div className="text-center space-y-2">
                      <div className="text-4xl mb-1 filter group-hover:drop-shadow-lg transition">{regalo.emoji}</div>
                      <p className="text-sm font-medium text-white group-hover:text-pink-400 transition truncate">
                        {regalo.nombre}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-500">{regalo.valor}</span>
                      </div>
                    </div>
                  </button>
                ))}
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
                <button
                  onClick={onRecargarCoins}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium transition-all hover:scale-[1.02] shadow-lg shadow-emerald-600/20"
                >
                  Recargar Coins
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notificación de Regalo Enviado */}
      {feedbackVisible && feedbackGift && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down">
          <div className="bg-gradient-to-r from-emerald-900/90 to-teal-900/90 backdrop-blur-lg border border-emerald-500/50 rounded-xl px-6 py-3.5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{feedbackGift.emoji}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Regalo enviado</p>
                <p className="text-emerald-300 text-xs">{feedbackGift.nombre}</p>
              </div>
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

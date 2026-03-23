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
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/50">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Catálogo de Regalos</h2>
                <p className="text-[10px] text-slate-500">Envía regalos exclusivos a la creadora</p>
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

        <div className="p-4">
          {regaloSeleccionado ? (
            /* Vista de Confirmación */
            <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full blur-2xl opacity-60"></div>
                <div className="relative text-5xl filter drop-shadow-xl">{regaloSeleccionado.emoji}</div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1.5">{regaloSeleccionado.nombre}</h3>
              
              <div className="flex items-center gap-1.5 mb-6">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className="text-base font-bold text-slate-800">{regaloSeleccionado.valor}</span>
                <span className="text-xs text-slate-500">coins</span>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={() => setRegaloSeleccionado(null)}
                  className="flex-1 py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all hover:scale-[1.02]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEnviar(regaloSeleccionado)}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-rose-500/30 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Vista de Catálogo */
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {catalogoRegalos.map((regalo) => (
                  <button
                    key={regalo.id}
                    onClick={() => setRegaloSeleccionado(regalo)}
                    className="group relative rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:border-rose-300 hover:from-rose-50 hover:to-pink-50 p-3 transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-200"
                  >
                    <div className="text-center space-y-1.5">
                      <div className="text-3xl mb-1 filter group-hover:drop-shadow-lg transition">{regalo.emoji}</div>
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-rose-700 transition truncate">
                        {regalo.nombre}
                      </p>
                      <div className="flex items-center justify-center gap-0.5">
                        <DollarSign className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-600">{regalo.valor}</span>
                      </div>
                    </div>
                  </button>
                ))}
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
                <button
                  onClick={onRecargarCoins}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100001] animate-fade-in-down">
          <div className="bg-white border-2 border-emerald-200 rounded-lg px-4 py-2.5 shadow-2xl shadow-emerald-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center border border-emerald-200">
                <span className="text-xl">{feedbackGift.emoji}</span>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-xs">Regalo enviado</p>
                <p className="text-emerald-600 text-[10px] font-medium">{feedbackGift.nombre}</p>
              </div>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { DollarSign, X, Sparkles, TrendingUp } from 'lucide-react';

interface RecargarCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecargar: (cantidad: number) => void;
  coinsBalance: number;
}

const paquetes = [
  { 
    cantidad: 100, 
    precio: 5, 
    icono: '💰', 
    color: 'from-slate-800 to-slate-900', 
    border: 'border-slate-600/50', 
    texto: 'Básico',
    oferta: '', 
    precioTachado: '', 
    ahorro: '',
    shadow: 'hover:shadow-slate-500/20'
  },
  { 
    cantidad: 500, 
    precio: 20, 
    icono: '💎', 
    color: 'from-purple-900 to-violet-900', 
    border: 'border-purple-500/50', 
    texto: 'Popular',
    oferta: 'Popular', 
    precioTachado: 'S/. 25', 
    ahorro: 'Ahorra 20%',
    shadow: 'hover:shadow-purple-500/30'
  },
  { 
    cantidad: 1000, 
    precio: 35, 
    icono: '👑', 
    color: 'from-blue-900 to-cyan-900', 
    border: 'border-blue-500/50', 
    texto: 'Mejor Valor',
    oferta: 'Mejor Valor', 
    precioTachado: 'S/. 50', 
    ahorro: 'Ahorra 30%',
    shadow: 'hover:shadow-blue-500/30'
  },
  { 
    cantidad: 2500, 
    precio: 80, 
    icono: '🔥', 
    color: 'from-amber-800 to-orange-900', 
    border: 'border-amber-500/50', 
    texto: 'VIP',
    oferta: 'VIP', 
    precioTachado: 'S/. 125', 
    ahorro: 'Ahorra 36%',
    shadow: 'hover:shadow-amber-500/30'
  },
];

export const RecargarCoinsModal: React.FC<RecargarCoinsModalProps> = ({ 
  isOpen, 
  onClose, 
  onRecargar, 
  coinsBalance 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-amber-600/10 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recargar Coins</h2>
                <p className="text-xs text-slate-400">Selecciona tu paquete</p>
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

        <div className="p-6 space-y-4">
          {/* Paquetes de Coins */}
          <div className="grid grid-cols-2 gap-3">
            {paquetes.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  onRecargar(p.cantidad);
                  onClose();
                }}
                className={`relative group bg-gradient-to-br ${p.color} border-2 ${p.border} rounded-xl p-4 transition-all hover:scale-105 ${p.shadow} shadow-lg overflow-hidden`}
              >
                {/* Badge de oferta */}
                {p.oferta && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-lg">
                    {p.oferta}
                  </div>
                )}

                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 text-center space-y-2">
                  {/* Icono */}
                  <div className="text-4xl mb-2 filter drop-shadow-lg">{p.icono}</div>
                  
                  {/* Cantidad */}
                  <div className="text-2xl font-bold text-white">
                    {p.cantidad.toLocaleString()}
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs text-slate-300 font-medium">{p.texto}</div>
                  
                  {/* Precio tachado */}
                  {p.precioTachado && (
                    <div className="text-xs text-slate-400 line-through">
                      {p.precioTachado}
                    </div>
                  )}
                  
                  {/* Precio actual */}
                  <div className="text-lg font-bold text-emerald-400">
                    S/. {p.precio}
                  </div>
                  
                  {/* Ahorro */}
                  {p.ahorro && (
                    <div className="inline-block text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {p.ahorro}
                    </div>
                  )}
                </div>

                {/* Indicador de hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </button>
            ))}
          </div>

          {/* Balance Actual */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">Balance actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-white">
                  {coinsBalance.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">coins</span>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              Los coins se acreditan <span className="font-semibold text-white">inmediatamente</span> y no caducan. Úsalos para regalos, ruleta y mensajes destacados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

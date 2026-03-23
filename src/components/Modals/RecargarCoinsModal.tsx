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
    color: 'from-slate-50 to-slate-100', 
    border: 'border-slate-200', 
    texto: 'Básico',
    oferta: '', 
    precioTachado: '', 
    ahorro: '',
    shadow: 'hover:shadow-lg hover:shadow-slate-200',
    hoverBorder: 'hover:border-slate-300'
  },
  { 
    cantidad: 500, 
    precio: 20, 
    icono: '💎', 
    color: 'from-violet-50 to-purple-50', 
    border: 'border-violet-200', 
    texto: 'Popular',
    oferta: 'Popular', 
    precioTachado: 'S/. 25', 
    ahorro: 'Ahorra 20%',
    shadow: 'hover:shadow-lg hover:shadow-violet-200',
    hoverBorder: 'hover:border-violet-300'
  },
  { 
    cantidad: 1000, 
    precio: 35, 
    icono: '👑', 
    color: 'from-rose-50 to-pink-50', 
    border: 'border-rose-200', 
    texto: 'Mejor Valor',
    oferta: 'Mejor Valor', 
    precioTachado: 'S/. 50', 
    ahorro: 'Ahorra 30%',
    shadow: 'hover:shadow-lg hover:shadow-rose-200',
    hoverBorder: 'hover:border-rose-300'
  },
  { 
    cantidad: 2500, 
    precio: 80, 
    icono: '🔥', 
    color: 'from-amber-50 to-orange-50', 
    border: 'border-amber-200', 
    texto: 'VIP',
    oferta: 'VIP', 
    precioTachado: 'S/. 125', 
    ahorro: 'Ahorra 36%',
    shadow: 'hover:shadow-lg hover:shadow-amber-200',
    hoverBorder: 'hover:border-amber-300'
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
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-200/50">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Recargar Coins</h2>
                <p className="text-[10px] text-slate-500">Selecciona tu paquete</p>
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
          {/* Paquetes de Coins */}
          <div className="grid grid-cols-2 gap-2">
            {paquetes.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  onRecargar(p.cantidad);
                  onClose();
                }}
                className={`relative group bg-gradient-to-br ${p.color} border-2 ${p.border} ${p.hoverBorder} rounded-lg p-3 transition-all hover:scale-105 ${p.shadow} overflow-hidden`}
              >
                {/* Badge de oferta */}
                {p.oferta && (
                  <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-md">
                    {p.oferta}
                  </div>
                )}

                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 text-center space-y-1.5">
                  {/* Icono */}
                  <div className="text-3xl mb-1 filter drop-shadow-md">{p.icono}</div>
                  
                  {/* Cantidad */}
                  <div className="text-xl font-bold text-slate-800">
                    {p.cantidad.toLocaleString()}
                  </div>
                  
                  {/* Label */}
                  <div className="text-[10px] text-slate-600 font-semibold">{p.texto}</div>
                  
                  {/* Precio tachado */}
                  {p.precioTachado && (
                    <div className="text-[10px] text-slate-400 line-through">
                      {p.precioTachado}
                    </div>
                  )}
                  
                  {/* Precio actual */}
                  <div className="text-base font-bold text-emerald-600">
                    S/. {p.precio}
                  </div>
                  
                  {/* Ahorro */}
                  {p.ahorro && (
                    <div className="inline-block text-[9px] text-rose-600 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full">
                      {p.ahorro}
                    </div>
                  )}
                </div>

                {/* Indicador de hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </button>
            ))}
          </div>

          {/* Balance Actual */}
          <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-semibold text-slate-600">Balance actual</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className="text-base font-bold text-slate-800">
                  {coinsBalance.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">coins</span>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="flex items-start gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-700 leading-relaxed">
              Los coins se acreditan <span className="font-bold text-slate-800">inmediatamente</span> y no caducan. Úsalos para regalos, ruleta y mensajes destacados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// src/components/Transmision/TipoTransmisionModal.tsx
import { useState } from 'react';
import { Radio, Crown, Globe, Ticket, X } from 'lucide-react';

interface TipoTransmisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tipo: 'gratis' | 'suscriptores' | 'ppv', precioPPV?: number, descripcionPPV?: string) => void;
}

export const TipoTransmisionModal = ({ isOpen, onClose, onConfirm }: TipoTransmisionModalProps) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioPPV, setPrecioPPV] = useState(0);
  const [descripcionPPV, setDescripcionPPV] = useState('');

  if (!isOpen) return null;

  const handleIniciar = () => {
    if (tipoSeleccionado === 'ppv' && (!precioPPV || precioPPV < 1 || !descripcionPPV.trim())) {
      return;
    }
    onConfirm(tipoSeleccionado, precioPPV, descripcionPPV);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        {/* Header CLARO */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Tipo de Transmisión</h2>
                <p className="text-xs text-slate-500">Selecciona el tipo de acceso</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {/* Opción Gratis */}
          <button
            onClick={() => setTipoSeleccionado('gratis')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'gratis'
                ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                tipoSeleccionado === 'gratis'
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'gratis' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-800">Público (Gratis)</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Cualquiera puede ver sin costo
                </p>
              </div>
            </div>
          </button>

          {/* Opción Solo Suscriptores */}
          <button
            onClick={() => setTipoSeleccionado('suscriptores')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'suscriptores'
                ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/20'
                : 'border-slate-200 bg-white hover:border-violet-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                tipoSeleccionado === 'suscriptores'
                  ? 'border-violet-500 bg-violet-500'
                  : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'suscriptores' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-violet-600" />
                  <h4 className="text-sm font-bold text-slate-800">Solo Suscriptores</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Requiere suscripción mensual (S/.20-150/mes)
                </p>
              </div>
            </div>
          </button>

          {/* Opción PPV */}
          <button
            onClick={() => setTipoSeleccionado('ppv')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'ppv'
                ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                tipoSeleccionado === 'ppv'
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'ppv' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="w-4 h-4 text-pink-600" />
                  <h4 className="text-sm font-bold text-slate-800">Pago por Entrada (PPV)</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Cobro único para acceder a este live
                </p>
              </div>
            </div>
          </button>

          {/* Formulario PPV */}
          {tipoSeleccionado === 'ppv' && (
            <div className="space-y-3 p-4 bg-pink-50 rounded-xl border border-pink-200 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Precio de Entrada (S/.) <span className="text-pink-500">*</span>
                </label>
                <input
                  type="number"
                  value={precioPPV || ''}
                  onChange={(e) => setPrecioPPV(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="15"
                  min="1"
                />
                <p className="text-xs text-slate-500 mt-1">💡 Sugerido: S/.10-30</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Descripción <span className="text-pink-500">*</span>
                </label>
                <textarea
                  value={descripcionPPV}
                  onChange={(e) => setDescripcionPPV(e.target.value.slice(0, 100))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Ej: Live especial con contenido exclusivo..."
                  rows={2}
                  maxLength={100}
                />
                <p className="text-xs text-slate-500 mt-1">{descripcionPPV.length}/100</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all hover:scale-[1.02]"
            >
              Cancelar
            </button>
            <button
              onClick={handleIniciar}
              disabled={tipoSeleccionado === 'ppv' && (!precioPPV || precioPPV < 1 || !descripcionPPV.trim())}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Iniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
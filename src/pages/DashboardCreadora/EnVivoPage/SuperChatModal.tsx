import React from 'react';
import { DollarSign, Sparkles } from 'lucide-react';

interface SuperChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (mensaje: string, tier: 'basic' | 'premium' | 'elite') => void;
}

export const SuperChatModal = ({ isOpen, onClose, onSend }: SuperChatModalProps) => {
  const [mensaje, setMensaje] = React.useState('');
  const [tierSeleccionado, setTierSeleccionado] = React.useState<'basic' | 'premium' | 'elite'>('basic');

  if (!isOpen) return null;

  const handleEnviar = () => {
    if (!mensaje.trim()) return;
    onSend(mensaje, tierSeleccionado);
    setMensaje('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-yellow-500/30 p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Super Chat
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selección de Tier */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Selecciona tu nivel</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTierSeleccionado('basic')}
              className={`p-3 rounded-lg border-2 transition-all ${
                tierSeleccionado === 'basic'
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-blue-500/50'
              }`}
            >
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xs text-white font-bold">Básico</div>
              <div className="text-xs text-blue-400">S/. 5</div>
              <div className="text-[10px] text-gray-400">30 seg</div>
            </button>
            <button
              onClick={() => setTierSeleccionado('premium')}
              className={`p-3 rounded-lg border-2 transition-all ${
                tierSeleccionado === 'premium'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-purple-500/50'
              }`}
            >
              <div className="text-2xl mb-1">💎</div>
              <div className="text-xs text-white font-bold">Premium</div>
              <div className="text-xs text-purple-400">S/. 10</div>
              <div className="text-[10px] text-gray-400">60 seg</div>
            </button>
            <button
              onClick={() => setTierSeleccionado('elite')}
              className={`p-3 rounded-lg border-2 transition-all ${
                tierSeleccionado === 'elite'
                  ? 'border-yellow-500 bg-yellow-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-yellow-500/50'
              }`}
            >
              <div className="text-2xl mb-1">👑</div>
              <div className="text-xs text-white font-bold">Elite</div>
              <div className="text-xs text-yellow-400">S/. 20</div>
              <div className="text-[10px] text-gray-400">120 seg</div>
            </button>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Tu mensaje destacado</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            maxLength={200}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
            rows={3}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {mensaje.length}/200
          </div>
        </div>

        {/* Preview del tier seleccionado */}
        <div className={`mb-4 p-3 rounded-lg border overflow-hidden ${
          tierSeleccionado === 'basic' 
            ? 'bg-blue-500/10 border-blue-500/50' 
            : tierSeleccionado === 'premium'
            ? 'bg-purple-500/10 border-purple-500/50'
            : 'bg-yellow-500/10 border-yellow-500/50'
        }`}>
          <div className="text-xs text-gray-400 mb-1">Vista previa:</div>
          <div className="text-sm text-white font-medium break-words overflow-wrap-anywhere">
            {mensaje || 'Tu mensaje aparecerá aquí...'}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            disabled={!mensaje.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar S/. {tierSeleccionado === 'basic' ? '5' : tierSeleccionado === 'premium' ? '10' : '20'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tu balance:</span>
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>1,250 coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// src/components/Modals/ConfirmDetenerTransmision.tsx
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDetenerTransmisionProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDetenerTransmision = ({
  isOpen,
  onConfirm,
  onCancel
}: ConfirmDetenerTransmisionProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4 z-[100000]"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Detener Transmisión</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            ¿Estás segura/o de que deseas <strong className="text-red-600">detener la transmisión en vivo</strong>?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-amber-900">
              ⚠️ <strong>Tus espectadores serán desconectados inmediatamente.</strong> La transmisión finalizará y no podrás reanudarla.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Sí, detener transmisión
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
// src/components/common/ConfirmacionModal.tsx
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmacionModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const config = {
    danger: {
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      headerBg: 'bg-red-50',
      titleColor: 'text-red-700',
      confirmBg: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      headerBg: 'bg-amber-50',
      titleColor: 'text-amber-700',
      confirmBg: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      headerBg: 'bg-blue-50',
      titleColor: 'text-blue-700',
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
    }
  };

  // Formatear mensaje: convertir \n en <br />
  const mensajeFormateado = message.split('\n').map((linea, index) => (
    <span key={index}>
      {linea}
      {index < message.split('\n').length - 1 && <br />}
    </span>
  ));

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header con color suave */}
        <div className={`flex items-start justify-between p-5 border-b border-gray-200 ${config[type].headerBg} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config[type].iconBg} flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${config[type].iconColor}`} />
            </div>
            <h3 className={`text-base font-bold ${config[type].titleColor}`}>{title}</h3>
          </div>
          {cancelText && (
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content con letras más pequeñas */}
        <div className="p-5">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {mensajeFormateado}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-5 border-t border-gray-200">
          {cancelText && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition text-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`${cancelText ? 'flex-1' : 'w-full'} px-4 py-2 ${config[type].confirmBg} text-white font-medium rounded-xl transition shadow-md text-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

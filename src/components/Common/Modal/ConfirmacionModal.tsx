// src/components/Common/Modal/ConfirmacionModal.tsx
// ✅ Z-INDEX ALTO PARA APARECER POR ENCIMA DE TODO

import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ConfirmacionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmacionModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  type = 'info',
  onConfirm,
  onCancel,
}: ConfirmacionModalProps) => {
  if (!isOpen) return null;

  const typeConfig = {
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    },
    danger: {
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonBg: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  // ✅ RENDERIZAR CON PORTAL Y Z-INDEX ALTO
  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-sm text-gray-600 text-center mb-6 whitespace-pre-line leading-relaxed">
          {message}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          {cancelText && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${config.buttonBg} text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg text-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ RENDERIZAR CON PORTAL DIRECTAMENTE EN BODY
  return createPortal(modalContent, document.body);
};

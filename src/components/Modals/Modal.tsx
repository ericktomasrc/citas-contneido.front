import { X, AlertCircle, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

type ModalType = 'error' | 'warning' | 'success' | 'confirm';

interface ModalProps {
  type: ModalType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
}: ModalProps) => {
  if (!isOpen) return null;

  const styles = {
    error: {
      icon: <XCircle className="w-12 h-12" />,
      gradient: 'from-red-500 to-rose-600',
      titleColor: 'text-red-900',
      button: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      iconBg: 'bg-red-50',
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12" />,
      gradient: 'from-yellow-500 to-orange-600',
      titleColor: 'text-yellow-900',
      button: 'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
      iconBg: 'bg-yellow-50',
    },
    success: {
      icon: <CheckCircle className="w-12 h-12" />,
      gradient: 'from-green-500 to-emerald-600',
      titleColor: 'text-green-900',
      button: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
      iconBg: 'bg-green-50',
    },
    confirm: {
      icon: <AlertCircle className="w-12 h-12" />,
      gradient: 'from-blue-500 to-cyan-600',
      titleColor: 'text-blue-900',
      button: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
      iconBg: 'bg-blue-50',
    },
  };

  const style = styles[type];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header compacto con X */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6 pt-0">
          {/* Icono premium */}
          <div className="flex justify-center mb-4">
            <div className={`${style.iconBg} p-3 rounded-2xl`}>
              <div className={`bg-gradient-to-r ${style.gradient} p-2 rounded-xl text-white`}>
                {style.icon}
              </div>
            </div>
          </div>

          {/* Título compacto */}
          <h3 className={`text-xl font-bold text-center mb-3 ${style.titleColor}`}>
            {title}
          </h3>

          {/* Mensaje */}
          <div className="text-gray-600 text-center text-sm leading-relaxed mb-5 whitespace-pre-line">
            {message}
          </div>

          {/* Botones compactos */}
          <div className="flex gap-2">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition text-sm"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r ${style.button} text-white font-medium rounded-lg transition shadow-md text-sm`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full px-4 py-2.5 bg-gradient-to-r ${style.button} text-white font-semibold rounded-lg transition shadow-md text-sm`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

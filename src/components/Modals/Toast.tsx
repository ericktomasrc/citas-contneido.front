import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ type, message, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
    },
  };

  const style = styles[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}>
        {style.icon}
        <div className="flex-1">
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
// src/components/Common/Toast.tsx
import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const ToastConfirmation = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-500',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bg: 'bg-red-500',
      icon: AlertCircle,
      iconColor: 'text-white'
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const Icon = config[type].icon;

  return (
    <div className="fixed top-6 right-6 z-[10000] animate-fade-in-right">
      <div className={`${config[type].bg} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm`}>
        <Icon className={`w-5 h-5 ${config[type].iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 rounded-lg p-1 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
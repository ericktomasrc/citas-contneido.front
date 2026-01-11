// src/features/chat/components/ChatWindow/ChatHeaderWhatsApp.tsx
// ✅ Header elegante SIN botón minimizar

import { Settings } from 'lucide-react';
import { User, UserRole } from '../../types/user.types';

interface ChatHeaderWhatsAppProps {
  participant: User;
  userRole: UserRole;
  onOpenSettings?: () => void;
}

export const ChatHeaderWhatsApp = ({
  participant,
  userRole,
  onOpenSettings,
}: ChatHeaderWhatsAppProps) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.nombre}
          className="w-12 h-12 rounded-full object-cover"
        />
        {participant.estado === 'online' && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-slate-800 truncate">
          {participant.nombre}
        </h2>
        <p className="text-sm text-slate-500">
          {participant.estado === 'online' ? 'En línea' : 'Desconectado'}
        </p>
      </div>

      {/* Botones: Badge PRIMERO + Config SEGUNDO (SIN minimizar) */}
      <div className="flex items-center gap-2">
        {/* ✅ BADGE PRIMERO (para creadora viendo espectador) */}
        {userRole === 'creadora' && participant.role === 'espectador' && participant.badge && (
          <div className="px-3 py-1.5 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg flex items-center gap-2">
            <span className="text-lg">{participant.badge.icon}</span>
            <span className="text-sm font-semibold text-violet-700">
              {participant.badge.name}
            </span>
          </div>
        )}

        {/* ✅ CONFIG SEGUNDO (solo para creadora) */}
        {userRole === 'creadora' && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600 hover:text-slate-800"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

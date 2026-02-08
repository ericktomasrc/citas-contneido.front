// src/features/chat/components/ChatWindow/ChatHeaderWhatsApp.tsx
// ✅ MEJORADO: Header compacto h-12, elementos más pequeños

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
    <div className="flex-shrink-0 h-12 bg-white border-b border-slate-200 px-3 flex items-center gap-2.5">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.nombre}
          className="w-8 h-8 rounded-full object-cover"
        />
        {participant.estado === 'online' && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xs font-semibold text-slate-800 truncate">
          {participant.nombre}
        </h2>
        <p className="text-[10px] text-slate-400">
          {participant.estado === 'online' ? 'En línea' : 'Desconectado'}
        </p>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-1.5">
        {/* Badge */}
        {userRole === 'creadora' && participant.role === 'espectador' && participant.badge && (
          <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-1">
            <span className="text-xs">{participant.badge.icon}</span>
            <span className="text-[10px] font-semibold text-slate-600">
              {participant.badge.name}
            </span>
          </div>
        )}

        {/* Config */}
        {userRole === 'creadora' && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition text-slate-500 hover:text-slate-700"
            title="Configuración"
          >
            <Settings className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

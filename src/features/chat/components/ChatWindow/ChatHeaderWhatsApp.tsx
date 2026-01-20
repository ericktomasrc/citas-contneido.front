// src/features/chat/components/ChatWindow/ChatHeaderWhatsApp.tsx
// ✅ Header COMPACTO - Más pequeño para mejor alineación
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
    <div className="flex-shrink-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.nombre}
          className="w-9 h-9 rounded-full object-cover"
        />
        {participant.estado === 'online' && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-slate-800 truncate">
          {participant.nombre}
        </h2>
        <p className="text-xs text-slate-500">
          {participant.estado === 'online' ? 'En línea' : 'Desconectado'}
        </p>
      </div>

      {/* Botones: Badge PRIMERO + Config SEGUNDO */}
      <div className="flex items-center gap-2">
        {/* ✅ BADGE PRIMERO (para creadora viendo espectador) */}
        {userRole === 'creadora' && participant.role === 'espectador' && participant.badge && (
          <div className="px-2.5 py-1 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg flex items-center gap-1.5">
            <span className="text-sm">{participant.badge.icon}</span>
            <span className="text-xs font-semibold text-violet-700">
              {participant.badge.name}
            </span>
          </div>
        )}

        {/* ✅ CONFIG SEGUNDO (solo para creadora) */}
        {userRole === 'creadora' && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600 hover:text-slate-800"
            title="Configuración"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
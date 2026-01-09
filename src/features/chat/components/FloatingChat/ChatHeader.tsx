// src/features/chat/components/FloatingChat/ChatHeader.tsx
// ✅ CORREGIDO: Badge visible + Botón de configuración

import { X, Minimize2, Maximize2, Settings } from 'lucide-react';
import { User, UserRole } from '../../types/user.types';
import { BadgeComponent } from '../Badge/BadgeComponent';

interface ChatHeaderProps {
  user: User;
  userRole: UserRole;
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const ChatHeader = ({
  user,
  userRole,
  isMinimized,
  onMinimize,
  onClose,
  onOpenSettings,
}: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 flex items-center gap-3">
      {/* Avatar con estado online */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.nombre}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
        />
        {user.estado === 'online' && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Información del usuario */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-sm truncate">
          {user.nombre}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80">
            {user.estado === 'online' ? 'En línea' : 'Desconectado'}
          </span>
          
          {/* ⭐ BADGE VISIBLE (solo si es espectador) */}
          {user.role === 'espectador' && user.badge && (
            <BadgeComponent 
              badge={user.badge} 
              size="sm" 
              position="message"
            />
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-1">
        {/* ⭐ BOTÓN DE CONFIGURACIÓN (solo para creadora) */}
        {userRole === 'creadora' && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-white"
            title="Configuración individual"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        {/* Minimizar/Maximizar */}
        <button
          onClick={onMinimize}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-white"
          title={isMinimized ? 'Maximizar' : 'Minimizar'}
        >
          {isMinimized ? (
            <Maximize2 className="w-4 h-4" />
          ) : (
            <Minimize2 className="w-4 h-4" />
          )}
        </button>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-white"
          title="Cerrar chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

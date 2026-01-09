// src/features/chat/components/ConversationList/ConversationCard.tsx
// ✅ TARJETA DE CONVERSACIÓN CON BADGE Y MENÚ DE OPCIONES

import { useState } from 'react';
import { MoreVertical, Pin, Archive, Trash2, Volume2, VolumeX } from 'lucide-react';
import { Conversation } from '../../types/chat.types';
import { BadgeComponent } from '../Badge/BadgeComponent';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  style?: React.CSSProperties;
}

export const ConversationCard = ({
  conversation,
  isActive,
  onClick,
  onPin,
  onArchive,
  onDelete,
  style,
}: ConversationCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const { participant, lastMessage, unreadCount, isPinned, isMuted } = conversation;

  // Formatear tiempo
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative p-4 cursor-pointer transition-all hover:bg-slate-50 ${
        isActive ? 'bg-violet-50 border-l-4 border-violet-600' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
            <img
              src={participant.avatar}
              alt={participant.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Estado online */}
          {participant.estado === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          )}

          {/* Badge debajo del avatar */}
          {participant.role === 'espectador' && participant.badge && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <BadgeComponent badge={participant.badge} size="sm" position="avatar" />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0 mt-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold truncate ${
                unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'
              }`}>
                {participant.nombre}
              </h3>
              
              {/* Iconos de estado */}
              <div className="flex items-center gap-1">
                {isPinned && <Pin className="w-3 h-3 text-violet-600 fill-violet-600" />}
                {isMuted && <VolumeX className="w-3 h-3 text-slate-400" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Timestamp */}
              <span className="text-xs text-slate-500">
                {lastMessage && formatTime(conversation.lastMessageAt)}
              </span>

              {/* Menú */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Último mensaje */}
          <div className="flex items-center justify-between">
            <p className={`text-xs truncate ${
              unreadCount > 0 ? 'font-semibold text-slate-900' : 'text-slate-500'
            }`}>
              {lastMessage?.content || 'Sin mensajes aún'}
            </p>

            {/* Badge de no leídos */}
            {unreadCount > 0 && (
              <div className="ml-2 px-2 py-0.5 bg-violet-600 text-white text-xs font-bold rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú contextual */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-4 top-16 z-20 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 min-w-[180px]">
            {onPin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
              >
                <Pin className="w-4 h-4" />
                {isPinned ? 'Desfijar' : 'Fijar'}
              </button>
            )}
            {onArchive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
              >
                <Archive className="w-4 h-4" />
                Archivar
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Eliminar conversación?')) {
                    onDelete();
                  }
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

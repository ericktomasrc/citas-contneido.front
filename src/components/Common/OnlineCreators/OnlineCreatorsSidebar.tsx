// src/components/Common/OnlineCreators/OnlineCreatorsSidebar_ConChat.tsx
// EJEMPLO CON BOTÓN DE CHAT AL HACER HOVER

import { Heart, MessageCircle } from 'lucide-react';
import { OnlineCreator } from '@/shared/types/creator.types';

interface OnlineCreatorsSidebarProps {
  creators: OnlineCreator[];
  onOpenChat?: (creatorId: string, creatorName: string, creatorAvatar: string) => void;
}

export const OnlineCreatorsSidebar = ({ 
  creators, 
  onOpenChat 
}: OnlineCreatorsSidebarProps) => {
  return (
    <aside className="fixed top-16 right-0 w-24 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 overflow-y-auto hidden lg:block z-30">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-3 z-10">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">💚</span>
          </div>
          <p className="text-[10px] font-semibold text-slate-600 text-center leading-tight">
            EN LÍNEA
          </p>
          <span className="text-xs font-bold text-emerald-600">
            {creators.filter(c => c.isLive).length}
          </span>
        </div>
      </div>

      {/* Lista de creadoras */}
      <div className="p-2 space-y-2">
        {creators.map((creator) => (
          <div
            key={creator.id}
            className="relative group cursor-pointer"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.nombre}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-slate-100 group-hover:border-pink-300 transition"
              />
              
              {/* Indicador online */}
              {creator.isLive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              )}
              
              {/* Favorite badge */}
              {creator.isFavorite && (
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              )}

              {/* 🔥 NUEVO: Overlay con botón de chat (aparece al hover) */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-2xl flex flex-col items-center justify-center gap-1">
                {/* Botón de chat */}
                {onOpenChat && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(
                        creator.id.toString(),
                        creator.nombre,
                        creator.avatar
                      );
                    }}
                    className="w-10 h-10 bg-white hover:bg-pink-50 rounded-full flex items-center justify-center transition shadow-lg"
                    title={`Chatear con ${creator.nombre}`}
                  >
                    <MessageCircle className="w-5 h-5 text-pink-600" />
                  </button>
                )}
                
                {/* Nombre (visible al hover) */}
                <p className="text-white text-[10px] font-semibold text-center px-1">
                  {creator.nombre}
                </p>
              </div>
            </div>

            {/* Nombre (siempre visible) */}
            <p className="text-[10px] font-medium text-slate-600 text-center mt-1 truncate px-1">
              {creator.nombre}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {creators.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            No hay creadoras en línea
          </p>
        </div>
      )}
    </aside>
  );
};

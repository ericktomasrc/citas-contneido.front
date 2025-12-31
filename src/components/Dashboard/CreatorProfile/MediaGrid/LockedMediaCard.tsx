import { Lock, Heart, Play, Sparkles } from 'lucide-react';
import { MediaItem } from '../../../../shared/types/creator-profile.types';

interface LockedMediaCardProps {
  item: MediaItem;
}

export const LockedMediaCard = ({ item }: LockedMediaCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group bg-white p-3 rounded-3xl shadow-md hover:shadow-2xl transition-all cursor-pointer">
      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {/* Blurred Image */}
        <img
          src={item.thumbnail || item.url}
          alt="Locked content"
          className="w-full h-full object-cover blur-md scale-110 group-hover:scale-125 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/80 to-pink-900/60 group-hover:from-black/95 group-hover:via-purple-900/90 group-hover:to-pink-900/70 transition-all duration-500" />

        {/* Content - CENTRADO */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {/* Lock Icon */}
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
            <Lock className="w-7 h-7 text-white" />
          </div>

          {/* Título */}
          {item.titulo && (
            <h3 className="text-white font-bold text-base mb-2 line-clamp-1 group-hover:text-pink-200 transition-colors">
              {item.titulo}
            </h3>
          )}

          {/* Descripción */}
          {item.descripcion && (
            <p className="text-white/90 text-xs leading-relaxed line-clamp-3 mb-4 group-hover:text-white transition-colors">
              {item.descripcion}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-white/80 mb-4 group-hover:text-white transition-colors">
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold">{item.likes}</span>
            </div>
            
            {item.tipo === 'video' && item.duracion && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold">{formatDuration(item.duracion)}</span>
                </div>
              </>
            )}
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-xl group-hover:shadow-pink-500/50 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white text-xs font-bold">Premium</span>
          </div>
        </div>

        {/* Animated Border on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/50 animate-pulse"></div>
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
};
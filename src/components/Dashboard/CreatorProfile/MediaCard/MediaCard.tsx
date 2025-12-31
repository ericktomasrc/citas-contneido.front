import { Play, Heart, Download, Eye } from 'lucide-react';
import { MediaItem } from '../../../../shared/types/creator-profile.types';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard = ({ item }: MediaCardProps) => {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm hover:shadow-2xl transition-all duration-300">
      {/* Imagen */}
      <img
        src={item.thumbnail || item.url}
        alt={item.titulo || 'Media'}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
      />

      {/* Gradiente overlay superior (hover) */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Gradiente overlay inferior */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Video Play Icon */}
      {item.tipo === 'video' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
          <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
        </div>
      )}

      {/* Duración del video */}
      {item.tipo === 'video' && item.duracion && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
          {Math.floor(item.duracion / 60)}:{(item.duracion % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Premium Badge */}
      {item.isPremium && (
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>VIP</span>
        </div>
      )}

      {/* Info Bottom (aparece con hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        {/* Título */}
        {item.titulo && (
          <p className="text-white font-semibold text-sm mb-2 line-clamp-1 drop-shadow-lg">
            {item.titulo}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Likes */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1">
              <Heart className="w-3.5 h-3.5 text-white" fill="white" />
              <span className="text-white text-xs font-bold">
                {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}K` : item.likes}
              </span>
            </div>
          </div>

          {/* Download Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              console.log('Descargar:', item.id);
            }}
            className="w-8 h-8 bg-white/30 backdrop-blur-md hover:bg-white/50 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Border Gradient Effect (hover) */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-xl" />
      </div>
    </div>
  );
};

import { Play, Heart } from 'lucide-react';
import { MediaItem } from '../../../shared/types/creator-profile.types';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard = ({ item }: MediaCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group bg-white p-3 rounded-3xl shadow-md hover:shadow-2xl transition-all cursor-pointer">
      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {/* Image */}
        <img
          src={item.thumbnail || item.url}
          alt="Media"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Video Badge */}
        {item.tipo === 'video' && item.duracion && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs font-bold shadow-lg">
            <Play className="w-3 h-3 fill-white" />
            {formatDuration(item.duracion)}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5 fill-white drop-shadow-lg" />
            <span className="font-bold text-sm drop-shadow-lg">{item.likes || 0}</span>
          </div>
        </div>

        {/* Click to view hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold">
            Click para ver
          </div>
        </div>
      </div>
    </div>
  );
}; 
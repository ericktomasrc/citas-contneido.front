import { Eye, Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LiveStream } from '../../../shared/types/creator-profile.types';

interface LiveCardProps {
  live: LiveStream;
  hasAccess?: boolean;
}

export const LiveCard = ({ live, hasAccess = false }: LiveCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/${live.slug}`);
  };

  const isPremium = live.tipo === 'premium';
  const isLocked = isPremium && !hasAccess;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800">
        <img
          src={live.thumbnailUrl}
          alt={live.titulo}
          className={`w-full h-full object-cover ${isLocked ? 'blur-md' : 'group-hover:scale-105 transition-transform duration-300'}`}
        />

        {/* Live Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-white text-xs font-bold shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>

        {/* Viewers */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
          <Eye className="w-3 h-3" />
          {live.viewers >= 1000 
            ? `${(live.viewers / 1000).toFixed(1)}K` 
            : live.viewers}
        </div>

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}

        {/* Lock Overlay (Premium sin acceso) */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-white font-bold text-lg mb-1">
              S/. {live.precioEntrada}
            </div>
            <div className="text-white/80 text-sm">
              Pago único para ver
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Creator */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={live.creatorPhoto}
            alt={live.creatorName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-700"
          />
          <span className="text-white font-semibold text-sm truncate">
            {live.creatorName}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-gray-300 text-sm font-medium line-clamp-2 mb-1">
          {live.titulo}
        </h3>

        {/* Category/Tags */}
        {live.descripcion && (
          <p className="text-gray-500 text-xs line-clamp-1">
            {live.descripcion}
          </p>
        )}
      </div>
    </div>
  );
};
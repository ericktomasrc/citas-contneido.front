import { MapPin, Heart, MessageCircle, CheckCircle } from 'lucide-react';
import { Creator } from '../../../shared/types/creator.types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatorCardProps {
  creator: Creator;
  onLike?: (id: number) => void;
  onClick?: (create: Creator) => void;
}

export const CreatorCard = ({ creator, onLike, onClick }: CreatorCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(creator.id);
  };

  const handleCardClick = () => {
      if (creator.slug) {
      navigate(`/perfil/${creator.slug}`);
    }
   // navigate(`/perfil/${creator.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
        <img
          src={creator.fotoUrl}
          alt={creator.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Live Badge */}
          {creator.isLive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-xs font-bold uppercase">LIVE</span>
            </div>
          )}

          {/* Online Status */}
          {!creator.isLive && creator.isOnline && (
            <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg" />
          )}

          {/* Verified Badge */}
          {creator.isVerified && (
            <div className="ml-auto bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-700'
            }`}
          />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/perfil/${creator.slug}`); 
              }}
              className="flex-1 bg-white text-gray-900 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
            >
              Ver Perfil
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                console.log('Abrir chat con', creator.id);
              }}
              className="bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 transition"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Name & Age */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {creator.nombre}, {creator.edad}
          </h3>
          {creator.isPremium && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-lg">
              💎 VIP
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{creator.ubicacion}</span>
          <span className="text-xs text-gray-400">• {creator.distancia} km</span>
        </div>

        {/* Bio Preview */}
        {creator.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {creator.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{creator.likes}</span>
          </div>
          <div className="text-sm font-bold text-pink-600">
            S/. {creator.precio}/mes
          </div>
        </div>
      </div>
    </div>
  );
};
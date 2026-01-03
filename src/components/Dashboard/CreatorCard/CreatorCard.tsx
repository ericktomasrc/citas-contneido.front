import { MapPin, Heart, ThumbsDown } from 'lucide-react';
import { Creator } from '../../../shared/types/creator.types';
import { useNavigate } from 'react-router-dom';

interface CreatorCardProps {
  creator: Creator;
  onLike?: (id: number) => void;
  onClick?: (create: Creator) => void;
}

export const CreatorCard = ({ creator, onLike, onClick }: CreatorCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (creator.slug) {
      navigate(`/perfil/${creator.slug}`);
     //navigate(`/perfil-publico-creadora/`);
    }
  };

  // ✅ Valores desde la BD (solo lectura)
  const likesCount = creator.likes || 0;
  const dislikesCount = creator.dislikes || 0;

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
          {/* Live Badge - Rojo */}
          {creator.isLive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase">EN VIVO</span>
            </div>
          )}

          {/* Online Badge - Verde */}
          {!creator.isLive && creator.isOnline && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-xs font-bold uppercase">EN LÍNEA</span>
            </div>
          )}

          {/* ❌ QUITADO: Verified Badge (Check azul) */}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
               navigate(`/perfil/${creator.slug}`); 
              //navigate(`/perfil-publico-creadora/`); 
            }}
            className="w-full bg-white text-gray-900 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
          >
            Ver Perfil
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Name & Age - ✅ MÁS PEQUEÑO */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-gray-900">
            {creator.nombre}, {creator.edad}
          </h3>
          {/* ❌ QUITADO: Badge VIP */}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{creator.ubicacion}</span>
          {creator.distancia !== undefined && (
            <span className="text-xs text-gray-400">• {creator.distancia} km</span>
          )}
        </div>

        {/* ❌ QUITADO: Bio/Descripción */}

        {/* Stats - ✅ Likes (verde) y Dislikes (rojo) DESDE BD */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Likes - Verde o Blanco */}
          <div className="flex items-center gap-1.5">
            <Heart
              className={`w-5 h-5 ${
                likesCount > 0 
                  ? 'fill-green-500 text-green-500' 
                  : 'fill-white text-gray-400 stroke-2'
              }`}
            />
            <span className={`text-sm font-medium ${
              likesCount > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              {likesCount}
            </span>
          </div>

          {/* Dislikes - Rojo o Blanco */}
          <div className="flex items-center gap-1.5">
            <ThumbsDown
              className={`w-5 h-5 ${
                dislikesCount > 0 
                  ? 'fill-red-500 text-red-500' 
                  : 'fill-white text-gray-400 stroke-2'
              }`}
            />
            <span className={`text-sm font-medium ${
              dislikesCount > 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {dislikesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
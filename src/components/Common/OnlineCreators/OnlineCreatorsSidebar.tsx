import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OnlineCreator } from '../../../shared/types/creator.types';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

interface OnlineCreatorsSidebarProps {
  creators: OnlineCreatorExtended[];
}

export const OnlineCreatorsSidebar = ({ creators }: OnlineCreatorsSidebarProps) => {
  const navigate = useNavigate();

  const handleClick = (creator: OnlineCreatorExtended) => {
    if (creator.slug) {
      navigate(`/perfil/${creator.slug}`);
    }
  };

  if (creators.length === 0) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 w-24 bg-white border-l border-gray-200 z-30 shadow-lg flex flex-col">
      {/* Header - FIJO ARRIBA */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-2 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-gray-900">EN LÍNEA</span>
        </div>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          {creators.length}
        </span>
      </div>

      {/* Lista de Creators - CON SCROLL */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {creators.map((creator) => (
          <button
            key={creator.id}
            onClick={() => handleClick(creator)}
            className="w-full group/item"
          >
            <div className="flex flex-col items-center gap-1.5">
              {/* Avatar con badges */}
              <div className="relative">
                {/* Gradient ring */}
                <div className={`w-14 h-14 rounded-full p-0.5 ${
                  creator.isLive
                    ? 'bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500'
                    : 'bg-gradient-to-tr from-green-400 to-emerald-500'
                }`}>
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <img
                      src={creator.avatar}
                      alt={creator.nombre}
                      className="w-full h-full rounded-full object-cover group-hover/item:scale-105 transition"
                    />
                  </div>
                </div>

                {/* LIVE Badge */}
                {creator.isLive && (
                  <div className="absolute -top-0.5 -left-0.5 flex items-center gap-0.5 px-1 py-0.5 bg-red-500 text-white text-[7px] font-bold rounded-full shadow-lg border border-white">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}

                {/* FAVORITO Badge */}
                {creator.isFavorite && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border border-white shadow-lg">
                    <Star className="w-2 h-2 text-white fill-white" />
                  </div>
                )}

                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>

              {/* Nombre + Edad */}
              <div className="text-center w-full px-1">
                <p className="text-xs font-semibold text-gray-900 group-hover/item:text-pink-600 transition truncate leading-tight">
                  {creator.nombre}
                </p>
                {creator.edad && (
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {creator.edad} años
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
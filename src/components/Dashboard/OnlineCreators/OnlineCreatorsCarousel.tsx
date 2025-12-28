import { ChevronRight, Star } from 'lucide-react';
import { useRef } from 'react';

interface OnlineCreator {
  id: number;
  nombre: string;
  avatar: string;
  isLive: boolean;
  isFavorite: boolean;  
}

interface OnlineCreatorsCarouselProps {
  creators: OnlineCreator[];
  onCreatorClick?: (id: number) => void;
}

export const OnlineCreatorsCarousel = ({ creators, onCreatorClick }: OnlineCreatorsCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (creators.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-lg font-bold text-gray-900">
            EN LÍNEA
          </h2>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            {creators.length}
          </span>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-700 transition">
          Ver todas
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {creators.map((creator) => (
            <button
              key={creator.id}
              onClick={() => onCreatorClick?.(creator.id)}
              className="flex-shrink-0 group/item"
            >
              <div className="flex flex-col items-center gap-2">
                {/* Avatar with ring and badges */}
                <div className="relative">
                  {/* Gradient ring */}
                  <div className={`w-20 h-20 rounded-full p-0.5 ${
                    creator.isLive
                      ? 'bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500'
                      : 'bg-gradient-to-tr from-green-400 to-emerald-500'
                  }`}>
                    <div className="w-full h-full bg-white rounded-full p-0.5">
                      <img
                        src={creator.avatar}
                        alt={creator.nombre}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* LIVE Badge - Arriba Izquierda */}
                  {creator.isLive && (
                    <div className="absolute -top-1 -left-1 flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full shadow-lg border-2 border-white">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}

                  {/* FAVORITO Badge - Arriba Derecha */}
                  {creator.isFavorite && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}

                  {/* Online indicator - Abajo Derecha */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-gray-900 group-hover/item:text-pink-600 transition max-w-[80px] truncate">
                  {creator.nombre}
                </span>
              </div>
            </button>
          ))}

          {/* Spacer para que se vea el último */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* Scroll Buttons (Desktop only) */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
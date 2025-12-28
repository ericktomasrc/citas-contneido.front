import { Creator } from '../../../shared/types/creator.types';
import { CreatorCard } from './CreatorCard';

interface CreatorGridProps {
  creators: Creator[];
  loading?: boolean;
  onCreatorClick?: (id: number) => void;
  onLike?: (id: number) => void;
}

export const CreatorGrid = ({ creators, loading, onCreatorClick, onLike }: CreatorGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">😔</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No hay resultados
        </h3>
        <p className="text-gray-600">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onClick={onCreatorClick}
          onLike={onLike}
        />
      ))}
    </div>
  );
};
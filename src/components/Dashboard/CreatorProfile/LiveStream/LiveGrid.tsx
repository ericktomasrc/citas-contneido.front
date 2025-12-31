import { LiveStream } from '../../../../shared/types/creator-profile.types';
import { LiveCard } from './LiveCard';

interface LiveGridProps {
  lives: LiveStream[];
  userPurchasedLives?: number[];
}

export const LiveGrid = ({ lives, userPurchasedLives = [] }: LiveGridProps) => {
  if (!lives || lives.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-6xl mb-4">📹</div>
        <p className="text-lg font-medium">No hay transmisiones en vivo ahora</p>
        <p className="text-sm mt-2">Vuelve más tarde para ver lives</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {lives.map((live) => (
        <LiveCard
          key={live.id}
          live={live}
          hasAccess={live.tipo === 'publico' || userPurchasedLives.includes(live.id)}
        />
      ))}
    </div>
  );
};
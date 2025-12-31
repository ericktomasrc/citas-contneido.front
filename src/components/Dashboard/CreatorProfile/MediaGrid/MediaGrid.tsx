import { useState } from 'react';
import { MediaItem } from '../../../../shared/types/creator-profile.types';
import { MediaCard } from '../MediaCard/MediaCard';
import { LockedMediaCard } from './LockedMediaCard';
import { MediaModal } from '../MediaModal/MediaModal';

interface MediaGridProps {
  items: MediaItem[];
  isPremiumTab: boolean;
  isSubscribed: boolean;
}

export const MediaGrid = ({ items, isPremiumTab, isSubscribed }: MediaGridProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4 shadow-inner">
          <span className="text-4xl">📷</span>
        </div>
        <p className="text-lg font-medium text-gray-500">No hay contenido disponible</p>
        <p className="text-sm text-gray-400 mt-1">Sé el primero en ver nuevo contenido</p>
      </div>
    );
  }

  const shouldLock = isPremiumTab && !isSubscribed;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => !shouldLock && setSelectedMedia(item)}
            className="cursor-pointer"
          >
            {shouldLock ? (
              <LockedMediaCard item={item} />
            ) : (
              <MediaCard item={item} />
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

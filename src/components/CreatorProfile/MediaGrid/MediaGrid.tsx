import { useState } from 'react';
import { MediaItem } from '../../../shared/types/creator-profile.types';
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
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-3xl">📷</span>
        </div>
        <p className="text-lg font-medium">No hay contenido disponible</p>
      </div>
    );
  }

  const shouldLock = isPremiumTab && !isSubscribed;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div key={item.id} onClick={() => !shouldLock && setSelectedMedia(item)}>
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
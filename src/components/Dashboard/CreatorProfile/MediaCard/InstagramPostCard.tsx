import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { MediaItem } from '../../../../shared/types/creator-profile.types';
import { useState } from 'react';

interface InstagramPostCardProps {
  item: MediaItem;
  creatorName: string;
  creatorUsername: string;
  creatorPhoto: string;
  creatorLocation?: string;
}

export const InstagramPostCard = ({ 
  item, 
  creatorName, 
  creatorUsername, 
  creatorPhoto,
  creatorLocation 
}: InstagramPostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={creatorPhoto}
            alt={creatorName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{creatorName}</h3>
            {creatorLocation && (
              <p className="text-xs text-gray-500">{creatorLocation}</p>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative bg-gray-100">
        <img
          src={item.url}
          alt="Post"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLiked(!liked)}
              className="transition hover:scale-110"
            >
              <Heart 
                className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} 
              />
            </button>
            <button className="transition hover:scale-110">
              <MessageCircle className="w-6 h-6 text-gray-900" />
            </button>
            <button className="transition hover:scale-110">
              <Send className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          <button 
            onClick={() => setSaved(!saved)}
            className="transition hover:scale-110"
          >
            <Bookmark 
              className={`w-6 h-6 ${saved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'}`} 
            />
          </button>
        </div>

        {/* Likes */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex -space-x-2">
            <img src={creatorPhoto} alt="" className="w-5 h-5 rounded-full border-2 border-white" />
          </div>
          <p className="text-sm">
            <span className="font-semibold">Liked by {creatorUsername}</span>
            <span className="text-gray-900"> and </span>
            <span className="font-semibold">{item.likes || 0} others</span>
          </p>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{creatorUsername}</span>
          <span className="text-gray-900">
            You can never dull my sparkle ✨
          </span>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-2 uppercase">
          {new Date(item.createdAt).toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
};
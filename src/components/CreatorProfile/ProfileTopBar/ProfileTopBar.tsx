import { ArrowLeft, Heart, Star, Share2, ThumbsDown } from 'lucide-react'; // ✅ Cambiar X por ThumbsDown
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProfileTopBarProps {
  username: string;
  isVerified: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProfileTopBar = ({ username, isVerified, isFavorite, onToggleFavorite }: ProfileTopBarProps) => {
  const navigate = useNavigate();
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Atrás</span>
        </button>
        
        {/* Center */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">@{username}</span>
          {isVerified && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Recomendar */}
          <button
            onClick={() => {
              setRecommend(!recommend);
              setNotRecommend(false);
            }}
            className={`p-2 rounded-full transition ${
              recommend ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${recommend ? 'fill-current' : ''}`} />
          </button>
          
          {/* Favorito */}
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition ${
              isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* Compartir */}
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
            <Share2 className="w-5 h-5" />
          </button>
          
          {/* No me gusta - THUMBS DOWN */}
          <button
            onClick={() => {
              setNotRecommend(!notRecommend);
              setRecommend(false);
            }}
            className={`p-2 rounded-full transition ${
              notRecommend ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ThumbsDown className={`w-5 h-5 ${notRecommend ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
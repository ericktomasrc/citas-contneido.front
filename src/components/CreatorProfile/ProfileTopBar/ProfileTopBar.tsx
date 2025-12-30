import { ArrowLeft, Heart, Star, Share2, ThumbsDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProfileTopBarProps {
  username: string;
  edad: number;
  isVerified: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProfileTopBar = ({ username, edad, isVerified, isFavorite, onToggleFavorite }: ProfileTopBarProps) => {
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
        {/* <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">@{username}, {edad}</span>
          {isVerified && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div> */}
        
        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Me gusta - Verde */}
          <button
            onClick={() => {
              setRecommend(!recommend);
              setNotRecommend(false);
            }}
            className={`p-2 rounded-full transition-all ${
              recommend 
                ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                : 'bg-green-50 text-green-500 hover:bg-green-100'
            }`}
            title="Me gusta"
          >
            <Heart className={`w-5 h-5 ${recommend ? 'fill-current' : ''}`} />
          </button>

          {/* No me gusta - Rojo */}
          <button
            onClick={() => {
              setNotRecommend(!notRecommend);
              setRecommend(false);
            }}
            className={`p-2 rounded-full transition-all ${
              notRecommend 
                ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
            title="No me gusta"
          >
            <ThumbsDown className={`w-5 h-5 ${notRecommend ? 'fill-current' : ''}`} />
          </button>
          
          {/* Favorito - Naranja-Amarillo */}
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorite 
                ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200' 
                : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
            }`}
            title="Favorito"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* Compartir - Azul */}
          <button 
            className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-all"
            title="Compartir perfil"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
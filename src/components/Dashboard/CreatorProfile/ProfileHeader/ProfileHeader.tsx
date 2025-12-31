import { ArrowLeft, Heart, X, Star, Share2, MapPin, MessageCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreatorProfile } from '../../../../shared/types/creator-profile.types';
import { useState } from 'react';

interface ProfileHeaderProps {
  profile: CreatorProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSendMessage: () => void;
  onSubscribe: () => void;
}

export const ProfileHeader = ({ 
  profile, 
  isFavorite, 
  onToggleFavorite,
  onSendMessage,
  onSubscribe 
}: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-16 z-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Atrás</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">@{profile.username}</span>
          {profile.isVerified && (
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Recomendar */}
          <button
            onClick={() => {
              setRecommend(!recommend);
              setNotRecommend(false);
            }}
            className={`group relative p-2.5 rounded-xl transition-all ${
              recommend 
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 scale-110' 
                : 'bg-gray-100/80 hover:bg-gray-200/80 hover:scale-105'
            }`}
            title="Recomendar"
          >
            <Heart className={`w-5 h-5 transition-all ${
              recommend ? 'text-white fill-white' : 'text-gray-600'
            }`} />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Recomendar
            </div>
          </button>
          
          {/* Favorito */}
          <button
            onClick={onToggleFavorite}
            className={`group relative p-2.5 rounded-xl transition-all ${
              isFavorite 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30 scale-110' 
                : 'bg-gray-100/80 hover:bg-gray-200/80 hover:scale-105'
            }`}
            title="Favorito"
          >
            <Star className={`w-5 h-5 transition-all ${
              isFavorite ? 'text-white fill-white' : 'text-gray-600'
            }`} />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Favorito
            </div>
          </button>
          
          {/* Compartir */}
          <button
            className="group relative p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 hover:scale-105 transition-all"
            title="Compartir"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Compartir
            </div>
          </button>
          
          {/* No Recomendar */}
          <button
            onClick={() => {
              setNotRecommend(!notRecommend);
              setRecommend(false);
            }}
            className={`group relative p-2.5 rounded-xl transition-all ${
              notRecommend 
                ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 scale-110' 
                : 'bg-gray-100/80 hover:bg-gray-200/80 hover:scale-105'
            }`}
            title="No la pasé bien"
          >
            <X className={`w-5 h-5 transition-all ${
              notRecommend ? 'text-white' : 'text-gray-600'
            }`} />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              No la pasé bien
            </div>
          </button>
        </div>
      </div>

      {/* Profile Content - Layout Simple */}
      <div className="px-6 py-5">
        <div className="flex items-start gap-6">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0 group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
              <img
                src={profile.fotoPerfil}
                alt={profile.nombre}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Online/Live Badge */}
            {profile.isLive && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                EN VIVO
              </div>
            )}
            
            {!profile.isLive && profile.isOnline && (
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-white rounded-full shadow-lg" />
            )}
          </div>

          {/* Info Section - Todo en una columna */}
          <div className="flex-1 min-w-0">
            {/* Name & Badges */}
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {profile.nombre}
              </h1>
              <span className="text-3xl font-bold text-gray-500">{profile.edad}</span>
              {profile.isPremium && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-md">
                  <Crown className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white">VIP</span>
                </div>
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{profile.ubicacion}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-500">{profile.distancia} km</span>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {profile.bio}
            </p>

            {/* Stats - Inline */}
            <div className="flex items-center gap-6 mb-4">
              <div className="group cursor-pointer">
                <div className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                  {profile.recomendaciones}
                </div>
                <div className="text-xs text-gray-500 font-medium">Recomendaciones</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="group cursor-pointer">
                <div className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                  {profile.suscriptores >= 1000 
                    ? `${(profile.suscriptores / 1000).toFixed(1)}k` 
                    : profile.suscriptores}
                </div>
                <div className="text-xs text-gray-500 font-medium">Suscriptores</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="group cursor-pointer">
                <div className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                  {profile.likes >= 1000 
                    ? `${(profile.likes / 1000).toFixed(1)}k` 
                    : profile.likes}
                </div>
                <div className="text-xs text-gray-500 font-medium">Likes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <button 
                onClick={onSendMessage}
                className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Mensaje
              </button>
              
              <button 
                onClick={onSubscribe}
                className="flex-1 bg-gradient-to-br from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                S/. {profile.precioSuscripcion}/mes
              </button>
            </div>

            {/* Intereses */}
            {profile.intereses && profile.intereses.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Intereses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.intereses.map((interes, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100/50 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {interes}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Detalles
              </h3>
              <div className="flex items-center gap-6 text-sm">
                {profile.cumpleanos && (
                  <div>
                    <span className="text-gray-500">Edad: </span>
                    <span className="text-gray-900 font-medium">{profile.edad} años</span>
                  </div>
                )}
                {profile.altura && (
                  <>
                    <div className="w-px h-4 bg-gray-200" />
                    <div>
                      <span className="text-gray-500">Altura: </span>
                      <span className="text-gray-900 font-medium">{profile.altura}m</span>
                    </div>
                  </>
                )}
                {profile.educacion && (
                  <>
                    <div className="w-px h-4 bg-gray-200" />
                    <div>
                      <span className="text-gray-500">Educación: </span>
                      <span className="text-gray-900 font-medium">{profile.educacion}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
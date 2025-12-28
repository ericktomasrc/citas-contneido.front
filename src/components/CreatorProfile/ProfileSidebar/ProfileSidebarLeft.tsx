import { UserPlus, MessageCircle, DollarSign, Crown, MapPin } from 'lucide-react';
import { CreatorProfile } from '../../../shared/types/creator-profile.types';
import { useNavigate } from 'react-router-dom';

interface ProfileSidebarLeftProps {
  profile: CreatorProfile;
  onInvite: () => void;
  onSendMessage: () => void;
  onDonate: () => void;
  onSubscribe: () => void;
}

export const ProfileSidebarLeft = ({ 
  profile, 
  onInvite,
  onSendMessage,
  onDonate,
  onSubscribe 
}: ProfileSidebarLeftProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-80 h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-gray-200">
      <div className="p-6">
        {/* STICKY SECTION - Foto hasta Botones */}
        <div className="sticky top-0 bg-white pb-4 z-10">
          {/* Profile Photo */}
          <div className="relative mb-4">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100">
              <img
                src={profile.fotoPerfil}
                alt={profile.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Online Badge */}
            {profile.isLive && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                LIVE
              </div>
            )}
            
            {!profile.isLive && profile.isOnline && (
              <div className="absolute bottom-4 right-1/2 translate-x-16 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
            )}
          </div>

          {/* Name & Username */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.nombre}</h2>
              {profile.isVerified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">@{profile.username}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 py-4 mb-4 border-y border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{profile.recomendaciones}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.suscriptores >= 1000 
                  ? `${(profile.suscriptores / 1000).toFixed(1)}K` 
                  : profile.suscriptores}
              </div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.likes >= 1000 
                  ? `${(profile.likes / 1000).toFixed(1)}K` 
                  : profile.likes}
              </div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-1">
              {profile.nombre} {profile.apellidos}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{profile.ubicacion}</span>
            <span className="text-xs text-gray-400">• {profile.distancia} km</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button 
              onClick={onInvite}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Invitar
            </button>
            
            <button 
              onClick={onSendMessage}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Mensaje
            </button>

            <button 
              onClick={onDonate}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Donar
            </button>
            
            <button 
              onClick={onSubscribe}
              className="w-full bg-gradient-to-br from-pink-600 to-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-pink-500 hover:to-rose-500 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Premium S/. {profile.precioSuscripcion}/mes
            </button>

            {profile.estaEnVivo && (
  <button 
    onClick={() => navigate(`/live/${profile.id}`)}
    className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-lg font-bold transition shadow-lg flex items-center justify-center gap-2 animate-pulse"
  >
    <div className="w-3 h-3 bg-white rounded-full"></div>
    VER EN VIVO
  </button>
)}
          </div>
        </div>

        {/* SCROLLABLE SECTION - Intereses y Detalles */}
        <div className="space-y-4 mt-4">
          {/* Intereses */}
          {profile.intereses && profile.intereses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h4>
              <div className="flex flex-wrap gap-2">
                {profile.intereses.map((interes, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Detalles</h4>
            <div className="space-y-1 text-sm">
              {profile.cumpleanos && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Edad</span>
                  <span className="text-gray-900 font-medium">{profile.edad} años</span>
                </div>
              )}
              {profile.altura && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Altura</span>
                  <span className="text-gray-900 font-medium">{profile.altura}m</span>
                </div>
              )}
              {profile.educacion && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Educación</span>
                  <span className="text-gray-900 font-medium">{profile.educacion}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { UserPlus, MessageCircle, DollarSign, Crown, MapPin } from 'lucide-react';
import { CreatorProfile } from '../../../../shared/types/creator-profile.types';
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
          {/* Profile Photo - Tamaño Instagram */}
          <div className="relative mb-4">
            {/* Contenedor del avatar */}
            <div className="relative w-20 h-20 mx-auto">
              {/* Ring animado solo cuando está en vivo */}
              {profile.estaEnVivo && (
                <>
                  {/* Ring externo con gradiente que gira */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500 opacity-100 animate-spin-slow"></div>
                  
                  {/* Ring interno blanco (separación) */}
                  <div className="absolute -inset-0.5 rounded-full bg-white"></div>
                </>
              )}
              
              {/* Avatar */}
              <div className={`relative w-full h-full rounded-full overflow-hidden ${
                profile.estaEnVivo ? '' : 'ring-2 ring-gray-200'
              }`}>
                <img
                  src={profile.fotoPerfil}
                  alt={profile.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Badge LIVE - Más pequeño */}
            {profile.estaEnVivo && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full shadow-md">
                EN VIVO
              </div>
            )}
            
            {/* Punto verde online - Más pequeño */}
            {!profile.estaEnVivo && profile.isOnline && (
              <div className="absolute bottom-0 right-1/2 translate-x-9 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Name & Username */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.nombre}, {profile.edad}</h2>
              {profile.isVerified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div> 
          </div>          

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 py-4 mb-4 border-y border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{profile.recomendaciones}</div>
              <div className="text-xs text-gray-500">Me gusta</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.suscriptores >= 1000 
                  ? `${(profile.suscriptores / 1000).toFixed(1)}K` 
                  : profile.suscriptores}
              </div>
              <div className="text-xs text-gray-500">suscriptores</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {profile.dislikes }
              </div>
              <div className="text-xs text-gray-500">No me gusta</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{profile.ubicacion}</span>
            <span className="text-xs text-gray-400">• {profile.distancia} km</span>
          </div>

          {/* Bio */}
          <div className="mb-6"> 
            <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>   

          {/* Intereses */}
          {profile.intereses && profile.intereses.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Intereses</h4>
              <div className="flex flex-wrap gap-2">
                {profile.intereses.map((interes, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Con texto e iconos */}
          <div className="space-y-2">
            {/* Contactar */}
            <button 
              onClick={onInvite}
              className="w-full bg-white hover:bg-gray-500 border-2 border-gray-400 hover:border-gray-500 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 py-2.5 group"
            >
              <UserPlus className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors">Contactar</span>
            </button>

            {/* Mensaje */}
            <button 
              onClick={onSendMessage}
              className="w-full bg-white hover:bg-blue-500 border-2 border-blue-500 hover:border-blue-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 py-2.5 group"
            >
              <MessageCircle className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-sm font-medium text-blue-600 group-hover:text-white transition-colors">Mensaje</span>
            </button>

            {/* Donar */}
            <button 
              onClick={onDonate}
              className="w-full bg-white hover:bg-green-500 border-2 border-green-500 hover:border-green-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 py-2.5 group"
            >
              <DollarSign className="w-4 h-4 text-green-500 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-sm font-medium text-green-600 group-hover:text-white transition-colors">Donar</span>
            </button>

            {/* Live - Solo cuando está en vivo */}
            {profile.estaEnVivo && (
              <button 
                onClick={() => navigate(`/live/${profile.id}`)}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 py-2.5 shadow-md font-medium"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm animate-pulse">VER EN VIVO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import { Heart, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OnlineCreator } from '@/shared/types/creator.types';

interface InvitacionExtendida extends OnlineCreator {
  edad?: number;
  ubicacion?: string;
  distancia?: number;
}

interface InvitacionesCarouselProps {
  invitaciones: InvitacionExtendida[];
}

export const InvitacionesCarousel = ({ invitaciones }: InvitacionesCarouselProps) => {
  const navigate = useNavigate();

  const handleVerPerfil = (invitacion: InvitacionExtendida) => {
    if (invitacion.slug) {
      navigate(`/perfil/${invitacion.slug}`);
    }
  };

  const handleAceptar = (invitacion: InvitacionExtendida, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Aceptar invitación:', invitacion.id);
    // TODO: Llamar API para aceptar invitación
  };

  const handleRechazar = (invitacion: InvitacionExtendida, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Rechazar invitación:', invitacion.id);
    // TODO: Llamar API para rechazar invitación
  };

  if (invitaciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
        <p className="text-gray-500">No tienes invitaciones pendientes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {invitaciones.map((invitacion) => (
        <div
          key={invitacion.id}
          onClick={() => handleVerPerfil(invitacion)}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-pink-500 hover:shadow-xl transition p-6 cursor-pointer group"
        >
          <div className="flex flex-col items-center">
            {/* Avatar con badges */}
            <div className="relative mb-4">
              {/* Gradient ring */}
              <div className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500">
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img
                    src={invitacion.avatar}
                    alt={invitacion.nombre}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* LIVE Badge si aplica */}
              {invitacion.isLive && (
                <div className="absolute -top-1 -right-1 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-white">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}

              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Nombre + Edad */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center group-hover:text-pink-600 transition">
              {invitacion.nombre}
              {invitacion.edad && (
                <span className="text-gray-500 font-normal ml-1">
                  {invitacion.edad}
                </span>
              )}
            </h3>

            {/* Ubicación + Distancia */}
            {invitacion.ubicacion && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{invitacion.ubicacion}</span>
                {invitacion.distancia !== undefined && (
                  <span className="text-gray-400">• {invitacion.distancia} km</span>
                )}
              </div>
            )}

              {/* Botones estilo Tinder - MÁS PEQUEÑOS */}
              <div className="w-full flex items-center justify-center gap-3 mt-2">
                {/* Aceptar - Corazón Verde PRIMERO */}
                <button
                  onClick={(e) => handleAceptar(invitacion, e)}
                  className="w-11 h-11 bg-white border-2 border-green-500 hover:bg-green-500 text-green-500 hover:text-white rounded-full transition flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 group/button"
                >
                  <Heart className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />
                </button>

                {/* Rechazar - X Roja SEGUNDO */}
                <button
                  onClick={(e) => handleRechazar(invitacion, e)}
                  className="w-11 h-11 bg-white border-2 border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 group/button"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};
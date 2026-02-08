import { Calendar, MapPin, Eye, X, Check } from 'lucide-react';
import { Invitacion } from '../types/invitaciones.types';

interface InvitacionCardProps {
  invitacion: Invitacion;
  onVerPerfil: (invitacion: Invitacion) => void;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export const InvitacionCard = ({ 
  invitacion, 
  onVerPerfil, 
  onAceptar, 
  onRechazar 
}: InvitacionCardProps) => {
  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out border border-zinc-100 hover:border-violet-200/60 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
      {/* Avatar */}
      <div 
        className="relative aspect-[3/4] bg-zinc-50 cursor-pointer overflow-hidden"
        onClick={() => onVerPerfil(invitacion)}
      >
        <img
          src={invitacion.avatar}
          alt={invitacion.nombre}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {/* Fecha de invitación */}
        {invitacion.fechaInvitacion && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-400 transition-colors duration-300 group-hover:text-violet-400" />
              <span className="text-[10px] font-medium text-zinc-500">
                {formatFecha(invitacion.fechaInvitacion)}
              </span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Info sobre la foto */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-base mb-0.5">
            {invitacion.nombre}, <span className="font-normal opacity-90">{invitacion.edad}</span>
          </h3>
          <div className="flex items-center gap-1 text-white/70 text-[11px]">
            <MapPin className="w-3 h-3" />
            <span>{invitacion.distancia.toFixed(1)} km</span>
            <span className="opacity-50">•</span>
            <span>{invitacion.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* Botones de Acción - 3 en una línea */}
      <div className="p-2.5">
        <div className="flex gap-1.5">
          <button
            onClick={() => onRechazar(invitacion.id)}
            className="flex-1 px-2 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rechazar</span>
          </button>
          <button
            onClick={() => onVerPerfil(invitacion)}
            className="flex-1 px-2 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Perfil</span>
          </button>
          <button
            onClick={() => onAceptar(invitacion.id)}
            className="flex-1 px-2 py-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm hover:shadow-violet-200"
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
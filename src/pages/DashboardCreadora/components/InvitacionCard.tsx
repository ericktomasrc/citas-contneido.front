import { Calendar, MapPin, Eye, X, Check } from 'lucide-react';
import { Invitacion } from '../../types/invitaciones.types';

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
    <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-300 transition-all overflow-hidden group shadow-sm hover:shadow-md">
      {/* Avatar */}
      <div 
        className="relative aspect-[3/4] bg-slate-100 cursor-pointer"
        onClick={() => onVerPerfil(invitacion)}
      >
        <img
          src={invitacion.avatar}
          alt={invitacion.nombre}
          className="w-full h-full object-cover"
        />
        
        {/* Fecha de invitación */}
        {invitacion.fechaInvitacion && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-slate-700 rounded-lg flex items-center gap-1 shadow-sm">
            <Calendar className="w-3 h-3 text-pink-500" />
            {formatFecha(invitacion.fechaInvitacion)}
          </div>
        )}
        
        {/* Badge de Live */}
        {invitacion.isLive && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            EN VIVO
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Info sobre la foto */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-lg mb-0.5">
            {invitacion.nombre}, {invitacion.edad}
          </h3>
          <div className="flex items-center gap-1.5 text-white/90 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{invitacion.distancia.toFixed(1)} km</span>
            <span>•</span>
            <span>{invitacion.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="p-3 space-y-2">
        {/* Botón Ver Perfil */}
        <button
          onClick={() => onVerPerfil(invitacion)}
          className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver Perfil
        </button>
        
        {/* Botones Aceptar/Rechazar */}
        <div className="flex gap-2">
          <button
            onClick={() => onRechazar(invitacion.id)}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Rechazar
          </button>
          <button
            onClick={() => onAceptar(invitacion.id)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

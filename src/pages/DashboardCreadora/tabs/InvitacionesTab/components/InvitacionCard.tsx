// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/InvitacionCard.tsx

import { Calendar, MapPin, X, Check } from 'lucide-react';
import { InvitacionDetalle } from '../types/invitaciones.types';

interface InvitacionCardProps {
  invitacion: InvitacionDetalle;
  isSelected: boolean;
  onSelect: (invitacion: InvitacionDetalle) => void;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export const InvitacionCard = ({ 
  invitacion, 
  isSelected,
  onSelect,
  onAceptar, 
  onRechazar,
}: InvitacionCardProps) => {
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo selecciona si no haces click en botones
    if ((e.target as HTMLElement).closest('button')) return;
    onSelect(invitacion);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-red-500 ring-offset-2 shadow-xl shadow-red-500/30' 
          : 'border border-gray-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-0.5'
        }`}
    >
      {/* Avatar */}
      <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
        <img
          src={invitacion.avatar}
          alt={invitacion.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge Verificado */}
        {invitacion.verificado && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Fecha de invitación */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md shadow-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600">
              {formatFecha(invitacion.fechaInvitacion)}
            </span>
          </div>
        </div>

        {/* ✅ Badge ROJO de selección - PEQUEÑO Y DISCRETO */}
        {isSelected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 rounded-full shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
              <span className="text-[9px] font-bold text-white">Seleccionado</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Info sobre la foto */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-sm mb-0.5 drop-shadow-md">
            {invitacion.nombre}, <span className="font-normal">{invitacion.edad}</span>
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-[11px]">
            <MapPin className="w-3 h-3" />
            <span>{invitacion.distancia.toFixed(1)} km • {invitacion.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* ✅ BOTONES PEQUEÑOS MODERADOS - NO GIGANTES */}
      <div className="p-2 flex gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRechazar(invitacion.id);
          }}
          className="flex-1 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Rechazar</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAceptar(invitacion.id);
          }}
          className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]
            ${isSelected 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm' 
              : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
            }
          `}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Aceptar</span>
        </button>
      </div>
    </div>
  );
};

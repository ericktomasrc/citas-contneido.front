// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/GridInvitaciones.tsx

import { InvitacionCard } from './InvitacionCard';
import { InvitacionDetalle } from '../types/invitaciones.types';
import { Loader2 } from 'lucide-react';

interface GridInvitacionesProps {
  invitaciones: InvitacionDetalle[];
  selectedId: number | null;
  isLoading: boolean;
  hasMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  onSelect: (invitacion: InvitacionDetalle) => void;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export const GridInvitaciones = ({
  invitaciones,
  selectedId,
  isLoading,
  hasMore,
  observerTarget,
  onSelect,
  onAceptar,
  onRechazar,
}: GridInvitacionesProps) => {
  return (
    // ✅ SOLUCIÓN: max-h-[calc(100vh-120px)] fuerza altura máxima
    <div className="h-full max-h-[calc(100vh-120px)] flex flex-col overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header con contador - STICKY */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Invitaciones pendientes
          </h2>
          <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
            {invitaciones.length}
          </span>
        </div>
      </div>

      {/* ✅ SCROLL FORZADO */}
      <div className="flex-1 overflow-y-scroll p-4">
        {/* Grid 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {invitaciones.map((invitacion) => (
            <InvitacionCard
              key={invitacion.id}
              invitacion={invitacion}
              isSelected={selectedId === invitacion.id}
              onSelect={onSelect}
              onAceptar={onAceptar}
              onRechazar={onRechazar}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8 mt-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-stone-200/60 shadow-sm">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              <span className="text-sm font-medium text-stone-600">Cargando invitaciones...</span>
            </div>
          </div>
        )}

        {/* Observer target */}
        <div 
          ref={observerTarget} 
          className="h-16 flex items-center justify-center mt-4"
        >
          {!isLoading && hasMore && invitaciones.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              <p className="text-xs text-stone-400 font-medium">Desplázate para ver más</p>
            </div>
          )}
          
          {!hasMore && invitaciones.length > 0 && (
            <p className="text-xs text-stone-400 font-medium">
              Has visto todas las invitaciones
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
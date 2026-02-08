import { InvitacionCard } from './InvitacionCard';
import { Invitacion } from '../types/invitaciones.types';
import { Loader2 } from 'lucide-react';

interface InvitacionesGridProps {
  invitaciones: Invitacion[];
  isLoading: boolean;
  hasMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  onVerPerfil: (invitacion: Invitacion) => void;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export const InvitacionesGrid = ({
  invitaciones,
  isLoading,
  hasMore,
  observerTarget,
  onVerPerfil,
  onAceptar,
  onRechazar,
}: InvitacionesGridProps) => {
  return (
    <>
      {/* Grid de Invitaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {invitaciones.map((invitacion) => (
          <InvitacionCard
            key={invitacion.id}
            invitacion={invitacion}
            onVerPerfil={onVerPerfil}
            onAceptar={onAceptar}
            onRechazar={onRechazar}
          />
        ))}
      </div>

      {/* Loading indicator - Elegant style */}
      {isLoading && (
        <div className="flex justify-center py-10 mt-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-stone-200/60 shadow-sm">
            <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
            <span className="text-sm font-medium text-stone-600">Cargando invitaciones...</span>
          </div>
        </div>
      )}

      {/* Observer target */}
      <div 
        ref={observerTarget} 
        className="h-16 flex items-center justify-center mt-6"
      >
        {!isLoading && hasMore && invitaciones.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <p className="text-xs text-stone-400 font-medium">Desplázate para ver más</p>
          </div>
        )}
        
        {!hasMore && invitaciones.length > 0 && (
          <p className="text-xs text-stone-400 font-medium">
            Has visto todas las invitaciones
          </p>
        )}
      </div>
    </>
  );
};

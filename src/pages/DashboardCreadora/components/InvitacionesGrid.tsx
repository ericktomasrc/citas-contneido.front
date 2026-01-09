import { InvitacionCard } from './InvitacionCard';
import { Invitacion } from '../types/invitaciones.types';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-8 mt-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-5 h-5 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600">Cargando más invitaciones...</span>
          </div>
        </div>
      )}

      {/* Observer target */}
      <div 
        ref={observerTarget} 
        className="h-20 flex items-center justify-center mt-4"
      >
        {!isLoading && hasMore && invitaciones.length > 0 && (
          <p className="text-xs text-slate-400">Cargando más contenido automáticamente...</p>
        )}
        
        {!hasMore && invitaciones.length > 0 && (
          <p className="text-xs text-slate-500">Has llegado al final de las invitaciones</p>
        )}
      </div>
    </>
  );
};

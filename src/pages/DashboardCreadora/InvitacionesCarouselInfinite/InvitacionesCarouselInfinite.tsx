// src/components/DashboardCreadora/Invitaciones/InvitacionesCarouselInfinite.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, MapPin, X, Check } from 'lucide-react';

interface Invitacion {
  id: number;
  slug: string;
  nombre: string;
  edad: number;
  ubicacion: string;
  distancia: number;
  avatar: string;
  isLive: boolean;
  isFavorite: boolean;
  fechaInvitacion: string;
}

interface InvitacionesCarouselInfiniteProps {
  invitaciones: Invitacion[];
}

export const InvitacionesCarouselInfinite = ({ invitaciones: initialInvitaciones }: InvitacionesCarouselInfiniteProps) => {
  const [invitaciones, setInvitaciones] = useState(initialInvitaciones);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Función para cargar más invitaciones
  const loadMoreInvitaciones = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    console.log('📥 Cargando más invitaciones... Página:', page + 1);
    
    // Simular llamada al API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Aquí iría la llamada real al backend
    // const response = await fetch(`/api/invitaciones?page=${page + 1}&limit=12`);
    // const newInvitaciones = await response.json();
    
    // Simulación: duplicar invitaciones existentes con nuevos IDs
    const newInvitaciones = initialInvitaciones.slice(0, 6).map((inv, index) => ({
      ...inv,
      id: inv.id + (page * 100) + index,
      nombre: `${inv.nombre} ${page + 1}`,
    }));

    if (newInvitaciones.length === 0) {
      setHasMore(false);
    } else {
      setInvitaciones(prev => [...prev, ...newInvitaciones]);
      setPage(prev => prev + 1);
    }
    
    setIsLoadingMore(false);
  }, [page, isLoadingMore, hasMore, initialInvitaciones]);

  // Intersection Observer para infinite scroll automático
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMoreInvitaciones();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreInvitaciones, isLoadingMore, hasMore]);

  const handleAceptar = (invitacionId: number) => {
    console.log('✅ Invitación aceptada:', invitacionId);
    // TODO: Conectar con backend
    // await fetch(`/api/invitaciones/${invitacionId}/aceptar`, { method: 'POST' });
    
    setInvitaciones(prev => prev.filter(inv => inv.id !== invitacionId));
  };

  const handleRechazar = (invitacionId: number) => {
    console.log('❌ Invitación rechazada:', invitacionId);
    // TODO: Conectar con backend
    // await fetch(`/api/invitaciones/${invitacionId}/rechazar`, { method: 'POST' });
    
    setInvitaciones(prev => prev.filter(inv => inv.id !== invitacionId));
  };

  if (invitaciones.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
          <Heart className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No tienes invitaciones
        </h3>
        <p className="text-sm text-slate-500">
          Cuando alguien se interese en ti, aparecerá aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid de Invitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {invitaciones.map((invitacion) => (
          <div
            key={invitacion.id}
            className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-300 transition-all overflow-hidden group shadow-sm hover:shadow-md"
          >
            {/* Avatar */}
            <div className="relative aspect-[3/4] bg-slate-100">
              <img
                src={invitacion.avatar}
                alt={invitacion.nombre}
                className="w-full h-full object-cover"
              />
              
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
            <div className="p-3 flex gap-2">
              <button
                onClick={() => handleRechazar(invitacion.id)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Rechazar
              </button>
              <button
                onClick={() => handleAceptar(invitacion.id)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Aceptar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator para infinite scroll */}
      {isLoadingMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-5 h-5 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600">Cargando más invitaciones...</span>
          </div>
        </div>
      )}

      {/* Observer target para infinite scroll */}
      <div 
        ref={observerTarget} 
        className="h-20 flex items-center justify-center"
      >
        {!isLoadingMore && hasMore && invitaciones.length > 0 && (
          <p className="text-xs text-slate-400">Cargando más contenido automáticamente...</p>
        )}
        
        {!hasMore && invitaciones.length > 0 && (
          <p className="text-xs text-slate-500">Has llegado al final de las invitaciones</p>
        )}
      </div>
    </div>
  );
};

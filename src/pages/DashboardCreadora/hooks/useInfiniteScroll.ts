import { useState, useCallback, useEffect, useRef } from 'react';
import { Invitacion } from '../types/invitaciones.types';

interface UseInfiniteScrollProps {
  initialData: Invitacion[];
  enabled: boolean;
}

export const useInfiniteScroll = ({ initialData, enabled }: UseInfiniteScrollProps) => {
  const [items, setItems] = useState<Invitacion[]>(initialData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    console.log('📥 Cargando más invitaciones... Página:', page + 1);
    
    // Simular llamada al API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Aquí iría la llamada real al backend
    // const response = await fetch(`/api/invitaciones?page=${page + 1}&limit=12`);
    // const newItems = await response.json();
    
    // Simulación: duplicar invitaciones existentes con nuevos IDs
    const newItems = initialData.slice(0, 6).map((inv, index) => ({
      ...inv,
      id: inv.id + (page * 100) + index,
      nombre: `${inv.nombre} ${page + 1}`,
    }));

    if (newItems.length === 0 || page >= 5) { // Limitar a 5 páginas en demo
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
    
    setIsLoading(false);
  }, [page, isLoading, hasMore, initialData]);

  // Intersection Observer para infinite scroll automático
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
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
  }, [loadMore, isLoading, hasMore, enabled]);

  // Reset cuando cambia enabled
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setItems(initialData);
  }, [enabled, initialData]);

  return {
    items,
    isLoading,
    hasMore,
    observerTarget,
    setItems,
  };
};

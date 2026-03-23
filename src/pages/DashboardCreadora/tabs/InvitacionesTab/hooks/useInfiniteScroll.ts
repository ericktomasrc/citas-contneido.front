// src/hooks/useInfiniteScroll.ts

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps<T> {
  enabled: boolean;
  initialData: T[];
  fetchData: (page: number) => Promise<T[]>;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T>({
  enabled,
  initialData,
  fetchData,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Reset cuando cambian los datos iniciales
  useEffect(() => {
    setItems(initialData);
    setPage(1);
    setHasMore(true);
  }, [initialData]);

  // Función para cargar más datos
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;

    setIsLoading(true);
    try {
      const newItems = await fetchData(page + 1);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, enabled, page, fetchData]);

  // Intersection Observer para detectar cuando llegar al final
  useEffect(() => {
    if (!enabled || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
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
  }, [enabled, hasMore, isLoading, loadMore]);

  return {
    items,
    isLoading,
    hasMore,
    observerTarget,
  };
}

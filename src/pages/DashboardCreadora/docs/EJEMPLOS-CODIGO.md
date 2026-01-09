# Ejemplos de Código - Casos de Uso

## 🎨 Caso 1: Agregar un Nuevo Tab

### Crear Tab de "Estadísticas"

```typescript
// 1. Crear el archivo del tab
// tabs/EstadisticasTab/EstadisticasTab.tsx

import { BarChart3, TrendingUp, Users } from 'lucide-react';

export const EstadisticasTab = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-700">Total Vistas</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">12,450</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-700">Suscriptores</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">324</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-slate-700">Engagement</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">87%</p>
        </div>
      </div>
    </div>
  );
};
```

```typescript
// 2. Agregar a DashboardCreadoraPage.tsx

// Import
import { EstadisticasTab } from './tabs/EstadisticasTab/EstadisticasTab';

// Render
{activeTab === 'estadisticas' && <EstadisticasTab />}
```

```typescript
// 3. Actualizar hooks/useTabs.ts

export type TabType = 
  | 'resumen' 
  | 'contenido' 
  | 'estadisticas' // ✅ Agregar aquí
  | 'mensajes' 
  | 'configuracion';
```

## 🔄 Caso 2: Reutilizar Infinite Scroll para Mensajes

```typescript
// pages/MensajesPage/MensajesPage.tsx

import { useInfiniteScroll } from '../DashboardCreadora/hooks/useInfiniteScroll';

interface Mensaje {
  id: number;
  texto: string;
  usuario: string;
  fecha: string;
}

const mensajesIniciales: Mensaje[] = [
  { id: 1, texto: 'Hola!', usuario: 'Juan', fecha: '2025-01-07' },
  // ... más mensajes
];

export const MensajesPage = () => {
  const {
    items: mensajes,
    isLoading,
    hasMore,
    observerTarget,
  } = useInfiniteScroll({
    initialData: mensajesIniciales,
    enabled: true,
  });

  return (
    <div className="space-y-4">
      {mensajes.map(mensaje => (
        <div key={mensaje.id} className="bg-white p-4 rounded-lg">
          <p className="font-semibold">{mensaje.usuario}</p>
          <p>{mensaje.texto}</p>
        </div>
      ))}
      
      {isLoading && <div>Cargando más mensajes...</div>}
      <div ref={observerTarget} />
    </div>
  );
};
```

## 🎯 Caso 3: Crear Variante de Card con Más Info

```typescript
// components/InvitacionCardDetallada.tsx

import { InvitacionCard } from './InvitacionCard';
import { Invitacion } from '../types/invitaciones.types';
import { Star, Heart, MessageCircle } from 'lucide-react';

interface InvitacionCardDetalladaProps {
  invitacion: Invitacion;
  onVerPerfil: (inv: Invitacion) => void;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
  // ✅ Props adicionales
  estadisticas?: {
    likes: number;
    mensajes: number;
    rating: number;
  };
}

export const InvitacionCardDetallada = ({ 
  invitacion, 
  estadisticas,
  ...props 
}: InvitacionCardDetalladaProps) => {
  return (
    <div>
      {/* Reutiliza el card original */}
      <InvitacionCard invitacion={invitacion} {...props} />
      
      {/* Agrega info extra */}
      {estadisticas && (
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {estadisticas.likes}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {estadisticas.mensajes}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {estadisticas.rating}
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🎨 Caso 4: Customizar SubTabs para Otra Sección

```typescript
// config/mensajes-subtabs.config.ts

import { Mail, Archive, Star } from 'lucide-react';
import { SubTab } from '../components/SubTabsHeader';

export const mensajesSubTabsConfig: SubTab[] = [
  { id: 'recibidos', label: 'Recibidos', icon: Mail },
  { id: 'archivados', label: 'Archivados', icon: Archive },
  { id: 'importantes', label: 'Importantes', icon: Star },
];
```

```typescript
// pages/MensajesPage/MensajesPage.tsx

import { SubTabsHeader } from '../DashboardCreadora/components/SubTabsHeader';
import { mensajesSubTabsConfig } from './config/mensajes-subtabs.config';

export const MensajesPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('recibidos');

  return (
    <div>
      <SubTabsHeader
        tabs={mensajesSubTabsConfig}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      
      <div className="p-6">
        {activeSubTab === 'recibidos' && <MensajesRecibidos />}
        {activeSubTab === 'archivados' && <MensajesArchivados />}
        {activeSubTab === 'importantes' && <MensajesImportantes />}
      </div>
    </div>
  );
};
```

## 🔧 Caso 5: Agregar Filtros al Infinite Scroll

```typescript
// hooks/useInfiniteScrollWithFilters.ts

import { useState } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

interface Filters {
  ubicacion?: string;
  edadMin?: number;
  edadMax?: number;
}

export const useInfiniteScrollWithFilters = <T extends any>({
  initialData,
  enabled,
}: {
  initialData: T[];
  enabled: boolean;
}) => {
  const [filters, setFilters] = useState<Filters>({});
  
  // Filtrar data antes de pasarla al infinite scroll
  const filteredData = initialData.filter(item => {
    if (filters.ubicacion && item.ubicacion !== filters.ubicacion) {
      return false;
    }
    if (filters.edadMin && item.edad < filters.edadMin) {
      return false;
    }
    if (filters.edadMax && item.edad > filters.edadMax) {
      return false;
    }
    return true;
  });

  const scrollData = useInfiniteScroll({
    initialData: filteredData,
    enabled,
  });

  return {
    ...scrollData,
    filters,
    setFilters,
  };
};
```

```typescript
// Uso en InvitacionesTab

import { useInfiniteScrollWithFilters } from '../../hooks/useInfiniteScrollWithFilters';

export const InvitacionesTab = ({ invitacionesIniciales, enabled }) => {
  const {
    items,
    isLoading,
    observerTarget,
    filters,
    setFilters,
  } = useInfiniteScrollWithFilters({
    initialData: invitacionesIniciales,
    enabled,
  });

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex gap-2">
        <select 
          onChange={(e) => setFilters({ ...filters, ubicacion: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Todas las ubicaciones</option>
          <option value="Miraflores">Miraflores</option>
          <option value="San Isidro">San Isidro</option>
        </select>
        
        <input
          type="number"
          placeholder="Edad mínima"
          onChange={(e) => setFilters({ ...filters, edadMin: +e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Grid */}
      <InvitacionesGrid items={items} {...otherProps} />
    </div>
  );
};
```

## 📊 Caso 6: Agregar Loading Skeleton

```typescript
// components/InvitacionCardSkeleton.tsx

export const InvitacionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden animate-pulse">
      {/* Avatar skeleton */}
      <div className="aspect-[3/4] bg-slate-200" />
      
      {/* Botones skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="flex gap-2">
          <div className="flex-1 h-11 bg-slate-200 rounded-xl" />
          <div className="flex-1 h-11 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
```

```typescript
// Uso en InvitacionesGrid

import { InvitacionCardSkeleton } from './InvitacionCardSkeleton';

export const InvitacionesGrid = ({ invitaciones, isLoading, ... }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {invitaciones.map(inv => (
        <InvitacionCard key={inv.id} invitacion={inv} {...props} />
      ))}
      
      {/* Mostrar skeletons mientras carga */}
      {isLoading && (
        <>
          <InvitacionCardSkeleton />
          <InvitacionCardSkeleton />
          <InvitacionCardSkeleton />
          <InvitacionCardSkeleton />
        </>
      )}
    </div>
  );
};
```

## 🎯 Caso 7: Conectar con API Real

```typescript
// services/invitaciones.service.ts

export const invitacionesService = {
  async getInvitaciones(page: number, limit: number) {
    const response = await fetch(
      `/api/invitaciones?page=${page}&limit=${limit}`
    );
    return response.json();
  },

  async aceptarInvitacion(id: number) {
    const response = await fetch(`/api/invitaciones/${id}/aceptar`, {
      method: 'POST',
    });
    return response.json();
  },

  async rechazarInvitacion(id: number) {
    const response = await fetch(`/api/invitaciones/${id}/rechazar`, {
      method: 'POST',
    });
    return response.json();
  },
};
```

```typescript
// Actualizar useInfiniteScroll para usar el servicio

import { invitacionesService } from '../services/invitaciones.service';

export const useInfiniteScroll = ({ initialData, enabled }) => {
  // ... código existente

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      // ✅ Llamada real al API
      const newItems = await invitacionesService.getInvitaciones(
        page + 1,
        12
      );

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error cargando invitaciones:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // ... resto del código
};
```

## 🎨 Caso 8: Agregar Animaciones

```typescript
// components/InvitacionCard.tsx con animaciones

import { motion } from 'framer-motion';

export const InvitacionCard = ({ invitacion, onVerPerfil, ... }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border-2 border-slate-200..."
    >
      {/* contenido del card */}
    </motion.div>
  );
};
```

Estos ejemplos muestran cómo la arquitectura modular facilita:
- ✅ Agregar nuevas features
- ✅ Reutilizar componentes y hooks
- ✅ Customizar comportamiento
- ✅ Integrar con APIs reales
- ✅ Mejorar la UX con animaciones

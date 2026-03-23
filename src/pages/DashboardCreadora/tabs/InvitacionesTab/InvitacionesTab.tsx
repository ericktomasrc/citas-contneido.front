// src/pages/DashboardCreadora/tabs/InvitacionesTab/InvitacionesTab.tsx

import { InvitacionesLayout } from './components/InvitacionesLayout';
import { EmptyState } from './components/EmptyState';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { toInvitacionBaseArray } from './utils/invitaciones.adapter';
import { InvitacionDetalle } from './types/invitaciones.types';

// Tipo base para el hook
type InvitacionBase = {
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
};

interface InvitacionesTabProps {
  invitacionesIniciales: InvitacionDetalle[];
  enabled: boolean;
}

export const InvitacionesTab = ({ invitacionesIniciales, enabled }: InvitacionesTabProps) => {
  // Convertir a tipo base para el hook
  const invitacionesBase = toInvitacionBaseArray(invitacionesIniciales);

  const {
    items,
    isLoading,
    hasMore,
    observerTarget,
  } = useInfiniteScroll<InvitacionBase>({
    enabled,
    initialData: invitacionesBase,
    fetchData: async (page: number) => {
      // Simular carga de más datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar más invitaciones de ejemplo
      const moreInvitations: InvitacionBase[] = Array.from({ length: 10 }, (_, i) => ({
        id: invitacionesIniciales.length + (page - 1) * 10 + i + 1,
        slug: `user-${invitacionesIniciales.length + (page - 1) * 10 + i + 1}`,
        nombre: `Usuario ${invitacionesIniciales.length + (page - 1) * 10 + i + 1}`,
        edad: 20 + (i % 15),
        ubicacion: ['San Isidro', 'Miraflores', 'Barranco', 'Surco'][i % 4] + ', Lima',
        distancia: Math.random() * 10,
        avatar: `https://i.pravatar.cc/400?img=${(invitacionesIniciales.length + i) % 70}`,
        isLive: false,
        isFavorite: false,
        fechaInvitacion: new Date().toISOString(),
      }));
      
      return moreInvitations;
    },
  });

  // Reconvertir a tipo detallado para el layout
  const invitacionesConDetalle: InvitacionDetalle[] = items.map((inv: InvitacionBase) => {
    const original = invitacionesIniciales.find(det => det.id === inv.id);
    return original || {
      ...inv,
      verificado: false,
      biografia: 'Usuario nuevo sin biografía.',
      fotos: [inv.avatar],
      informacionBasica: {
        profesion: 'No especificado',
        educacion: 'No especificado',
        estadoCivil: 'Soltero',
        hijos: 'No',
      },
      intereses: [],
    };
  });

  const handleAceptar = (id: number) => {
    if (confirm('¿Deseas aceptar esta invitación?')) {
      console.log('Aceptar invitación:', id);
      // Aquí llamarías a tu API
    }
  };

  const handleRechazar = (id: number) => {
    if (confirm('¿Deseas rechazar esta invitación?')) {
      console.log('Rechazar invitación:', id);
      // Aquí llamarías a tu API
    }
  };

  const handleDenunciar = (id: number) => {
    console.log('Denunciar usuario:', id);
    // Aquí llamarías a tu API
  };

  if (invitacionesConDetalle.length === 0 && !isLoading) {
    return (
      <div className="h-full">
        <EmptyState />
      </div>
    );
  }

  // ✅ CRÍTICO: h-full para heredar altura del padre
  return (
    <div className="h-full">
      <InvitacionesLayout
        invitaciones={invitacionesConDetalle}
        isLoading={isLoading}
        hasMore={hasMore}
        observerTarget={observerTarget}
        onAceptar={handleAceptar}
        onRechazar={handleRechazar}
        onDenunciar={handleDenunciar}
      />
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { InvitacionesGrid } from '../../components/InvitacionesGrid';
import { InvitacionesEmpty } from '../../components/InvitacionesEmpty';
import { Invitacion } from '../../types/invitaciones.types';

interface InvitacionesTabProps {
  invitacionesIniciales: Invitacion[];
  enabled: boolean;
}

export const InvitacionesTab = ({ invitacionesIniciales, enabled }: InvitacionesTabProps) => {
  const navigate = useNavigate();
  
  const {
    items: invitaciones,
    isLoading,
    hasMore,
    observerTarget,
    setItems,
  } = useInfiniteScroll({
    initialData: invitacionesIniciales,
    enabled,
  });

  const handleVerPerfil = (invitacion: Invitacion) => {
    if (invitacion.slug) {
      navigate(`/perfil-usuario/${invitacion.slug}`);
    }
  };

  const handleAceptar = (invitacionId: number) => {
    console.log('✅ Invitación aceptada:', invitacionId);
    setItems(prev => prev.filter(inv => inv.id !== invitacionId));
  };

  const handleRechazar = (invitacionId: number) => {
    console.log('❌ Invitación rechazada:', invitacionId);
    setItems(prev => prev.filter(inv => inv.id !== invitacionId));
  };

  if (invitaciones.length === 0) {
    return <InvitacionesEmpty />;
  }

  return (
    <InvitacionesGrid
      invitaciones={invitaciones}
      isLoading={isLoading}
      hasMore={hasMore}
      observerTarget={observerTarget}
      onVerPerfil={handleVerPerfil}
      onAceptar={handleAceptar}
      onRechazar={handleRechazar}
    />
  );
};

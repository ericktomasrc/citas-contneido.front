// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/InvitacionesLayout.tsx

import { useState, useEffect } from 'react';
import { DetalleUsuario } from './DetalleUsuario';
import { DetalleUsuarioModal } from './DetalleUsuarioModal';
import { GridInvitaciones } from './GridInvitaciones';
import { PhotoCarouselModal } from './PhotoCarouselModal';
import { InvitacionDetalle } from '../types/invitaciones.types';

interface InvitacionesLayoutProps {
  invitaciones: InvitacionDetalle[];
  isLoading: boolean;
  hasMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  onAceptar: (id: number) => void;
  onRechazar: (id: number) => void;
  onDenunciar: (id: number) => void;
}

export const InvitacionesLayout = ({
  invitaciones,
  isLoading,
  hasMore,
  observerTarget,
  onAceptar,
  onRechazar,
  onDenunciar,
}: InvitacionesLayoutProps) => {
  const [selectedUser, setSelectedUser] = useState<InvitacionDetalle | null>(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Detectar tamaño de pantalla
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-seleccionar primera invitación cuando cambia la lista (solo desktop)
  useEffect(() => {
    if (invitaciones.length > 0 && !selectedUser && isDesktop) {
      setSelectedUser(invitaciones[0]);
    }
  }, [invitaciones, selectedUser, isDesktop]);

  const handleSelectUser = (invitacion: InvitacionDetalle) => {
    setSelectedUser(invitacion);
    
    // En mobile/tablet, abrir modal
    if (!isDesktop) {
      setIsDetailModalOpen(true);
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setIsPhotoModalOpen(true);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedPhotoUrl(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleAceptarWithUpdate = (id: number) => {
    onAceptar(id);
    if (selectedUser?.id === id) {
      const currentIndex = invitaciones.findIndex(inv => inv.id === id);
      const nextInvitacion = invitaciones[currentIndex + 1] || invitaciones[currentIndex - 1] || null;
      setSelectedUser(nextInvitacion);
    }
  };

  const handleRechazarWithUpdate = (id: number) => {
    onRechazar(id);
    if (selectedUser?.id === id) {
      const currentIndex = invitaciones.findIndex(inv => inv.id === id);
      const nextInvitacion = invitaciones[currentIndex + 1] || invitaciones[currentIndex - 1] || null;
      setSelectedUser(nextInvitacion);
    }
  };

  return (
    <>
      {/* 
        ✅ SOLUCIÓN FINAL DEFINITIVA:
        - Altura calculada: 100vh - navbar(56px) - padding(24px) = calc(100vh - 80px)
        - Grid con altura heredada
      */}
      <div className="p-3 md:p-4 h-[calc(100vh-80px)]">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Columna Izquierda - Detalle (solo desktop) */}
          <div className="hidden lg:block lg:col-span-4 h-full">
            <DetalleUsuario 
              usuario={selectedUser} 
              onPhotoClick={handlePhotoClick}
              onDenunciar={onDenunciar}
            />
          </div>

          {/* Columna Derecha - Grid con Scroll */}
          <div className="lg:col-span-8 h-full">
            <GridInvitaciones
              invitaciones={invitaciones}
              selectedId={selectedUser?.id || null}
              isLoading={isLoading}
              hasMore={hasMore}
              observerTarget={observerTarget}
              onSelect={handleSelectUser}
              onAceptar={handleAceptarWithUpdate}
              onRechazar={handleRechazarWithUpdate}
            />
          </div>
        </div>
      </div>

      {/* Modal de Detalle (solo mobile/tablet <1024px) */}
      <DetalleUsuarioModal
        usuario={selectedUser}
        isOpen={isDetailModalOpen && !isDesktop}
        onClose={handleCloseDetailModal}
        onPhotoClick={handlePhotoClick}
      />

      {/* Modal de Galería (todas las pantallas) */}
      <PhotoCarouselModal
        photos={selectedUser?.fotos || []}
        initialPhotoUrl={selectedPhotoUrl}
        isOpen={isPhotoModalOpen}
        onClose={handleClosePhotoModal}
      />
    </>
  );
};
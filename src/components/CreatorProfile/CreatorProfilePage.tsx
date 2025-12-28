import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { ProfileHeader } from '../../components/CreatorProfile/ProfileHeader/ProfileHeader';
// import { ContentTabs } from '../../components/CreatorProfile/ContentTabs/ContentTabs';
import { CreatorProfile } from '../../shared/types/creator-profile.types';

export const CreatorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile: CreatorProfile = {
    // ... mismo mock data
    id: 1,
    username: 'maria_lima',
    nombre: 'María',
    apellidos: 'Rodriguez',
    edad: 24,
    ubicacion: 'San Isidro, Lima',
    distancia: 5,
    bio: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida. Aquí comparto mi día a día y contenido exclusivo para mis seguidores.',
    fotoPerfil: 'https://i.pravatar.cc/400?img=1',
    isOnline: true,
    isLive: false,
    isVerified: true,
    isPremium: true,
    precioSuscripcion: 140,
    recomendaciones: 123,
    suscriptores: 1234,
    likes: 5678,
    intereses: ['Relación seria', 'Salir', 'Amistad', 'Cenas'],
    altura: 1.65,
    educacion: 'Universidad',
    cumpleanos: '15 de marzo',
    fotosPublicas: [
      { id: 1, tipo: 'foto', url: 'https://picsum.photos/400/400?random=1', thumbnail: 'https://picsum.photos/400/400?random=1', isPremium: false, likes: 234, createdAt: '2024-01-15' },
      { id: 2, tipo: 'foto', url: 'https://picsum.photos/400/400?random=2', thumbnail: 'https://picsum.photos/400/400?random=2', isPremium: false, likes: 189, createdAt: '2024-01-14' },
      { id: 3, tipo: 'foto', url: 'https://picsum.photos/400/400?random=3', thumbnail: 'https://picsum.photos/400/400?random=3', isPremium: false, likes: 156, createdAt: '2024-01-13' },
    ],
    videosPublicos: [
      { id: 10, tipo: 'video', url: 'https://example.com/video1.mp4', thumbnail: 'https://picsum.photos/400/400?random=10', isPremium: false, likes: 567, createdAt: '2024-01-13', duracion: 125 },
    ],
    estaEnVivo: false,
    fotoBanner: '',
    contenidoPremiumFotos: [],
    contenidoPremiumVideos: [],
    contenidoComprable: [],
    precioSuscripcionFotos: 0,
    precioSuscripcionVideos: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="pt-16 lg:pl-64">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader
            profile={profile}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onSendMessage={() => console.log('Mensaje')}
            onSubscribe={() => console.log('Suscribirse')}
          />

          {/* <ContentTabs profile={profile} /> */}
        </div>
      </main>
    </div>
  );
};
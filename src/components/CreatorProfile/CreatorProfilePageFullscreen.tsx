import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileTopBar } from '../../components/CreatorProfile/ProfileTopBar/ProfileTopBar';
import { ProfileSidebarLeft } from '../../components/CreatorProfile/ProfileSidebar/ProfileSidebarLeft';
import { ContentTabsInstagram } from './ContentTabs/ContentTabsInstagram';
import { CreatorProfile } from '../../shared/types/creator-profile.types';

export const CreatorProfilePageFullscreen = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubscribedToPhotos, setIsSubscribedToPhotos] = useState(false); 
    const [isSubscribedToVideos, setIsSubscribedToVideos] = useState(false); 

const profile: CreatorProfile = {
  id: 1,
  username: 'maria_lima',
  nombre: 'María',
  apellidos: 'Rodriguez',
  edad: 24,
  ubicacion: 'San Isidro, Lima',
  distancia: 5,
  bio: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida.',
  fotoPerfil: 'https://i.pravatar.cc/400?img=1',
  isOnline: true,
  isLive: false,
  isVerified: true,
  isPremium: true,
  precioSuscripcion: 140,
  recomendaciones: 472,
  suscriptores: 12400,
  likes: 5700,
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
  
contenidoPremiumFotos: [
  { 
    id: 30, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=30', 
    thumbnail: 'https://picsum.photos/400/400?random=30', 
    isPremium: true, 
    likes: 456, 
    createdAt: '2024-01-10',
    titulo: 'Atardecer en la Playa',
    descripcion: 'Sesión exclusiva en bikini dorado durante el atardecer. Fotografía profesional en alta resolución.'
  },
  { 
    id: 31, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=31', 
    thumbnail: 'https://picsum.photos/400/400?random=31', 
    isPremium: true, 
    likes: 389, 
    createdAt: '2024-01-09',
    titulo: 'Fitness en el Gym',
    descripcion: 'Mi mejor pose después de entrenar. Outfit deportivo completo con leggings rosados.'
  },
  { 
    id: 32, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=32', 
    thumbnail: 'https://picsum.photos/400/400?random=32', 
    isPremium: true, 
    likes: 512, 
    createdAt: '2024-01-08',
    titulo: 'Lencería Elegante',
    descripcion: 'Sesión íntima con conjunto de encaje negro. Iluminación profesional y poses sensuales.'
  },
  { 
    id: 33, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=33', 
    thumbnail: 'https://picsum.photos/400/400?random=33', 
    isPremium: true, 
    likes: 678, 
    createdAt: '2024-01-07',
    titulo: 'Pool Party Vibes',
    descripcion: 'Diversión en la piscina con mis amigas. Bikinis coloridos y mucha onda.'
  },
  { 
    id: 34, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=34', 
    thumbnail: 'https://picsum.photos/400/400?random=34', 
    isPremium: true, 
    likes: 423, 
    createdAt: '2024-01-06',
    titulo: 'Noche de Gala',
    descripcion: 'Vestido rojo elegante en evento exclusivo. Fotos glamorosas y sofisticadas.'
  },
  { 
    id: 35, 
    tipo: 'foto', 
    url: 'https://picsum.photos/400/400?random=35', 
    thumbnail: 'https://picsum.photos/400/400?random=35', 
    isPremium: true, 
    likes: 501, 
    createdAt: '2024-01-05',
    titulo: 'Behind the Scenes',
    descripcion: 'Momentos detrás de cámaras de mi última sesión. Contenido nunca antes visto.'
  },
],

contenidoPremiumVideos: [
  { 
    id: 40, 
    tipo: 'video', 
    url: 'video.mp4', 
    thumbnail: 'https://picsum.photos/400/400?random=40', 
    isPremium: true, 
    likes: 789, 
    createdAt: '2024-01-08', 
    duracion: 180,
    titulo: 'Yoga Matutina Completa',
    descripcion: 'Rutina completa de yoga al amanecer. 30 minutos de ejercicios y estiramientos en la playa.'
  },
  { 
    id: 41, 
    tipo: 'video', 
    url: 'video2.mp4', 
    thumbnail: 'https://picsum.photos/400/400?random=41', 
    isPremium: true, 
    likes: 654, 
    createdAt: '2024-01-07', 
    duracion: 240,
    titulo: 'Baile Sensual',
    descripcion: 'Coreografía exclusiva con música latina. Video completo sin censura.'
  },
  { 
    id: 42, 
    tipo: 'video', 
    url: 'video3.mp4', 
    thumbnail: 'https://picsum.photos/400/400?random=42', 
    isPremium: true, 
    likes: 892, 
    createdAt: '2024-01-06', 
    duracion: 320,
    titulo: 'Día en mi Vida',
    descripcion: 'Acompáñame durante todo un día. Desde que despierto hasta que me duermo. Contenido íntimo y personal.'
  },
],
  
  contenidoComprable: [
    {
      id: 1,
      titulo: 'Pack Playa Verano 2024',
      descripcion: 'Sesión fotográfica exclusiva en la playa. 15 fotos en alta resolución.',
      tipo: 'pack',
      thumbnail: 'https://picsum.photos/400/400?random=50',
      precio: 45,
      cantidadItems: 15,
      cantidadFotos: 12,    // ✅ NUEVO
      cantidadVideos: 3,    // ✅ NUEVO
      isPurchased: false,
      items: [],
      createdAt: '2024-01-12',
    },
    {
      id: 2,
      titulo: 'Video Fitness Rutina Completa',
      descripcion: 'Video completo de mi rutina de gimnasio. 30 minutos en 4K.',
      tipo: 'video',
      thumbnail: 'https://picsum.photos/400/400?random=51',
      precio: 25,
      cantidadItems: 1,
      isPurchased: true,
      items: [],
      createdAt: '2024-01-11',
    },
    {
      id: 3,
      titulo: 'Foto Premium Exclusiva',
      descripcion: 'Una sola foto de mi última sesión profesional en 8K.',
      tipo: 'foto',
      thumbnail: 'https://picsum.photos/400/400?random=52',
      precio: 15,
      cantidadItems: 1,
      isPurchased: false,
      items: [],
      createdAt: '2024-01-10',
    },
  ],  

  estaEnVivo: true,
  fotoBanner: '',
  precioSuscripcionFotos: 80,
  precioSuscripcionVideos: 100,
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <ProfileTopBar
        username={profile.username}
        isVerified={profile.isVerified}
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />

      {/* Layout: Sidebar Left + Content */}
      <div className="flex">
        {/* Left Sidebar - Profile Info */}
        <ProfileSidebarLeft
          profile={profile}
          onInvite={() => console.log('Invitar')}
          onSendMessage={() => console.log('Mensaje')}
          onDonate={() => console.log('Donar')}
          onSubscribe={() => console.log('Premium')}
        />

        {/* Right Content - Photos/Videos Grid */}
        <div className="flex-1">
          <ContentTabsInstagram 
            profile={profile} 
            isSubscribedToPhotos={isSubscribedToPhotos}
            isSubscribedToVideos={isSubscribedToVideos}
          />
        </div>
      </div>
    </div>
  );
};
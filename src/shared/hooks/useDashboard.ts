import { useState, useEffect } from 'react';
import { Creator, TabType, DashboardFilters } from '../types/creator.types';
import { useNavigate } from 'react-router-dom';
import { OnlineCreator } from '../types/creator.types';  

// Mock data - Reemplazar con API real
const mockCreators: Creator[] = [
  {
    id: 1,
    slug: 'maria-rodriguez-a7k3', // ✅ NUEVO
    nombre: 'María Rodriguez',
    username: 'maria_lima',
    edad: 24,
    ubicacion: 'San Isidro, Lima',
    bio: 'Modelo y creadora de contenido. Amante del fitness y viajes.',
    avatar: 'https://i.pravatar.cc/400?img=1',
    coverPhoto: 'https://picsum.photos/1200/400?random=1',
    fotos: 234,
    seguidores: 12500,
    likes: 45600,
    precioSuscripcion: 140,
    precio: 140,
    generoId: 1,
    isOnline: true,
    isVerified: true,
    isFavorite: true,
    fechaRegistro: '2024-12-20',
    intereses: ['Fitness', 'Viajes', 'Fotografía'],
    distancia: 2.5,
    fotoUrl: 'https://i.pravatar.cc/400?img=1',
    isLive: false,
    isPremium: true,
  },
  {
    id: 2,
    slug: 'sofia-lopez-m9x2', // ✅ NUEVO
    nombre: 'Sofia Lopez',
    username: 'sofia_fitness',
    edad: 26,
    ubicacion: 'Miraflores, Lima',
    bio: 'Entrenadora personal certificada. Vida saludable 💪',
    avatar: 'https://i.pravatar.cc/400?img=5',
    coverPhoto: 'https://picsum.photos/1200/400?random=2',
    fotos: 189,
    seguidores: 8900,
    likes: 32100,
    precioSuscripcion: 120,
    precio: 120,
    generoId: 1,
    isOnline: false,
    isVerified: true,
    isFavorite: false,
    fechaRegistro: '2024-12-18',
    intereses: ['Fitness', 'Nutrición', 'Yoga'],
    distancia: 3.8,
    fotoUrl: 'https://i.pravatar.cc/400?img=5',
    isLive: false,
    isPremium: false,
  },
  {
    id: 3,
    slug: 'ana-martinez-p5h8', // ✅ NUEVO
    nombre: 'Ana Martinez',
    username: 'ana_chef',
    edad: 28,
    ubicacion: 'Barranco, Lima',
    bio: 'Chef profesional. Comparto recetas y tips de cocina 👩‍🍳',
    avatar: 'https://i.pravatar.cc/400?img=9',
    coverPhoto: 'https://picsum.photos/1200/400?random=3',
    fotos: 156,
    seguidores: 15200,
    likes: 52300,
    precioSuscripcion: 100,
    precio: 100,
    generoId: 1,
    isOnline: true,
    isVerified: false,
    isFavorite: true,
    fechaRegistro: '2024-12-15',
    intereses: ['Cocina', 'Repostería', 'Viajes'],
    distancia: 5.2,
    fotoUrl: 'https://i.pravatar.cc/400?img=9',
    isLive: true,
    isPremium: false,
  },
  {
    id: 4,
    slug: 'lucia-fernandez-k2w7', // ✅ NUEVO
    nombre: 'Lucia Fernandez',
    username: 'lucia_travel',
    edad: 25,
    ubicacion: 'Cusco',
    bio: 'Viajera empedernida. Explorando el mundo 🌎✈️',
    avatar: 'https://i.pravatar.cc/400?img=10',
    coverPhoto: 'https://picsum.photos/1200/400?random=4',
    fotos: 312,
    seguidores: 22100,
    likes: 78900,
    precioSuscripcion: 150,
    precio: 150,
    generoId: 1,
    isOnline: false,
    isVerified: true,
    isFavorite: false,
    fechaRegistro: '2024-12-10',
    intereses: ['Viajes', 'Fotografía', 'Aventura'],
    distancia: 1050.0,
    fotoUrl: 'https://i.pravatar.cc/400?img=10',
    isLive: false,
    isPremium: true,
  },
  {
    id: 5,
    slug: 'valeria-castro-t8n4', // ✅ NUEVO
    nombre: 'Valeria Castro',
    username: 'vale_art',
    edad: 23,
    ubicacion: 'San Miguel, Lima',
    bio: 'Artista digital y diseñadora. Arte es vida 🎨',
    avatar: 'https://i.pravatar.cc/400?img=23',
    coverPhoto: 'https://picsum.photos/1200/400?random=5',
    fotos: 278,
    seguidores: 18700,
    likes: 61200,
    precioSuscripcion: 130,
    precio: 130,
    generoId: 1,
    isOnline: true,
    isVerified: true,
    isFavorite: true,
    fechaRegistro: '2024-12-25',
    intereses: ['Arte', 'Diseño', 'Ilustración'],
    distancia: 4.1,
    fotoUrl: 'https://i.pravatar.cc/400?img=23',
    isLive: true,
    isPremium: true,
  },
  {
    id: 6,
    slug: 'camila-torres-r3b9', // ✅ NUEVO
    nombre: 'Camila Torres',
    username: 'cami_beauty',
    edad: 27,
    ubicacion: 'Surco, Lima',
    bio: 'Makeup artist profesional. Tips de belleza 💄',
    avatar: 'https://i.pravatar.cc/400?img=27',
    coverPhoto: 'https://picsum.photos/1200/400?random=6',
    fotos: 198,
    seguidores: 13400,
    likes: 48700,
    precioSuscripcion: 110,
    precio: 110,
    generoId: 1,
    isOnline: false,
    isVerified: false,
    isFavorite: false,
    fechaRegistro: '2024-12-22',
    intereses: ['Belleza', 'Maquillaje', 'Moda'],
    distancia: 6.7,
    fotoUrl: 'https://i.pravatar.cc/400?img=27',
    isLive: false,
    isPremium: false,
  },
];

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('descubrir');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Llamar al hook

  const [filters, setFilters] = useState<DashboardFilters>({
    searchQuery: '',
  });

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (activeTab === 'en-vivo') {
        setCreators(mockCreators.filter(c => c.isLive));
      } else {
        setCreators(mockCreators);
      }
      setLoading(false);
    }, 500);
  }, [activeTab, filters]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

const handleCreatorClick = (creator: OnlineCreator) => {
  navigate(`/perfil/${creator.slug}`); // ✅ Usa slug en lugar de id
};

  const handleLike = (id: number) => {
    console.log('Liked creator:', id);
    // Llamar API para dar like
  };

  return {
    activeTab,
    creators,
    loading,
    filters,
    handleTabChange,
    handleCreatorClick,
    handleLike,
    setFilters,
  };
};
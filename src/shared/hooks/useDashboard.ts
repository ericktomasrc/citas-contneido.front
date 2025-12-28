import { useState, useEffect } from 'react';
import { Creator, TabType, DashboardFilters } from '../types/creator.types';

// Mock data - Reemplazar con API real
const mockCreators: Creator[] = [
  {
    id: 1,
    username: 'maria_lima',
    nombre: 'María',
    edad: 24,
    ubicacion: 'San Isidro, Lima',
    distancia: 5,
    fotoUrl: 'https://i.pravatar.cc/400?img=1',
    isLive: true,
    isOnline: true,
    isPremium: true,
    isVerified: true,
    bio: 'Modelo y creadora de contenido. Amante del fitness y viajes.',
    precio: 140,
    likes: 1234,
    generoId: 1,
  },
  // ... agregar más datos mock
];

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('descubrir');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleCreatorClick = (id: number) => {
    console.log('Creator clicked:', id);
    // Navegar al perfil
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
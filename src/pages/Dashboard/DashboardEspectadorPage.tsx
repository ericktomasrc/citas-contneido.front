import { DashboardEspectadorLayout } from './layouts/DashboardEspectadorLayout'; 

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Video, MapPin, UserPlus, Eye } from 'lucide-react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { LiveGrid } from '../../components/Dashboard/CreatorProfile/LiveStream/LiveGrid'; 
import { useDashboard } from '../../shared/hooks/useDashboard';
import { LiveStream } from '../../shared/types/creator-profile.types';
import { Creator } from '@/shared/types/creator.types'; 

const DashboardEspectadorPageContent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState<'descubrir' | 'en-vivo'>('descubrir');
  
  // Estados para infinite scroll
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    creators: initialCreators,
    loading,
    handleLike,
  } = useDashboard(); 

  const [creators, setCreators] = useState<Creator[]>(initialCreators);

  // Sincronizar creators iniciales
  useEffect(() => {
    setCreators(initialCreators);
  }, [initialCreators]); 

  const mockLives: LiveStream[] = [
    {
      id: 1,
      creatorId: 1,
      creatorName: 'María Rodriguez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=1',
      titulo: 'Yoga Matutina 🧘‍♀️ Rutina Completa',
      descripcion: 'Relájate y estira todo tu cuerpo',
      tipo: 'publico',
      thumbnailUrl: 'https://picsum.photos/640/360?random=1',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 234,
      likes: 456,
      totalEarnings: 890,
      startedAt: new Date(),
      slug: 'yoga-matutina-rutina-completa',
    },
    {
      id: 2,
      creatorId: 2,
      creatorName: 'Sofia Lopez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=5',
      titulo: 'Baile Sensual 💃 Coreografía Nueva',
      descripcion: 'Aprende pasos de bachata',
      tipo: 'premium',
      precioEntrada: 25,
      thumbnailUrl: 'https://picsum.photos/640/360?random=2',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 567,
      likes: 823,
      totalEarnings: 1250,
      startedAt: new Date(),
      slug: 'baile-sensual-coreografia-nueva',
    },
    {
      id: 3,
      creatorId: 3,
      creatorName: 'Ana Martinez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=9',
      titulo: 'Cocina Saludable 🥗 Recetas Fit',
      descripcion: 'Preparando smoothie bowl',
      tipo: 'publico',
      thumbnailUrl: 'https://picsum.photos/640/360?random=3',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 189,
      likes: 312,
      totalEarnings: 450,
      startedAt: new Date(),
      slug: 'cocina-saludable-recetas-fit',
    },
    {
      id: 4,
      creatorId: 4,
      creatorName: 'Lucia Fernandez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=10',
      titulo: 'Sesión de Fotos BTS 📸',
      descripcion: 'Behind the scenes exclusivo',
      tipo: 'premium',
      precioEntrada: 35,
      thumbnailUrl: 'https://picsum.photos/640/360?random=4',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 412,
      likes: 678,
      totalEarnings: 980,
      startedAt: new Date(),
      slug: 'sesion-de-fotos-bts',
    },
    {
      id: 5,
      creatorId: 5,
      creatorName: 'Valeria Castro',
      creatorPhoto: 'https://i.pravatar.cc/400?img=23',
      titulo: 'Charlemos 💬 Q&A con Fans',
      descripcion: 'Respondo todas tus preguntas',
      tipo: 'publico',
      thumbnailUrl: 'https://picsum.photos/640/360?random=5',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 345,
      likes: 534,
      totalEarnings: 670,
      startedAt: new Date(),
      slug: 'charlemos-qa-con-fans',
    },
    {
      id: 6,
      creatorId: 6,
      creatorName: 'Camila Torres',
      creatorPhoto: 'https://i.pravatar.cc/400?img=27',
      titulo: 'Maquillaje Profesional 💄',
      descripcion: 'Tutorial completo paso a paso',
      tipo: 'premium',
      precioEntrada: 20,
      thumbnailUrl: 'https://picsum.photos/640/360?random=6',
      streamUrl: 'stream-url',
      isLive: true,
      viewers: 678,
      likes: 891,
      totalEarnings: 1340,
      startedAt: new Date(),
      slug: 'maquillaje-profesional',
    },
  ];

  const tabs = [
    { id: 'descubrir' as const, label: 'Descubrir', icon: Heart },
    { id: 'en-vivo' as const, label: 'En Vivo', icon: Video },
  ];

  // Función para navegar al perfil
  const handleVerPerfil = (creator: Creator) => {
    if (creator.slug) {
      navigate(`/creadora/${creator.slug}`);
    }
  };

  // Función para invitar
  const handleInvitar = (creatorId: number) => {
    console.log('💌 Invitando a creadora:', creatorId);
    // TODO: Conectar con backend
    // await fetch(`/api/invitaciones`, { method: 'POST', body: JSON.stringify({ creatorId }) });
  };

  // Función para cargar más contenido
  const loadMoreCreators = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    console.log('📥 Cargando más creadoras... Página:', page + 1);
    
    // Simular llamada al API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Aquí iría la llamada real al backend
    // const response = await fetch(`/api/creators?page=${page + 1}&limit=12`);
    // const newCreators = await response.json();
    
    // Simulación: duplicar creators existentes con nuevos IDs
    const newCreators = initialCreators.slice(0, 6).map((creator, index) => ({
      ...creator,
      id: creator.id + (page * 100) + index,
      nombre: `${creator.nombre} ${page + 1}`,
    }));

    if (newCreators.length === 0 || page >= 5) { // Limitar a 5 páginas en demo
      setHasMore(false);
    } else {
      setCreators(prev => [...prev, ...newCreators]);
      setPage(prev => prev + 1);
    }
    
    setIsLoadingMore(false);
  }, [page, isLoadingMore, hasMore, initialCreators]);

  // Intersection Observer para infinite scroll automático
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore && activeTab === 'descubrir') {
          loadMoreCreators();
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
  }, [loadMoreCreators, isLoadingMore, hasMore, activeTab]);

  // Reset page cuando cambia de tab
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setCreators(initialCreators);
  }, [activeTab, initialCreators]);

  return (
    <>
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      /> 
      
      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 pr-0 lg:pr-24 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap
                    ${isActive 
                      ? 'text-pink-600' 
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-6">
            {activeTab === 'descubrir' && (
              <>
                {/* Grid de Creadoras */}
                {creators.length === 0 && !loading ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
                      <Heart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No hay creadoras disponibles
                    </h3>
                    <p className="text-sm text-slate-500">
                      Vuelve más tarde para ver nuevos perfiles
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {creators.map((creator) => (
                        <div
                          key={creator.id}
                          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-300 transition-all overflow-hidden group shadow-sm hover:shadow-md"
                        >
                          {/* Avatar */}
                          <div 
                            className="relative aspect-[3/4] bg-slate-100 cursor-pointer"
                            onClick={() => handleVerPerfil(creator)}
                          >
                            <img
                              src={creator.avatar}
                              alt={creator.nombre}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Badge de Live */}
                            {creator.isLive && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                EN VIVO
                              </div>
                            )}

                            {/* Badge Verificado */}
                            {creator.isVerified && (
                              <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Info sobre la foto */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white font-bold text-lg mb-0.5">
                                {creator.nombre}
                              </h3>
                              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span>{creator.ubicacion || 'Lima, Perú'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Botones de Acción */}
                          <div className="p-3 space-y-2">
                            {/* Botón Ver Perfil */}
                            <button
                              onClick={() => handleVerPerfil(creator)}
                              className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Perfil
                            </button>
                            
                            {/* Botón Invitar */}
                            <button
                              onClick={() => handleInvitar(creator.id)}
                              className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              Invitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Loading indicator para infinite scroll */}
                    {isLoadingMore && (
                      <div className="text-center py-8 mt-6">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <div className="w-5 h-5 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium text-slate-600">Cargando más creadoras...</span>
                        </div>
                      </div>
                    )}

                    {/* Observer target para infinite scroll */}
                    <div 
                      ref={observerTarget} 
                      className="h-20 flex items-center justify-center mt-4"
                    >
                      {!isLoadingMore && hasMore && creators.length > 0 && (
                        <p className="text-xs text-slate-400">Cargando más contenido automáticamente...</p>
                      )}
                      
                      {!hasMore && creators.length > 0 && (
                        <p className="text-xs text-slate-500">Has llegado al final</p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'en-vivo' && (
              <div>
                <div className="mb-6">
                  <p className="text-sm text-slate-600">
                    {mockLives.length} creadoras transmitiendo ahora
                  </p>
                </div>
                <LiveGrid lives={mockLives} userPurchasedLives={[]} />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

// ⚠️ IMPORTANTE: Aquí estaba el error - faltaba el return
export const DashboardEspectadorPage = () => (
  <DashboardEspectadorLayout>
    <DashboardEspectadorPageContent />
  </DashboardEspectadorLayout>
);

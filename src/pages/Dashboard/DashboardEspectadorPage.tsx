import { useState } from 'react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { TabsNavigation } from '../../components/Dashboard/Tabs/TabsNavigation';
import { OnlineCreatorsCarousel } from '../../components/Dashboard/OnlineCreators/OnlineCreatorsCarousel';
import { CreatorGrid } from '../../components/Dashboard/CreatorCard/CreatorGrid';
import { LiveGrid } from '../../components/Dashboard/CreatorProfile/LiveStream/LiveGrid'; 
import { useDashboard } from '../../shared/hooks/useDashboard';
import { LiveStream } from '../../shared/types/creator-profile.types';  
import { OnlineCreator } from '@/shared/types/creator.types';
import { OnlineCreatorsSidebar } from '@/components/Dashboard/OnlineCreators/OnlineCreatorsSidebar';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

export const DashboardEspectadorPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [quickFilter, setQuickFilter] = useState<'favoritas' | 'nuevas' | 'sugeridas' | null>(null);

  const {
    activeTab,
    creators,
    loading,
    handleTabChange,
    handleCreatorClick,
    handleLike,
  } = useDashboard();

  // Mock data - Creadoras en línea
  const onlineCreators: OnlineCreatorExtended[] = [
    { id: 1, slug: 'maria-rodriguez-a7k3', nombre: 'Chelsea', edad: 24, avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, isFavorite: true },
    { id: 2, slug: 'amanda-garcia-b9d2', nombre: 'Amanda', edad: 26, avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, isFavorite: false },
    { id: 3, slug: 'chloe-martin-c4f7', nombre: 'Chloe', edad: 22, avatar: 'https://i.pravatar.cc/150?img=3', isLive: true, isFavorite: false },
    { id: 4, slug: 'leslie-hall-e8k1', nombre: 'Leslie', edad: 28, avatar: 'https://i.pravatar.cc/150?img=4', isLive: false, isFavorite: true },
    { id: 5, slug: 'maria-lopez-d3j9', nombre: 'María', edad: 25, avatar: 'https://i.pravatar.cc/150?img=5', isLive: false, isFavorite: false },
    { id: 6, slug: 'ana-martinez-f6l4', nombre: 'Ana', edad: 27, avatar: 'https://i.pravatar.cc/150?img=6', isLive: true, isFavorite: true },
    { id: 7, slug: 'sofia-gonzalez-h7k2', nombre: 'Sofía', edad: 23, avatar: 'https://i.pravatar.cc/150?img=7', isLive: false, isFavorite: false },
    { id: 8, slug: 'lucia-morales-j9l8', nombre: 'Lucía', edad: 29, avatar: 'https://i.pravatar.cc/150?img=8', isLive: false, isFavorite: true },
    { id: 9, slug: 'valeria-castro-t8n4', nombre: 'Valeria', edad: 24, avatar: 'https://i.pravatar.cc/150?img=9', isLive: true, isFavorite: false },
    { id: 10, slug: 'camila-torres-r3b9', nombre: 'Camila', edad: 26, avatar: 'https://i.pravatar.cc/150?img=10', isLive: false, isFavorite: true },
    { id: 11, slug: 'daniela-ruiz-w5p3', nombre: 'Daniela', edad: 25, avatar: 'https://i.pravatar.cc/150?img=11', isLive: true, isFavorite: false },
    { id: 12, slug: 'andrea-silva-q7m8', nombre: 'Andrea', edad: 28, avatar: 'https://i.pravatar.cc/150?img=12', isLive: false, isFavorite: false },
  ];

  //   NUEVO - Mock data de Lives
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

  // Filtrar creators según quick filter
const filteredCreators = quickFilter
  ? creators.filter(c => {
      if (quickFilter === 'favoritas') {
        return c.isFavorite; // Mostrar solo favoritas
      }
      if (quickFilter === 'nuevas') {
        const dias = Math.floor((Date.now() - new Date(c.fechaRegistro || 0).getTime()) / (1000 * 60 * 60 * 24));
        return dias <= 7;
      }
      if (quickFilter === 'sugeridas') {
        return c.isVerified && c.likes > 1000; // O tu lógica de sugeridas
      }
      return true;
    })
  : creators;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      {/* Sidebar */}
      <SidebarDashboard
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <OnlineCreatorsSidebar creators={onlineCreators} />
      {/* Main Content */}
      <main className="pt-16 lg:pl-64 pr-24 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8"> 

          {/* Tabs + Quick Filters */}
          <div className="mb-6">
            <TabsNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              activeQuickFilter={quickFilter}
              onQuickFilterChange={setQuickFilter}
            />
          </div>

          {/*   CONDICIONAL SEGÚN TAB ACTIVO */}
          {activeTab === 'descubrir' && (
            <>
              {/* Online Creators Carousel */}
              {/* <OnlineCreatorsCarousel
                creators={onlineCreators}
                onCreatorClick={handleCreatorClick}
              /> */}

              {/* Grid */}
              <CreatorGrid
                creators={filteredCreators}
                loading={loading}
                onCreatorClick={handleCreatorClick}
                onLike={handleLike}
              />

              {/* Load More */}
              {!loading && filteredCreators.length > 0 && (
                <div className="text-center mt-8">
                  <button className="px-8 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-pink-500 hover:text-pink-600 transition">
                    Cargar más
                  </button>
                </div>
              )}
            </>
          )}

          {/*  NUEVO - SECCIÓN EN VIVO */}
          {activeTab === 'en-vivo' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-gray-900 text-3xl font-bold mb-2">
                    Transmisiones en Vivo
                  </h4>
                  <p className="text-gray-600">
                    {mockLives.length} creadoras transmitiendo ahora
                  </p>
                </div>
              </div>
              <LiveGrid lives={mockLives} userPurchasedLives={[]} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
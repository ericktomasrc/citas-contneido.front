import { useState, useEffect } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Crown, Users, Activity } from 'lucide-react';
import { NavbarCreadora } from '../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { StatsCards } from '../../components/DashboardCreadora/StatsCards/StatsCards';
import { InvitacionesCarousel } from '../../components/DashboardCreadora/Invitaciones/InvitacionesCarousel'; 
import { MiActividadTab } from '../../components/DashboardCreadora/Tabs/Inicio/MiActividadTab';
import { ContenidoPage } from '../DashboardCreadora/ContenidoPage/ContenidoPage';
import { PacksPage } from './PacksPage/PacksPage';
import { OnlineCreator } from '@/shared/types/creator.types';
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';
type SubTabType = 'invitaciones' | 'resumen' | 'miactividad';

export const DashboardCreadoraPagebBKB = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const tabFromUrl = (searchParams.get('tab') as TabType) || 'resumen';
  const subTabFromUrl = (searchParams.get('subtab') as SubTabType) || 'invitaciones';
  
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(subTabFromUrl);

  useEffect(() => {
    const params: Record<string, string> = { tab: activeTab };
    
    if (activeTab === 'resumen' || activeTab === 'invitaciones') {
      params.subtab = activeSubTab;
    }
    
    setSearchParams(params, { replace: true });
  }, [activeTab, activeSubTab, setSearchParams]);

  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    gananciasMes: 2450,
  };

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

  const [invitaciones] = useState([
    { id: 1, slug: 'juan-perez-x7m3', nombre: 'Juan', edad: 28, ubicacion: 'San Isidro, Lima', distancia: 2.3, avatar: 'https://i.pravatar.cc/150?img=12', isLive: false, isFavorite: false, fechaInvitacion: '2025-01-02' },
    { id: 2, slug: 'carlos-gomez-k9p2', nombre: 'Carlos', edad: 32, ubicacion: 'Miraflores, Lima', distancia: 4.1, avatar: 'https://i.pravatar.cc/150?img=13', isLive: true, isFavorite: false, fechaInvitacion: '2025-01-01' },
    { id: 3, slug: 'diego-torres-a4n8', nombre: 'Diego', edad: 25, ubicacion: 'Barranco, Lima', distancia: 5.8, avatar: 'https://i.pravatar.cc/150?img=14', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-31' },
    { id: 4, slug: 'miguel-santos-b6q1', nombre: 'Miguel', edad: 30, ubicacion: 'Surco, Lima', distancia: 7.2, avatar: 'https://i.pravatar.cc/150?img=15', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-30' },
    { id: 5, slug: 'alejandro-ruiz-c2r7', nombre: 'Alejandro', edad: 27, ubicacion: 'San Miguel, Lima', distancia: 3.5, avatar: 'https://i.pravatar.cc/150?img=16', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-29' },
    { id: 6, slug: 'andres-morales-d8t4', nombre: 'Andrés', edad: 29, ubicacion: 'Lince, Lima', distancia: 6.0, avatar: 'https://i.pravatar.cc/150?img=17', isLive: true, isFavorite: false, fechaInvitacion: '2024-12-28' },
    { id: 7, slug: 'luis-castro-e3w9', nombre: 'Luis', edad: 31, ubicacion: 'Jesús María, Lima', distancia: 4.7, avatar: 'https://i.pravatar.cc/150?img=18', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-27' },
    { id: 8, slug: 'roberto-vargas-f5y6', nombre: 'Roberto', edad: 26, ubicacion: 'La Molina, Lima', distancia: 8.9, avatar: 'https://i.pravatar.cc/150?img=19', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-26' },
    { id: 9, slug: 'fernando-diaz-g1h5', nombre: 'Fernando', edad: 33, ubicacion: 'San Borja, Lima', distancia: 5.3, avatar: 'https://i.pravatar.cc/150?img=20', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-25' },
    { id: 10, slug: 'ricardo-flores-h9j2', nombre: 'Ricardo', edad: 24, ubicacion: 'Pueblo Libre, Lima', distancia: 6.8, avatar: 'https://i.pravatar.cc/150?img=21', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-24' },
    { id: 11, slug: 'eduardo-chavez-i3k7', nombre: 'Eduardo', edad: 35, ubicacion: 'Magdalena, Lima', distancia: 7.5, avatar: 'https://i.pravatar.cc/150?img=22', isLive: true, isFavorite: false, fechaInvitacion: '2024-12-23' },
    { id: 12, slug: 'pablo-ramirez-j8l4', nombre: 'Pablo', edad: 29, ubicacion: 'Breña, Lima', distancia: 4.2, avatar: 'https://i.pravatar.cc/150?img=23', isLive: false, isFavorite: false, fechaInvitacion: '2024-12-22' },
  ]);

  const subTabs = [
    { id: 'invitaciones' as const, label: 'Invitaciones', icon: Users },
    { id: 'resumen' as const, label: 'Resumen', icon: TrendingUp },
    { id: 'miactividad' as const, label: 'Mi Actividad', icon: Activity },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'invitaciones') {
      setActiveSubTab('invitaciones');
    } else if (tab === 'resumen') {
      setActiveSubTab('invitaciones');
    }
  };

  const handleSubTabChange = (tab: string) => {
    if (tab === 'invitaciones' || tab === 'resumen' || tab === 'miactividad') {
      setActiveSubTab(tab as SubTabType);
    }
  };

  const handleProgramarEvento = () => {
    console.log('Programar evento');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <OnlineCreatorsSidebar creators={onlineCreators} />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 pr-0 lg:pr-24 overflow-hidden flex flex-col">
        {/* Header Fijo con Tabs */}
        {(activeTab === 'resumen' || activeTab === 'invitaciones') && (
          <div className="flex-shrink-0 bg-white border-b border-slate-200">
            <div className="flex border-b border-slate-200 px-6 overflow-x-auto">
              {subTabs.map((tab) => {
                const isActive = activeSubTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSubTabChange(tab.id)}
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
        )}

        {/* Header solo para Contenido */}
        {activeTab === 'contenido' && (
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-pink-500" />
              <h1 className="text-xl font-bold text-slate-800">Contenido</h1>
            </div>
          </div>
        )}

        {/* Header solo para Packs */}
        {activeTab === 'packs' && (
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet-500" />
              <h1 className="text-xl font-bold text-slate-800">Packs</h1>
            </div>
          </div>
        )}
        
        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-6">
            {activeTab === 'resumen' || activeTab === 'invitaciones' ? (
              <>
                {activeSubTab === 'invitaciones' && (
                  <div> 
                    {/* <InvitacionesFilters /> */}
                    <InvitacionesCarousel invitaciones={invitaciones} />
                  </div>
                )}

                {activeSubTab === 'resumen' && (
                  <>
                    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">
                          ¡Hola {currentUser.nombre}! 👋
                        </h2>
                        <p className="text-sm text-slate-600">
                          Aquí tienes un resumen de tu actividad
                        </p>
                      </div>

                      <div className="hidden md:block">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
                          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-emerald-700 font-medium">Ganancias este mes</p>
                            <p className="text-xl font-bold text-emerald-900">
                              S/. {currentUser.gananciasMes.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <StatsCards />

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                        <h3 className="text-base font-bold text-slate-800 mb-4">
                          Actividad Reciente
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-600 font-bold text-sm">+</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                Nueva suscripción
                              </p>
                              <p className="text-xs text-slate-500">Hace 2 horas</p>
                            </div>
                            <span className="text-emerald-600 font-bold text-sm">+S/. 140</span>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">🎁</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                Regalo recibido
                              </p>
                              <p className="text-xs text-slate-500">Hace 5 horas</p>
                            </div>
                            <span className="text-purple-600 font-bold text-sm">+S/. 50</span>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">📦</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                Pack vendido
                              </p>
                              <p className="text-xs text-slate-500">Hace 1 día</p>
                            </div>
                            <span className="text-blue-600 font-bold text-sm">+S/. 80</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                        <h3 className="text-base font-bold text-slate-800 mb-4">
                          Próximos Lives
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              <span className="text-xs font-bold text-red-600">PROGRAMADO</span>
                            </div>
                            <p className="font-semibold text-slate-900 text-sm">Yoga Matutina</p>
                            <p className="text-xs text-slate-600 mt-0.5">Hoy a las 10:00 AM</p>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 text-center">
                              No tienes más lives programados
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeSubTab === 'miactividad' && (
                  <MiActividadTab onProgramarEvento={handleProgramarEvento} />
                )}
              </>
            ) : (
              <div>
                {activeTab === 'contenido' && <ContenidoPage />}
                {activeTab === 'packs' && <PacksPage />}
                {activeTab === 'mensajes' && (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-bold text-slate-800">Mensajes</h2>
                    <p className="text-sm text-slate-600 mt-2">Próximamente</p>
                  </div>
                )}
                {activeTab === 'donaciones' && (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-bold text-slate-800">Donaciones</h2>
                    <p className="text-sm text-slate-600 mt-2">Próximamente</p>
                  </div>
                )}
                {activeTab === 'configuracion' && (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-bold text-slate-800">Configuración</h2>
                    <p className="text-sm text-slate-600 mt-2">Próximamente</p>
                  </div>
                )}
                {activeTab === 'reportes' && (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-bold text-slate-800">Reportes y Estadísticas</h2>
                    <p className="text-sm text-slate-600 mt-2">Próximamente</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

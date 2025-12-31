import { useState } from 'react';
import { NavbarCreadora } from '../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { TabsNavigationCreadora } from '../../components/DashboardCreadora/Tabs/TabsNavigationCreadora';
import { StatsCards } from '../../components/DashboardCreadora/StatsCards/StatsCards';
import { InvitacionesCarousel } from '../../components/DashboardCreadora/Invitaciones/InvitacionesCarousel';
import { OnlineCreator } from '@/shared/types/creator.types';

type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';
type SubTabType = 'invitaciones' | 'resumen';

export const DashboardCreadoraPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('resumen');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('invitaciones'); // ✅ CAMBIO: Empieza en invitaciones

  // Mock user data
  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    gananciasMes: 2450,
  };

  // ✅ Mock data - Usuarios interesados (invitaciones)
const invitaciones = [
  { 
    id: 1, 
    slug: 'juan-perez-x7m3', 
    nombre: 'Juan', 
    edad: 28, // ✅ NUEVO
    ubicacion: 'San Isidro, Lima', // ✅ NUEVO
    distancia: 2.3, // ✅ NUEVO
    avatar: 'https://i.pravatar.cc/150?img=12', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 2, 
    slug: 'carlos-gomez-k9p2', 
    nombre: 'Carlos', 
    edad: 32, 
    ubicacion: 'Miraflores, Lima', 
    distancia: 4.1, 
    avatar: 'https://i.pravatar.cc/150?img=13', 
    isLive: true, 
    isFavorite: false 
  },
  { 
    id: 3, 
    slug: 'diego-torres-a4n8', 
    nombre: 'Diego', 
    edad: 25, 
    ubicacion: 'Barranco, Lima', 
    distancia: 5.8, 
    avatar: 'https://i.pravatar.cc/150?img=14', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 4, 
    slug: 'miguel-santos-b6q1', 
    nombre: 'Miguel', 
    edad: 30, 
    ubicacion: 'Surco, Lima', 
    distancia: 7.2, 
    avatar: 'https://i.pravatar.cc/150?img=15', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 5, 
    slug: 'alejandro-ruiz-c2r7', 
    nombre: 'Alejandro', 
    edad: 27, 
    ubicacion: 'San Miguel, Lima', 
    distancia: 3.5, 
    avatar: 'https://i.pravatar.cc/150?img=16', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 6, 
    slug: 'andres-morales-d8t4', 
    nombre: 'Andrés', 
    edad: 29, 
    ubicacion: 'Lince, Lima', 
    distancia: 6.0, 
    avatar: 'https://i.pravatar.cc/150?img=17', 
    isLive: true, 
    isFavorite: false 
  },
  { 
    id: 7, 
    slug: 'luis-castro-e3w9', 
    nombre: 'Luis', 
    edad: 31, 
    ubicacion: 'Jesús María, Lima', 
    distancia: 4.7, 
    avatar: 'https://i.pravatar.cc/150?img=18', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 8, 
    slug: 'roberto-vargas-f5y6', 
    nombre: 'Roberto', 
    edad: 26, 
    ubicacion: 'La Molina, Lima', 
    distancia: 8.9, 
    avatar: 'https://i.pravatar.cc/150?img=19', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 9, 
    slug: 'fernando-diaz-g1h5', 
    nombre: 'Fernando', 
    edad: 33, 
    ubicacion: 'San Borja, Lima', 
    distancia: 5.3, 
    avatar: 'https://i.pravatar.cc/150?img=20', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 10, 
    slug: 'ricardo-flores-h9j2', 
    nombre: 'Ricardo', 
    edad: 24, 
    ubicacion: 'Pueblo Libre, Lima', 
    distancia: 6.8, 
    avatar: 'https://i.pravatar.cc/150?img=21', 
    isLive: false, 
    isFavorite: false 
  },
  { 
    id: 11, 
    slug: 'eduardo-chavez-i3k7', 
    nombre: 'Eduardo', 
    edad: 35, 
    ubicacion: 'Magdalena, Lima', 
    distancia: 7.5, 
    avatar: 'https://i.pravatar.cc/150?img=22', 
    isLive: true, 
    isFavorite: false 
  },
  { 
    id: 12, 
    slug: 'pablo-ramirez-j8l4', 
    nombre: 'Pablo', 
    edad: 29, 
    ubicacion: 'Breña, Lima', 
    distancia: 4.2, 
    avatar: 'https://i.pravatar.cc/150?img=23', 
    isLive: false, 
    isFavorite: false 
  },
];

  // Cambiar sub-tab cuando se hace click en "Invitaciones" del sidebar
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'invitaciones') {
      setActiveSubTab('invitaciones');
    } else if (tab === 'resumen') {
      setActiveSubTab('invitaciones'); // Por defecto empieza en invitaciones
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* TABS INVITACIONES/RESUMEN - Solo en tab "resumen" o "invitaciones" */}
          {(activeTab === 'resumen' || activeTab === 'invitaciones') && (
            <TabsNavigationCreadora
              activeTab={activeSubTab}
              onTabChange={setActiveSubTab}
            />
          )}

          {/* Contenido según sub-tab activo */}
          {activeTab === 'resumen' || activeTab === 'invitaciones' ? (
            <>
              {/* TAB INVITACIONES */}
              {activeSubTab === 'invitaciones' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Usuarios Interesados
                    </h3>
                    <p className="text-gray-600">
                      {invitaciones.length} usuarios han enviado invitaciones
                    </p>
                  </div>

                  <InvitacionesCarousel invitaciones={invitaciones} />
                </div>
              )}
              

              {/* TAB RESUMEN */}
              {activeSubTab === 'resumen' && (
                <>
                  {/* ✅ Header con Ganancias del Mes */}
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Hola {currentUser.nombre}! 👋
                      </h3>
                      <p className="text-gray-600">
                        Aquí tienes un resumen de tu actividad
                      </p>
                    </div>

                    {/* ✅ GANANCIAS DEL MES - AQUÍ */}
                    <div className="hidden md:block">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-medium">Ganancias este mes</p>
                          <p className="text-2xl font-bold text-green-900">S/. {currentUser.gananciasMes.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <StatsCards />

                  {/* Actividad Reciente y Próximos Lives */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Actividad Reciente
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">+</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Nueva suscripción</p>
                            <p className="text-xs text-gray-500">Hace 2 horas</p>
                          </div>
                          <span className="text-green-600 font-bold">+S/. 140</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">🎁</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Regalo recibido</p>
                            <p className="text-xs text-gray-500">Hace 5 horas</p>
                          </div>
                          <span className="text-purple-600 font-bold">+S/. 50</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">📦</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Pack vendido</p>
                            <p className="text-xs text-gray-500">Hace 1 día</p>
                          </div>
                          <span className="text-blue-600 font-bold">+S/. 80</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Próximos Lives
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-red-600">PROGRAMADO</span>
                          </div>
                          <p className="font-medium text-gray-900">Yoga Matutina</p>
                          <p className="text-sm text-gray-600">Hoy a las 10:00 AM</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 text-center">
                            No tienes más lives programados
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            /* Otros tabs del sidebar */
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'contenido' && 'Gestionar Contenido'}
                {activeTab === 'packs' && 'Mis Packs'}
                {activeTab === 'envivo' && 'Transmisiones en Vivo'}
                {activeTab === 'mensajes' && 'Mensajes'}
                {activeTab === 'donaciones' && 'Donaciones'}
                {activeTab === 'configuracion' && 'Configuración'}
                {activeTab === 'reportes' && 'Reportes y Estadísticas'}
              </h2>
              <p className="text-gray-600">Próximamente...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
// src/pages/DashboardCreadora/DashboardCreadoraPage.tsx
// ✅ SOLUCIÓN 1: PERSISTIR TAB EN URL

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, Settings, MessageCircle } from 'lucide-react';
import { NavbarCreadora } from '../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { ContenidoPage } from '../DashboardCreadora/ContenidoPage/ContenidoPage';
import { PacksPage } from './PacksPage/PacksPage';
import { OnlineCreator } from '@/shared/types/creator.types';
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';

// 🔥 Importar componentes del chat
import { FloatingChatModal } from '@/features/chat/components/FloatingChat/FloatingChatModal';
import { QuickSettingsPanel } from '@/features/chat/components/Settings/QuickSettingsPanel';

// Importar tabs
import { InvitacionesTab } from './tabs/InvitacionesTab/InvitacionesTab';
import { ResumenTab } from './tabs/ResumenTab/ResumenTab';
import { MiActividadTab } from '../../components/DashboardCreadora/Tabs/Inicio/MiActividadTab';

// Componentes
import { SubTabsHeader } from './components/SubTabsHeader';
import { PageHeader } from './components/PageHeader';

// Configuración y datos
import { subTabsConfig } from './config/subtabs.config';
import { invitacionesIniciales } from './data/invitaciones.data';

// Tipos
type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';
type SubTabId = 'resumen' | 'invitaciones' | 'miactividad';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

export const DashboardCreadoraPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ✅ SOLUCIÓN: Usar URL params para persistir el tab
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Leer tab de la URL, si no existe usar 'resumen'
  const tabFromUrl = (searchParams.get('tab') as TabType) || 'resumen';
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);
  
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('resumen');

  // Estados para el chat
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatRecipient, setChatRecipient] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // ✅ SOLUCIÓN: Actualizar URL cuando cambia el tab
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // ✅ SOLUCIÓN: Sincronizar tab cuando cambia la URL (botón atrás/adelante)
  useEffect(() => {
    const urlTab = searchParams.get('tab') as TabType;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  // Usuario actual
  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    gananciasMes: 2450,
  };

  // Mock de suscriptores
  const subscribersWithMessages = [
    { id: '1', nombre: 'Juan Pérez', avatar: 'https://i.pravatar.cc/150?img=11', lastMessage: 'Hola! ¿Cómo estás?', unreadCount: 3 },
    { id: '2', nombre: 'Carlos López', avatar: 'https://i.pravatar.cc/150?img=12', lastMessage: '¿Disponible para videollamada?', unreadCount: 1 },
    { id: '3', nombre: 'Miguel Torres', avatar: 'https://i.pravatar.cc/150?img=13', lastMessage: 'Gracias por el contenido!', unreadCount: 0 },
    { id: '4', nombre: 'Pedro Sánchez', avatar: 'https://i.pravatar.cc/150?img=14', lastMessage: 'Me encanta tu perfil 💕', unreadCount: 2 },
  ];

  // Creadores online
  const onlineCreators: OnlineCreatorExtended[] = [
    { id: 1, slug: 'maria-rodriguez-a7k3', nombre: 'Chelsea', edad: 24, avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, isFavorite: true },
    { id: 2, slug: 'amanda-garcia-b9d2', nombre: 'Amanda', edad: 26, avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, isFavorite: false },
    { id: 3, slug: 'chloe-martin-c4f7', nombre: 'Chloe', edad: 22, avatar: 'https://i.pravatar.cc/150?img=3', isLive: true, isFavorite: false },
  ];

  // Funciones del chat
  const handleOpenChat = (subscriberId: string, subscriberName: string, subscriberAvatar: string) => {
    console.log('💬 Abriendo chat con:', subscriberName);
    setActiveChatId(subscriberId);
    setChatRecipient({
      id: subscriberId,
      name: subscriberName,
      avatar: subscriberAvatar,
    });
  };

  const handleCloseChat = () => {
    setActiveChatId(null);
    setChatRecipient(null);
  };

  const handleProgramarEvento = () => {
    console.log('Programar evento');
  };

  const handleSubTabChange = (tabId: string) => {
    setActiveSubTab(tabId as SubTabId);
  };

  const showSubTabs = activeTab === 'resumen';

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 pr-0 lg:pr-24 overflow-hidden flex flex-col">
        {/* Header */}
        {showSubTabs ? (
          <SubTabsHeader
            tabs={subTabsConfig}
            activeTab={activeSubTab}
            onTabChange={handleSubTabChange}
          />
        ) : (
          <>
            {activeTab === 'contenido' && (
              <PageHeader icon={Crown} title="Contenido" iconColor="text-pink-500" />
            )}
            {activeTab === 'packs' && (
              <PageHeader icon={Crown} title="Packs" iconColor="text-violet-500" />
            )}
            {activeTab === 'mensajes' && (
              <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-pink-600" />
                      Mensajes
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      {subscribersWithMessages.filter(s => s.unreadCount > 0).length} conversaciones sin leer
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-violet-600 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 border border-violet-200"
                  >
                    <Settings className="w-4 h-4" />
                    Configurar Chat
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-6">
            {showSubTabs && (
              <>
                {activeSubTab === 'invitaciones' && (
                  <InvitacionesTab
                    invitacionesIniciales={invitacionesIniciales}
                    enabled={activeSubTab === 'invitaciones'}
                  />
                )}

                {activeSubTab === 'resumen' && (
                  <ResumenTab
                    nombreUsuario={currentUser.nombre}
                    gananciasMes={currentUser.gananciasMes}
                  />
                )}

                {activeSubTab === 'miactividad' && (
                  <MiActividadTab onProgramarEvento={handleProgramarEvento} />
                )}
              </>
            )}

            {activeTab === 'mensajes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscribersWithMessages.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-300 transition-all p-5 cursor-pointer group"
                    onClick={() => handleOpenChat(subscriber.id, subscriber.nombre, subscriber.avatar)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={subscriber.avatar}
                          alt={subscriber.nombre}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-violet-200 transition"
                        />
                        {subscriber.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                            {subscriber.unreadCount}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-violet-600 transition">
                          {subscriber.nombre}
                        </h3>
                        <p className="text-sm text-slate-500 truncate mt-0.5">
                          {subscriber.lastMessage}
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenChat(subscriber.id, subscriber.nombre, subscriber.avatar);
                          }}
                          className="mt-3 px-4 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-600 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 border border-pink-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Abrir Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {subscribersWithMessages.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
                      <MessageCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No hay mensajes aún
                    </h3>
                    <p className="text-sm text-slate-500">
                      Los suscriptores podrán enviarte mensajes desde tu perfil
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showSubTabs && activeTab !== 'mensajes' && (
              <>
                {activeTab === 'contenido' && <ContenidoPage />}
                {activeTab === 'packs' && <PacksPage />}
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
              </>
            )}
          </div>
        </div>
      </main>

      {/* <OnlineCreatorsSidebar creators={onlineCreators} /> */}

      {/* Modales del chat */}
      {activeChatId && chatRecipient && (
        <FloatingChatModal
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          recipientAvatar={chatRecipient.avatar}
          isOnline={true}
          onClose={handleCloseChat}
        />
      )}

      {showSettings && (
        <QuickSettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

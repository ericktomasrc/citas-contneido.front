// src/pages/DashboardCreadora/DashboardCreadoraPage.tsx
// ✅ MEJORADO: Ajustado para navbar h-14 y sidebar w-16 más compactos

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavbarCreadora } from '../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { ContenidoPage } from '../DashboardCreadora/ContenidoPage/ContenidoPage';
import { PacksPage } from './PacksPage/PacksPage';
import { RoleSwitcher } from '@/components/dev/RoleSwitcher';
import { VideoCallModal } from '@/features/chat/components/VideoCall/VideoCallModal';

// Chat
import { MessagesContent } from '@/pages/Messages/MessagesContent';

// Tabs
import { InvitacionesTab } from './tabs/InvitacionesTab/InvitacionesTab';
import { ResumenTab } from './tabs/ResumenTab/ResumenTab';
import { MiActividadTab } from '../../components/DashboardCreadora/Tabs/Inicio/MiActividadTab';

// Componentes
import { SubTabsHeader } from './components/SubTabsHeader';

// Configuración
import { subTabsConfig } from './config/subtabs.config';
import { invitacionesIniciales } from './data/invitaciones.data';
import { TabTypeMenu } from './hooks/useTabs';

type SubTabId = 'invitaciones' | 'resumen';

export const DashboardCreadoraPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = (searchParams.get('tab') as TabTypeMenu) ;
  const [activeTab, setActiveTab] = useState<TabTypeMenu>(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('invitaciones');

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVideoCallMinimized, setIsVideoCallMinimized] = useState(false);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    const urlTab = searchParams.get('tab') as TabTypeMenu;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=47',
    gananciasMes: 2450,
  };

  const handleProgramarEvento = () => {
    console.log('Programar evento');
  };

  const handleSubTabChange = (tabId: string) => {
    setActiveSubTab(tabId as SubTabId);
  };

  const handleVideoCallStart = () => {
    setIsVideoCallActive(true);
    setIsVideoCallMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsVideoCallMinimized(!isVideoCallMinimized);
  };

  const handleVideoCallClose = () => {
    setIsVideoCallActive(false);
    setIsVideoCallMinimized(false);
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
        isVideoCallActive={isVideoCallActive && !isVideoCallMinimized}
      />

      {/* ✅ AJUSTADO: top-14 (navbar h-14) y lg:left-16 (sidebar w-16) */}
      <main className={`
        fixed top-14 left-0 right-0 bottom-0 overflow-hidden flex flex-col
        transition-all duration-300
        ${isVideoCallActive && !isVideoCallMinimized ? '' : 'lg:left-16'}
      `}>
        {activeTab === 'mensajes' ? (
          <MessagesContent onVideoCallStart={handleVideoCallStart} />
        ) : (
          <>
            {/* Header de SubTabs más compacto */}
            {showSubTabs && (
              <SubTabsHeader
                tabs={subTabsConfig}
                activeTab={activeSubTab}
                onTabChange={handleSubTabChange}
              />
            )}

            {/* ✅ Contenido con padding reducido */}
            <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="p-3 md:p-4"> {/* Reducido: p-3 en móvil, p-4 en desktop */}
                {showSubTabs && (
                  <> 
                    {activeSubTab === 'resumen' && (
                      <ResumenTab
                        nombreUsuario={currentUser.nombre}
                        gananciasMes={currentUser.gananciasMes}
                      />
                    )}
                  </>
                )}

                {!showSubTabs && (
                  <>
                    {activeTab === 'contenido' && <ContenidoPage />}
                    {activeTab === 'packs' && <PacksPage />}
                    {activeTab === 'inicio' && <MiActividadTab />}
                    {activeTab === 'invitaciones' && (
                      <InvitacionesTab
                        invitacionesIniciales={invitacionesIniciales}
                        enabled={activeSubTab === 'invitaciones'}
                      />
                    )}
                    {activeTab === 'donaciones' && (
                      <div className="text-center py-12">
                        <h2 className="text-lg font-semibold text-slate-800">Donaciones</h2>
                        <p className="text-xs text-slate-500 mt-1">Próximamente</p>
                      </div>
                    )}
                    {activeTab === 'configuracion' && (
                      <div className="text-center py-12">
                        <h2 className="text-lg font-semibold text-slate-800">Configuración</h2>
                        <p className="text-xs text-slate-500 mt-1">Próximamente</p>
                      </div>
                    )}
                    {activeTab === 'reportes' && (
                      <div className="text-center py-12">
                        <h2 className="text-lg font-semibold text-slate-800">Reportes y Estadísticas</h2>
                        <p className="text-xs text-slate-500 mt-1">Próximamente</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {isVideoCallActive && (
        <VideoCallModal
          onClose={handleVideoCallClose}
          isMinimized={isVideoCallMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      )}

      <RoleSwitcher />
    </div>
  );
};

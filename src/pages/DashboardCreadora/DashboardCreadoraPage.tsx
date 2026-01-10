// src/pages/DashboardCreadora/DashboardCreadoraPage.tsx
// ✅ ACTUALIZADO: Con nuevo chat WhatsApp integrado

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crown, MessageCircle } from 'lucide-react';
import { NavbarCreadora } from '../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { ContenidoPage } from '../DashboardCreadora/ContenidoPage/ContenidoPage';
import { PacksPage } from './PacksPage/PacksPage';
import { RoleSwitcher } from '@/components/dev/RoleSwitcher';

// ✅ NUEVO: Importar el contenido del chat
import { MessagesContent } from '@/pages/Messages/MessagesContent';

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

export const DashboardCreadoraPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabFromUrl = (searchParams.get('tab') as TabType) || 'resumen';
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('resumen');

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    const urlTab = searchParams.get('tab') as TabType;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    gananciasMes: 2450,
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

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-20 overflow-hidden flex flex-col">
        {/* ✅ CHAT: Ocupa toda la altura sin header */}
        {activeTab === 'mensajes' ? (
          <MessagesContent />
        ) : (
          <>
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

                {!showSubTabs && (
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
          </>
        )}
      </main>

      <RoleSwitcher />
    </div>    
  );
};

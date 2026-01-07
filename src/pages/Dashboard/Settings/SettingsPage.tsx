import { useState } from 'react';
import { Shield, Bell, Lock, Settings } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';
import { AccountTab } from '../../../components/Dashboard/Settings/AccountTab';
import { PrivacyTab } from '../../../components/Dashboard/Settings/PrivacyTab';
import { NotificationsTab } from '../../../components/Dashboard/Settings/NotificationsTab'; 
import { DashboardEspectadorLayout } from '../layouts/DashboardEspectadorLayout';

type SettingsTabType = 'cuenta' | 'privacidad' | 'notificaciones'; 

export const SettingsPageContent = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>('cuenta');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'cuenta' as SettingsTabType, label: 'Cuenta', icon: Shield },
    { id: 'privacidad' as SettingsTabType, label: 'Privacidad', icon: Lock },
    { id: 'notificaciones' as SettingsTabType, label: 'Notificaciones', icon: Bell },
  ]; 

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}      />
 
      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-6 h-6 text-pink-500" />
                Configuración
              </h1> 
            </div>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Tabs Simples y Elegantes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="flex border-b border-slate-200 overflow-x-auto">
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
                      
                      {/* Línea inferior cuando está activo */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              {activeTab === 'cuenta' && <AccountTab />}
              {activeTab === 'privacidad' && <PrivacyTab />}
              {activeTab === 'notificaciones' && <NotificationsTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const SettingsPage = () => (
  <DashboardEspectadorLayout>
    <SettingsPageContent />
  </DashboardEspectadorLayout>
);

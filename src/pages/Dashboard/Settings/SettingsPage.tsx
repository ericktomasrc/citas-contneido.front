import { useState } from 'react';
import { Shield, Bell, Lock, Settings } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';
import { AccountTab } from '../../../components/Dashboard/Settings/AccountTab';
import { PrivacyTab } from '../../../components/Dashboard/Settings/PrivacyTab';
import { NotificationsTab } from '../../../components/Dashboard/Settings/NotificationsTab';

type SettingsTabType = 'cuenta' | 'privacidad' | 'notificaciones';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>('cuenta');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { 
      id: 'cuenta' as SettingsTabType, 
      label: 'Cuenta',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-600',
      bgActive: 'bg-blue-50',
      borderActive: 'border-blue-500'
    },
    { 
      id: 'privacidad' as SettingsTabType, 
      label: 'Privacidad',
      icon: Lock,
      gradient: 'from-purple-500 to-indigo-600',
      bgActive: 'bg-purple-50',
      borderActive: 'border-purple-500'
    },
    { 
      id: 'notificaciones' as SettingsTabType, 
      label: 'Notificaciones',
      icon: Bell,
      gradient: 'from-yellow-500 to-orange-600',
      bgActive: 'bg-yellow-50',
      borderActive: 'border-yellow-500'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Settings className="w-7 h-7 text-blue-500" />
              Configuración
            </h1>
            <p className="text-gray-600">Administra tu cuenta y preferencias</p>
          </div>

          {/* Tabs Premium */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                      ${isActive 
                        ? `${tab.bgActive} ring-1 ${tab.borderActive.replace('border-', 'ring-')}` 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Icono */}
                    <div className={`
                      flex items-center justify-center w-7 h-7 rounded-md transition-all
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient}` 
                        : 'bg-gray-100'
                      }
                    `}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>

                    {/* Label */}
                    <span className={`
                      font-semibold text-sm transition-colors
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent` 
                        : 'text-gray-700'
                      }
                    `}>
                      {tab.label}
                    </span>

                    {/* Indicator activo */}
                    {isActive && (
                      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r ${tab.gradient}`} />
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
      </main>
    </div>
  );
};
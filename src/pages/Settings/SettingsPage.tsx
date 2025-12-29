import { useState } from 'react';
import { User, Shield, Bell, Lock, Search } from 'lucide-react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { ProfileTab } from '../../components/Settings/ProfileTab';
import { AccountTab } from '../../components/Settings/AccountTab';
import { PrivacyTab } from '../../components/Settings/PrivacyTab';
import { NotificationsTab } from '../../components/Settings/NotificationsTab';
import { SearchPreferencesTab } from '../../components/Settings/SearchPreferencesTab';

type SettingsTabType = 'perfil' | 'cuenta' | 'privacidad' | 'notificaciones' | 'busqueda';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>('perfil');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { 
      id: 'perfil' as SettingsTabType, 
      label: 'Mi Perfil',
      icon: User,
      gradient: 'from-pink-500 to-rose-600',
      bgActive: 'bg-pink-50',
      borderActive: 'border-pink-500'
    },
    { 
      id: 'cuenta' as SettingsTabType, 
      label: 'Cuenta',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-600',
      bgActive: 'bg-blue-50',
      borderActive: 'border-blue-500'
    },
    { 
      id: 'busqueda' as SettingsTabType, 
      label: 'Búsqueda',
      icon: Search,
      gradient: 'from-green-500 to-emerald-600',
      bgActive: 'bg-green-50',
      borderActive: 'border-green-500'
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
    <div className="min-h-screen bg-gray-50">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-600">Administra tu perfil, cuenta y preferencias</p>
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
            {activeTab === 'perfil' && <ProfileTab />}
            {activeTab === 'cuenta' && <AccountTab />}
            {activeTab === 'busqueda' && <SearchPreferencesTab />}
            {activeTab === 'privacidad' && <PrivacyTab />}
            {activeTab === 'notificaciones' && <NotificationsTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

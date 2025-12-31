import { useState } from 'react';
import { Crown, Mail, Coins, Gift, FileText, CreditCard } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';
import { ActiveSubscriptionsTable } from '../../../components/Dashboard/Subscriptions/ActiveSubscriptionsTable';
import { InvitationsTable } from '../../../components/Dashboard/Subscriptions/InvitationsTable';
import { CoinsTable } from '../../../components/Dashboard/Subscriptions/CoinsTable';
import { GiftsTable } from '../../../components/Dashboard/Subscriptions/GiftsTable';
import { PurchaseHistoryTable } from '../../../components/Dashboard/Subscriptions/PurchaseHistoryTable';

type TabType = 'activas' | 'invitaciones' | 'saldo' | 'regalos' | 'historial';

export const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('activas');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { 
      id: 'activas' as TabType, 
      label: 'Suscripciones Activas',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-600',
      bgActive: 'bg-purple-50',
      borderActive: 'border-purple-500'
    },
    { 
      id: 'invitaciones' as TabType, 
      label: 'Invitaciones',
      icon: Mail,
      gradient: 'from-pink-500 to-rose-600',
      bgActive: 'bg-pink-50',
      borderActive: 'border-pink-500'
    },
    { 
      id: 'saldo' as TabType, 
      label: 'Recargar Saldo',
      icon: Coins,
      gradient: 'from-yellow-500 to-orange-600',
      bgActive: 'bg-yellow-50',
      borderActive: 'border-yellow-500'
    },
    { 
      id: 'regalos' as TabType, 
      label: 'Comprar Regalos',
      icon: Gift,
      gradient: 'from-blue-500 to-cyan-600',
      bgActive: 'bg-blue-50',
      borderActive: 'border-blue-500'
    },
    { 
      id: 'historial' as TabType, 
      label: 'Historial',
      icon: FileText,
      gradient: 'from-gray-600 to-gray-800',
      bgActive: 'bg-gray-50',
      borderActive: 'border-gray-600'
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
          {/* Header compacto con icono */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-purple-500" />
              Mis Suscripciones
            </h1>
            <p className="text-gray-600">Administra tus suscripciones, invitaciones y compras</p>
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
            {activeTab === 'activas' && <ActiveSubscriptionsTable />}
            {activeTab === 'invitaciones' && <InvitationsTable />}
            {activeTab === 'saldo' && <CoinsTable />}
            {activeTab === 'regalos' && <GiftsTable />}
            {activeTab === 'historial' && <PurchaseHistoryTable />}
          </div>
        </div>
      </main>
    </div>
  );
};

// src/components/DashboardCreadora/Sidebar/SidebarCreadora.tsx
// ✅ MEJORADO: Auto-hide durante videollamada

import { BarChart3, Image, Package, Radio, MessageCircle, Mail, DollarSign, Settings, TrendingUp, X, LogOut, Home, Crown, Sparkles, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';
import { useState } from 'react';
import { TabTypeMenu } from '@/pages/DashboardCreadora/hooks/useTabs';


interface SidebarCreadoraProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabTypeMenu;
  onTabChange: (tab: TabTypeMenu) => void;
  isVideoCallActive?: boolean; // ✅ NUEVO
}

export const SidebarCreadora = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  isVideoCallActive = false // ✅ NUEVO
}: SidebarCreadoraProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: 'inicio' as TabTypeMenu, icon: Home, label: 'Inicio', badge: null },
    { id: 'invitaciones' as TabTypeMenu, icon: Mail, label: 'Invitaciones', badge: null },
    { id: 'resumen' as TabTypeMenu, icon: BarChart3, label: 'Resumen', badge: null },
    { id: 'contenido' as TabTypeMenu, icon: Crown, label: 'Contenido', badge: null },
    { id: 'mensajes' as TabTypeMenu, icon: MessageCircle, label: 'Chat', badge: 12 },
    { id: 'configuracion' as TabTypeMenu, icon: Settings, label: 'Configuración', badge: null },
    { id: 'reportes' as TabTypeMenu, icon: TrendingUp, label: 'Reportes', badge: null },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && !isVideoCallActive && (
        <div
          className="fixed inset-0 bg-black/5 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ✅ Sidebar con auto-hide durante videollamada */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-20 bg-gray-50/80 backdrop-blur-sm border-r border-gray-200/60 z-40
          transform transition-all duration-300 ease-out flex flex-col
          ${isVideoCallActive
            ? '-translate-x-full'
            : isOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col items-center">
          <div className="w-full space-y-0.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex flex-col items-center gap-1 py-3 px-2 relative
                    transition-all duration-150 group
                    ${isActive
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }
                  `}
                >
                  {/* Indicador activo */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-indigo-600 rounded-r-full" />
                  )}

                  {/* Icono */}
                  <div className="relative">
                    <item.icon className={`w-6 h-6 transition-transform duration-150 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />

                    {/* Badge */}
                    {item.badge !== null && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-[10px] font-medium transition-colors duration-150 ${isActive ? 'text-indigo-600' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Separador */}
          <div className="w-8 h-px bg-gray-200 my-2" />

          {/* Más opciones */}
          {/* <button className="w-full flex flex-col items-center gap-1 py-3 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-150">
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-medium">Más</span>
          </button> */}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200/60 py-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex flex-col items-center gap-1 py-3 px-2 text-gray-600 hover:text-red-600 hover:bg-red-50/50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-medium">
              {isLoggingOut ? 'Salir...' : 'Salir'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

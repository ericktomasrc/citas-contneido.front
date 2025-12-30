import { BarChart3, Image, Package, Radio, MessageCircle, Mail, DollarSign, Settings, TrendingUp, X, LogOut, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';
import { useState } from 'react';

type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';

interface SidebarCreadoraProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SidebarCreadora = ({ isOpen, onClose, activeTab, onTabChange }: SidebarCreadoraProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

const menuItems = [
  { id: 'resumen' as TabType, icon: Home, label: 'Inicio', badge: null }, // ✅ CAMBIO AQUÍ
  { id: 'contenido' as TabType, icon: Image, label: 'Contenido', badge: null },
  { id: 'packs' as TabType, icon: Package, label: 'Packs', badge: null },
  { id: 'envivo' as TabType, icon: Radio, label: 'En Vivo', badge: null },
  { id: 'mensajes' as TabType, icon: MessageCircle, label: 'Mensajes', badge: 12 },
  { id: 'invitaciones' as TabType, icon: Mail, label: 'Invitaciones', badge: 5 },
  { id: 'donaciones' as TabType, icon: DollarSign, label: 'Donaciones', badge: 8 },
  { id: 'configuracion' as TabType, icon: Settings, label: 'Configuración', badge: null },
  { id: 'reportes' as TabType, icon: TrendingUp, label: 'Reportes', badge: null },
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

  // Mock user data
  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima2',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header - Solo móvil */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="font-semibold text-gray-900">Panel de Control</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose(); // Cerrar sidebar en móvil al hacer click
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition group
                    ${isActive 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-pink-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span className={`flex-1 font-medium text-left text-sm ${isActive ? 'text-pink-600' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge !== null && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-bold
                      ${isActive ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Usuario y Cerrar Sesión */}
        <div className="border-t border-gray-200 p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <img
              src={currentUser.avatar}
              alt={currentUser.nombre}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser.nombre}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.username}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className={`w-5 h-5 transition-transform ${
              isLoggingOut ? 'animate-pulse' : 'group-hover:translate-x-0.5'
            }`} />
            <span className="font-medium">
              {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
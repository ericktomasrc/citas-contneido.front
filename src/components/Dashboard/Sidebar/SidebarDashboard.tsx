import { Home,  CreditCard,  Activity, Settings, X, LogOut } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';
import { useState } from 'react';

interface SidebarDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDashboard = ({ isOpen, onClose }: SidebarDashboardProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard', active: true },
    { icon: CreditCard, label: 'Mis Suscripciones', href: '/mis-suscripciones' },
    { icon: Activity, label: 'Invitaciones', href: '/invitaciones', badge: 5 },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Llamar API de logout
      await authApi.logout();
      
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirigir a login
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aún si falla el API, limpiar localStorage y redirigir
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Mock user data - TODO: Obtener del contexto/store
  const currentUser = {
    nombre: 'Usuario Demo',
    username: '@usuario_demo',
    avatar: 'https://i.pravatar.cc/150?img=68',
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
          <span className="font-semibold text-gray-900">Menú</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation - Flex grow para empujar el footer abajo */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Principal
            </h3>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
                badge={item.badge}
              />
            ))}
          </div>
        </nav>

        {/* Footer - Usuario y Cerrar Sesión */}
        <div className="border-t border-gray-200 p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <img
              src={currentUser.avatar}
              alt={currentUser.nombre}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
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
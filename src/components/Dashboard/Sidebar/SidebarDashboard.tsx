import { Home, CreditCard, Settings, X, LogOut, Mail, User, Search } from 'lucide-react';
import { SidebarItem } from '../SiderbarItem/SidebarItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';
import { useState } from 'react'; 

interface SidebarDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDashboard = ({ isOpen, onClose }: SidebarDashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard' },
    { icon: User, label: 'Mi Perfil', href: '/mi-perfil' },
    { icon: Search, label: 'Preferencias de Búsqueda', href: '/preferencias-busqueda' },
    { icon: CreditCard, label: 'Mis Suscripciones', href: '/mis-suscripciones' },
    { icon: Mail, label: 'Invitaciones', href: '/invitaciones', badge: 5 },
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
    edad: 30,
    meGusta: 150,
    suscriptores: 3200,
    noMeGusta: 3,
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

                {/* Avatar y Stats */}
        <div className="p-6 border-b border-gray-200">
          {/* Avatar SIN badge EN VIVO */}
          <div className="relative w-24 h-24 mx-auto mb-3">
            <div className="w-full h-full aspect-square">
              <img
                src={currentUser.avatar}
                alt={currentUser.nombre}
                className="w-full h-full rounded-full object-cover ring-4 ring-pink-200"
              />
            </div>
          </div>

          {/* Nombre y verificado */}
          <div className="text-center mt-4 mb-4">
            <div className="flex items-center justify-center gap-1">
              <h3 className="text-lg font-bold text-gray-900">
                María, {currentUser.edad}
              </h3>
              {/* <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
            </div>
          </div>

          {/* Estadísticas con iconos grises */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Me gusta - Corazón gris */}
            <div>            
              <p className="text-lg font-bold text-gray-900 mt-1">{currentUser.meGusta}</p>  
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg> 
              </div>
            </div>

            {/* Suscriptores - Usuario + Tarjeta grises */}
            <div>     
              <p className="text-lg font-bold text-gray-900 mt-1">
                {currentUser.suscriptores >= 1000 
                  ? `${(currentUser.suscriptores / 1000).toFixed(1)}K` 
                  : currentUser.suscriptores}
              </p>         
              <div className="flex items-center justify-center gap-0.5">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>               
            </div>

            {/* No me gusta - Dedo abajo gris */}
            <div>      
               <p className="text-lg font-bold text-gray-900 mt-1">{currentUser.noMeGusta}</p>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                </svg> 
              </div>
            </div>
          </div>
        </div>


        {/* Navigation - Flex grow para empujar el footer abajo */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div> 
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
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

import { Bell, MessageCircle, User, Menu, SlidersHorizontal, MapPin, LogOut, Settings, CreditCard } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';

interface NavbarDashboardProps {
  onToggleSidebar: () => void;
  notificationsCount?: number;
  messagesCount?: number;
  onFilterChange?: (filters: any) => void;
}

export const NavbarDashboard = ({ 
  onToggleSidebar, 
  notificationsCount = 0,
  messagesCount = 0,
  onFilterChange
}: NavbarDashboardProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock user data - TODO: Obtener del contexto/store
  const currentUser = {
    nombre: 'Usuario Demo',
    username: '@usuario_demo',
    avatar: 'https://i.pravatar.cc/150?img=68',
  };

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="h-16 px-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              CitasContenido
            </span>
          </div>
        </div>

        {/* Center - Search + Filters */}
        <div className="flex-1 max-w-3xl flex items-center gap-3">
          {/* Search */}
          <div className="flex-1">
            <SearchBar />
          </div>         
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-2 py-1.5 transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.nombre}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
              />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {currentUser.username}
            </span>

              <svg className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
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
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/configuracion');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Mi Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/mis-suscripciones');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>Mis Suscripciones</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/configuracion');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Configuración</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Edad */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Edad</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Todas</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36+">36+</option>
              </select>
            </div>

            {/* Distancia */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Distancia</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Cualquiera</option>
                <option value="10">Menos de 10 km</option>
                <option value="50">Menos de 50 km</option>
                <option value="100">Menos de 100 km</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Estado</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Todas</option>
                <option value="online">En línea</option>
                <option value="live">En vivo</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
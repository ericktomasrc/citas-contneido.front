// src/components/DashboardCreadora/Navbar/NavbarCreadora.tsx
// ✅ MEJORADO: Iconos y elementos más compactos

import { Bell, MessageCircle, User, Menu, LogOut, Settings, DollarSign, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';

interface NavbarCreadoraProps {
  onToggleSidebar: () => void;
}

export const NavbarCreadora = ({ onToggleSidebar }: NavbarCreadoraProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima1',
    avatar: 'https://i.pravatar.cc/150?img=47',
    gananciasMes: 2450,
  };

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

  const dropdownItems = [
    { 
      icon: User, 
      label: 'Mi Perfil', 
      onClick: () => {
        navigate('/editar-publico-creadora');
        setShowProfileDropdown(false);
      }
    },
    { 
      icon: DollarSign, 
      label: 'Mis Ganancias', 
      onClick: () => {
        navigate('/dashboard-creadora');
        setShowProfileDropdown(false);
      }
    },
    { 
      icon: Settings, 
      label: 'Configuración', 
      onClick: () => {
        navigate('/dashboard-creadora');
        setShowProfileDropdown(false);
      }
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      {/* Altura reducida: h-14 en lugar de h-16 */}
      <div className="h-14 px-3 flex items-center justify-between gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Menu Toggle - más compacto */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition lg:hidden"
          >
            <Menu className="w-4.5 h-4.5 text-gray-700" strokeWidth={1.75} />
          </button>

          {/* Logo - más pequeño */}
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">C</span>
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              CitasContenido
            </span>
          </div> 
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Buscador móvil */}
          <button className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition">
            <Search className="w-4 h-4 text-gray-600" strokeWidth={1.75} />
          </button>

          {/* Notificaciones */}
          <button className="relative p-1.5 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-4 h-4 text-gray-600" strokeWidth={1.75} />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              8
            </span>
          </button>

          {/* Mensajes */}
          <button className="relative p-1.5 hover:bg-gray-100 rounded-lg transition">
            <MessageCircle className="w-4 h-4 text-gray-600" strokeWidth={1.75} />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-pink-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              12
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-1.5 hover:bg-gray-100 rounded-full px-1 py-0.5 transition"
            >
              {/* Avatar más pequeño */}
              <img
                src={currentUser.avatar}
                alt={currentUser.nombre}
                className="w-7 h-7 rounded-full object-cover border border-gray-200"
              />
              <span className="text-[11px] font-medium text-gray-600 hidden sm:block">
                {currentUser.username}
              </span>
            </button>

            {/* Dropdown Menu - más compacto */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-2.5 py-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.nombre}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-900 truncate">
                        {currentUser.nombre}
                      </p>
                      <p className="text-[9px] text-gray-500 truncate">
                        {currentUser.username}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-0.5">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-gray-700 hover:bg-gray-50 transition"
                    >
                      <item.icon className="w-3 h-3 text-gray-500" strokeWidth={1.75} />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-0.5">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className={`w-3 h-3 ${isLoggingOut ? 'animate-pulse' : ''}`} strokeWidth={1.75} />
                    {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

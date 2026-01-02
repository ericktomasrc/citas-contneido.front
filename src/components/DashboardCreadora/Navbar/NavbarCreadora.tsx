import { Bell, MessageCircle, User, Menu, LogOut, Settings, DollarSign } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';

interface NavbarCreadoraProps {
  onToggleSidebar: () => void;
}

export const NavbarCreadora = ({ onToggleSidebar }: NavbarCreadoraProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentUser = {
    nombre: 'María Rodriguez',
    username: '@maria_lima1',
    avatar: 'https://i.pravatar.cc/150?img=1',
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
        navigate('/editar-publico-creadora');  // ✅ NUEVA RUTA
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

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notificaciones */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              8
            </span>
          </button>

          {/* Mensajes */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              12
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.nombre}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-200"
              />
              <span className="font-medium text-gray-700 hidden lg:block">
                {currentUser.username}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.nombre}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-200"
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

                <div className="py-2">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 my-2" />

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className={`w-5 h-5 transition-transform ${
                    isLoggingOut ? 'animate-pulse' : ''
                  }`} />
                  <span className="font-medium">
                    {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
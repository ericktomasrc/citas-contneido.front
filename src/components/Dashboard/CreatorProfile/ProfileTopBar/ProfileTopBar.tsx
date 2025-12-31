import { ArrowLeft, Heart, Star, Share2, ThumbsDown, User, CreditCard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

interface ProfileTopBarProps {
  username: string;
  edad: number;
  isVerified: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProfileTopBar = ({ username, edad, isVerified, isFavorite, onToggleFavorite }: ProfileTopBarProps) => {
  const navigate = useNavigate();
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: Implementar logout real
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mock user data - TODO: Obtener del contexto/store
  const currentUser = {
    nombre: 'Usuario Demo',
    username: '@usuario_demo',
    avatar: 'https://i.pravatar.cc/150?img=68',
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Atrás</span>
        </button>
        
        {/* Right - Botones + Avatar */}
        <div className="flex items-center gap-3">
          {/* Me gusta - Verde */}
          <button
            onClick={() => {
              setRecommend(!recommend);
              setNotRecommend(false);
            }}
            className={`p-2 rounded-full transition-all ${
              recommend 
                ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                : 'bg-green-50 text-green-500 hover:bg-green-100'
            }`}
            title="Me gusta"
          >
            <Heart className={`w-5 h-5 ${recommend ? 'fill-current' : ''}`} />
          </button>

          {/* No me gusta - Rojo */}
          <button
            onClick={() => {
              setNotRecommend(!notRecommend);
              setRecommend(false);
            }}
            className={`p-2 rounded-full transition-all ${
              notRecommend 
                ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
            title="No me gusta"
          >
            <ThumbsDown className={`w-5 h-5 ${notRecommend ? 'fill-current' : ''}`} />
          </button>
          
          {/* Favorito - Naranja-Amarillo */}
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorite 
                ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200' 
                : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
            }`}
            title="Favorito"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          {/* Compartir - Azul */}
          <button 
            className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-all"
            title="Compartir perfil"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 mx-2" />

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
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
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
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
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Mi Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/mis-suscripciones');
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>Mis Suscripciones</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/configuracion');
                      setShowDropdown(false);
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
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
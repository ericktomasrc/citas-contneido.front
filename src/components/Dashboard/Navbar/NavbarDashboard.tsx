import { Bell, MessageCircle, User, Menu, SlidersHorizontal, MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useState } from 'react';

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
  const [selectedCity, setSelectedCity] = useState('');

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

          {/* Ciudad Filter */}
          <div className="hidden md:block">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                onFilterChange?.({ ciudad: e.target.value });
              }}
              className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition appearance-none pr-10"
            >
              <option value="">📍 Todas las ciudades</option>
              <option value="lima">Lima</option>
              <option value="arequipa">Arequipa</option>
              <option value="cusco">Cusco</option>
              <option value="trujillo">Trujillo</option>
              <option value="chiclayo">Chiclayo</option>
            </select>
          </div>

          {/* Filtros Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6 text-gray-700" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Messages */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            {messagesCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                {messagesCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700 hidden lg:block">@usuario</span>
          </button>
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

            {/* Verificadas */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                <span className="text-sm font-medium text-gray-700">Solo verificadas ✓</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
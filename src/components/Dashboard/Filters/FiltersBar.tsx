import { SlidersHorizontal, MapPin } from 'lucide-react';
import { useState } from 'react';

export const FiltersBar = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {/* Ciudad */}
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
          <option value="">📍 Todas las ciudades</option>
          <option value="lima">Lima</option>
          <option value="arequipa">Arequipa</option>
          <option value="cusco">Cusco</option>
          <option value="trujillo">Trujillo</option>
        </select>

        {/* Filtros avanzados */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </button>

        {/* Quick filters */}
        <div className="flex gap-2 ml-auto">
          <button className="px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 rounded-lg text-sm font-medium hover:from-pink-100 hover:to-purple-100 transition">
            🆕 Nuevas
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            ⭐ Destacadas
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Todas</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36+">36+</option>
              </select>
            </div>

            {/* Distancia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distancia</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="">Cualquiera</option>
                <option value="10">Menos de 10 km</option>
                <option value="50">Menos de 50 km</option>
                <option value="100">Menos de 100 km</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
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
    </div>
  );
};
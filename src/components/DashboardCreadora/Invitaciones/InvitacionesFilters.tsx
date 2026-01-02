import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  selected: boolean;
}

export const InvitacionesFilters = () => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    edad: [
      { id: '18-25', label: '18-25 años', selected: false },
      { id: '26-35', label: '26-35 años', selected: false },
      { id: '36-45', label: '36-45 años', selected: false },
      { id: '46+', label: '46+ años', selected: false },
    ],
    ubicacion: [
      { id: 'san-isidro', label: 'San Isidro', selected: false },
      { id: 'miraflores', label: 'Miraflores', selected: false },
      { id: 'barranco', label: 'Barranco', selected: false },
      { id: 'surco', label: 'Surco', selected: false },
    ],
    estado: [
      { id: 'online', label: 'En línea', selected: false },
      { id: 'live', label: 'En vivo', selected: false },
    ],
  });

  const toggleFilter = (category: keyof typeof filters, id: string) => {
    setFilters({
      ...filters,
      [category]: filters[category].map(f => 
        f.id === id ? { ...f, selected: !f.selected } : f
      ),
    });
  };

  const clearAllFilters = () => {
    setFilters({
      edad: filters.edad.map(f => ({ ...f, selected: false })),
      ubicacion: filters.ubicacion.map(f => ({ ...f, selected: false })),
      estado: filters.estado.map(f => ({ ...f, selected: false })),
    });
    setSearchText('');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).flat().filter(f => f.selected).length;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="mb-6 space-y-4">
      {/* Barra de búsqueda y botón filtros */}
      <div className="flex gap-3">
        {/* Input de búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Botón Filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            showFilters || activeCount > 0
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Botón Limpiar (solo si hay filtros activos) */}
        {(activeCount > 0 || searchText) && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Edad */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Edad</h4>
              <div className="space-y-2">
                {filters.edad.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      filter.selected
                        ? 'bg-pink-500 border-pink-500'
                        : 'border-gray-300 group-hover:border-pink-300'
                    }`}>
                      {filter.selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={filter.selected}
                      onChange={() => toggleFilter('edad', filter.id)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Ubicación</h4>
              <div className="space-y-2">
                {filters.ubicacion.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      filter.selected
                        ? 'bg-pink-500 border-pink-500'
                        : 'border-gray-300 group-hover:border-pink-300'
                    }`}>
                      {filter.selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={filter.selected}
                      onChange={() => toggleFilter('ubicacion', filter.id)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Estado</h4>
              <div className="space-y-2">
                {filters.estado.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      filter.selected
                        ? 'bg-pink-500 border-pink-500'
                        : 'border-gray-300 group-hover:border-pink-300'
                    }`}>
                      {filter.selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={filter.selected}
                      onChange={() => toggleFilter('estado', filter.id)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags de filtros activos */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([category, items]) =>
            items
              .filter(f => f.selected)
              .map(filter => (
                <span
                  key={`${category}-${filter.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium"
                >
                  {filter.label}
                  <button
                    onClick={() => toggleFilter(category as keyof typeof filters, filter.id)}
                    className="hover:text-pink-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))
          )}
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { MapPin, Save, RotateCcw, Search, Sliders } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard'
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';

interface SearchPreferences {
  edadMin: number;
  edadMax: number;
  distancia: number;
  buscarEnTodoElMundo: boolean;
  ubicacion: string;
  alturaMin: number;
  alturaMax: number;
  tipoCuerpo: string[];
  apariencia: string[];
  idiomas: string[];
  nivelIngles: string;
  etnia: string[];
  fumas: string;
  buscando: string[];
  mostrar: string;
}

export const SearchPreferencesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchPrefs, setSearchPrefs] = useState<SearchPreferences>({
    edadMin: 18,
    edadMax: 55,
    distancia: 200,
    buscarEnTodoElMundo: false,
    ubicacion: 'Intersección &, Fundo Las Casuarinas, Av. Fátima 1345, Trujillo 13008, Peru',
    alturaMin: 120,
    alturaMax: 200,
    tipoCuerpo: ['delgado', 'con-curvas', 'atletico'],
    apariencia: [],
    idiomas: [],
    nivelIngles: '',
    etnia: [],
    fumas: '',
    buscando: [],
    mostrar: 'solo-mujeres'
  });

  const handleReset = () => {
    setSearchPrefs({
      edadMin: 18,
      edadMax: 55,
      distancia: 200,
      buscarEnTodoElMundo: false,
      ubicacion: '',
      alturaMin: 120,
      alturaMax: 200,
      tipoCuerpo: [],
      apariencia: [],
      idiomas: [],
      nivelIngles: '',
      etnia: [],
      fumas: '',
      buscando: [],
      mostrar: 'solo-mujeres'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Search className="w-7 h-7 text-pink-500" />
              Preferencias de Búsqueda
            </h1>
            <p className="text-gray-600">Personaliza tus criterios para encontrar mejores coincidencias</p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Columna Izquierda - Filtros Básicos */}
            <div className="xl:col-span-1 space-y-6">
              {/* Card: Rangos Básicos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-pink-500" />
                  Filtros Principales
                </h2>

                <div className="space-y-6">
                  {/* Rango de Edad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Edad: <span className="text-pink-600">{searchPrefs.edadMin}–{searchPrefs.edadMax}+ años</span>
                    </label>
                    <div className="relative pt-6">
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={searchPrefs.edadMin}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, edadMin: parseInt(e.target.value) })}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-20 accent-pink-500"
                      />
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={searchPrefs.edadMax}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, edadMax: parseInt(e.target.value) })}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-20 accent-pink-500"
                      />
                      <div className="w-full h-2 bg-pink-100 rounded-full relative">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                          style={{
                            left: `${((searchPrefs.edadMin - 18) / (80 - 18)) * 100}%`,
                            right: `${100 - ((searchPrefs.edadMax - 18) / (80 - 18)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>18 años</span>
                      <span>80+ años</span>
                    </div>
                  </div>

                  {/* Distancia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Distancia: <span className="text-pink-600">{searchPrefs.distancia} km</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={searchPrefs.distancia}
                      onChange={(e) => setSearchPrefs({ ...searchPrefs, distancia: parseInt(e.target.value) })}
                      className="w-full h-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 km</span>
                      <span>500 km</span>
                    </div>
                  </div>

                  {/* Búsqueda Global */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchPrefs.buscarEnTodoElMundo}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, buscarEnTodoElMundo: e.target.checked })}
                        className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">Búsqueda Global</span>
                        <span className="text-xs text-gray-600">Buscar en todo el mundo</span>
                      </div>
                    </label>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tu ubicación
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchPrefs.ubicacion}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, ubicacion: e.target.value })}
                        disabled={searchPrefs.buscarEnTodoElMundo}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition"
                        placeholder="Ingresa tu ubicación"
                      />
                    </div>
                  </div>

                  {/* Altura */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Altura: <span className="text-pink-600">{searchPrefs.alturaMin}–{searchPrefs.alturaMax} cm</span>
                    </label>
                    <div className="relative pt-6">
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={searchPrefs.alturaMin}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, alturaMin: parseInt(e.target.value) })}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-20 accent-pink-500"
                      />
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={searchPrefs.alturaMax}
                        onChange={(e) => setSearchPrefs({ ...searchPrefs, alturaMax: parseInt(e.target.value) })}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-20 accent-pink-500"
                      />
                      <div className="w-full h-2 bg-pink-100 rounded-full relative">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                          style={{
                            left: `${((searchPrefs.alturaMin - 120) / (220 - 120)) * 100}%`,
                            right: `${100 - ((searchPrefs.alturaMax - 120) / (220 - 120)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>120 cm</span>
                      <span>220 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Preferencias Detalladas */}
            <div className="xl:col-span-2 space-y-6">
              {/* Card: Características Físicas CON BOTONES */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
                {/* Botones en esquina superior derecha */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <button 
                    onClick={handleReset}
                    className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetear
                  </button>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Características Físicas</h2>
                
                <div className="space-y-8">
                  {/* Tipo de Cuerpo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tipo de cuerpo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['delgado', 'con-curvas', 'atletico', 'promedio', 'exceso-de-peso', 'otros'].map((tipo) => {
                        const isSelected = searchPrefs.tipoCuerpo.includes(tipo);
                        return (
                          <button
                            key={tipo}
                            onClick={() => {
                              setSearchPrefs({
                                ...searchPrefs,
                                tipoCuerpo: isSelected
                                  ? searchPrefs.tipoCuerpo.filter((t) => t !== tipo)
                                  : [...searchPrefs.tipoCuerpo, tipo]
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Apariencia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Apariencia
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['muy-atractivo', 'atractivo', 'promedio', 'debajo-del-promedio'].map((apariencia) => {
                        const isSelected = searchPrefs.apariencia.includes(apariencia);
                        return (
                          <button
                            key={apariencia}
                            onClick={() => {
                              setSearchPrefs({
                                ...searchPrefs,
                                apariencia: isSelected
                                  ? searchPrefs.apariencia.filter((a) => a !== apariencia)
                                  : [...searchPrefs.apariencia, apariencia]
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {apariencia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Idiomas y Cultura */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Idiomas y Cultura</h2>
                
                <div className="space-y-8">
                  {/* Idiomas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Idiomas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['ingles', 'espanol', 'portugues', 'aleman', 'rumano', 'ruso', 'frances', 'chino', 'japones'].map((idioma) => {
                        const isSelected = searchPrefs.idiomas.includes(idioma);
                        return (
                          <button
                            key={idioma}
                            onClick={() => {
                              setSearchPrefs({
                                ...searchPrefs,
                                idiomas: isSelected
                                  ? searchPrefs.idiomas.filter((i) => i !== idioma)
                                  : [...searchPrefs.idiomas, idioma]
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {idioma.charAt(0).toUpperCase() + idioma.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nivel de Inglés */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nivel de inglés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['malo', 'medio', 'bueno', 'fluido'].map((nivel) => (
                        <button
                          key={nivel}
                          onClick={() => setSearchPrefs({ ...searchPrefs, nivelIngles: nivel })}
                          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            searchPrefs.nivelIngles === nivel
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Etnicidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Etnicidad
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['asiatico', 'negro-afrodescendiente', 'latino-hispano', 'hindu', 'medio-oriente', 'mestizo', 'nativo-americano', 'islas-del-pacifico', 'blanco-caucasico', 'otros'].map((etnia) => {
                        const isSelected = searchPrefs.etnia.includes(etnia);
                        return (
                          <button
                            key={etnia}
                            onClick={() => {
                              setSearchPrefs({
                                ...searchPrefs,
                                etnia: isSelected
                                  ? searchPrefs.etnia.filter((e) => e !== etnia)
                                  : [...searchPrefs.etnia, etnia]
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {etnia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Preferencias Personales */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Preferencias Personales</h2>
                
                <div className="space-y-8">
                  {/* Fumadora */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Fumadora?
                    </label>
                    <div className="flex gap-2">
                      {['si', 'no', 'a-veces'].map((opcion) => (
                        <button
                          key={opcion}
                          onClick={() => setSearchPrefs({ ...searchPrefs, fumas: opcion })}
                          className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                            searchPrefs.fumas === opcion
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {opcion === 'a-veces' ? 'A veces' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buscando */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Qué busca?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['ligue', 'citas-casuales', 'relacion', 'matrimonio', 'relacion-en-linea'].map((tipo) => {
                        const isSelected = searchPrefs.buscando.includes(tipo);
                        return (
                          <button
                            key={tipo}
                            onClick={() => {
                              setSearchPrefs({
                                ...searchPrefs,
                                buscando: isSelected
                                  ? searchPrefs.buscando.filter((b) => b !== tipo)
                                  : [...searchPrefs.buscando, tipo]
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Muéstrame */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mostrarme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSearchPrefs({ ...searchPrefs, mostrar: 'solo-hombres' })}
                        className={`px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                          searchPrefs.mostrar === 'solo-hombres'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Solo Hombres
                      </button>
                      <button
                        onClick={() => setSearchPrefs({ ...searchPrefs, mostrar: 'solo-mujeres' })}
                        className={`px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                          searchPrefs.mostrar === 'solo-mujeres'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Solo Mujeres
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
import { useState } from 'react';
import { MapPin } from 'lucide-react';

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

export const SearchPreferencesTab = () => {
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

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Configuración de búsqueda</h3>
        <p className="text-gray-600">Personaliza tus preferencias para encontrar mejores coincidencias</p>
      </div>

      {/* Rango de edad y distancia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edad */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Rango de edad: {searchPrefs.edadMin}–{searchPrefs.edadMax}+
          </label>
          <div className="relative pt-6">
            <input
              type="range"
              min="18"
              max="80"
              value={searchPrefs.edadMin}
              onChange={(e) => setSearchPrefs({ ...searchPrefs, edadMin: parseInt(e.target.value) })}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
              style={{
                background: 'transparent',
              }}
            />
            <input
              type="range"
              min="18"
              max="80"
              value={searchPrefs.edadMax}
              onChange={(e) => setSearchPrefs({ ...searchPrefs, edadMax: parseInt(e.target.value) })}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
              style={{
                background: 'transparent',
              }}
            />
            <div className="w-full h-2 bg-pink-200 rounded-full relative">
              <div 
                className="absolute h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                style={{
                  left: `${((searchPrefs.edadMin - 18) / (80 - 18)) * 100}%`,
                  right: `${100 - ((searchPrefs.edadMax - 18) / (80 - 18)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Distancia */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Rango de distancia: {searchPrefs.distancia} km
          </label>
          <input
            type="range"
            min="1"
            max="500"
            value={searchPrefs.distancia}
            onChange={(e) => setSearchPrefs({ ...searchPrefs, distancia: parseInt(e.target.value) })}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </div>

      {/* Búsqueda en todo el mundo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={searchPrefs.buscarEnTodoElMundo}
            onChange={(e) => setSearchPrefs({ ...searchPrefs, buscarEnTodoElMundo: e.target.checked })}
            className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm font-medium text-gray-900">Búsqueda en todo el mundo</span>
        </label>
      </div>

      {/* Ubicación */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Ubicación
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchPrefs.ubicacion}
            onChange={(e) => setSearchPrefs({ ...searchPrefs, ubicacion: e.target.value })}
            disabled={searchPrefs.buscarEnTodoElMundo}
            className="w-full pl-10 pr-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>

      {/* Altura */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-4">
          Altura: {searchPrefs.alturaMin} cm –{searchPrefs.alturaMax} cm
        </label>
        <div className="relative pt-6">
          <input
            type="range"
            min="120"
            max="220"
            value={searchPrefs.alturaMin}
            onChange={(e) => setSearchPrefs({ ...searchPrefs, alturaMin: parseInt(e.target.value) })}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
          />
          <input
            type="range"
            min="120"
            max="220"
            value={searchPrefs.alturaMax}
            onChange={(e) => setSearchPrefs({ ...searchPrefs, alturaMax: parseInt(e.target.value) })}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20"
          />
          <div className="w-full h-2 bg-pink-200 rounded-full relative">
            <div 
              className="absolute h-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
              style={{
                left: `${((searchPrefs.alturaMin - 120) / (220 - 120)) * 100}%`,
                right: `${100 - ((searchPrefs.alturaMax - 120) / (220 - 120)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Cuerpo
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                }`}
              >
                {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apariencia */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                }`}
              >
                {apariencia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Idiomas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Idiomas
        </label>
        <div className="flex flex-wrap gap-2">
          {['ingles', 'espanol', 'portugues', 'aleman', 'rumano', 'ruso'].map((idioma) => {
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                }`}
              >
                {idioma.charAt(0).toUpperCase() + idioma.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ¿Qué tan bueno inglés? */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          ¿Qué tan buen inglés?
        </label>
        <div className="flex flex-wrap gap-2">
          {['malo', 'medio', 'bueno', 'fluido'].map((nivel) => (
            <button
              key={nivel}
              onClick={() => setSearchPrefs({ ...searchPrefs, nivelIngles: nivel })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                searchPrefs.nivelIngles === nivel
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
              }`}
            >
              {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Etnicidad */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                }`}
              >
                {etnia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')}
              </button>
            );
          })}
        </div>
      </div>

      {/* ¿Fumadora? */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          ¿Fumadora?
        </label>
        <div className="flex gap-2">
          {['si', 'no', 'a-veces'].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setSearchPrefs({ ...searchPrefs, fumas: opcion })}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                searchPrefs.fumas === opcion
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
              }`}
            >
              {opcion === 'a-veces' ? 'A veces' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Buscando */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Buscando
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                }`}
              >
                {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Muéstrame */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Muéstrame
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setSearchPrefs({ ...searchPrefs, mostrar: 'solo-hombres' })}
            className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition ${
              searchPrefs.mostrar === 'solo-hombres'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
            }`}
          >
            Solo hombres
          </button>
          <button
            onClick={() => setSearchPrefs({ ...searchPrefs, mostrar: 'solo-mujeres' })}
            className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold transition ${
              searchPrefs.mostrar === 'solo-mujeres'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
            }`}
          >
            Solo mujeres
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 gap-4">
        <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition">
          Guardar
        </button>
        <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition">
          Resetear
        </button>
      </div>
    </div>
  );
};

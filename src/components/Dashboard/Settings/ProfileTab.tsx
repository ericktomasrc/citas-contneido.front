import { useState } from 'react';
import { Camera, X, Calendar } from 'lucide-react';

export const ProfileTab = () => {
  const [photos, setPhotos] = useState<string[]>([
    'https://i.pravatar.cc/400?img=12',
    'https://i.pravatar.cc/400?img=13',
  ]);
  
  const [formData, setFormData] = useState({
    nombre: 'Jack',
    fechaNacimiento: '1994-04-08',
    bio: 'Soy Ing. Software... y me gusta viajar',
    altura: 160,
    tipoCuerpo: 'delgado',
    apariencia: 'muy-atractivo',
    idiomas: ['ingles', 'espanol'],
    nivelIngles: 'medio',
    etnia: 'latino-hispano',
    fumas: 'no',
    hijos: '0',
    buscando: ['ligue'],
    ingresos: '0-49k'
  });

  const handlePhotoUpload = () => {
    alert('Upload de foto - TODO: Implementar con API');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl">
      {/* Alert de verificación */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-green-800 font-semibold">
            Tu cuenta ha sido verificada
          </p>
          <p className="text-xs text-green-700 mt-0.5">
            Email y verificación facial completados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda - Fotos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Fotos</h3>
          
          {/* Grid de fotos */}
          <div className="grid grid-cols-3 gap-3">
            {/* Foto principal (más grande) */}
            {photos[0] && (
              <div className="col-span-2 row-span-2 relative group">
                <img
                  src={photos[0]}
                  alt="Foto principal"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(0)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* Fotos secundarias */}
            {photos.slice(1, 5).map((photo, index) => (
              <div key={index + 1} className="relative group aspect-square">
                <img
                  src={photo}
                  alt={`Foto ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index + 1)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            {/* Slots vacíos */}
            {Array.from({ length: Math.max(0, 5 - photos.length) }).map((_, index) => (
              <button
                key={`empty-${index}`}
                onClick={handlePhotoUpload}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-500 hover:bg-pink-50 transition group"
              >
                <Camera className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha - Información */}
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es tu nombre?
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca tu fecha de nacimiento
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dinos algo sobre ti. Puedes escribir sobre tus hobbies, valores y visión de vida.
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.bio.length}/500</p>
          </div>

          {/* Botón Guardar */}
          <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition">
            Guardar
          </button>
        </div>
      </div>

      {/* Sección: Más información */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Más información</h2>

        <div className="space-y-8">
          {/* Altura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tu altura {formData.altura} cm
            </label>
            <input
              type="range"
              min="140"
              max="220"
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Tipo de cuerpo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tu tipo de cuerpo
            </label>
            <div className="flex flex-wrap gap-2">
              {['delgado', 'con-curvas', 'atletico', 'promedio', 'exceso-de-peso', 'otros'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setFormData({ ...formData, tipoCuerpo: tipo })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.tipoCuerpo === tipo
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {tipo.replace('-', ' ').charAt(0).toUpperCase() + tipo.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Apariencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tu apariencia
            </label>
            <div className="flex flex-wrap gap-2">
              {['muy-atractivo', 'atractivo', 'promedio', 'debajo-del-promedio'].map((apariencia) => (
                <button
                  key={apariencia}
                  onClick={() => setFormData({ ...formData, apariencia })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.apariencia === apariencia
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {apariencia.replace('-', ' ').charAt(0).toUpperCase() + apariencia.slice(1).replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Idiomas que hablas
            </label>
            <div className="flex flex-wrap gap-2">
              {['ingles', 'espanol', 'portugues', 'aleman', 'rumano', 'ruso', 'frances', 'chino', 'japones'].map((idioma) => {
                const isSelected = formData.idiomas.includes(idioma);
                return (
                  <button
                    key={idioma}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        idiomas: isSelected
                          ? formData.idiomas.filter((i) => i !== idioma)
                          : [...formData.idiomas, idioma]
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

          {/* Nivel de inglés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Qué tan bueno es tu inglés?
            </label>
            <div className="flex flex-wrap gap-2">
              {['malo', 'medio', 'bueno', 'fluido'].map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => setFormData({ ...formData, nivelIngles: nivel })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.nivelIngles === nivel
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Etnia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tu etnia
            </label>
            <div className="flex flex-wrap gap-2">
              {['asiatico', 'negro-afrodescendiente', 'latino-hispano', 'hindu', 'medio-oriente', 'mestizo', 'nativo-americano', 'islas-del-pacifico', 'blanco-caucasico', 'otros'].map((etnia) => (
                <button
                  key={etnia}
                  onClick={() => setFormData({ ...formData, etnia })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.etnia === etnia
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {etnia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')}
                </button>
              ))}
            </div>
          </div>

          {/* ¿Fumas? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Fumas?
            </label>
            <div className="flex gap-2">
              {['si', 'no', 'a-veces'].map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => setFormData({ ...formData, fumas: opcion })}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                    formData.fumas === opcion
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {opcion === 'a-veces' ? 'A veces' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ¿Cuántos hijos? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cuántos hijos tienes?
            </label>
            <div className="flex gap-2">
              {['0', '1', '2', '3+', 'no-quiero-decirlo'].map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => setFormData({ ...formData, hijos: opcion })}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    formData.hijos === opcion
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {opcion === 'no-quiero-decirlo' ? 'No quiero decirlo' : opcion}
                </button>
              ))}
            </div>
          </div>

          {/* Buscando */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Buscando
            </label>
            <div className="flex flex-wrap gap-2">
              {['ligue', 'citas-casuales', 'relacion', 'matrimonio', 'relacion-en-linea'].map((tipo) => {
                const isSelected = formData.buscando.includes(tipo);
                return (
                  <button
                    key={tipo}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        buscando: isSelected
                          ? formData.buscando.filter((b) => b !== tipo)
                          : [...formData.buscando, tipo]
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

          {/* Tenencias en dólares */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tenencias en dólares
            </label>
            <div className="flex flex-wrap gap-2">
              {['0-49k', '50k-249k', '250k-999k', '1M-5M', '5M+', 'no-quiero-decirlo'].map((rango) => (
                <button
                  key={rango}
                  onClick={() => setFormData({ ...formData, ingresos: rango })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.ingresos === rango
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-500'
                  }`}
                >
                  {rango === 'no-quiero-decirlo' ? 'No quiero decirlo' : rango}
                </button>
              ))}
            </div>
          </div>

          {/* Botón Guardar final */}
          <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

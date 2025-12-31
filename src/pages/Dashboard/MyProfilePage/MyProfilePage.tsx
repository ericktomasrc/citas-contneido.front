import { useState } from 'react';
import { Camera, X, Calendar, Save, User } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';

export const MyProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3 flex-wrap">
              <User className="w-7 h-7 text-pink-500" />
              Mi Perfil
              {/* Badge de verificación compacto */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verificado
              </span>
            </h1>
            <p className="text-gray-600">Administra tu información personal y preferencias</p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Columna Izquierda - Fotos */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-pink-500" />
                  Tus Fotos
                </h2>
                
                {/* Grid de fotos - Diseño Premium */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Foto principal (más grande) */}
                  {photos[0] && (
                    <div className="col-span-2 row-span-2 relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                      <img
                        src={photos[0]}
                        alt="Foto principal"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => handleRemovePhoto(0)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition">
                        <p className="text-xs font-bold text-gray-900">Principal</p>
                      </div>
                    </div>
                  )}

                  {/* Fotos secundarias */}
                  {photos.slice(1, 5).map((photo, index) => (
                    <div key={index + 1} className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                      <img
                        src={photo}
                        alt={`Foto ${index + 2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => handleRemovePhoto(index + 1)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
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
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-pink-500 hover:bg-pink-50 transition group"
                    >
                      <Camera className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition mb-1" />
                      <span className="text-xs text-gray-400 group-hover:text-pink-500 transition font-medium">Subir</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Máximo 5 fotos • Primera foto es tu foto principal
                </p>
              </div>
            </div>

            {/* Columna Derecha - Información */}
            <div className="xl:col-span-2 space-y-8">
              {/* Card: Información Básica */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
                {/* Botón Guardar en esquina superior derecha - VERDE */}
                <button className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Información Básica</h2>
                
                <div className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Cuál es tu nombre?
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="Tu nombre"
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de nacimiento
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sobre ti
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Escribe sobre tus hobbies, valores y visión de vida
                    </p>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition"
                      placeholder="Cuéntanos sobre ti..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">Máximo 500 caracteres</p>
                      <p className="text-xs font-medium text-gray-600">{formData.bio.length}/500</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Características Físicas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Características Físicas</h2>
                
                <div className="space-y-8">
                  {/* Altura */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Tu altura: <span className="text-pink-600">{formData.altura} cm</span>
                    </label>
                    <input
                      type="range"
                      min="140"
                      max="220"
                      value={formData.altura}
                      onChange={(e) => setFormData({ ...formData, altura: parseInt(e.target.value) })}
                      className="w-full h-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>140 cm</span>
                      <span>220 cm</span>
                    </div>
                  </div>

                  {/* Tipo de cuerpo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tipo de cuerpo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['delgado', 'con-curvas', 'atletico', 'promedio', 'exceso-de-peso', 'otros'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setFormData({ ...formData, tipoCuerpo: tipo })}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.tipoCuerpo === tipo
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tipo.replace('-', ' ').charAt(0).toUpperCase() + tipo.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apariencia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tu apariencia
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['muy-atractivo', 'atractivo', 'promedio', 'debajo-del-promedio'].map((apariencia) => (
                        <button
                          key={apariencia}
                          onClick={() => setFormData({ ...formData, apariencia })}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.apariencia === apariencia
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {apariencia.replace('-', ' ').charAt(0).toUpperCase() + apariencia.slice(1).replace(/-/g, ' ')}
                        </button>
                      ))}
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

                  {/* Nivel de inglés */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nivel de inglés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['malo', 'medio', 'bueno', 'fluido'].map((nivel) => (
                        <button
                          key={nivel}
                          onClick={() => setFormData({ ...formData, nivelIngles: nivel })}
                          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.nivelIngles === nivel
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Etnia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tu etnia
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['asiatico', 'negro-afrodescendiente', 'latino-hispano', 'hindu', 'medio-oriente', 'mestizo', 'nativo-americano', 'islas-del-pacifico', 'blanco-caucasico', 'otros'].map((etnia) => (
                        <button
                          key={etnia}
                          onClick={() => setFormData({ ...formData, etnia })}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.etnia === etnia
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {etnia.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('/')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Estilo de Vida */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Estilo de Vida</h2>
                
                <div className="space-y-8">
                  {/* Fumas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Fumas?
                    </label>
                    <div className="flex gap-2">
                      {['si', 'no', 'a-veces'].map((opcion) => (
                        <button
                          key={opcion}
                          onClick={() => setFormData({ ...formData, fumas: opcion })}
                          className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                            formData.fumas === opcion
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {opcion === 'a-veces' ? 'A veces' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hijos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Cuántos hijos tienes?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['0', '1', '2', '3+', 'no-quiero-decirlo'].map((opcion) => (
                        <button
                          key={opcion}
                          onClick={() => setFormData({ ...formData, hijos: opcion })}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.hijos === opcion
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {opcion === 'no-quiero-decirlo' ? 'Prefiero no decirlo' : opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buscando */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Qué estás buscando?
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

                  {/* Ingresos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tenencias en dólares (USD)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['0-49k', '50k-249k', '250k-999k', '1M-5M', '5M+', 'no-quiero-decirlo'].map((rango) => (
                        <button
                          key={rango}
                          onClick={() => setFormData({ ...formData, ingresos: rango })}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.ingresos === rango
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {rango === 'no-quiero-decirlo' ? 'Prefiero no decirlo' : rango}
                        </button>
                      ))}
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
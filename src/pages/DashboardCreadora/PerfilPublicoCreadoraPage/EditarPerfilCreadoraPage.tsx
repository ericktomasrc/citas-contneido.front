import { useState } from 'react';
import { Camera, X, Calendar, Save, User, Eye } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { useNavigate } from 'react-router-dom';

type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';

export const EditarPerfilCreadoraPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([
    'https://i.pravatar.cc/400?img=1',
    'https://i.pravatar.cc/400?img=2',
  ]);
  
  const [formData, setFormData] = useState({
    nombre: 'María',
    fechaNacimiento: '1999-03-15',
    bio: 'Soy Ing. Software... y me gusta viajar ✈️ Amante del fitness y la vida saludable 💪 Aquí comparto mi día a día y contenido exclusivo 🌟',
    altura: 160,
    tipoCuerpo: 'delgado',
    apariencia: 'muy-atractivo',
    idiomas: ['ingles', 'espanol'],
    nivelIngles: 'medio',
    etnia: 'latino-hispano',
    fumas: 'no',
    hijos: '0',
    buscando: ['ligue'],
    ingresos: '50k-249k',
    precioSuscripcion: 140,
    ubicacion: 'Miraflores, Lima'
  });

  const handlePhotoUpload = () => {
    const newPhoto = `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70)}`;
    if (photos.length < 5) {
      setPhotos([...photos, newPhoto]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert('¡Perfil guardado exitosamente! 🎉');
    console.log('Datos del perfil:', { formData, photos });
  };

  const handleViewPublicProfile = () => {
    navigate('/perfil-publico-creadora');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'resumen' || tab === 'invitaciones') {
      navigate('/dashboard-creadora');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab="configuracion"
        onTabChange={handleTabChange}
      />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-8 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3 flex-wrap">
                <User className="w-7 h-7 text-pink-500" />
                Editar Mi Perfil
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verificado
                </span>
              </h1>
              <p className="text-gray-600">Administra tu información personal y preferencias que verán tus seguidores</p>
            </div>

            <div className="hidden lg:flex gap-3">
              <button
                onClick={handleViewPublicProfile}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Perfil Público
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-[1800px] mx-auto p-8 pt-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Columna Izquierda - Fotos */}
              <div className="xl:col-span-4">
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-pink-500" />
                    Tus Fotos
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-3">
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
                  
                  <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                    <p className="text-xs font-semibold text-pink-700 mb-1">💡 Consejo</p>
                    <p className="text-xs text-gray-700">
                      Las fotos de buena calidad y variadas atraen más seguidores. Muestra tu personalidad!
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Información */}
              <div className="xl:col-span-8 space-y-8">
                <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
                  <button
                    onClick={handleViewPublicProfile}
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center justify-center"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                </div>

                {/* Card: Información Básica */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Información Básica</h2>
                  
                  <div className="space-y-6">
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                        placeholder="Ej: Miraflores, Lima"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Esto ayuda a que usuarios cercanos te encuentren
                      </p>
                    </div>

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

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio de Suscripción Mensual (S/.)
                      </label>
                      <input
                        type="number"
                        value={formData.precioSuscripcion}
                        onChange={(e) => setFormData({ ...formData, precioSuscripcion: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                        placeholder="140"
                        min="10"
                        max="500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Precio recomendado: S/. 100 - S/. 200
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sobre ti
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Escribe sobre tus hobbies, valores y visión de vida. Esto aparecerá en tu perfil público 💫
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
                        <p className={`text-xs font-medium ${formData.bio.length > 450 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {formData.bio.length}/500
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card: Características Físicas */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Características Físicas</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Tu altura: <span className="text-pink-600 text-lg">{formData.altura} cm</span>
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
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Idiomas y Cultura</h2>
                  
                  <div className="space-y-8">
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
                      <p className="text-xs text-gray-500 mt-2">
                        Puedes seleccionar múltiples idiomas
                      </p>
                    </div>

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
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Estilo de Vida</h2>
                  
                  <div className="space-y-8">
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
                      <p className="text-xs text-gray-500 mt-2">
                        Puedes seleccionar múltiples opciones
                      </p>
                    </div>

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
        </div>
      </main>
    </div>
  );
};
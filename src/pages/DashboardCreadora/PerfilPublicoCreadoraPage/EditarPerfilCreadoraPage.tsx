import { useState } from 'react';
import { Camera, X, Calendar, Save, User, Eye, MapPin, Heart, Sparkles, Lock, Users, Image as ImageIcon } from 'lucide-react';
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
    // Información General
    nombre: 'María',
    dedondeEres: 'Lima, Perú',
    ubicacionActual: '',
    fechaNacimiento: '1999-03-15',
    buscando: ['citas-casuales'],
    intereses: ['viajar', 'deportes'],
    sobreTi: 'Soy Ing. Software... y me gusta viajar ✈️ Amante del fitness y la vida saludable 💪',
    
    // Información Privada
    whatsapp: '',
    numeroCuenta: '',
    
    // Precio
    precioSuscripcion: 140,
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

  const handleToggleMultiple = (field: 'buscando' | 'intereses', value: string) => {
    const current = formData[field];
    const isSelected = current.includes(value);
    
    setFormData({
      ...formData,
      [field]: isSelected
        ? current.filter((item) => item !== value)
        : [...current, value]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab="configuracion"
        onTabChange={handleTabChange}
      />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-gradient-to-r from-white via-rose-50 to-purple-50 border-b border-rose-100 p-6 lg:p-8 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3 flex-wrap">
                <User className="w-7 h-7 text-rose-500" />
                Editar Mi Perfil
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
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
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Perfil Público
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Columna Izquierda - Fotos/Videos */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 p-6 sticky top-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Fotos & Videos</h2>
                      <p className="text-xs text-gray-500">Tu galería visual</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {photos[0] && (
                      <div className="col-span-2 relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all aspect-[4/5]">
                        <img
                          src={photos[0]}
                          alt="Foto principal"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <button
                          onClick={() => handleRemovePhoto(0)}
                          className="absolute top-2 right-2 w-7 h-7 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition">
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
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}

                    {Array.from({ length: Math.max(0, 5 - photos.length) }).map((_, index) => (
                      <button
                        key={`empty-${index}`}
                        onClick={handlePhotoUpload}
                        className="aspect-square border-2 border-dashed border-rose-200 rounded-xl flex flex-col items-center justify-center hover:border-rose-400 hover:bg-rose-50 transition group"
                      >
                        <Camera className="w-5 h-5 text-rose-300 group-hover:text-rose-500 transition mb-1" />
                        <span className="text-xs text-rose-400 group-hover:text-rose-600 transition font-medium">Agregar</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Máximo 5 fotos • La primera es tu portada
                  </p>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl border border-rose-100">
                    <p className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Consejo Premium
                    </p>
                    <p className="text-xs text-gray-700">
                      Fotos de calidad y variadas generan 3x más interés
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Información */}
              <div className="lg:col-span-2 space-y-6">
                {/* Botones flotantes móvil */}
                <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
                  <button
                    onClick={handleViewPublicProfile}
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-2xl hover:scale-110 flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all shadow-2xl hover:scale-110 flex items-center justify-center"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                </div>

                {/* Card: Información General */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Información General</h2>
                      <p className="text-xs text-gray-500">Datos básicos de tu perfil</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-white"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ¿De dónde eres?
                      </label>
                      <input
                        type="text"
                        value={formData.dedondeEres}
                        onChange={(e) => setFormData({ ...formData, dedondeEres: e.target.value })}
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-white"
                        placeholder="Ej: Lima, Perú"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Tu ciudad de origen
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        Ubicación actual
                      </label>
                      <input
                        type="text"
                        value={formData.ubicacionActual}
                        onChange={(e) => setFormData({ ...formData, ubicacionActual: e.target.value })}
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-white"
                        placeholder="Escribe o deja que detectemos tu ubicación"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Ayuda a usuarios cercanos a encontrarte
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
                          className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-white"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        ¿Qué estás buscando?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'citas-casuales', label: 'Citas Casuales' },
                          { value: 'relacion', label: 'Relación' },
                          { value: 'matrimonio', label: 'Matrimonio' },
                          { value: 'relacion-online', label: 'Relación Online' },
                          { value: 'amistad', label: 'Amistad' }
                        ].map((opcion) => {
                          const isSelected = formData.buscando.includes(opcion.value);
                          return (
                            <button
                              key={opcion.value}
                              onClick={() => handleToggleMultiple('buscando', opcion.value)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                                  : 'bg-rose-50 text-gray-700 hover:bg-rose-100 border border-rose-200'
                              }`}
                            >
                              {opcion.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selecciona una o más opciones
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-500" />
                        Intereses
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'viajar', label: 'Viajar' },
                          { value: 'deportes', label: 'Deportes' },
                          { value: 'cine', label: 'Cine' },
                          { value: 'conciertos', label: 'Conciertos' },
                          { value: 'cocina', label: 'Cocina' },
                          { value: 'lectura', label: 'Lectura' },
                          { value: 'musica', label: 'Música' },
                          { value: 'arte', label: 'Arte' },
                          { value: 'tecnologia', label: 'Tecnología' },
                          { value: 'naturaleza', label: 'Naturaleza' },
                          { value: 'fitness', label: 'Fitness' },
                          { value: 'moda', label: 'Moda' }
                        ].map((interes) => {
                          const isSelected = formData.intereses.includes(interes.value);
                          return (
                            <button
                              key={interes.value}
                              onClick={() => handleToggleMultiple('intereses', interes.value)}
                              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                                  : 'bg-rose-50 text-gray-700 hover:bg-rose-100 border border-rose-200'
                              }`}
                            >
                              {interes.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Comparte tus pasiones e intereses
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sobre ti
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Cuéntanos sobre tus hobbies, valores y visión de vida
                      </p>
                      <textarea
                        value={formData.sobreTi}
                        onChange={(e) => setFormData({ ...formData, sobreTi: e.target.value })}
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition bg-white"
                        placeholder="Escribe algo sobre ti..."
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">Máximo 500 caracteres</p>
                        <p className={`text-xs font-medium ${formData.sobreTi.length > 450 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {formData.sobreTi.length}/500
                        </p>
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
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-white"
                        placeholder="140"
                        min="10"
                        max="500"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Precio recomendado: S/. 100 - S/. 200
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card: Información Privada */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Información Privada</h2>
                      <p className="text-xs text-gray-500">Solo visible para ti y administradores</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
                        placeholder="+51 999 999 999"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Para contacto y verificación
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Cuenta Bancaria
                      </label>
                      <input
                        type="text"
                        value={formData.numeroCuenta}
                        onChange={(e) => setFormData({ ...formData, numeroCuenta: e.target.value })}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
                        placeholder="Ej: BCP 123-456789-0-00"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Para transferencias y pagos
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                      <div className="flex gap-3">
                        <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-purple-900 mb-1">
                            Información Protegida
                          </p>
                          <p className="text-xs text-gray-700">
                            Estos datos están encriptados y nunca se mostrarán públicamente. Solo se usan para procesos internos y pagos.
                          </p>
                        </div>
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

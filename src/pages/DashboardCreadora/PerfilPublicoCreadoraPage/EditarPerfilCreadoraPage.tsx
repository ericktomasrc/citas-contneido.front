import { useState } from 'react';
import { Camera, X, Calendar, Save, User, Eye, MapPin, Heart, Sparkles, Lock, Users, UserPlus, Image, Video, Upload, Search, MoreVertical } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { useNavigate } from 'react-router-dom';

type TabType = 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes';
type ProfileTab = 'general' | 'privada' | 'comunidad' | 'seguidores' | 'fotos-videos';

export const EditarPerfilCreadoraPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('general');
  const [profilePhoto, setProfilePhoto] = useState('https://i.pravatar.cc/400?img=5');
  const [searchComunidad, setSearchComunidad] = useState('');
  const [searchSeguidores, setSearchSeguidores] = useState('');
  const [activeTab] = useState<TabType>('configuracion');
  
  const [formData, setFormData] = useState({
    nombre: 'María García',
    dedondeEres: 'Lima, Perú',
    ubicacion: '',
    fechaNacimiento: '1999-03-15',
    buscando: ['citas-casuales', 'relacion'],
    intereses: ['viajar', 'deportes', 'cine'],
    bio: 'Me encanta viajar y conocer nuevas culturas. Apasionada por el fitness y la vida saludable. 🌟',
    whatsapp: '',
    numeroCuenta: ''
  });

  // Mock data para comunidad y seguidores
  const [comunidad] = useState([
    { id: 1, nombre: 'Carlos M.', foto: 'https://i.pravatar.cc/150?img=12', desde: 'Hace 2 meses' },
    { id: 2, nombre: 'Diego R.', foto: 'https://i.pravatar.cc/150?img=13', desde: 'Hace 1 mes' },
    { id: 3, nombre: 'Andrés P.', foto: 'https://i.pravatar.cc/150?img=14', desde: 'Hace 3 semanas' },
    { id: 4, nombre: 'Roberto L.', foto: 'https://i.pravatar.cc/150?img=15', desde: 'Hace 1 semana' },
  ]);

  const [seguidores] = useState([
    { id: 1, nombre: 'Juan S.', foto: 'https://i.pravatar.cc/150?img=16', ubicacion: 'Miraflores, Lima' },
    { id: 2, nombre: 'Pedro G.', foto: 'https://i.pravatar.cc/150?img=17', ubicacion: 'San Isidro, Lima' },
    { id: 3, nombre: 'Luis F.', foto: 'https://i.pravatar.cc/150?img=18', ubicacion: 'Barranco, Lima' },
    { id: 4, nombre: 'Miguel A.', foto: 'https://i.pravatar.cc/150?img=19', ubicacion: 'Surco, Lima' },
    { id: 5, nombre: 'Jorge T.', foto: 'https://i.pravatar.cc/150?img=20', ubicacion: 'La Molina, Lima' },
  ]);

  const [mediaFiles, setMediaFiles] = useState([
    { id: 1, type: 'photo', url: 'https://i.pravatar.cc/400?img=1', fecha: '10 Ene 2026' },
    { id: 2, type: 'photo', url: 'https://i.pravatar.cc/400?img=2', fecha: '9 Ene 2026' },
    { id: 3, type: 'video', url: 'https://i.pravatar.cc/400?img=3', fecha: '8 Ene 2026', duracion: '2:30' },
    { id: 4, type: 'photo', url: 'https://i.pravatar.cc/400?img=4', fecha: '7 Ene 2026' },
  ]);

  const handleProfilePhotoUpload = () => {
    const newPhoto = `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70)}`;
    setProfilePhoto(newPhoto);
  };

  const handleMediaUpload = () => {
    const newMedia = {
      id: mediaFiles.length + 1,
      type: Math.random() > 0.5 ? 'photo' : 'video',
      url: `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70)}`,
      fecha: 'Hoy',
      duracion: Math.random() > 0.5 ? `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60)}` : undefined
    };
    setMediaFiles([newMedia, ...mediaFiles]);
  };

  const handleRemoveMedia = (id: number) => {
    setMediaFiles(mediaFiles.filter(m => m.id !== id));
  };

  const handleSave = () => {
    alert('¡Perfil guardado exitosamente! 🎉');
    console.log('Datos del perfil:', formData);
  };

  const handleViewPublicProfile = () => {
    navigate('/perfil-publico-creadora');
  };

  const handleTabChange = (tab: TabType) => {
    // Navegar al dashboard con el tab correspondiente
    navigate(`/dashboard-creadora?tab=${tab}`);
  };

  const filteredComunidad = comunidad.filter(m => 
    m.nombre.toLowerCase().includes(searchComunidad.toLowerCase())
  );

  const filteredSeguidores = seguidores.filter(s => 
    s.nombre.toLowerCase().includes(searchSeguidores.toLowerCase())
  );

  const profileTabs = [
    { id: 'general' as ProfileTab, label: 'Información General', icon: User },
    { id: 'privada' as ProfileTab, label: 'Información Privada', icon: Lock },
    { id: 'comunidad' as ProfileTab, label: 'Comunidad', icon: Users },
    { id: 'seguidores' as ProfileTab, label: 'Seguidores', icon: UserPlus },
    { id: 'fotos-videos' as ProfileTab, label: 'Fotos y Videos', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <SidebarCreadora
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-20 overflow-hidden flex flex-col">
        {/* Header con foto de perfil - MÁS COMPACTO */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {/* Foto de perfil circular - MÁS PEQUEÑA */}
                <div className="relative group">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={profilePhoto}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleProfilePhotoUpload}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-md hover:from-pink-600 hover:to-rose-600 transition-all"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>

                <div>
                  <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    {formData.nombre}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </span>
                  </h1>
                  <p className="text-xs text-gray-600">Edita tu perfil y preferencias</p>
                </div>
              </div>

              <div className="hidden lg:flex gap-2">
                <button
                  onClick={handleViewPublicProfile}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Perfil
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación - MÁS COMPACTOS */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide gap-0.5">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all whitespace-nowrap text-xs ${
                    activeProfileTab === tab.id
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            {/* Tab: Información General */}
            {activeProfileTab === 'general' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-500" />
                    Información Básica
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Fecha de nacimiento
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.fechaNacimiento}
                          onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        ¿De dónde eres?
                      </label>
                      <input
                        type="text"
                        value={formData.dedondeEres}
                        onChange={(e) => setFormData({ ...formData, dedondeEres: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                        placeholder="Ej: Lima, Perú"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Tu ciudad o país de origen
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Ubicación actual
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.ubicacion}
                          onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                          className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                          placeholder="Escribe o permite ubicación"
                        />
                        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Ayuda a usuarios cercanos a encontrarte
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      ¿Qué estás buscando?
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['citas-casuales', 'relacion', 'matrimonio', 'relacion-en-linea'].map((tipo) => {
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
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5">
                      Puedes seleccionar múltiples opciones
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Intereses
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['viajar', 'deportes', 'cine', 'conciertos', 'arte', 'lectura', 'cocina', 'tecnologia', 'moda', 'musica'].map((interes) => {
                        const isSelected = formData.intereses.includes(interes);
                        return (
                          <button
                            key={interes}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                intereses: isSelected
                                  ? formData.intereses.filter((i) => i !== interes)
                                  : [...formData.intereses, interes]
                              });
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {interes.charAt(0).toUpperCase() + interes.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5">
                      Selecciona tus pasatiempos favoritos
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Sobre ti
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      maxLength={300}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition text-sm"
                      placeholder="Cuéntanos sobre ti..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-gray-500">Máximo 300 caracteres</p>
                      <p className={`text-[10px] font-medium ${formData.bio.length > 270 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {formData.bio.length}/300
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Información Privada */}
            {activeProfileTab === 'privada' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-start gap-2 mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-900">Información Confidencial</p>
                      <p className="text-[10px] text-amber-700 mt-0.5">
                        Esta información es privada y solo será visible para ti
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                        placeholder="+51 999 999 999"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Para que tus seguidores puedan contactarte
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Número de cuenta bancaria
                      </label>
                      <input
                        type="text"
                        value={formData.numeroCuenta}
                        onChange={(e) => setFormData({ ...formData, numeroCuenta: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-sm"
                        placeholder="Número de cuenta para retiros"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Para procesar tus pagos y retiros
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Comunidad */}
            {activeProfileTab === 'comunidad' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-500" />
                      Comunidad ({comunidad.length})
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={searchComunidad}
                        onChange={(e) => setSearchComunidad(e.target.value)}
                        placeholder="Buscar..."
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs w-40"
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    Tus suscriptores activos con acceso a contenido premium
                  </p>

                  <div className="space-y-1.5">
                    {filteredComunidad.map((miembro) => (
                      <div
                        key={miembro.id}
                        className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                            <img
                              src={miembro.foto}
                              alt={miembro.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{miembro.nombre}</p>
                            <p className="text-[10px] text-gray-500">Suscriptor {miembro.desde}</p>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {filteredComunidad.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No se encontraron miembros</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Seguidores */}
            {activeProfileTab === 'seguidores' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-pink-500" />
                      Seguidores ({seguidores.length})
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={searchSeguidores}
                        onChange={(e) => setSearchSeguidores(e.target.value)}
                        placeholder="Buscar..."
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs w-40"
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    Personas que siguen tu perfil y ven tu contenido público
                  </p>

                  <div className="space-y-1.5">
                    {filteredSeguidores.map((seguidor) => (
                      <div
                        key={seguidor.id}
                        className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                            <img
                              src={seguidor.foto}
                              alt={seguidor.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{seguidor.nombre}</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {seguidor.ubicacion}
                            </p>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {filteredSeguidores.length === 0 && (
                    <div className="text-center py-8">
                      <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No se encontraron seguidores</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Fotos y Videos */}
            {activeProfileTab === 'fotos-videos' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Image className="w-4 h-4 text-pink-500" />
                      Fotos y Videos ({mediaFiles.length})
                    </h2>
                    <button
                      onClick={handleMediaUpload}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm flex items-center gap-1.5 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Subir
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    Comparte fotos y videos con tu comunidad
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {mediaFiles.map((media) => (
                      <div
                        key={media.id}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-pink-300 transition group"
                      >
                        <img
                          src={media.url}
                          alt={`Media ${media.id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {media.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Video className="w-4 h-4 text-gray-700" />
                            </div>
                            {media.duracion && (
                              <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {media.duracion}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-1.5 left-1.5 text-white text-[10px]">
                            {media.fecha}
                          </div>
                          <button
                            onClick={() => handleRemoveMedia(media.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {mediaFiles.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                      <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-2">Aún no has subido fotos o videos</p>
                      <button
                        onClick={handleMediaUpload}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm text-xs"
                      >
                        Subir tu primer archivo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones flotantes para móvil - MÁS PEQUEÑOS */}
        <div className="lg:hidden fixed bottom-5 right-5 z-40 flex flex-col gap-2">
          <button
            onClick={handleViewPublicProfile}
            className="w-11 h-11 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleSave}
            className="w-11 h-11 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <Save className="w-4.5 h-4.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
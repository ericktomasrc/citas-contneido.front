import { useState, useRef } from 'react';
import { X, Calendar, Save, Upload, User } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard'; 
import { DashboardEspectadorLayout } from '../layouts/DashboardEspectadorLayout';
 
 const MyProfilePageContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [photo, setPhoto] = useState<string>('https://i.pravatar.cc/400?img=12'); // Solo una foto
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
 
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ La imagen debe pesar menos de 5MB');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPhoto(imageUrl); // Reemplazar la foto existente
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // TODO: Subir al servidor
    console.log('📸 Subiendo foto:', file.name);
  };

  const handleRemovePhoto = () => {
    setPhoto(''); // Eliminar la foto
    console.log('🗑️ Foto eliminada');
  };

  const handleSave = () => {
    if (!photo) {
      alert('⚠️ Debes subir una foto de perfil');
      return;
    }
    
    alert('¡Perfil guardado exitosamente! 🎉');
    console.log('Datos del perfil:', formData, photo);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      /> 
      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />       

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              <h1 className="text-xl font-bold text-slate-800">Mi Perfil</h1>
            </div>
            
            {/* Botón Guardar en header para desktop */}
            {/* <div className="hidden lg:flex">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div> */}
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda - Foto Principal e Info Básica */}
              <div className="lg:col-span-1 space-y-6">
                {/* Card de Foto Principal */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">Foto de Perfil</h3>
                    {photo && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        ✓ Subida
                      </span>
                    )}
                  </div>

                  {/* Foto Principal */}
                  {photo ? (
                    <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 hover:border-violet-300 transition-colors">
                      <div className="aspect-[3/4] bg-slate-100">
                        <img
                          src={photo}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Botones de acción */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white/95 hover:bg-white backdrop-blur-sm text-slate-800 rounded-lg font-semibold text-sm transition shadow-lg flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Cambiar
                        </button>
                        <button
                          onClick={handleRemovePhoto}
                          className="px-4 py-2 bg-red-500/95 hover:bg-red-500 backdrop-blur-sm text-white rounded-lg font-semibold text-sm transition shadow-lg flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Estado sin foto
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-[3/4] border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-xl bg-slate-50 hover:bg-violet-50 transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-16 h-16 bg-slate-200 group-hover:bg-violet-100 rounded-full flex items-center justify-center transition-colors">
                          <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-600 transition-colors" />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-sm font-semibold text-slate-700 group-hover:text-violet-600 transition-colors mb-1">
                            Sube tu foto de perfil
                          </p>
                          <p className="text-xs text-slate-500">
                            JPG, PNG o GIF • Máx 5MB
                          </p>
                        </div>
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 text-center px-2 mt-3">
                    Esta será tu foto principal en tu perfil
                  </p>
                </div>

                {/* Card: Información Básica */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Información Básica</h3>
                  
                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Alias
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-white"
                        placeholder="Tu nombre"
                      />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Fecha de nacimiento
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.fechaNacimiento}
                          onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-white"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sobre ti
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        maxLength={500}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none transition bg-white"
                        placeholder="Cuéntanos sobre ti..."
                      />
                      <p className="text-[10px] text-slate-500 text-right mt-1">
                        {formData.bio.length}/500
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Características (igual que antes) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Botón flotante para móvil */}
                <div className="lg:hidden fixed bottom-6 right-6 z-40">
                  <button
                    onClick={handleSave}
                    className="w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center"
                  >
                    <Save className="w-6 h-6" />
                  </button>
                </div>

                {/* Cards de características (mantener igual que antes) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Características Físicas</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Tipo de cuerpo
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['delgado', 'con-curvas', 'atletico', 'promedio', 'exceso-de-peso', 'otros'].map((tipo) => (
                          <button
                            key={tipo}
                            onClick={() => setFormData({ ...formData, tipoCuerpo: tipo })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              formData.tipoCuerpo === tipo
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {tipo.replace('-', ' ').charAt(0).toUpperCase() + tipo.slice(1).replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Tu apariencia
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['muy-atractivo', 'atractivo', 'promedio', 'debajo-del-promedio'].map((apariencia) => (
                          <button
                            key={apariencia}
                            onClick={() => setFormData({ ...formData, apariencia })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              formData.apariencia === apariencia
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {apariencia.replace('-', ' ').charAt(0).toUpperCase() + apariencia.slice(1).replace(/-/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Idiomas y Cultura</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {idioma.charAt(0).toUpperCase() + idioma.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Nivel de inglés
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['malo', 'medio', 'bueno', 'fluido'].map((nivel) => (
                          <button
                            key={nivel}
                            onClick={() => setFormData({ ...formData, nivelIngles: nivel })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              formData.nivelIngles === nivel
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Estilo de Vida</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
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
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {tipo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                        {/* Botón Guardar en header para desktop */}
            <div className="hidden lg:flex">
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Cambios
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
      </main> 
    </div>
  );
};

export const MyProfilePage = () => (
  <DashboardEspectadorLayout>
    <MyProfilePageContent />
  </DashboardEspectadorLayout>
);


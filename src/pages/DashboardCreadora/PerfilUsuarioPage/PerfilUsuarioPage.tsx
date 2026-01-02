import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, X, Image } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';

export const PerfilUsuarioPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab] = useState<'invitaciones'>('invitaciones');

  const usuario = {
    id: 1,
    nombre: 'Juan Pérez',
    edad: 28,
    ubicacion: 'San Isidro, Lima',
    distancia: 2.3,
    avatar: 'https://i.pravatar.cc/400?img=12',
    biografia: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida. 🏋️‍♀️✈️ Siempre buscando nuevas aventuras y experiencias inolvidables.',
    fechaInvitacion: '2025-01-02',
    fotos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400',
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    ],
    informacionBasica: {
      profesion: 'Ingeniero de Software',
      educacion: 'Universidad Católica',
      estadoCivil: 'Soltero',
      hijos: 'No',
    },
    intereses: ['Fitness', 'Viajes', 'Tecnología', 'Cine', 'Música'],
  };

  const handleTabChange = (tab: 'resumen' | 'contenido' | 'packs' | 'envivo' | 'mensajes' | 'invitaciones' | 'donaciones' | 'configuracion' | 'reportes') => {
    navigate('/dashboard-creadora');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarCreadora 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Contenedor principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Columna izquierda - Perfil e información */}
            <div className="xl:col-span-1 space-y-6">
              {/* Card de perfil CON BOTÓN VOLVER ARRIBA */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                {/* Header con gradiente rosa */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-pink-600 font-medium transition group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Volver</span>
                  </button>
                </div>

                {/* Avatar grande estilo Instagram */}
                <div className="p-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 mb-4">
                      <div className="w-full h-full bg-white rounded-full p-1">
                        <img
                          src={usuario.avatar}
                          alt={usuario.nombre}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {usuario.nombre}, {usuario.edad}
                    </h1>

                    <div className="flex items-center gap-1.5 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{usuario.ubicacion}</span>
                      <span className="text-gray-400">• {usuario.distancia} km</span>
                    </div>

                    {/* Fecha de invitación */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg border border-pink-200">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      <span className="text-sm font-semibold text-pink-700">
                        Invitación: {new Date(usuario.fechaInvitacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Biografía */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Sobre mí</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {usuario.biografia}
                    </p>
                  </div>

                  {/* Información básica */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Información básica</h3>
                    
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Profesión</p>
                        <p className="text-sm font-medium text-gray-900">{usuario.informacionBasica.profesion}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Educación</p>
                        <p className="text-sm font-medium text-gray-900">{usuario.informacionBasica.educacion}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Estado civil</p>
                        <p className="text-sm font-medium text-gray-900">{usuario.informacionBasica.estadoCivil}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Hijos</p>
                        <p className="text-sm font-medium text-gray-900">{usuario.informacionBasica.hijos}</p>
                      </div>
                    </div>
                  </div>

                  {/* Intereses */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {usuario.intereses.map((interes, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg text-sm font-medium text-pink-700"
                        >
                          {interes}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Aceptar Invitación
                  </button>
                  
                  <button className="w-full bg-white hover:bg-gray-50 border-2 border-red-500 text-red-500 hover:text-red-600 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <X className="w-5 h-5" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>

            {/* Columna derecha - Galería de fotos */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
                {/* Header con icono */}
                <div className="flex items-center gap-3 mb-6">
                  <Image className="w-7 h-7 text-pink-500" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Fotos ({usuario.fotos.length})
                  </h3>
                </div>
                
                {/* Grid 4 columnas - MÁS PEQUEÑO */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usuario.fotos.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(foto)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-pink-500 transition-all group cursor-pointer"
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para ver foto en grande */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] w-full">
            <img
              src={selectedPhoto}
              alt="Foto ampliada"
              className="w-full h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
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
    biografia: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida. \n🏋️‍♀️✈️ Siempre buscando nuevas aventuras y experiencias inolvidables.',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarCreadora 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Botón volver - FUERA del contenedor principal */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-500 font-medium transition group mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver</span>
          </button>

          {/* CONTENEDOR ÚNICO - SIN MÚLTIPLES CARDS */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100/50 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-slate-100/50">
              
              {/* Columna izquierda - Perfil (SIN CARD INTERNO) */}
              <div className="xl:col-span-1 p-8">
                {/* Avatar elegante con ring sutil */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-full ring-4 ring-purple-100/50 ring-offset-4 mb-4 overflow-hidden">
                    <img
                      src={usuario.avatar}
                      alt={usuario.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h1 className="text-2xl font-bold text-slate-800 mb-1">
                    {usuario.nombre}, {usuario.edad}
                  </h1>

                  <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{usuario.ubicacion}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm">{usuario.distancia} km</span>
                  </div>

                  {/* Fecha de invitación - SUTIL */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50/50 rounded-xl border border-purple-100/50">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(usuario.fechaInvitacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Biografía - SIN BORDER PESADO */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Sobre mí
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {usuario.biografia}
                  </p>
                </div>

                {/* Información básica - DISEÑO LIMPIO */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Información básica
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-50/50 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-0.5">Profesión</p>
                        <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.profesion}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-50/50 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-0.5">Educación</p>
                        <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.educacion}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-50/50 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-0.5">Estado civil</p>
                        <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.estadoCivil}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-50/50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-0.5">Hijos</p>
                        <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.hijos}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intereses - PILLS SUTILES */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    Intereses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {usuario.intereses.map((interes, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-violet-50/50 border border-purple-100/50 rounded-lg text-xs font-medium text-slate-600"
                      >
                        {interes}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botones de acción - COLORES SUAVES */}
                <div className="space-y-2.5">
                  <button className="w-full bg-gradient-to-r from-emerald-400/90 to-teal-400/90 hover:from-emerald-400 hover:to-teal-400 text-white py-3 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Aceptar Invitación
                  </button>
                  
                  <button className="w-full bg-white hover:bg-slate-50 border border-rose-200/50 text-rose-400 hover:text-rose-500 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <X className="w-5 h-5" />
                    Rechazar
                  </button>
                </div>
              </div>

              {/* Columna derecha - Galería (INTEGRADA, SIN CARD SEPARADO) */}
              <div className="xl:col-span-2 p-8">
                {/* Header minimalista */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100/50 to-pink-100/50 flex items-center justify-center">
                    <Image className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Fotos <span className="text-slate-400 font-normal">({usuario.fotos.length})</span>
                  </h3>
                </div>
                
                {/* Grid 4 columnas - SIN BORDERS PESADOS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usuario.fotos.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(foto)}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-100/50 hover:border-purple-200 hover:shadow-md transition-all group cursor-pointer bg-slate-50/50"
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para ver foto en grande - MEJORADO */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
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

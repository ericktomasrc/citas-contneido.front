import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, X, Image } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { OnlineCreator } from '@/shared/types/creator.types';
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

export const PerfilUsuarioPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab] = useState<'invitaciones'>('invitaciones');

  // Mock data - Creadoras en línea
  const onlineCreators: OnlineCreatorExtended[] = [
    { id: 1, slug: 'maria-rodriguez-a7k3', nombre: 'Chelsea', edad: 24, avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, isFavorite: true },
    { id: 2, slug: 'amanda-garcia-b9d2', nombre: 'Amanda', edad: 26, avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, isFavorite: false },
    { id: 3, slug: 'chloe-martin-c4f7', nombre: 'Chloe', edad: 22, avatar: 'https://i.pravatar.cc/150?img=3', isLive: true, isFavorite: false },
    { id: 4, slug: 'leslie-hall-e8k1', nombre: 'Leslie', edad: 28, avatar: 'https://i.pravatar.cc/150?img=4', isLive: false, isFavorite: true },
    { id: 5, slug: 'maria-lopez-d3j9', nombre: 'María', edad: 25, avatar: 'https://i.pravatar.cc/150?img=5', isLive: false, isFavorite: false },
    { id: 6, slug: 'ana-martinez-f6l4', nombre: 'Ana', edad: 27, avatar: 'https://i.pravatar.cc/150?img=6', isLive: true, isFavorite: true },
    { id: 7, slug: 'sofia-gonzalez-h7k2', nombre: 'Sofía', edad: 23, avatar: 'https://i.pravatar.cc/150?img=7', isLive: false, isFavorite: false },
    { id: 8, slug: 'lucia-morales-j9l8', nombre: 'Lucía', edad: 29, avatar: 'https://i.pravatar.cc/150?img=8', isLive: false, isFavorite: true },
    { id: 9, slug: 'valeria-castro-t8n4', nombre: 'Valeria', edad: 24, avatar: 'https://i.pravatar.cc/150?img=9', isLive: true, isFavorite: false },
    { id: 10, slug: 'camila-torres-r3b9', nombre: 'Camila', edad: 26, avatar: 'https://i.pravatar.cc/150?img=10', isLive: false, isFavorite: true },
    { id: 11, slug: 'daniela-ruiz-w5p3', nombre: 'Daniela', edad: 25, avatar: 'https://i.pravatar.cc/150?img=11', isLive: true, isFavorite: false },
    { id: 12, slug: 'andrea-silva-q7m8', nombre: 'Andrea', edad: 28, avatar: 'https://i.pravatar.cc/150?img=12', isLive: false, isFavorite: false },
  ];

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

  const handleAceptar = () => {
    console.log('✅ Invitación aceptada');
    // TODO: Conectar con backend
  };

  const handleRechazar = () => {
    console.log('❌ Invitación rechazada');
    // TODO: Conectar con backend
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarCreadora 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <OnlineCreatorsSidebar creators={onlineCreators} />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 pr-0 lg:pr-24 overflow-hidden flex flex-col">
        {/* Header Fijo */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-pink-500 font-medium transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver</span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-6">
            {/* Grid Principal */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Columna Izquierda - Info del Usuario */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full ring-4 ring-pink-100 ring-offset-4 mb-4 overflow-hidden">
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

                    {/* Fecha de invitación */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-xl border border-violet-200">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {new Date(usuario.fechaInvitacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Biografía */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Sobre mí</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {usuario.biografia}
                    </p>
                  </div>

                  {/* Información básica */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Información básica</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 mb-0.5">Profesión</p>
                          <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.profesion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 mb-0.5">Educación</p>
                          <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.educacion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 mb-0.5">Estado civil</p>
                          <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.estadoCivil}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 mb-0.5">Hijos</p>
                          <p className="text-sm font-medium text-slate-700">{usuario.informacionBasica.hijos}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intereses */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {usuario.intereses.map((interes, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg text-xs font-medium text-slate-600"
                        >
                          {interes}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción - MANTENER BONITOS */}
                  <div className="space-y-2.5">
                    <button 
                      onClick={handleAceptar}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" fill="currentColor" />
                      Aceptar Invitación
                    </button>
                    
                    <button 
                      onClick={handleRechazar}
                      className="w-full bg-white hover:bg-slate-50 border-2 border-rose-200 hover:border-rose-300 text-rose-500 hover:text-rose-600 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Galería */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                      <Image className="w-5 h-5 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Fotos <span className="text-slate-400 font-normal">({usuario.fotos.length})</span>
                    </h3>
                  </div>
                  
                  {/* Grid de fotos */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {usuario.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhoto(foto)}
                        className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer"
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
        </div>
      </main>

      {/* Modal para ver foto en grande */}
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

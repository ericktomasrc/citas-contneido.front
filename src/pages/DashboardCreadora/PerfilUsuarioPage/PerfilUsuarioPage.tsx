import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, X, Image, Flag, Check } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { OnlineCreator } from '@/shared/types/creator.types';
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';
import { TabTypeMenu } from '../hooks/useTabs';

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
    biografia: 'Ingeniero de software apasionado por la tecnología y la innovación. Me encanta viajar, conocer nuevas culturas y disfrutar de buena comida. Busco conexiones genuinas.',
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
      'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400',
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
    ],
    informacionBasica: {
      profesion: 'Ingeniero de Software',
      educacion: 'Universidad Católica',
      estadoCivil: 'Soltero',
      hijos: 'No',
    },
    intereses: ['Fitness', 'Viajes', 'Tecnología', 'Cine', 'Música', 'Gastronomía'],
  };

  const handleTabChange = (tab: TabTypeMenu) => {
    navigate(`/dashboard-creadora?tab=${tab}`);
  };

  const handleAceptar = () => {
    console.log('✅ Invitación aceptada');
    alert('✅ Invitación aceptada correctamente');
    navigate('/dashboard-creadora?tab=resumen');
  };

  const handleRechazar = () => {
    console.log('❌ Invitación rechazada');
    if (confirm('¿Estás segura de rechazar esta invitación?')) {
      alert('❌ Invitación rechazada');
      navigate('/dashboard-creadora?tab=resumen');
    }
  };

  const handleDenunciar = () => {
    console.log('🚨 Usuario denunciado');
    if (confirm('¿Deseas reportar a este usuario? Nuestro equipo revisará el caso.')) {
      alert('🚨 Denuncia enviada. Revisaremos el caso pronto.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <NavbarCreadora onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarCreadora 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      /> 

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-20 pr-0 lg:pr-20 overflow-hidden flex flex-col">
        {/* Header Superior - TODO EN UNA LÍNEA */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-6">
              
              {/* Izquierda: Botón Volver + Avatar + Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Botón Volver */}
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1.5 text-gray-600 hover:text-pink-500 font-medium transition group text-sm flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Volver</span>
                </button>

                {/* Avatar + Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-14 h-14 rounded-full ring-2 ring-pink-200 ring-offset-2 overflow-hidden flex-shrink-0">
                    <img
                      src={usuario.avatar}
                      alt={usuario.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h1 className="text-base font-bold text-gray-900">
                        {usuario.nombre}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-gray-500 mb-1">Edita tu perfil y preferencias</p>

                    <div className="flex items-center gap-2 text-[11px]">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{usuario.ubicacion}</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-50 rounded border border-violet-200">
                        <Calendar className="w-2.5 h-2.5 text-violet-500" />
                        <span className="text-[10px] font-medium text-gray-700">
                          Invitación: {new Date(usuario.fechaInvitacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derecha: Botones de Acción */}
              <div className="hidden lg:flex gap-2 flex-shrink-0">
                <button 
                  onClick={handleAceptar}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Aceptar
                </button>
                
                <button 
                  onClick={handleRechazar}
                  className="bg-white hover:bg-gray-50 border border-rose-300 hover:border-rose-400 text-rose-500 hover:text-rose-600 px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  Rechazar
                </button>

                <button 
                  onClick={handleDenunciar}
                  className="bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 text-red-500 hover:text-red-600 px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 text-xs"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Denunciar
                </button>
              </div>
            </div>

            {/* Botones móvil - Debajo */}
            <div className="lg:hidden flex gap-2 mt-3">
              <button 
                onClick={handleAceptar}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 text-sm"
              >
                <Check className="w-4 h-4" />
                Aceptar
              </button>
              
              <button 
                onClick={handleRechazar}
                className="flex-1 bg-white hover:bg-gray-50 border border-rose-300 hover:border-rose-400 text-rose-500 hover:text-rose-600 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm"
              >
                <X className="w-4 h-4" />
                Rechazar
              </button>

              <button 
                onClick={handleDenunciar}
                className="flex-1 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 text-red-500 hover:text-red-600 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm"
              >
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido con Scroll - Info + Fotos */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Columna Izquierda - Información */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {/* Biografía */}
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Sobre él</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {usuario.biografia}
                    </p>
                  </div>

                  {/* Información básica - Grid 2x2 */}
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Información básica</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 mb-0.5">Profesión</p>
                          <p className="text-xs font-medium text-gray-900 truncate">{usuario.informacionBasica.profesion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 mb-0.5">Educación</p>
                          <p className="text-xs font-medium text-gray-900 truncate">{usuario.informacionBasica.educacion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 mb-0.5">Estado civil</p>
                          <p className="text-xs font-medium text-gray-900">{usuario.informacionBasica.estadoCivil}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500 mb-0.5">Hijos</p>
                          <p className="text-xs font-medium text-gray-900">{usuario.informacionBasica.hijos}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intereses */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {usuario.intereses.map((interes, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-violet-50 border border-violet-200 rounded-md text-[11px] font-medium text-gray-700"
                        >
                          {interes}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Galería de Fotos */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                      <Image className="w-4.5 h-4.5 text-violet-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Fotos <span className="text-gray-400 font-normal text-sm">({usuario.fotos.length})</span>
                    </h3>
                  </div>
                  
                  {/* Grid de fotos */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {usuario.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhoto(foto)}
                        className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer"
                      >
                        <img
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Tips de evaluación */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">💡</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-900 mb-1">Tips de evaluación</p>
                        <p className="text-[10px] text-amber-700 leading-relaxed">
                          Revisa cuidadosamente el perfil, fotos e información. Acepta solo si cumple con tus criterios y te sientes cómoda. Puedes denunciar perfiles sospechosos.
                        </p>
                      </div>
                    </div>
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
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-4xl max-h-[90vh] w-full">
            <img
              src={selectedPhoto}
              alt="Foto ampliada"
              className="w-full h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

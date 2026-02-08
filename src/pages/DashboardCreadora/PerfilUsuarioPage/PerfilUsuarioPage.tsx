// src/pages/DashboardCreadora/PerfilUsuario/PerfilUsuarioPage.tsx
// ✅ MEJORADO: Elementos más pequeños, colores originales mantenidos, modal con Portal

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, X, Image, Flag, Check } from 'lucide-react';
import { NavbarCreadora } from '../../../components/DashboardCreadora/Navbar/NavbarCreadora';
import { SidebarCreadora } from '../../../components/DashboardCreadora/Sidebar/SidebarCreadora';
import { OnlineCreator } from '@/shared/types/creator.types';
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

  // Modal con Portal - Pantalla completa con navegación
  const PhotoModal = () => {
    if (!selectedPhoto) return null;
    
    const currentIndex = usuario.fotos.indexOf(selectedPhoto);
    const totalPhotos = usuario.fotos.length;
    
    const goToPrevious = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newIndex = currentIndex === 0 ? totalPhotos - 1 : currentIndex - 1;
      setSelectedPhoto(usuario.fotos[newIndex]);
    };
    
    const goToNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newIndex = currentIndex === totalPhotos - 1 ? 0 : currentIndex + 1;
      setSelectedPhoto(usuario.fotos[newIndex]);
    };

    // Navegación con teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious(e as any);
      if (e.key === 'ArrowRight') goToNext(e as any);
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    
    return createPortal(
      <div
        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
        onClick={() => setSelectedPhoto(null)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setSelectedPhoto(null)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Contador de fotos */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm font-medium z-10">
          {currentIndex + 1} / {totalPhotos}
        </div>

        {/* Botón anterior */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* Imagen principal - Ocupa toda la pantalla */}
        <div 
          className="w-full h-full flex items-center justify-center p-16"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={selectedPhoto}
            alt={`Foto ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Botón siguiente */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
        >
          <ArrowLeft className="w-6 h-6 rotate-180" strokeWidth={2} />
        </button>

        {/* Miniaturas en la parte inferior */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 rounded-full z-10">
          {usuario.fotos.map((foto, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(foto);
              }}
              className={`w-10 h-10 rounded-md overflow-hidden border-2 transition ${
                index === currentIndex 
                  ? 'border-white scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={foto}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
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

      <main className="fixed top-14 left-0 right-0 bottom-0 lg:left-16 overflow-hidden flex flex-col">
        {/* Header Superior Compacto */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 py-2.5">
            <div className="flex items-center gap-4">
              
              {/* Izquierda: Botón Volver + Avatar + Info */}
              <div className="flex items-center gap-3 flex-1">
                {/* Botón Volver */}
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-pink-500 font-medium transition group text-xs flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
                  <span>Volver</span>
                </button>

                {/* Avatar + Info */}
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-10 h-10 rounded-full ring-2 ring-pink-200 ring-offset-1 overflow-hidden flex-shrink-0">
                    <img
                      src={usuario.avatar}
                      alt={usuario.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h1 className="text-sm font-semibold text-gray-900">
                        {usuario.nombre}
                      </h1>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full">
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <div className="flex items-center gap-0.5 text-gray-500">
                        <MapPin className="w-2.5 h-2.5" strokeWidth={2} />
                        <span>{usuario.ubicacion}</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-violet-50 rounded border border-violet-200">
                        <Calendar className="w-2.5 h-2.5 text-violet-500" strokeWidth={2} />
                        <span className="text-[9px] font-medium text-gray-600">
                          {new Date(usuario.fechaInvitacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derecha: Botones de Acción */}
              <div className="hidden lg:flex gap-1.5 flex-shrink-0">
                <button 
                  onClick={handleAceptar}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm flex items-center gap-1 text-[11px]"
                >
                  <Check className="w-3 h-3" strokeWidth={2} />
                  Aceptar
                </button>
                
                <button 
                  onClick={handleRechazar}
                  className="bg-white hover:bg-gray-50 border border-rose-300 text-rose-500 px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 text-[11px]"
                >
                  <X className="w-3 h-3" strokeWidth={2} />
                  Rechazar
                </button>

                <button 
                  onClick={handleDenunciar}
                  className="bg-white hover:bg-red-50 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 text-[11px]"
                >
                  <Flag className="w-3 h-3" strokeWidth={2} />
                  Denunciar
                </button>
              </div>
            </div>

            {/* Botones móvil */}
            <div className="lg:hidden flex gap-1.5 mt-2.5">
              <button 
                onClick={handleAceptar}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-1.5 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-1 text-xs"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                Aceptar
              </button>
              
              <button 
                onClick={handleRechazar}
                className="flex-1 bg-white border border-rose-300 text-rose-500 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                Rechazar
              </button>

              <button 
                onClick={handleDenunciar}
                className="flex-1 bg-white border border-red-200 text-red-500 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs"
              >
                <Flag className="w-3.5 h-3.5" strokeWidth={2} />
                Denunciar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              {/* Columna Izquierda - Información */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* Biografía */}
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Sobre él</h3>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {usuario.biografia}
                    </p>
                  </div>

                  {/* Información básica */}
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-900 mb-2.5">Información básica</h3>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 mb-0.5">Profesión</p>
                          <p className="text-[11px] font-medium text-gray-900 truncate">{usuario.informacionBasica.profesion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 mb-0.5">Educación</p>
                          <p className="text-[11px] font-medium text-gray-900 truncate">{usuario.informacionBasica.educacion}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 mb-0.5">Estado civil</p>
                          <p className="text-[11px] font-medium text-gray-900">{usuario.informacionBasica.estadoCivil}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-400 mb-0.5">Hijos</p>
                          <p className="text-[11px] font-medium text-gray-900">{usuario.informacionBasica.hijos}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intereses */}
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-gray-900 mb-2">Intereses</h3>
                    <div className="flex flex-wrap gap-1">
                      {usuario.intereses.map((interes, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-violet-50 border border-violet-200 rounded text-[10px] font-medium text-gray-700"
                        >
                          {interes}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Galería */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Fotos <span className="text-gray-400 font-normal text-xs">({usuario.fotos.length})</span>
                    </h3>
                  </div>
                  
                  {/* Grid de fotos */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5">
                    {usuario.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhoto(foto)}
                        className="aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer"
                      >
                        <img
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px]">💡</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-amber-900 mb-0.5">Tips de evaluación</p>
                        <p className="text-[10px] text-amber-700 leading-relaxed">
                          Revisa cuidadosamente el perfil, fotos e información. Acepta solo si cumple con tus criterios.
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

      {/* Modal con Portal */}
      <PhotoModal />
    </div>
  );
};
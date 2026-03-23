// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/DetalleUsuarioModal.tsx

import { createPortal } from 'react-dom';
import { X, MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, Image as ImageIcon } from 'lucide-react';
import { InvitacionDetalle } from '../types/invitaciones.types';

interface DetalleUsuarioModalProps {
  usuario: InvitacionDetalle | null;
  isOpen: boolean;
  onClose: () => void;
  onPhotoClick: (photoUrl: string) => void;
}

export const DetalleUsuarioModal = ({ 
  usuario, 
  isOpen, 
  onClose,
  onPhotoClick 
}: DetalleUsuarioModalProps) => {
  if (!isOpen || !usuario) return null;

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end lg:items-center justify-center">
      {/* Overlay - cierra al hacer click */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Modal - slide desde abajo en mobile */}
      <div 
        className="relative bg-white w-full lg:max-w-2xl lg:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom lg:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Perfil completo</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Header con Avatar */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-full ring-2 ring-violet-200 ring-offset-2 overflow-hidden flex-shrink-0">
                <img
                  src={usuario.avatar}
                  alt={usuario.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {usuario.nombre}, {usuario.edad}
                  </h2>
                  {usuario.verificado && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>{usuario.distancia.toFixed(1)} km - {usuario.ubicacion}</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 rounded border border-violet-200">
                    <Calendar className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
                    <span className="text-[10px] font-medium text-gray-600">
                      {formatFecha(usuario.fechaInvitacion)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Sobre él</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {usuario.biografia}
            </p>
          </div>

          {/* Información básica */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Información básica</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-violet-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 mb-0.5">Profesión</p>
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {usuario.informacionBasica.profesion}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-violet-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 mb-0.5">Educación</p>
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {usuario.informacionBasica.educacion}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-violet-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 mb-0.5">Estado civil</p>
                  <p className="text-xs font-medium text-gray-900">
                    {usuario.informacionBasica.estadoCivil}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-violet-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 mb-0.5">Hijos</p>
                  <p className="text-xs font-medium text-gray-900">
                    {usuario.informacionBasica.hijos}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intereses */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h3>
            <div className="flex flex-wrap gap-1.5">
              {usuario.intereses.map((interes, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-violet-50 border border-violet-200 rounded text-[11px] font-medium text-gray-700"
                >
                  {interes}
                </span>
              ))}
            </div>
          </div>

          {/* Galería de fotos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-violet-500" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Fotos <span className="text-gray-400 font-normal text-xs">({usuario.fotos.length})</span>
              </h3>
            </div>
            
            {/* Grid 3 columnas en mobile */}
            <div className="grid grid-cols-3 gap-2">
              {usuario.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => onPhotoClick(foto)}
                  className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all group cursor-pointer"
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
    </div>,
    document.body
  );
};

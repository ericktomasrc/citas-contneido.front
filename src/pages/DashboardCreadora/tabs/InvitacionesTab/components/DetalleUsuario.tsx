// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/DetalleUsuario.tsx

import { useState } from 'react';
import { MapPin, Calendar, Briefcase, Heart, GraduationCap, Users, Image, ChevronDown, ChevronUp, Flag } from 'lucide-react';
import { InvitacionDetalle } from '../types/invitaciones.types';

interface DetalleUsuarioProps {
  usuario: InvitacionDetalle | null;
  onPhotoClick: (photoUrl: string) => void;
  onDenunciar: (id: number) => void;
}

export const DetalleUsuario = ({ usuario, onPhotoClick, onDenunciar }: DetalleUsuarioProps) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [interesesExpanded, setInteresesExpanded] = useState(false);

  if (!usuario) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center h-[90vh] flex flex-col items-center justify-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-pink-100 rounded-2xl mb-4">
          <Users className="w-8 h-8 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Selecciona una invitación
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Haz click en cualquier tarjeta para ver el perfil completo del usuario
        </p>
      </div>
    );
  }

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const bioMaxLength = 150;
  const bioTruncated = usuario.biografia.length > bioMaxLength 
    ? usuario.biografia.substring(0, bioMaxLength) + '...' 
    : usuario.biografia;

  const interesesVisibles = interesesExpanded ? usuario.intereses : usuario.intereses.slice(0, 6);
  const interesesRestantes = usuario.intereses.length - 6;

  const handleDenunciar = () => {
    if (confirm('¿Deseas reportar a este usuario? Nuestro equipo revisará el caso.')) {
      onDenunciar(usuario.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-screen xl:h-screen lg:h-[90vh]">
      
      {/* Header con Avatar Y BOTÓN DENUNCIAR PEQUEÑO */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-full ring-2 ring-violet-200 ring-offset-2 overflow-hidden flex-shrink-0">
            <img
              src={usuario.avatar}
              alt={usuario.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-1">
                <h2 className="text-base font-semibold text-gray-900">
                  {usuario.nombre}, {usuario.edad}
                </h2>
                {usuario.verificado && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>

              {/* ✅ BOTÓN DENUNCIAR - PEQUEÑO CON TEXTO */}
              <button
                onClick={handleDenunciar}
                className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all text-[10px] font-medium border border-transparent hover:border-red-200"
                title="Denunciar usuario"
              >
                <Flag className="w-3 h-3" strokeWidth={2} />
                <span>Denunciar</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] flex-wrap">
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                <span>{usuario.distancia.toFixed(1)} km - {usuario.ubicacion}</span>
              </div>
              
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 rounded border border-violet-200">
                <Calendar className="w-3 h-3 text-violet-500" strokeWidth={2} />
                <span className="text-[10px] font-medium text-gray-600">
                  {formatFecha(usuario.fechaInvitacion)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido - SIN scroll general, solo en galería */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Biografía - Fijo, colapsable */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Sobre él</h3>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            {bioExpanded ? usuario.biografia : bioTruncated}
          </p>
          {usuario.biografia.length > bioMaxLength && (
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-[10px] text-violet-600 font-semibold mt-1 hover:text-violet-700 flex items-center gap-1"
            >
              {bioExpanded ? (
                <>Ver menos <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Ver más <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Información básica - Fijo */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-2.5">Información básica</h3>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-gray-400 mb-0.5">Profesión</p>
                <p className="text-[11px] font-medium text-gray-900 truncate">
                  {usuario.informacionBasica.profesion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-gray-400 mb-0.5">Educación</p>
                <p className="text-[11px] font-medium text-gray-900 truncate">
                  {usuario.informacionBasica.educacion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                <Heart className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-gray-400 mb-0.5">Estado civil</p>
                <p className="text-[11px] font-medium text-gray-900">
                  {usuario.informacionBasica.estadoCivil}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-gray-400 mb-0.5">Hijos</p>
                <p className="text-[11px] font-medium text-gray-900">
                  {usuario.informacionBasica.hijos}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Intereses - Fijo, colapsable */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Intereses</h3>
          <div className="flex flex-wrap gap-1">
            {interesesVisibles.map((interes, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-violet-50 border border-violet-200 rounded text-[10px] font-medium text-gray-700"
              >
                {interes}
              </span>
            ))}
            {interesesRestantes > 0 && !interesesExpanded && (
              <button
                onClick={() => setInteresesExpanded(true)}
                className="px-2 py-0.5 bg-violet-100 border border-violet-300 rounded text-[10px] font-semibold text-violet-700 hover:bg-violet-200"
              >
                + {interesesRestantes} más
              </button>
            )}
          </div>
        </div>

        {/* Galería horizontal - Scroll horizontal */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
              <Image className="w-3.5 h-3.5 text-violet-500" strokeWidth={2} />
            </div>
            <h3 className="text-xs font-semibold text-gray-900">
              Fotos <span className="text-gray-400 font-normal text-[10px]">({usuario.fotos.length})</span>
            </h3>
          </div>
          
          {/* Scroll horizontal - Fotos 100px */}
          <div className="overflow-x-auto overflow-y-hidden -mx-1 px-1">
            <div className="flex gap-2 pb-2">
              {usuario.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => onPhotoClick(foto)}
                  className="flex-shrink-0 w-[100px] h-[100px] rounded-md overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all group cursor-pointer"
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

        {/* Tips - Fijo abajo */}
        <div className="flex-shrink-0 p-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px]">💡</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-amber-900 mb-0.5">Tips de evaluación</p>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Revisa cuidadosamente el perfil, fotos e información antes de aceptar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

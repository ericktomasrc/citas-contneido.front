// src/components/DashboardCreadora/Tabs/Contenido/CardVideoProgramado.tsx
// ✅ NUEVO - Card de un video programado

import { useState } from 'react';
import { Video, Clock, Lightbulb, Heart, Edit2, Trash2 } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import type { VideoProgramado } from './types';

interface CardVideoProgramadoProps {
  video: VideoProgramado;
  onEditar: () => void;
  onEliminar: () => void;
}

export const CardVideoProgramado = ({ video, onEditar, onEliminar }: CardVideoProgramadoProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEliminar = () => {
    setShowConfirmDelete(true);
  };

  const confirmarEliminar = () => {
    onEliminar();
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all group hover:shadow-sm">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="relative w-24 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
            {video.archivo.thumbnail ? (
              <video
                src={video.archivo.url}
                className="w-full h-full object-cover"
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                <Video className="w-8 h-8 text-white" />
              </div>
            )}
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[7px] border-l-slate-700 border-y-[5px] border-y-transparent ml-0.5" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">{video.titulo}</h4>
            
            {video.descripcion && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{video.descripcion}</p>
            )}

            <div className="flex items-center gap-3 mt-1.5">
              {/* Hora */}
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{video.horaProgramada}</span>
              </div>

              {/* Sugerencia asociada */}
              {video.sugerenciaAsociada && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md max-w-[250px]">
                  <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="text-[11px] text-amber-700 truncate">
                    {video.sugerenciaAsociada.texto}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
                    <Heart className="w-2.5 h-2.5 fill-current" />
                    <span className="text-[10px] font-bold">{video.sugerenciaAsociada.likes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={onEditar}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleEliminar}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Confirmación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Video Programado"
            message={`¿Estás segura de eliminar "${video.titulo}"?\n\nEste video no se publicará en la fecha programada.`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminar}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}
    </>
  );
};

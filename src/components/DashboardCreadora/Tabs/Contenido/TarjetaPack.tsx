// src/components/DashboardCreadora/Tabs/Contenido/TarjetaPack.tsx
import { useState } from 'react';
import { Edit2, Trash2, Camera, Video as VideoIcon, Users, Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/ConfirmacionModal';
import { ModalVisualizador } from '../../../Common/ModalVisualizador';
import type { Pack } from './types';

interface TarjetaPackProps {
  pack: Pack;
  onToggle: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export const TarjetaPack = ({ pack, onToggle, onEditar, onEliminar }: TarjetaPackProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVisualizador, setShowVisualizador] = useState(false);

  const totalFotos = pack.archivos.filter((a) => a.tipo === 'foto').length;
  const totalVideos = pack.archivos.filter((a) => a.tipo === 'video').length;

  const handleEliminar = () => {
    setShowConfirmDelete(true);
  };

  const confirmarEliminar = () => {
    onEliminar();
    setShowConfirmDelete(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : pack.archivos.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < pack.archivos.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
        {/* Header con estado y precio */}
        <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {pack.compradores > 0 ? (
              <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-md flex items-center gap-1.5">
                <Check className="w-3 h-3" />
                Compradores ({pack.compradores})
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                Compradores (0)
              </span>
            )}
          </div>
          <div className="px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-md">
            S/. {pack.precio}
          </div>
        </div>

        {/* Imagen/Video con Slider */}
        <div className="relative aspect-video bg-slate-100 group">
          {pack.archivos[currentImageIndex].tipo === 'foto' ? (
            <img
              src={pack.archivos[currentImageIndex].url}
              alt={pack.titulo}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <VideoIcon className="w-16 h-16 text-white" />
            </div>
          )}

          {/* Botón Ver - OJITO */}
          <button
            onClick={() => setShowVisualizador(true)}
            className="absolute top-3 right-3 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Flechas de navegación */}
          {pack.archivos.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-slate-900" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-slate-900" />
              </button>

              {/* Contador */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                {currentImageIndex + 1} / {pack.archivos.length}
              </div>
            </>
          )}

          {/* Contador de fotos y videos - SOLO ÍCONOS PREMIUM */}
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {totalFotos > 0 && (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
                <div className="flex flex-col items-center">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-bold text-white leading-none">{totalFotos}</span>
                </div>
              </div>
            )}
            {totalVideos > 0 && (
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-xl">
                <div className="flex flex-col items-center">
                  <VideoIcon className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-bold text-white leading-none">{totalVideos}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info del Pack */}
        <div className="p-4">
          <h3 className="font-bold text-slate-900 mb-1 text-sm line-clamp-1">
            {pack.titulo}
          </h3>
          {pack.descripcion && (
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
              {pack.descripcion}
            </p>
          )}

          {/* Checkbox para activar/desactivar */}
          <div className="mb-3 pb-3 border-b border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={pack.activo}
                  onChange={onToggle}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    pack.activo ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      pack.activo ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  pack.activo ? 'text-teal-700' : 'text-slate-600'
                }`}
              >
                {pack.activo ? 'Activado para venta' : 'Desactivado'}
              </span>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={onEditar}
              className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={handleEliminar}
              className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Pack"
            message={`¿Estás segura de eliminar el pack "${pack.titulo}"?\n\nEsto eliminará ${pack.archivos.length} archivo(s).`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminar}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}

      {/* Modal Visualizador */}
      {showVisualizador && (
        <ModalVisualizador
          isOpen={showVisualizador}
          archivos={pack.archivos}
          indiceInicial={currentImageIndex}
          onClose={() => setShowVisualizador(false)}
        />
      )}
    </>
  );
};

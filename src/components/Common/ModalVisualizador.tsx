// src/components/common/ModalVisualizador.tsx
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { ArchivoContenido } from '../DashboardCreadora/Tabs/Contenido/types';

interface ModalVisualizadorProps {
  isOpen: boolean;
  archivos: ArchivoContenido[];
  indiceInicial: number;
  onClose: () => void;
}

export const ModalVisualizador = ({
  isOpen,
  archivos,
  indiceInicial,
  onClose,
}: ModalVisualizadorProps) => {
  const [indiceActual, setIndiceActual] = useState(indiceInicial);

  if (!isOpen || archivos.length === 0) return null;

  const archivoActual = archivos[indiceActual];

  const handlePrev = () => {
    setIndiceActual((prev) => (prev > 0 ? prev - 1 : archivos.length - 1));
  };

  const handleNext = () => {
    setIndiceActual((prev) => (prev < archivos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100000] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Botón Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Contenedor Principal - MÁS COMPACTO */}
      <div className="max-w-5xl w-full">
        {/* Imagen/Video - MÁS PEQUEÑA */}
        <div className="relative aspect-[4/3] max-h-[70vh] rounded-2xl overflow-hidden mb-2 bg-black/50">
          {archivoActual.tipo === 'foto' ? (
            <img
              src={archivoActual.url}
              alt={archivoActual.nombre}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
                <p className="text-white text-sm font-medium">
                  {archivoActual.nombre}
                </p>
              </div>
            </div>
          )}

          {/* Flechas de Navegación */}
          {archivos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-xl"
              >
                <ChevronLeft className="w-6 h-6 text-slate-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-xl"
              >
                <ChevronRight className="w-6 h-6 text-slate-900" />
              </button>
            </>
          )}

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-sm font-semibold rounded-full">
            {indiceActual + 1} / {archivos.length}
          </div>
        </div>

        {/* Info del Archivo - MÁS COMPACTA */}
        <div className="text-center mb-2">
          <p className="text-white font-semibold text-base mb-0.5">
            {archivoActual.nombre}
          </p>
          <p className="text-slate-400 text-xs">
            {archivoActual.tipo === 'foto' ? 'Foto' : 'Video'} •{' '}
            {(archivoActual.tamano / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        {/* Miniaturas - MÁS ARRIBA, NO PASAR BARRA WINDOWS */}
        {archivos.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto pb-2 max-w-3xl mx-auto">
            {archivos.map((archivo, index) => (
              <button
                key={archivo.id}
                onClick={() => setIndiceActual(index)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  indiceActual === index
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {archivo.tipo === 'foto' ? (
                  <img
                    src={archivo.thumbnail || archivo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-white fill-current" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/Common/Modal/ModalVisualizador.tsx
// ✅ MODAL CON Z-INDEX ALTO PARA ESTAR POR ENCIMA DE TODO

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Archivo {
  id: string;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail: string;
  nombre: string;
  tamano: number;
  fechaSubida: Date;
}

interface ModalVisualizadorProps {
  isOpen: boolean;
  archivos: Archivo[];
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

  useEffect(() => {
    setIndiceActual(indiceInicial);
  }, [indiceInicial]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handleAnterior();
      if (e.key === 'ArrowRight') handleSiguiente();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, indiceActual]);

  if (!isOpen || archivos.length === 0) return null;

  const archivoActual = archivos[indiceActual];

  const handleAnterior = () => {
    setIndiceActual((prev) => (prev > 0 ? prev - 1 : archivos.length - 1));
  };

  const handleSiguiente = () => {
    setIndiceActual((prev) => (prev < archivos.length - 1 ? prev + 1 : 0));
  };

  const handleDescargar = () => {
    const link = document.createElement('a');
    link.href = archivoActual.url;
    link.download = archivoActual.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modalContent = (
    // ✅ Z-INDEX MUY ALTO PARA ESTAR POR ENCIMA DE TODO
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100000] flex items-center justify-center">
      {/* Botón Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:rotate-90 z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navegación Izquierda */}
      {archivos.length > 1 && (
        <button
          onClick={handleAnterior}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navegación Derecha */}
      {archivos.length > 1 && (
        <button
          onClick={handleSiguiente}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Contenido Principal */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {archivoActual.tipo === 'foto' ? (
          <img
            src={archivoActual.url}
            alt={archivoActual.nombre}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <video
            src={archivoActual.url}
            controls
            autoPlay
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
      </div>

      {/* Información y Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
        <div className="max-w-7xl mx-auto">
          {/* Info del archivo */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold text-lg">{archivoActual.nombre}</p>
              <p className="text-gray-300 text-sm">
                {(archivoActual.tamano / 1024 / 1024).toFixed(2)} MB • {indiceActual + 1} / {archivos.length}
              </p>
            </div>
            <button
              onClick={handleDescargar}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>

          {/* Thumbnails */}
          {archivos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {archivos.map((archivo, index) => (
                <button
                  key={archivo.id}
                  onClick={() => setIndiceActual(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    index === indiceActual
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={archivo.thumbnail}
                    alt={archivo.nombre}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ✅ USAR PORTAL PARA RENDERIZAR EN EL BODY
  return createPortal(modalContent, document.body);
};

// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/PhotoCarouselModal.tsx

import { createPortal } from 'react-dom';
import { X, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PhotoCarouselModalProps {
  photos: string[];
  initialPhotoUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoCarouselModal = ({ 
  photos, 
  initialPhotoUrl, 
  isOpen, 
  onClose 
}: PhotoCarouselModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialPhotoUrl) {
      const index = photos.indexOf(initialPhotoUrl);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialPhotoUrl, photos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  if (!isOpen || !initialPhotoUrl) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
      >
        <X className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Contador de fotos */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium z-10">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Botón anterior */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2} />
        </button>
      )}

      {/* Imagen principal */}
      <div 
        className="w-full h-full flex items-center justify-center p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photos[currentIndex]}
          alt={`Foto ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Botón siguiente */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition z-10"
        >
          <ArrowLeft className="w-6 h-6 rotate-180" strokeWidth={2} />
        </button>
      )}

      {/* Miniaturas en la parte inferior */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full z-10 max-w-[90vw] overflow-x-auto">
          {photos.map((foto, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-10 h-10 rounded-md overflow-hidden border-2 transition flex-shrink-0 ${
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
      )}
    </div>,
    document.body
  );
};

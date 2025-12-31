import { X, Heart, Download, Share2, Play } from 'lucide-react';
import { MediaItem } from '../../../../shared/types/creator-profile.types';
import { useEffect } from 'react';

interface MediaModalProps {
  media: MediaItem;
  onClose: () => void;
}

export const MediaModal = ({ media, onClose }: MediaModalProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevenir scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido */}
        <div
          className="bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] max-w-6xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Media */}
            <div className="lg:flex-1 bg-black flex items-center justify-center relative min-h-[85vh]">
            {media.tipo === 'foto' ? (
                <img
                src={media.url}
                alt="Media"
                className="w-full h-full object-contain" // ✅ AHORA OCUPA TODO EL ESPACIO
                />
            ) : (
                <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-white text-center">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Reproductor de video</p>
                    {media.duracion && (
                    <p className="text-sm text-gray-500 mt-2">
                        Duración: {formatDuration(media.duracion)}
                    </p>
                    )}
                </div>
                </div>
            )}
            </div>

            {/* Sidebar Info */}
            <div className="lg:w-96 bg-gray-900 border-l border-gray-800">
              <div className="p-6 space-y-6">
                {/* Título */}
                {media.titulo && (
                  <div>
                    <h2 className="text-white text-2xl font-bold mb-2">
                      {media.titulo}
                    </h2>
                  </div>
                )}

                {/* Descripción */}
                {media.descripcion && (
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {media.descripcion}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-white font-semibold">{media.likes}</span>
                  </div>
                  {media.tipo === 'video' && media.duracion && (
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-blue-500" />
                      <span className="text-white font-semibold">
                        {formatDuration(media.duracion)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fecha */}
                <div className="text-gray-500 text-sm">
                  {new Date(media.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>

                {/* Acciones */}
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg">
                    <Heart className="w-5 h-5" />
                    Me gusta
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                    <Download className="w-5 h-5" />
                    Descargar
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                    <Share2 className="w-5 h-5" />
                    Compartir
                  </button>
                </div>

                {/* Tipo badge */}
                <div className="flex items-center justify-center">
                  {media.isPremium ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-full">
                      💎 Premium
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-semibold rounded-full">
                      {media.tipo === 'foto' ? '📷 Foto' : '🎥 Video'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
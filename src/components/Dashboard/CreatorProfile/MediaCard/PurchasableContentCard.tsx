import { ShoppingCart, Download, Lock, Image, Video } from 'lucide-react';
import { PurchasableContent } from '../../../../shared/types/creator-profile.types';

interface PurchasableContentCardProps {
  content: PurchasableContent;
  onPurchase: (contentId: number) => void;
  onDownload: (contentId: number) => void;
}

export const PurchasableContentCard = ({ 
  content, 
  onPurchase,
  onDownload 
}: PurchasableContentCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={content.thumbnail}
            alt={content.titulo}
            className="w-full h-full object-cover"
          />
          {!content.isPurchased && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
          
          {/* Tipo badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs font-bold flex items-center gap-1">
            {content.tipo === 'foto' && <Image className="w-3 h-3" />}
            {content.tipo === 'video' && <Video className="w-3 h-3" />}
            {content.tipo === 'pack' && '📦'}
            <span>{content.cantidadItems}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
            {content.titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {content.descripcion}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span>
              {content.tipo === 'pack' 
                ? `${content.cantidadItems} items` 
                : content.tipo === 'foto' 
                ? 'Foto HD' 
                : 'Video HD'}
            </span>
            <span>•</span>
            <span>{new Date(content.createdAt).toLocaleDateString('es-ES')}</span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                S/. {content.precio}
              </span>
              <span className="text-xs text-gray-500">pago único</span>
            </div>

            {content.isPurchased ? (
              <button
                onClick={() => onDownload(content.id)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
            ) : (
              <button
                onClick={() => onPurchase(content.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
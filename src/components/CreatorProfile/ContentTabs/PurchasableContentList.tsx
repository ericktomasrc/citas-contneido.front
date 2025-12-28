import { ShoppingCart, Download, Image, Video, Package } from 'lucide-react';
import { PurchasableContent } from '../../../shared/types/creator-profile.types';

interface PurchasableContentListProps {
  items: PurchasableContent[];
  onPurchase: (contentId: number) => void;
  onDownload: (contentId: number) => void;
}

export const PurchasableContentList = ({ 
  items, 
  onPurchase,
  onDownload 
}: PurchasableContentListProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No hay contenido en venta</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-700">
          <div className="col-span-1 text-center">Tipo</div>
          <div className="col-span-5">Descripción</div>
          <div className="col-span-2 text-center">Cantidad</div>
          <div className="col-span-2 text-center">Precio</div>
          <div className="col-span-2 text-center">Acción</div>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-6 py-4 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 transition-all"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Tipo Icon */}
              <div className="col-span-1 flex justify-center">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shadow-md
                  ${item.tipo === 'foto' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                    : item.tipo === 'video'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  }
                `}>
                  {item.tipo === 'foto' && <Image className="w-6 h-6 text-white" />}
                  {item.tipo === 'video' && <Video className="w-6 h-6 text-white" />}
                  {item.tipo === 'pack' && <Package className="w-6 h-6 text-white" />}
                </div>
              </div>

              {/* Descripción */}
              <div className="col-span-5">
                <h3 className="font-bold text-gray-900 mb-1">
                  {item.titulo}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.descripcion}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Cantidad */}
              <div className="col-span-2 text-center">
                {item.tipo === 'pack' ? (
                  <div className="inline-flex flex-col gap-1">
                    {/* Fotos */}
                    {item.cantidadFotos && item.cantidadFotos > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                        <Image className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-900">{item.cantidadFotos}</span>
                      </div>
                    )}
                    {/* Videos */}
                    {item.cantidadVideos && item.cantidadVideos > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg">
                        <Video className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-900">{item.cantidadVideos}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    {item.tipo === 'foto' && (
                      <>
                        <Image className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-gray-900">{item.cantidadItems}</span>
                      </>
                    )}
                    {item.tipo === 'video' && (
                      <>
                        <Video className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-gray-900">{item.cantidadItems}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="col-span-2 text-center">
                <div className="inline-flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    S/. {item.precio}
                  </span>
                  <span className="text-xs text-gray-500">pago único</span>
                </div>
              </div>

              {/* Acción */}
              <div className="col-span-2 flex justify-center">
                {item.isPurchased ? (
                  <button
                    onClick={() => onDownload(item.id)}
                    className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Descargar
                  </button>
                ) : (
                  <button
                    onClick={() => onPurchase(item.id)}
                    className="flex items-center gap-2 bg-gradient-to-br from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl font-semibold transition shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Comprar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{items.length}</span> items disponibles
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {items.filter(i => i.isPurchased).length}
            </span> comprados
          </span>
        </div>
      </div>
    </div>
  );
};
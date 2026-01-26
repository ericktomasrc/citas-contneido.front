// En ConfirmDeleteModal.tsx
import { Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalFotoPublicacionProps {
  onConfirm: () => void;
  onCancel: () => void;
  esEliminacionFoto?: boolean; // NUEVO parámetro
}

export const ConfirmDeleteModalFotoPublicacion = ({ 
  onConfirm, 
  onCancel,
  esEliminacionFoto = false 
}: ConfirmDeleteModalFotoPublicacionProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {esEliminacionFoto ? 'Eliminar Foto' : 'Eliminar Publicación'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            {esEliminacionFoto 
              ? '¿Estás seguro de que deseas eliminar esta foto?'
              : '¿Estás seguro de que deseas eliminar esta publicación?'}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-lg"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
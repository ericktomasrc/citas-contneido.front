import { Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalFotoPublicacionProps {
  onConfirm: () => void;
  onCancel: () => void;
  esEliminacionFoto?: boolean;
}

export const ConfirmDeleteModalFotoPublicacion = ({
  onConfirm,
  onCancel,
  esEliminacionFoto = false
}: ConfirmDeleteModalFotoPublicacionProps) => {
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xs w-full p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-600">
              {esEliminacionFoto ? 'Eliminar Foto' : 'Eliminar Publicación'}
            </h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-500 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mb-3">
          {esEliminacionFoto
            ? '¿Estás seguro de que deseas eliminar esta foto?'
            : '¿Estás seguro de que deseas eliminar esta publicación?'}
        </p>

        <div className="bg-amber-50/50 border border-amber-100/50 rounded-lg px-3 py-2 mb-4">
          <p className="text-[10px] text-amber-600">
            <span className="font-semibold">Advertencia:</span> Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-2.5 bg-rose-400/90 text-white rounded-lg text-[11px] font-semibold hover:bg-rose-500/90 transition shadow-sm shadow-rose-100"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
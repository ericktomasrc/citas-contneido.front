// src/components/DashboardCreadora/Tabs/Contenido/EstadoVentaPacks.tsx
import { ShoppingBag, Users, DollarSign } from 'lucide-react';

interface EstadoVentaPacksProps {
  ventaActiva: boolean;
  totalPacks: number;
  totalCompradores: number;
  precioTotal: number;
  onActivar: () => void;
  onDesactivar: () => void;
}

export const EstadoVentaPacks = ({
  ventaActiva,
  totalPacks,
  totalCompradores,
  precioTotal,
  onActivar,
  onDesactivar,
}: EstadoVentaPacksProps) => {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-3 rounded-xl border-2 transition-all ${
        ventaActiva
          ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200'
          : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
      }`}
    >
      {/* Indicador de estado */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            ventaActiva ? 'bg-teal-500' : 'bg-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800">
              Venta de Packs
            </h4>
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                ventaActiva ? 'bg-teal-500' : 'bg-slate-400'
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                ventaActiva ? 'text-teal-700' : 'text-slate-600'
              }`}
            >
              {ventaActiva ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-600">
            <span>
              <span className="font-semibold text-slate-800">{totalPacks}</span>{' '}
              packs activos
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-semibold text-slate-800">
                {totalCompradores}
              </span>{' '}
              compradores
            </span>
          </div>
        </div>
      </div>

      {/* Precio Total */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <p className="text-xl font-bold text-slate-800">
              S/.{precioTotal}
            </p>
          </div>
          <p className="text-xs text-slate-500">Total en venta</p>
        </div>
      </div>

      {/* Botón de acción */}
      <div>
        {ventaActiva ? (
          <button
            onClick={onDesactivar}
            className="px-4 py-2 bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500 text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
          >
            Desactivar
          </button>
        ) : (
          <button
            onClick={onActivar}
            disabled={totalPacks === 0}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
              totalPacks === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-md'
            }`}
          >
            {totalPacks === 0 ? 'Sin packs' : 'Activar Venta'}
          </button>
        )}
      </div>
    </div>
  );
};

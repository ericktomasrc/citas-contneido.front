// src/components/DashboardCreadora/Tabs/Contenido/EstadoSuscripcion.tsx
import { useState } from 'react';
import { Crown, Edit2, Check, X, Users } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import { CONTENIDO_CONFIG } from '../../../Common/config/config';

interface EstadoSuscripcionProps {
  tipo: 'fotos' | 'videos';
  suscripcionActiva: boolean;
  precioSuscripcion: number;
  suscriptoresPagaron: number;
  setPrecioSuscripcion: (precio: number) => void;
  totalArchivos: number;
  minimo: number;
  onActivar: () => void;
  onDesactivar: () => void;
}

export const EstadoSuscripcion = ({
  tipo,
  suscripcionActiva,
  suscriptoresPagaron,
  precioSuscripcion,
  setPrecioSuscripcion,
  totalArchivos,
  minimo,
  onActivar,
  onDesactivar,
}: EstadoSuscripcionProps) => {
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioTemporal, setPrecioTemporal] = useState(precioSuscripcion);
  const [showAlertPrecio, setShowAlertPrecio] = useState(false);

  const handleGuardarPrecio = () => {
    if (
      precioTemporal < CONTENIDO_CONFIG.PRECIO_MIN ||
      precioTemporal > CONTENIDO_CONFIG.PRECIO_MAX
    ) {
      setShowAlertPrecio(true);
      return;
    }

    setPrecioSuscripcion(precioTemporal);
    setEditandoPrecio(false);
    console.log('💰 Precio actualizado:', precioTemporal);

    // TODO: Conectar con backend
  };

  const handleCancelarEdicion = () => {
    setPrecioTemporal(precioSuscripcion);
    setEditandoPrecio(false);
  };

  const labelTipo = tipo === 'fotos' ? 'Fotos' : 'Videos';

  return (
    <>
      <div
        className={`flex items-center gap-4 px-5 py-3 rounded-xl border-2 transition-all ${
          suscripcionActiva
            ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200'
            : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
        }`}
      >
        {/* Indicador de estado */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              suscripcionActiva ? 'bg-teal-500' : 'bg-slate-400'
            }`}
          >
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-800">
                Suscripción {labelTipo}
              </h4>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  suscripcionActiva ? 'bg-teal-500' : 'bg-slate-400'
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  suscripcionActiva ? 'text-teal-700' : 'text-slate-600'
                }`}
              >
                {suscripcionActiva ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-600">
              <span>
                <span className="font-semibold text-slate-800">{totalArchivos}</span>{' '}
                {tipo}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="font-semibold text-slate-800">
                  {suscriptoresPagaron}
                </span>{' '}
                suscriptores
              </span>
            </div>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center gap-2 ml-auto">
          {editandoPrecio ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                  S/.
                </span>
                <input
                  type="number"
                  value={precioTemporal}
                  onChange={(e) =>
                    setPrecioTemporal(parseInt(e.target.value) || 0)
                  }
                  className="w-32 pl-9 pr-3 py-2 border-2 border-indigo-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  min={CONTENIDO_CONFIG.PRECIO_MIN}
                  max={CONTENIDO_CONFIG.PRECIO_MAX}
                  autoFocus
                />
              </div>
              <button
                onClick={handleGuardarPrecio}
                className="p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
                title="Guardar"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelarEdicion}
                className="p-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-lg transition"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xl font-bold text-slate-800">
                  S/.{precioSuscripcion}
                </p>
                <p className="text-xs text-slate-500">por mes</p>
              </div>
              <button
                onClick={() => {
                  setEditandoPrecio(true);
                  setPrecioTemporal(precioSuscripcion);
                }}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                title="Editar precio"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <div>
          {suscripcionActiva ? (
            <button
              onClick={onDesactivar}
              className="px-4 py-2 bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500 text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
            >
              Desactivar
            </button>
          ) : (
            <button
              onClick={onActivar}
              disabled={totalArchivos < minimo}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                totalArchivos < minimo
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-md'
              }`}
            >
              {totalArchivos === 0
                ? 'Sube contenido'
                : totalArchivos < minimo
                ? `Faltan ${minimo - totalArchivos}`
                : 'Activar'}
            </button>
          )}
        </div>
      </div>

      {/* Modal de Alerta - Precio Inválido */}
      {showAlertPrecio && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showAlertPrecio}
            title="Precio Inválido"
            message={`El precio debe estar entre S/.${CONTENIDO_CONFIG.PRECIO_MIN} y S/.${CONTENIDO_CONFIG.PRECIO_MAX}`}
            confirmText="Entendido"
            cancelText=""
            type="warning"
            onConfirm={() => setShowAlertPrecio(false)}
            onCancel={() => setShowAlertPrecio(false)}
          />
        </div>
      )}
    </>
  );
};

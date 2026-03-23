// src/components/DashboardCreadora/Tabs/Contenido/EstadoSuscripcion.tsx
// ✅ SOLO SE QUITÓ: Precio editable y botones Activar/Desactivar
// ✅ TODO LO DEMÁS QUEDA IGUAL

import { Crown, Users } from 'lucide-react';

interface EstadoSuscripcionProps {
  tipo: 'fotos' | 'videos';
  suscripcionActiva: boolean;
  suscriptoresPagaron: number;
  totalArchivos: number;
}

export const EstadoSuscripcion = ({
  tipo,
  suscripcionActiva,
  suscriptoresPagaron,
  totalArchivos,
}: EstadoSuscripcionProps) => {
  const labelTipo = tipo === 'fotos' ? 'Fotos' : 'Videos';

  return (
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
    </div>
  );
};
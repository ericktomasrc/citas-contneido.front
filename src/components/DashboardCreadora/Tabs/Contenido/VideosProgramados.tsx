// src/components/DashboardCreadora/Tabs/Contenido/VideosProgramados.tsx
// ✅ NUEVO - Lista de videos programados agrupados por fecha

import { Calendar, Clock, Plus } from 'lucide-react';
import { CardVideoProgramado } from './CardVideoProgramado';
import type { VideoProgramado } from './types';

interface VideosProgramadosProps {
  videos: VideoProgramado[];
  onEditar: (video: VideoProgramado) => void;
  onEliminar: (id: string) => void;
  onNuevo: () => void;
}

export const VideosProgramados = ({ videos, onEditar, onEliminar, onNuevo }: VideosProgramadosProps) => {
  const videosPendientes = videos.filter((v) => v.estado === 'pendiente');

  // Agrupar por fecha
  const videosPorFecha = videosPendientes.reduce((acc, video) => {
    const fechaKey = video.fechaProgramada.toISOString().split('T')[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(video);
    return acc;
  }, {} as Record<string, VideoProgramado[]>);

  // Ordenar fechas de más próxima a más lejana
  const fechasOrdenadas = Object.keys(videosPorFecha).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00');
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
    if (fecha.toDateString() === manana.toDateString()) return 'Mañana';

    return fecha.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  // Estado vacío
  if (videosPendientes.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-2xl mb-3">
            <Calendar className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1.5">
            Sin videos programados
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Programa videos para que se publiquen automáticamente en la fecha indicada
          </p>
          <button
            onClick={onNuevo}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Programar Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {fechasOrdenadas.map((fechaKey) => (
        <div key={fechaKey} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header de fecha */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 capitalize">
                    {formatearFecha(fechaKey)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {videosPorFecha[fechaKey].length} video{videosPorFecha[fechaKey].length > 1 ? 's' : ''} programado{videosPorFecha[fechaKey].length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de videos de esa fecha */}
          <div className="p-3 space-y-2">
            {videosPorFecha[fechaKey]
              .sort((a, b) => a.horaProgramada.localeCompare(b.horaProgramada))
              .map((video) => (
                <CardVideoProgramado
                  key={video.id}
                  video={video}
                  onEditar={() => onEditar(video)}
                  onEliminar={() => onEliminar(video.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

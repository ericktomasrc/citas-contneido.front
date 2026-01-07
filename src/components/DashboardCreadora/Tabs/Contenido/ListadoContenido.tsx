// src/components/DashboardCreadora/Tabs/Contenido/ListadoContenido.tsx
import { useState } from 'react';
import { Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import type { GrupoContenido } from './types';
import { TarjetaArchivo } from './TarjetaArchivo';

interface ListadoContenidoProps {
  tipo: 'fotos' | 'videos';
  grupos: GrupoContenido[];
  onEliminarArchivo: (grupoIndex: number, archivoId: string) => void;
  onEliminarGrupo: (grupoIndex: number) => void;
}

export const ListadoContenido = ({
  tipo,
  grupos,
  onEliminarArchivo,
  onEliminarGrupo,
}: ListadoContenidoProps) => {
  // Estado para grupos expandidos/colapsados
  const [gruposExpandidos, setGruposExpandidos] = useState<Record<number, boolean>>(
    grupos.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );

  // Estados para confirmación de eliminación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [grupoAEliminar, setGrupoAEliminar] = useState<{
    index: number;
    grupo: GrupoContenido;
  } | null>(null);

  const toggleGrupo = (index: number) => {
    setGruposExpandidos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEliminarGrupo = (index: number, grupo: GrupoContenido) => {
    setGrupoAEliminar({ index, grupo });
    setShowConfirmDelete(true);
  };

  const confirmarEliminarGrupo = () => {
    if (grupoAEliminar) {
      onEliminarGrupo(grupoAEliminar.index);
    }
    setShowConfirmDelete(false);
    setGrupoAEliminar(null);
  };

  return (
    <>
      <div className="space-y-5">
        {grupos.map((grupo, grupoIndex) => {
          const estaExpandido = gruposExpandidos[grupoIndex] ?? true;

          return (
            <div
              key={grupoIndex}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors shadow-sm"
            >
              {/* Header del Grupo - más compacto */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleGrupo(grupoIndex)}
                    className="flex items-center gap-2.5 flex-1 text-left hover:opacity-80 transition"
                  >
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-800">
                        {formatearMesAnio(grupo.fecha)}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {grupo.archivos.length} {tipo}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 ml-4">
                    {/* Botones */}
                    <button
                      onClick={() => toggleGrupo(grupoIndex)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition"
                      title={estaExpandido ? 'Colapsar' : 'Expandir'}
                    >
                      {estaExpandido ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      )}
                    </button>

                    {/* Botón de eliminar grupo (comentado en el código original, pero disponible) */}
                    {/* <button
                      onClick={() => handleEliminarGrupo(grupoIndex, grupo)}
                      className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition"
                      title="Eliminar grupo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>
              </div>

              {/* Contenido del Grupo */}
              {estaExpandido && (
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {grupo.archivos.map((archivo) => (
                      <TarjetaArchivo
                        key={archivo.id}
                        archivo={archivo}
                        todosArchivos={grupo.archivos}
                        onEliminar={() => onEliminarArchivo(grupoIndex, archivo.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmación de Eliminación de Grupo */}
      {showConfirmDelete && grupoAEliminar && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Grupo"
            message={`¿Estás segura de eliminar este grupo con ${grupoAEliminar.grupo.archivos.length} archivo(s)?\n\nMes: ${formatearMesAnio(grupoAEliminar.grupo.fecha)}`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminarGrupo}
            onCancel={() => {
              setShowConfirmDelete(false);
              setGrupoAEliminar(null);
            }}
          />
        </div>
      )}
    </>
  );
};

// Helper para formatear mes y año
function formatearMesAnio(fecha: Date): string {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  return `${mes} ${anio}`;
}

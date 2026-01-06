// src/components/DashboardCreadora/Tabs/Contenido/TarjetaArchivo.tsx
import { useState } from 'react';
import { Trash2, Video, Eye } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/ConfirmacionModal';
import { ModalVisualizador } from '../../../Common/ModalVisualizador';
import type { ArchivoContenido } from './types';

interface TarjetaArchivoProps {
  archivo: ArchivoContenido;
  todosArchivos: ArchivoContenido[]; // Todas las fotos/videos del grupo
  onEliminar: () => void;
}

export const TarjetaArchivo = ({ archivo, todosArchivos, onEliminar }: TarjetaArchivoProps) => {
  const [showVisualizador, setShowVisualizador] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEliminar = () => {
    setShowConfirmDelete(true);
  };

  const confirmarEliminar = () => {
    onEliminar();
    setShowConfirmDelete(false);
  };

  // Encontrar el índice del archivo actual en la lista completa
  const indiceActual = todosArchivos.findIndex(a => a.id === archivo.id);

  return (
    <>
      <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all">
        {/* Preview */}
        <div className="aspect-square bg-slate-100 relative overflow-hidden">
          {archivo.tipo === 'foto' ? (
            <img
              src={archivo.url}
              alt={archivo.nombre}
              className="w-full h-full object-cover"
              onLoad={(e) => {
                console.log('✅ Imagen cargada:', archivo.nombre);
                e.currentTarget.style.opacity = '1';
              }}
              onError={(e) => {
                console.error('❌ Error cargando imagen:', archivo.nombre, archivo.url);
              }}
              style={{ opacity: 0, transition: 'opacity 0.3s' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <Video className="w-10 h-10 text-white" />
            </div>
          )}

          {/* Overlay con controles */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <button
                onClick={() => setShowVisualizador(true)}
                className="w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-lg flex items-center justify-center transition shadow-lg hover:scale-110"
                title="Ver"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleEliminar}
                className="w-9 h-9 bg-red-500/90 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition shadow-lg hover:scale-110"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info del archivo */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5">
                <p className="text-xs font-medium text-white truncate">
                  {archivo.nombre}
                </p>
                <p className="text-[10px] text-slate-300">
                  {(archivo.tamano / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Badge de tipo */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {archivo.tipo === 'foto' ? (
              <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-md shadow-lg">
                FOTO
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-md shadow-lg">
                VIDEO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal Visualizador con SLIDER de todas las fotos */}
      {showVisualizador && (
        <ModalVisualizador
          isOpen={showVisualizador}
          archivos={todosArchivos}
          indiceInicial={indiceActual}
          onClose={() => setShowVisualizador(false)}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Archivo"
            message={`¿Estás segura de eliminar este ${archivo.tipo}?\n\n${archivo.nombre}`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminar}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}
    </>
  );
};

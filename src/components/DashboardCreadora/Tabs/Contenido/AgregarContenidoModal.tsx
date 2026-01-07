// src/components/DashboardCreadora/Tabs/Contenido/AgregarContenidoModal.tsx
import { useState, useRef } from 'react';
import { X, Upload, Camera, Video as VideoIcon, Trash2, Eye, Image, Video } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import { ModalVisualizador } from '../../../Common/Modal/ModalVisualizador';
import type { ArchivoContenido, ArchivoPreview } from './types';

interface AgregarContenidoModalProps {
  tipo: 'fotos' | 'videos';
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (archivos: ArchivoContenido[]) => void;
}

export const AgregarContenidoModal = ({
  tipo,
  isOpen,
  onClose,
  onGuardar,
}: AgregarContenidoModalProps) => {
  const [archivos, setArchivos] = useState<ArchivoPreview[]>([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAlertNoFiles, setShowAlertNoFiles] = useState(false);
  const [showVisualizador, setShowVisualizador] = useState(false);
  const [indiceVisualizador, setIndiceVisualizador] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const acceptType = tipo === 'fotos' ? 'image/*' : 'video/*';
  const tipoArchivo: 'foto' | 'video' = tipo === 'fotos' ? 'foto' : 'video';

  // Manejar selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const nuevosArchivos: ArchivoPreview[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      tipo: tipoArchivo,
      seleccionado: true,
    }));

    setArchivos((prev) => [...prev, ...nuevosArchivos]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle selección individual
  const toggleSeleccion = (id: string) => {
    setArchivos((prev) =>
      prev.map((arch) =>
        arch.id === id ? { ...arch, seleccionado: !arch.seleccionado } : arch
      )
    );
  };

  // Seleccionar/Deseleccionar todos
  const handleToggleTodos = () => {
    const nuevoEstado = !seleccionarTodos;
    setSeleccionarTodos(nuevoEstado);
    setArchivos((prev) =>
      prev.map((arch) => ({ ...arch, seleccionado: nuevoEstado }))
    );
  };

  // Eliminar archivo individual
  const handleEliminarArchivo = (id: string) => {
    setArchivos((prev) => {
      // NO revocar URL aquí porque podría estar siendo usado en el listado principal
      // const archivo = prev.find((a) => a.id === id);
      // if (archivo) {
      //   URL.revokeObjectURL(archivo.preview);
      // }
      return prev.filter((a) => a.id !== id);
    });
  };

  // Eliminar archivos seleccionados
  const handleEliminarSeleccionados = () => {
    setShowConfirmDelete(true);
  };

  const confirmarEliminarSeleccionados = () => {
    setArchivos((prev) => {
      // NO revocar URLs - podrían estar siendo usados en el listado
      // const eliminados = prev.filter((a) => a.seleccionado);
      // eliminados.forEach((arch) => URL.revokeObjectURL(arch.preview));
      return prev.filter((a) => !a.seleccionado);
    });
    setShowConfirmDelete(false);
  };

  // Guardar contenido
  const handleGuardar = () => {
    const archivosSeleccionados = archivos.filter((a) => a.seleccionado);

    if (archivosSeleccionados.length === 0) {
      setShowAlertNoFiles(true);
      return;
    }

    // Convertir a ArchivoContenido
    const archivosParaGuardar: ArchivoContenido[] = archivosSeleccionados.map(
      (arch) => ({
        id: arch.id,
        tipo: arch.tipo,
        url: arch.preview, // En producción sería la URL del servidor
        thumbnail: arch.preview,
        nombre: arch.file.name,
        tamano: arch.file.size,
        fechaSubida: new Date(),
      })
    );

    onGuardar(archivosParaGuardar);

    // NO REVOCAR URLs - dejarlos para que las imágenes se puedan ver
    // archivos.forEach((arch) => URL.revokeObjectURL(arch.preview));
    setArchivos([]);
    setSeleccionarTodos(true);
    onClose();
  };

  // Cerrar modal
  const handleCerrar = () => {
    // NO REVOCAR previews - las URLs son necesarias para mostrar las imágenes
    // archivos.forEach((arch) => URL.revokeObjectURL(arch.preview));
    setArchivos([]);
    setSeleccionarTodos(true);
    onClose();
  };

  const archivosSeleccionados = archivos.filter((a) => a.seleccionado).length;
  const labelTipo = tipo === 'fotos' ? 'Fotos' : 'Videos';
  const IconoTipo = tipo === 'fotos' ? Image : Video;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Agregar {labelTipo}
                </h3>
                <p className="text-xs text-slate-600">
                  {archivos.length > 0
                    ? `${archivos.length} archivo(s) • ${archivosSeleccionados} seleccionado(s)`
                    : `Sube tus ${tipo}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleCerrar}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Botón Agregar Archivos */}
          <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptType}
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Seleccionar {labelTipo}
              </button>

              {archivos.length > 0 && (
                <>
                  <button
                    onClick={handleToggleTodos}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-all"
                  >
                    {seleccionarTodos ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>

                  {archivosSeleccionados > 0 && (
                    <button
                      onClick={handleEliminarSeleccionados}
                      className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar ({archivosSeleccionados})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {archivos.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
                  <IconoTipo className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No hay archivos seleccionados
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Haz clic en "Seleccionar {labelTipo}" para comenzar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                      archivo.seleccionado
                        ? 'border-indigo-400 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    {/* Preview */}
                    <div className="aspect-square bg-slate-100 relative">
                      {archivo.tipo === 'foto' ? (
                        <img
                          src={archivo.preview}
                          alt={archivo.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                          <VideoIcon className="w-12 h-12 text-white" />
                        </div>
                      )}

                      {/* Badge tipo - SOLO ÍCONO PREMIUM */}
                      <div className="absolute top-2 left-2 z-10">
                        {archivo.tipo === 'foto' ? (
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-xl flex items-center justify-center backdrop-blur-sm">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-xl flex items-center justify-center backdrop-blur-sm">
                            <VideoIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Botón Ver - OJITO con Z-INDEX ALTO para que funcione */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIndiceVisualizador(archivos.findIndex((a) => a.id === archivo.id));
                          setShowVisualizador(true);
                        }}
                        className="absolute top-12 right-2 z-20 w-9 h-9 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center transition-all shadow-xl"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Overlay con controles */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                          <button
                            onClick={() => toggleSeleccion(archivo.id)}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                              archivo.seleccionado
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white text-slate-700'
                            }`}
                          >
                            {archivo.seleccionado ? '✓ Seleccionado' : 'Seleccionar'}
                          </button>
                          <button
                            onClick={() => handleEliminarArchivo(archivo.id)}
                            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Indicador de selección */}
                      {archivo.seleccionado && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2 bg-white">
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {archivo.file.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(archivo.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={handleCerrar}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={archivosSeleccionados === 0}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
                  archivosSeleccionados === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                Guardar ({archivosSeleccionados})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación - Eliminar Seleccionados */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Archivos"
            message={`¿Estás segura de eliminar ${archivosSeleccionados} archivo(s)?`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminarSeleccionados}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}

      {/* Modal de Alerta - Sin Archivos Seleccionados */}
      {showAlertNoFiles && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showAlertNoFiles}
            title="Selecciona al menos un archivo"
            message="Debes seleccionar al menos un archivo para poder guardar."
            confirmText="Entendido"
            cancelText=""
            type="warning"
            onConfirm={() => setShowAlertNoFiles(false)}
            onCancel={() => setShowAlertNoFiles(false)}
          />
        </div>
      )}

      {/* Modal Visualizador */}
      {showVisualizador && (
        <ModalVisualizador
          isOpen={showVisualizador}
          archivos={archivos.map((a) => ({
            id: a.id,
            tipo: a.tipo,
            url: a.preview,
            thumbnail: a.preview,
            nombre: a.file.name,
            tamano: a.file.size,
            fechaSubida: new Date(),
          }))}
          indiceInicial={indiceVisualizador}
          onClose={() => setShowVisualizador(false)}
        />
      )}
    </>
  );
};

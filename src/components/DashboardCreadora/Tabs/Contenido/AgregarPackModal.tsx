// src/components/DashboardCreadora/Tabs/Contenido/AgregarPackModal.tsx
// ✅ Z-INDEX z-[60] PARA APARECER POR ENCIMA DEL SIDEBAR (z-40)

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Trash2, Package, Eye, Camera, Video as VideoIcon } from 'lucide-react';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import { ModalVisualizador } from '../../../Common/Modal/ModalVisualizador';
import type { ArchivoContenido, ArchivoPreview, Pack } from './types';

interface AgregarPackModalProps {
  isOpen: boolean;
  packEditar: Pack | null;
  onClose: () => void;
  onGuardar: (
    packId: string | null,
    titulo: string,
    descripcion: string,
    precio: number,
    archivos: ArchivoContenido[]
  ) => void;
  minimoArchivos: number;
}

export const AgregarPackModal = ({
  isOpen,
  packEditar,
  onClose,
  onGuardar,
  minimoArchivos,
}: AgregarPackModalProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [archivos, setArchivos] = useState<ArchivoPreview[]>([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAlertValidation, setShowAlertValidation] = useState(false);
  const [mensajeValidacion, setMensajeValidacion] = useState('');
  const [showVisualizador, setShowVisualizador] = useState(false);
  const [indiceVisualizador, setIndiceVisualizador] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (packEditar && isOpen) {
      setTitulo(packEditar.titulo);
      setDescripcion(packEditar.descripcion || '');
      setPrecio(packEditar.precio);
      
      // Convertir archivos del pack a ArchivoPreview
      const archivosPreview: ArchivoPreview[] = packEditar.archivos.map(archivo => ({
        id: archivo.id,
        file: new File([], archivo.nombre), // Dummy file
        preview: archivo.url,
        tipo: archivo.tipo,
        seleccionado: true,
      }));
      setArchivos(archivosPreview);
    } else {
      // Limpiar
      setTitulo('');
      setDescripcion('');
      setPrecio(0);
      setArchivos([]);
    }
  }, [packEditar, isOpen]);

  if (!isOpen) return null;

  // Manejar selección de archivos (fotos Y videos)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const nuevosArchivos: ArchivoPreview[] = files.map((file) => {
      const tipo = file.type.startsWith('image/') ? 'foto' : 'video';

      return {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        tipo,
        seleccionado: true,
      };
    });

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
    setArchivos((prev) => prev.filter((a) => a.id !== id));
  };

  // Eliminar archivos seleccionados
  const handleEliminarSeleccionados = () => {
    setShowConfirmDelete(true);
  };

  const confirmarEliminarSeleccionados = () => {
    setArchivos((prev) => prev.filter((a) => !a.seleccionado));
    setShowConfirmDelete(false);
  };

  // Guardar pack
  const handleGuardar = () => {
    const archivosSeleccionados = archivos.filter((a) => a.seleccionado);

    // Validaciones
    if (!titulo.trim()) {
      setMensajeValidacion('El título es obligatorio');
      setShowAlertValidation(true);
      return;
    }

    if (precio <= 0) {
      setMensajeValidacion('El precio debe ser mayor a 0');
      setShowAlertValidation(true);
      return;
    }

    if (archivosSeleccionados.length < minimoArchivos) {
      setMensajeValidacion(
        `Debes seleccionar al menos ${minimoArchivos} archivos (fotos o videos)`
      );
      setShowAlertValidation(true);
      return;
    }

    // Convertir a ArchivoContenido
    const archivosParaGuardar: ArchivoContenido[] = archivosSeleccionados.map(
      (arch) => ({
        id: arch.id,
        tipo: arch.tipo,
        url: arch.preview,
        thumbnail: arch.preview,
        nombre: arch.file.name,
        tamano: arch.file.size,
        fechaSubida: new Date(),
      })
    );

    onGuardar(
      packEditar?.id || null,
      titulo,
      descripcion,
      precio,
      archivosParaGuardar
    );

    // Limpiar estado
    setTitulo('');
    setDescripcion('');
    setPrecio(0);
    setArchivos([]);
    setSeleccionarTodos(true);
    onClose();
  };

  // Abrir visualizador
  const handleVerArchivo = (index: number) => {
    setIndiceVisualizador(index);
    setShowVisualizador(true);
  };

  // Manejar cambio de precio (solo números)
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Solo permitir números
    if (valor === '' || /^\d+$/.test(valor)) {
      setPrecio(valor === '' ? 0 : Number(valor));
    }
  };

  // Cerrar modal
  const handleCerrar = () => {
    setTitulo('');
    setDescripcion('');
    setPrecio(0);
    setArchivos([]);
    setSeleccionarTodos(true);
    onClose();
  };

  const archivosSeleccionados = archivos.filter((a) => a.seleccionado).length;
  const totalFotos = archivos.filter((a) => a.tipo === 'foto').length;
  const totalVideos = archivos.filter((a) => a.tipo === 'video').length;

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* ✅ Z-INDEX z-[100] PARA ESTAR POR ENCIMA DE TODO */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
          {/* Header - MÁS COMPACTO */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Package className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {packEditar ? 'Editar Pack' : 'Crear Pack'}
                </h3>
                <p className="text-[10px] text-slate-600">
                  {archivos.length > 0
                    ? `${totalFotos} foto(s) • ${totalVideos} video(s) • ${archivosSeleccionados} seleccionado(s)`
                    : `Mínimo ${minimoArchivos} archivos (fotos o videos)`}
                </p>
              </div>
            </div>
            <button
              onClick={handleCerrar}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Formulario del Pack - MÁS COMPACTO */}
          <div className="px-5 py-3 border-b border-slate-200 flex-shrink-0 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Pack Playa Verano 2024"
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Precio (S/.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={precio || ''}
                  onChange={handlePrecioChange}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe tu pack..."
                className="w-full px-2.5 py-1.5 border-2 border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
                rows={2}
                maxLength={200}
              />
            </div>
          </div>

          {/* Botón Agregar Archivos - MÁS COMPACTO */}
          <div className="px-5 py-3 border-b border-slate-200 flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Agregar Fotos o Videos
              </button>

              {archivos.length > 0 && (
                <>
                  <button
                    onClick={handleToggleTodos}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-all"
                  >
                    {seleccionarTodos ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>

                  {archivosSeleccionados > 0 && (
                    <button
                      onClick={handleEliminarSeleccionados}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar ({archivosSeleccionados})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Contenido Principal - Grid de Archivos */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {archivos.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-3">
                  <Package className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-1.5">
                  No hay archivos seleccionados
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Puedes agregar fotos y videos juntos en un mismo pack
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                          handleVerArchivo(
                            archivos.findIndex((a) => a.id === archivo.id)
                          );
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

          {/* Footer - MÁS COMPACTO */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <div className="flex gap-2.5">
              <button
                onClick={handleCerrar}
                className="flex-1 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={archivosSeleccionados < minimoArchivos || !titulo.trim() || precio <= 0}
                className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-md ${
                  archivosSeleccionados < minimoArchivos || !titulo.trim() || precio <= 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                {packEditar ? 'Guardar Cambios' : `Crear Pack (${archivosSeleccionados})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales de Confirmación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmDelete}
            title="Eliminar Archivos"
            message={`¿Estás segura de eliminar ${archivos.filter((a) => a.seleccionado).length} archivo(s)?`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarEliminarSeleccionados}
            onCancel={() => setShowConfirmDelete(false)}
          />
        </div>
      )}

      {showAlertValidation && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showAlertValidation}
            title="Validación"
            message={mensajeValidacion}
            confirmText="Entendido"
            cancelText=""
            type="warning"
            onConfirm={() => setShowAlertValidation(false)}
            onCancel={() => setShowAlertValidation(false)}
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

  // ✅ Renderizar con createPortal para que aparezca POR ENCIMA de TODO
  return createPortal(modalContent, document.body);
};

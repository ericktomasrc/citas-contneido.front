// src/components/DashboardCreadora/Tabs/Contenido/ProgramarVideoModal.tsx
// ✅ NUEVO - Modal para programar video con sugerencias

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Calendar, Clock, Lightbulb, Heart, Video } from 'lucide-react';
import { MOCK_SUGERENCIAS } from './types';
import type { ArchivoContenido, VideoProgramado, SugerenciaContenido } from './types';

interface ProgramarVideoModalProps {
  isOpen: boolean;
  videoEditar: VideoProgramado | null;
  onClose: () => void;
  onGuardar: (
    titulo: string,
    descripcion: string,
    archivo: ArchivoContenido,
    fechaProgramada: Date,
    horaProgramada: string,
    sugerencia: SugerenciaContenido | null
  ) => void;
}

export const ProgramarVideoModal = ({
  isOpen,
  videoEditar,
  onClose,
  onGuardar,
}: ProgramarVideoModalProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<ArchivoContenido | null>(null);
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [horaProgramada, setHoraProgramada] = useState('10:00');
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState<SugerenciaContenido | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoEditar) {
      setTitulo(videoEditar.titulo);
      setDescripcion(videoEditar.descripcion || '');
      setArchivo(videoEditar.archivo);
      setFechaProgramada(videoEditar.fechaProgramada.toISOString().split('T')[0]);
      setHoraProgramada(videoEditar.horaProgramada);
      setSugerenciaSeleccionada(videoEditar.sugerenciaAsociada || null);
    } else {
      // Defaults para nuevo
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      setFechaProgramada(manana.toISOString().split('T')[0]);
      setTitulo('');
      setDescripcion('');
      setArchivo(null);
      setHoraProgramada('10:00');
      setSugerenciaSeleccionada(null);
    }
  }, [videoEditar, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nuevoArchivo: ArchivoContenido = {
      id: `${Date.now()}`,
      tipo: 'video',
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      nombre: file.name,
      tamano: file.size,
      fechaSubida: new Date(),
    };
    setArchivo(nuevoArchivo);
  };

  const handleGuardar = () => {
    if (!titulo.trim() || !archivo || !fechaProgramada) return;

    onGuardar(
      titulo,
      descripcion,
      archivo,
      new Date(fechaProgramada + 'T12:00:00'),
      horaProgramada,
      sugerenciaSeleccionada
    );
  };

  const puedeGuardar = titulo.trim() && archivo && fechaProgramada;
  const hoy = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {videoEditar ? 'Editar Video Programado' : 'Programar Video'}
              </h3>
              <p className="text-[10px] text-slate-500">
                Se publicará automáticamente en la fecha indicada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Subir Video */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Video <span className="text-red-500">*</span>
            </label>
            {archivo ? (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <video src={archivo.url} className="w-full h-full object-cover" muted />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{archivo.nombre}</p>
                    <p className="text-[10px] text-slate-400">
                      {(archivo.tamano / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setArchivo(null)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl mb-2 transition">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition">
                    Clic para seleccionar video
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Rutina de yoga matutina"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              maxLength={80}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descripción <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el contenido del video..."
              rows={2}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
              maxLength={200}
            />
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaProgramada}
                onChange={(e) => setFechaProgramada(e.target.value)}
                min={hoy}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <Clock className="w-3 h-3 inline mr-1" />
                Hora
              </label>
              <input
                type="time"
                value={horaProgramada}
                onChange={(e) => setHoraProgramada(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Sugerencias de suscriptores */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <label className="text-xs font-semibold text-slate-700">
                Sugerencias de suscriptores
              </label>
              <span className="text-[10px] text-slate-400 font-normal">(opcional - selecciona una)</span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {MOCK_SUGERENCIAS.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() =>
                    setSugerenciaSeleccionada(
                      sugerenciaSeleccionada?.id === sug.id ? null : sug
                    )
                  }
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    sugerenciaSeleccionada?.id === sug.id
                      ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 leading-snug font-medium">{sug.texto}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        @{sug.usernameSuscriptor}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 text-rose-400 flex-shrink-0">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-bold">{sug.likes}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={!puedeGuardar}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
                puedeGuardar
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white hover:shadow-lg'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {videoEditar ? 'Guardar Cambios' : 'Programar Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

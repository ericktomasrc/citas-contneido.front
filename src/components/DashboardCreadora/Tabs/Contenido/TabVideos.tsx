// src/components/DashboardCreadora/Tabs/Contenido/TabVideos.tsx
// ✅ NUEVO - VIDEOS CON SUB-TABS (PUBLICADOS | PROGRAMADOS)
// Lógica de "Publicados" copiada de TabContenido original (misma estructura)
// "Programados" es funcionalidad nueva

import { useState, useRef } from 'react';
import { Video, AlertCircle, Upload, Calendar, Clock } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../Common/config/config';
import { ListadoContenido } from './ListadoContenido';
import { EstadoSuscripcion } from './EstadoSuscripcion';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import { VideosProgramados } from './VideosProgramados';
import { ProgramarVideoModal } from './ProgramarVideoModal';
import type { ArchivoContenido, GrupoContenido, VideoProgramado, SugerenciaContenido } from './types';

const MINIMO_VIDEOS = CONTENIDO_CONFIG.MINIMO_VIDEOS;

type SubTab = 'publicados' | 'programados';

type TipoConfirmacion = 
  | 'activar-suscripcion'
  | 'desactivar-suscripcion'
  | 'eliminar-sin-minimo'
  | null;

export const TabVideos = () => {
  // ═══════════════════════════════════════════════════
  // SUB-TAB STATE
  // ═══════════════════════════════════════════════════
  const [subTab, setSubTab] = useState<SubTab>('publicados');

  // ═══════════════════════════════════════════════════
  // ESTADOS ORIGINALES DE TABCONTENIDO (para videos publicados)
  // ═══════════════════════════════════════════════════
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);
  const [precioSuscripcion, setPrecioSuscripcion] = useState<number>(CONTENIDO_CONFIG.PRECIO_DEFAULT);
  const [gruposContenido, setGruposContenido] = useState<GrupoContenido[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [confirmacionTipo, setConfirmacionTipo] = useState<TipoConfirmacion>(null);
  const [confirmacionData, setConfirmacionData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalVideos = gruposContenido.reduce((acc, grupo) => acc + grupo.archivos.length, 0);
  const suscriptoresPagaron = 3;

  // ═══════════════════════════════════════════════════
  // ESTADOS NUEVOS PARA PROGRAMACIÓN
  // ═══════════════════════════════════════════════════
  const [videosProgramados, setVideosProgramados] = useState<VideoProgramado[]>([]);
  const [showProgramarModal, setShowProgramarModal] = useState(false);
  const [videoProgramadoEditar, setVideoProgramadoEditar] = useState<VideoProgramado | null>(null);

  const totalProgramados = videosProgramados.filter(v => v.estado === 'pendiente').length;

  // ═══════════════════════════════════════════════════
  // LÓGICA DE VIDEOS PUBLICADOS (misma que TabContenido original)
  // ═══════════════════════════════════════════════════

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const nuevosArchivos: ArchivoContenido[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      tipo: 'video',
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      nombre: file.name,
      tamano: file.size,
      fechaSubida: new Date(),
    }));

    agregarArchivosAGrupos(nuevosArchivos);
    setFileInputKey(Date.now());
  };

  const agregarArchivosAGrupos = (archivos: ArchivoContenido[]) => {
    setGruposContenido((prev) => {
      const nuevosGrupos = prev.map(grupo => ({
        ...grupo,
        archivos: [...grupo.archivos]
      }));
      
      const archivosPorMes = archivos.reduce((acc, archivo) => {
        const fecha = new Date(archivo.fechaSubida);
        const mesAnio = `${fecha.getFullYear()}-${fecha.getMonth()}`;
        if (!acc[mesAnio]) acc[mesAnio] = [];
        acc[mesAnio].push(archivo);
        return acc;
      }, {} as Record<string, ArchivoContenido[]>);

      Object.entries(archivosPorMes).forEach(([mesAnio, archivosDelMes]) => {
        const [anio, mes] = mesAnio.split('-').map(Number);
        const fechaGrupo = new Date(anio, mes, 1);
        
        const grupoExistente = nuevosGrupos.find((g) => {
          const fechaG = new Date(g.fecha);
          return fechaG.getFullYear() === anio && fechaG.getMonth() === mes;
        });
        
        if (grupoExistente) {
          grupoExistente.archivos = [...grupoExistente.archivos, ...archivosDelMes];
        } else {
          nuevosGrupos.push({ fecha: fechaGrupo, archivos: [...archivosDelMes] });
        }
      });
      
      return nuevosGrupos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    });
  };

  const handleEliminarArchivo = (grupoIndex: number, archivoId: string) => {
    if (suscripcionActiva && totalVideos - 1 < MINIMO_VIDEOS) {
      setConfirmacionTipo('eliminar-sin-minimo');
      setShowConfirmacion(true);
      return;
    }
    setGruposContenido((prev) => {
      const nuevoGrupos = [...prev];
      nuevoGrupos[grupoIndex].archivos = nuevoGrupos[grupoIndex].archivos.filter(
        (a) => a.id !== archivoId
      );
      return nuevoGrupos.filter((g) => g.archivos.length > 0);
    });
  };

  const handleEliminarGrupo = (grupoIndex: number) => {
    const grupo = gruposContenido[grupoIndex];
    if (suscripcionActiva && totalVideos - grupo.archivos.length < MINIMO_VIDEOS) {
      setConfirmacionTipo('eliminar-sin-minimo');
      setShowConfirmacion(true);
      return;
    }
    setGruposContenido((prev) => prev.filter((_, index) => index !== grupoIndex));
  };

  const handleActivarSuscripcion = () => {
    if (totalVideos < MINIMO_VIDEOS) return;
    setConfirmacionTipo('activar-suscripcion');
    setConfirmacionData({ totalArchivos: totalVideos, precio: precioSuscripcion });
    setShowConfirmacion(true);
  };

  const confirmarActivarSuscripcion = () => {
    setSuscripcionActiva(true);
    setShowConfirmacion(false);
  };

  const handleDesactivarSuscripcion = () => {
    setConfirmacionTipo('desactivar-suscripcion');
    setShowConfirmacion(true);
  };

  const confirmarDesactivarSuscripcion = () => {
    setSuscripcionActiva(false);
    setShowConfirmacion(false);
  };

  // ═══════════════════════════════════════════════════
  // LÓGICA DE VIDEOS PROGRAMADOS (NUEVA)
  // ═══════════════════════════════════════════════════

  const handleProgramarVideo = (
    titulo: string,
    descripcion: string,
    archivo: ArchivoContenido,
    fechaProgramada: Date,
    horaProgramada: string,
    sugerencia: SugerenciaContenido | null
  ) => {
    if (videoProgramadoEditar) {
      // Editar existente
      setVideosProgramados((prev) =>
        prev.map((v) =>
          v.id === videoProgramadoEditar.id
            ? { ...v, titulo, descripcion, archivo, fechaProgramada, horaProgramada, sugerenciaAsociada: sugerencia }
            : v
        )
      );
    } else {
      // Crear nuevo
      const nuevo: VideoProgramado = {
        id: `prog-${Date.now()}`,
        titulo,
        descripcion,
        archivo,
        fechaProgramada,
        horaProgramada,
        sugerenciaAsociada: sugerencia,
        estado: 'pendiente',
        fechaCreacion: new Date(),
      };
      setVideosProgramados((prev) => [nuevo, ...prev]);
    }
    setShowProgramarModal(false);
    setVideoProgramadoEditar(null);
  };

  const handleEditarProgramado = (video: VideoProgramado) => {
    setVideoProgramadoEditar(video);
    setShowProgramarModal(true);
  };

  const handleEliminarProgramado = (id: string) => {
    setVideosProgramados((prev) => prev.filter((v) => v.id !== id));
  };

  // ═══════════════════════════════════════════════════
  // CONFIG DEL MODAL DE CONFIRMACIÓN
  // ═══════════════════════════════════════════════════

  const getModalConfig = () => {
    switch (confirmacionTipo) {
      case 'activar-suscripcion':
        return {
          title: 'Autorización de Publicación',
          message: `¿Confirmas que deseas publicar tu contenido y activar las suscripciones?\n\n• ${confirmacionData?.totalArchivos || 0} videos se harán disponibles\n• Precio: S/.${confirmacionData?.precio || 0}/mes\n\nTu contenido será visible para tus suscriptores.`,
          confirmText: 'Activar Suscripción',
          type: 'info' as const,
          onConfirm: confirmarActivarSuscripcion,
        };
      case 'desactivar-suscripcion':
        return {
          title: 'Desactivar Suscripción',
          message: 'Al desactivar la suscripción:\n\n• Perderás AUTOMÁTICAMENTE todos tus suscriptores activos\n• Este proceso es irreversible\n\nSi tienes dudas, comunícate con el área de soporte antes de continuar.\n\n¿Deseas continuar con la desactivación?',
          confirmText: 'Sí, desactivar',
          type: 'danger' as const,
          onConfirm: confirmarDesactivarSuscripcion,
        };
      case 'eliminar-sin-minimo':
        return {
          title: 'No puedes eliminar este contenido',
          message: `Tu suscripción está activa y necesitas mantener al menos ${MINIMO_VIDEOS} videos publicados.\n\nDesactiva tu suscripción primero si deseas eliminar más videos.`,
          confirmText: 'Entendido',
          cancelText: '',
          type: 'warning' as const,
          onConfirm: () => setShowConfirmacion(false),
        };
      default:
        return {
          title: '',
          message: '',
          confirmText: 'Aceptar',
          type: 'info' as const,
          onConfirm: () => setShowConfirmacion(false),
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <>
      {/* Input oculto para subir videos */}
      <input
        key={fileInputKey}
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ✅ FILA CON SUSCRIPCIÓN + BOTONES */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="inline-block">
          <EstadoSuscripcion
            tipo="videos"
            suscripcionActiva={suscripcionActiva}
            suscriptoresPagaron={suscriptoresPagaron}
            precioSuscripcion={precioSuscripcion}
            setPrecioSuscripcion={setPrecioSuscripcion}
            totalArchivos={totalVideos}
            minimo={MINIMO_VIDEOS}
            onActivar={handleActivarSuscripcion}
            onDesactivar={handleDesactivarSuscripcion}
          />
        </div>

        {/* ✅ BOTONES: Subir Videos + Programar */}
        <div className="flex gap-2">
          {subTab === 'publicados' && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Subir Videos
            </button>
          )}
          <button
            onClick={() => {
              setVideoProgramadoEditar(null);
              setShowProgramarModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            Programar
          </button>
        </div>
      </div>

      {/* ✅ SUB-TABS: Publicados | Programados */}
      <div className="flex items-center gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setSubTab('publicados')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            subTab === 'publicados'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Video className="w-4 h-4" />
          Publicados
          {totalVideos > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              subTab === 'publicados' ? 'bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {totalVideos}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('programados')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            subTab === 'programados'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Programados
          {totalProgramados > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              subTab === 'programados' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {totalProgramados}
            </span>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* CONTENIDO SEGÚN SUB-TAB */}
      {/* ═══════════════════════════════════════════════ */}

      {subTab === 'publicados' ? (
        <>
          {/* Aviso si no hay suficientes videos */}
          {totalVideos < MINIMO_VIDEOS && totalVideos > 0 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Necesitas más contenido
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Sube al menos {MINIMO_VIDEOS - totalVideos} videos más para activar tu suscripción
                </p>
              </div>
            </div>
          )}

          {/* Videos publicados */}
          {gruposContenido.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-2xl mb-3">
                  <Video className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-1.5">
                  Aún no tienes videos
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Comienza subiendo videos para tus suscriptores
                </p>
                <div className="flex gap-2.5 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Subir Videos
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ListadoContenido
              tipo="videos"
              grupos={gruposContenido}
              onEliminarArchivo={handleEliminarArchivo}
              onEliminarGrupo={handleEliminarGrupo}
            />
          )}
        </>
      ) : (
        /* ✅ SUB-TAB PROGRAMADOS */
        <VideosProgramados
          videos={videosProgramados}
          onEditar={handleEditarProgramado}
          onEliminar={handleEliminarProgramado}
          onNuevo={() => {
            setVideoProgramadoEditar(null);
            setShowProgramarModal(true);
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* MODALES */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Modal Programar Video */}
      {showProgramarModal && (
        <ProgramarVideoModal
          isOpen={showProgramarModal}
          videoEditar={videoProgramadoEditar}
          onClose={() => {
            setShowProgramarModal(false);
            setVideoProgramadoEditar(null);
          }}
          onGuardar={handleProgramarVideo}
        />
      )}

      {/* Modal Confirmación */}
      {showConfirmacion && (
        <ConfirmacionModal
          isOpen={showConfirmacion}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          type={modalConfig.type}
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setShowConfirmacion(false)}
        />
      )}
    </>
  );
};

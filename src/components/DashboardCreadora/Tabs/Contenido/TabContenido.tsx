// src/components/DashboardCreadora/Tabs/Contenido/TabContenido.tsx
// ✅ SIN MODAL - BOTONES DIRECTOS + CÁMARA WEB

import { useState, useRef } from 'react';
import { Image, Video, AlertCircle, Upload, Camera, VideoIcon } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../Common/config/config';
import { ListadoContenido } from './ListadoContenido';
import { EstadoSuscripcion } from './EstadoSuscripcion';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import { CameraModal } from './CameraModal';
import type { ArchivoContenido, GrupoContenido } from './types';

interface TabContenidoProps {
  tipo: 'fotos' | 'videos';
  minimo: number;
}

type TipoConfirmacion = 
  | 'activar-suscripcion'
  | 'desactivar-suscripcion'
  | 'eliminar-sin-minimo'
  | null;

export const TabContenido = ({ tipo, minimo }: TabContenidoProps) => {
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);
  const [precioSuscripcion, setPrecioSuscripcion] = useState<number>(CONTENIDO_CONFIG.PRECIO_DEFAULT);
  const [gruposContenido, setGruposContenido] = useState<GrupoContenido[]>([]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // ✅ Key única para forzar reset

  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [confirmacionTipo, setConfirmacionTipo] = useState<TipoConfirmacion>(null);
  const [confirmacionData, setConfirmacionData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalArchivos = gruposContenido.reduce((acc, grupo) => acc + grupo.archivos.length, 0);
  const suscriptoresPagaron = 3;

  // ✅ Manejar subida de archivos directa
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    console.log('🔵 handleFileSelect - Archivos seleccionados:', files.length);
    
    const tipoArchivo: 'foto' | 'video' = tipo === 'fotos' ? 'foto' : 'video';
    
    const nuevosArchivos: ArchivoContenido[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      tipo: tipoArchivo,
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      nombre: file.name,
      tamano: file.size,
      fechaSubida: new Date(),
    }));

    console.log('🟢 handleFileSelect - Archivos procesados:', nuevosArchivos.length);
    agregarArchivosAGrupos(nuevosArchivos);
    
    // ✅ Cambiar key para forzar reset del input
    setFileInputKey(Date.now());
    console.log('🟣 handleFileSelect - Input reseteado');
  };

  // ✅ Agregar archivos capturados desde cámara
  const handleCameraCapture = (blob: Blob, tipoCaptura: 'foto' | 'video') => {
    const archivo: ArchivoContenido = {
      id: `${Date.now()}-${Math.random()}`,
      tipo: tipoCaptura,
      url: URL.createObjectURL(blob),
      thumbnail: URL.createObjectURL(blob),
      nombre: `${tipoCaptura}-${Date.now()}.${tipoCaptura === 'foto' ? 'jpg' : 'mp4'}`,
      tamano: blob.size,
      fechaSubida: new Date(),
    };

    agregarArchivosAGrupos([archivo]);
    setShowCameraModal(false);
  };

  // ✅ Agregar archivos a grupos por mes (SIN MUTACIONES)
  const agregarArchivosAGrupos = (archivos: ArchivoContenido[]) => {
    console.log('🔴 agregarArchivosAGrupos - Recibiendo archivos:', archivos.length);
    
    setGruposContenido((prev) => {
      console.log('🟡 agregarArchivosAGrupos - Estado anterior:', prev.length, 'grupos');
      prev.forEach((g, i) => {
        console.log(`   Grupo ${i + 1}: ${g.archivos.length} archivos`);
      });
      
      // ✅ DEEP COPY para evitar mutaciones
      const nuevosGrupos = prev.map(grupo => ({
        ...grupo,
        archivos: [...grupo.archivos]
      }));
      
      // Agrupar archivos nuevos por mes
      const archivosPorMes = archivos.reduce((acc, archivo) => {
        const fecha = new Date(archivo.fechaSubida);
        const mesAnio = `${fecha.getFullYear()}-${fecha.getMonth()}`;
        if (!acc[mesAnio]) acc[mesAnio] = [];
        acc[mesAnio].push(archivo);
        return acc;
      }, {} as Record<string, ArchivoContenido[]>);

      // Agregar archivos a grupos existentes o crear nuevos
      Object.entries(archivosPorMes).forEach(([mesAnio, archivosDelMes]) => {
        const [anio, mes] = mesAnio.split('-').map(Number);
        const fechaGrupo = new Date(anio, mes, 1);
        
        const grupoExistente = nuevosGrupos.find((g) => {
          const fechaG = new Date(g.fecha);
          return fechaG.getFullYear() === anio && fechaG.getMonth() === mes;
        });
        
        if (grupoExistente) {
          console.log(`   ✅ Agregando ${archivosDelMes.length} archivos a grupo existente`);
          // ✅ Agregar sin mutar el original
          grupoExistente.archivos = [...grupoExistente.archivos, ...archivosDelMes];
        } else {
          console.log(`   ✅ Creando nuevo grupo con ${archivosDelMes.length} archivos`);
          nuevosGrupos.push({ fecha: fechaGrupo, archivos: [...archivosDelMes] });
        }
      });
      
      console.log('🟢 agregarArchivosAGrupos - Estado nuevo:', nuevosGrupos.length, 'grupos');
      nuevosGrupos.forEach((g, i) => {
        console.log(`   Grupo ${i + 1}: ${g.archivos.length} archivos`);
      });
      
      return nuevosGrupos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    });
  };

  const handleEliminarArchivo = (grupoIndex: number, archivoId: string) => {
    if (suscripcionActiva && totalArchivos - 1 < minimo) {
      setConfirmacionTipo('eliminar-sin-minimo');
      setShowConfirmacion(true);
      return;
    }
    ejecutarEliminacionArchivo(grupoIndex, archivoId);
  };

  const ejecutarEliminacionArchivo = (grupoIndex: number, archivoId: string) => {
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
    if (suscripcionActiva && totalArchivos - grupo.archivos.length < minimo) {
      setConfirmacionTipo('eliminar-sin-minimo');
      setShowConfirmacion(true);
      return;
    }
    setGruposContenido((prev) => prev.filter((_, index) => index !== grupoIndex));
  };

  const handleActivarSuscripcion = () => {
    if (totalArchivos < minimo) return;
    setConfirmacionTipo('activar-suscripcion');
    setConfirmacionData({ totalArchivos, precio: precioSuscripcion });
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

  const getModalConfig = () => {
    switch (confirmacionTipo) {
      case 'activar-suscripcion':
        return {
          title: 'Autorización de Publicación',
          message: `¿Confirmas que deseas publicar tu contenido y activar las suscripciones?\n\n• ${confirmacionData?.totalArchivos || 0} ${tipo} se harán disponibles\n• Precio: S/.${confirmacionData?.precio || 0}/mes\n\nTu contenido será visible para tus suscriptores.`,
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
          message: `Tu suscripción está activa y necesitas mantener al menos ${minimo} ${tipo} publicadas.\n\nDesactiva tu suscripción primero si deseas eliminar más ${tipo}.`,
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
  const labelTipo = tipo === 'fotos' ? 'Fotos' : 'Videos';
  const IconoTipo = tipo === 'fotos' ? Image : Video;
  const acceptType = tipo === 'fotos' ? 'image/*' : 'video/*';

  return (
    <>
      {/* Input oculto para subir archivos */}
      <input
        key={fileInputKey}
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptType}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ✅ FILA CON SUSCRIPCIÓN + BOTONES */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Componente de suscripción */}
        <div className="inline-block">
          <EstadoSuscripcion
            tipo={tipo}
            suscripcionActiva={suscripcionActiva}
            suscriptoresPagaron={suscriptoresPagaron}
            precioSuscripcion={precioSuscripcion}
            setPrecioSuscripcion={setPrecioSuscripcion}
            totalArchivos={totalArchivos}
            minimo={minimo}
            onActivar={handleActivarSuscripcion}
            onDesactivar={handleDesactivarSuscripcion}
          />
        </div>

        {/* ✅ BOTONES DIRECTOS (SIN MODAL) */}
        <div className="flex gap-2">
          {tipo === 'fotos' ? (
            <>
              {/* Subir Fotos */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Subir Fotos
              </button>

              {/* Tomar Foto */}
              <button
                onClick={() => setShowCameraModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                Tomar Foto
              </button>
            </>
          ) : (
            <>
              {/* Subir Videos */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Subir Videos
              </button>

              {/* Grabar Video */}
              <button
                onClick={() => setShowCameraModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <VideoIcon className="w-4 h-4" />
                Grabar Video
              </button>
            </>
          )}
        </div>
      </div>

      {/* Aviso si no hay suficientes archivos */}
      {totalArchivos < minimo && totalArchivos > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Necesitas más contenido
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Sube al menos {minimo - totalArchivos} {tipo} más para activar tu suscripción
            </p>
          </div>
        </div>
      )}

      {/* ✅ ÁREA DE CONTENIDO */}
      {gruposContenido.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-2xl mb-3">
              <IconoTipo className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1.5">
              Aún no tienes {tipo}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comienza subiendo {tipo} para tus suscriptores
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Subir {labelTipo}
              </button>
              <button
                onClick={() => setShowCameraModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                {tipo === 'fotos' ? <Camera className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                {tipo === 'fotos' ? 'Tomar Foto' : 'Grabar Video'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ListadoContenido
          tipo={tipo}
          grupos={gruposContenido}
          onEliminarArchivo={handleEliminarArchivo}
          onEliminarGrupo={handleEliminarGrupo}
        />
      )}

      {/* Modal de Cámara */}
      {showCameraModal && (
        <CameraModal
          tipo={tipo === 'fotos' ? 'foto' : 'video'}
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onCapture={handleCameraCapture}
        />
      )}

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

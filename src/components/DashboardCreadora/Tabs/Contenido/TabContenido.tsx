// src/components/DashboardCreadora/Tabs/Contenido/TabContenido.tsx
import { useState } from 'react';
import { Image, Video, AlertCircle } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../Common/config';
import { AgregarContenidoModal } from './AgregarContenidoModal';
import { ListadoContenido } from './ListadoContenido';
import { EstadoSuscripcion } from './EstadoSuscripcion';
import { ConfirmacionModal } from '../../../Common/ConfirmacionModal';
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
  // Estados principales
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);
  const [precioSuscripcion, setPrecioSuscripcion] = useState<number>(CONTENIDO_CONFIG.PRECIO_DEFAULT);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [gruposContenido, setGruposContenido] = useState<GrupoContenido[]>([]);

  // Estados para confirmación
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [confirmacionTipo, setConfirmacionTipo] = useState<TipoConfirmacion>(null);
  const [confirmacionData, setConfirmacionData] = useState<any>(null);

  // Contar total de archivos
  const totalArchivos = gruposContenido.reduce(
    (acc, grupo) => acc + grupo.archivos.length,
    0
  );

  const suscriptoresPagaron = 3; // TODO: Traer del backend

  // Función para agregar nuevo contenido
  const handleAgregarContenido = (archivos: ArchivoContenido[]) => {
    // Agrupar archivos por mes
    const archivosPorMes = archivos.reduce((acc, archivo) => {
      const fecha = new Date(archivo.fechaSubida);
      const mesAnio = `${fecha.getFullYear()}-${fecha.getMonth()}`;

      if (!acc[mesAnio]) {
        acc[mesAnio] = [];
      }
      acc[mesAnio].push(archivo);
      return acc;
    }, {} as Record<string, ArchivoContenido[]>);

    // Crear/actualizar grupos por mes
    setGruposContenido((prev) => {
      const nuevosGrupos = [...prev];

      Object.entries(archivosPorMes).forEach(([mesAnio, archivosDelMes]) => {
        const [anio, mes] = mesAnio.split('-').map(Number);
        const fechaGrupo = new Date(anio, mes, 1);

        // Buscar si ya existe un grupo para este mes
        const grupoExistente = nuevosGrupos.find((g) => {
          const fechaG = new Date(g.fecha);
          return (
            fechaG.getFullYear() === anio && fechaG.getMonth() === mes
          );
        });

        if (grupoExistente) {
          // Agregar archivos al grupo existente
          grupoExistente.archivos.push(...archivosDelMes);
        } else {
          // Crear nuevo grupo
          nuevosGrupos.push({
            fecha: fechaGrupo,
            archivos: archivosDelMes,
          });
        }
      });

      // Ordenar grupos por fecha (más reciente primero)
      return nuevosGrupos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
    });

    console.log(`✅ ${tipo} agregadas:`, archivos.length);

    // TODO: Conectar con backend
  };

  // Función para eliminar archivo individual
  const handleEliminarArchivo = (grupoIndex: number, archivoId: string) => {
    // Validar si suscripción está activa y quedarían menos del mínimo
    if (suscripcionActiva) {
      const totalActual = totalArchivos;
      if (totalActual - 1 < minimo) {
        setConfirmacionTipo('eliminar-sin-minimo');
        setShowConfirmacion(true);
        return;
      }
    }

    // Eliminar directamente si no hay problema
    ejecutarEliminacionArchivo(grupoIndex, archivoId);
  };

  const ejecutarEliminacionArchivo = (grupoIndex: number, archivoId: string) => {
    setGruposContenido((prev) => {
      const nuevoGrupos = [...prev];
      nuevoGrupos[grupoIndex].archivos = nuevoGrupos[grupoIndex].archivos.filter(
        (a) => a.id !== archivoId
      );

      // Si el grupo queda sin archivos, eliminarlo
      return nuevoGrupos.filter((g) => g.archivos.length > 0);
    });

    console.log('🗑️ Archivo eliminado:', archivoId);

    // TODO: Conectar con backend
  };

  // Función para eliminar grupo completo
  const handleEliminarGrupo = (grupoIndex: number) => {
    const grupo = gruposContenido[grupoIndex];

    // Validar si suscripción está activa
    if (suscripcionActiva) {
      const totalActual = totalArchivos;
      const totalDespues = totalActual - grupo.archivos.length;

      if (totalDespues < minimo) {
        setConfirmacionTipo('eliminar-sin-minimo');
        setShowConfirmacion(true);
        return;
      }
    }

    setGruposContenido((prev) => prev.filter((_, index) => index !== grupoIndex));

    console.log('🗑️ Grupo eliminado:', grupoIndex);

    // TODO: Conectar con backend
  };

  // Función para activar suscripción
  const handleActivarSuscripcion = () => {
    // Validación: mínimo requerido
    if (totalArchivos < minimo) {
      // Este caso ya está manejado por el botón disabled, pero por si acaso
      return;
    }

    setConfirmacionTipo('activar-suscripcion');
    setConfirmacionData({ totalArchivos, precio: precioSuscripcion });
    setShowConfirmacion(true);
  };

  const confirmarActivarSuscripcion = () => {
    setSuscripcionActiva(true);
    console.log('✅ Suscripción activada:', {
      tipo,
      precio: precioSuscripcion,
      archivos: totalArchivos,
    });
    setShowConfirmacion(false);

    // TODO: Conectar con backend
  };

  // Función para desactivar suscripción
  const handleDesactivarSuscripcion = () => {
    setConfirmacionTipo('desactivar-suscripcion');
    setShowConfirmacion(true);
  };

  const confirmarDesactivarSuscripcion = () => {
    setSuscripcionActiva(false);
    console.log('❌ Suscripción desactivada');
    setShowConfirmacion(false);

    // TODO: Conectar con backend
  };

  // Configuración de modal según tipo
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

  return (
    <>
      {/* Botones superiores */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <button
          onClick={() => setShowAgregarModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center gap-2"
        >
          <IconoTipo className="w-4 h-4" />
          Agregar {labelTipo}
        </button>

        {/* Estado de suscripción compacto */}
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

      {/* Aviso si no hay suficientes archivos */}
      {totalArchivos < minimo && totalArchivos > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Necesitas más contenido
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Sube al menos {minimo - totalArchivos} {tipo} más para activar tu
              suscripción
            </p>
          </div>
        </div>
      )}

      {/* Listado de Contenido */}
      {gruposContenido.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
            <IconoTipo className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Aún no tienes {tipo}
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Comienza subiendo {tipo} para tus suscriptores
          </p>
          {/* <button
            onClick={() => setShowAgregarModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Agregar tus Primeras {labelTipo}
          </button> */}
        </div>
      ) : (
        <ListadoContenido
          tipo={tipo}
          grupos={gruposContenido}
          onEliminarArchivo={handleEliminarArchivo}
          onEliminarGrupo={handleEliminarGrupo}
        />
      )}

      {/* Modal Agregar Contenido */}
      <AgregarContenidoModal
        tipo={tipo}
        isOpen={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onGuardar={handleAgregarContenido}
      />

      {/* Modal de Confirmación */}
      {showConfirmacion && (
        <div className="fixed inset-0 z-[100000]">
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
        </div>
      )}
    </>
  );
};

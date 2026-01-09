// src/components/DashboardCreadora/Tabs/Contenido/TabPacks.tsx
// ✅ VERSIÓN EXACTA SEGÚN IMAGEN

import { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { AgregarPackModal } from './AgregarPackModal';
import { ListadoPacks } from './ListadoPacks';
import { EstadoVentaPacks } from './EstadoVentaPacks';
import { ConfirmacionModal } from '../../../Common/Modal/ConfirmacionModal';
import type { Pack, ArchivoContenido } from './types';

const MINIMO_ARCHIVOS_PACK = 5;

export const TabPacks = () => {
  const [ventaActiva, setVentaActiva] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [packEditar, setPackEditar] = useState<Pack | null>(null);
  
  const [showConfirmActivar, setShowConfirmActivar] = useState(false);
  const [showConfirmDesactivar, setShowConfirmDesactivar] = useState(false);
  const [showAlertNoPacks, setShowAlertNoPacks] = useState(false);
  const [showAlertNoEliminar, setShowAlertNoEliminar] = useState(false);

  const packsActivos = packs.filter(p => p.activo);
  const totalCompradores = packs.reduce((acc, p) => acc + (p.compradores || 0), 0);
  const precioTotalVenta = packsActivos.reduce((acc, p) => acc + p.precio, 0);

  const obtenerThumbnail = (archivos: ArchivoContenido[]): string => {
    const primerVideo = archivos.find(a => a.tipo === 'video');
    if (primerVideo) return primerVideo.thumbnail || primerVideo.url;
    const primeraFoto = archivos.find(a => a.tipo === 'foto');
    if (primeraFoto) return primeraFoto.thumbnail || primeraFoto.url;
    return '';
  };

  const handleAgregarPack = (titulo: string, descripcion: string, precio: number, archivos: ArchivoContenido[]) => {
    const nuevoPack: Pack = {
      id: `pack-${Date.now()}`,
      titulo,
      descripcion,
      precio,
      archivos,
      activo: false,
      compradores: 0,
      fechaCreacion: new Date(),
      thumbnail: obtenerThumbnail(archivos),
    };
    setPacks(prev => [nuevoPack, ...prev]);
  };

  const handleEditarPack = (packId: string, titulo: string, descripcion: string, precio: number, archivos: ArchivoContenido[]) => {
    setPacks(prev =>
      prev.map(p =>
        p.id === packId
          ? { ...p, titulo, descripcion, precio, archivos, thumbnail: obtenerThumbnail(archivos) }
          : p
      )
    );
  };

  const handleTogglePack = (packId: string) => {
    setPacks(prev => prev.map(p => (p.id === packId ? { ...p, activo: !p.activo } : p)));
  };

  const handleEliminarPack = (packId: string) => {
    const packAEliminar = packs.find((p) => p.id === packId);
    if (ventaActiva && packAEliminar?.activo && packsActivos.length === 1) {
      setShowAlertNoEliminar(true);
      return;
    }
    setPacks(prev => prev.filter(p => p.id !== packId));
  };

  const handleActivarVenta = () => {
    if (packsActivos.length === 0) {
      setShowAlertNoPacks(true);
      return;
    }
    setShowConfirmActivar(true);
  };

  const confirmarActivarVenta = () => {
    setVentaActiva(true);
    setShowConfirmActivar(false);
  };

  const handleDesactivarVenta = () => {
    setShowConfirmDesactivar(true);
  };

  const confirmarDesactivarVenta = () => {
    setVentaActiva(false);
    setShowConfirmDesactivar(false);
  };

  return (
    <>
      {/* ✅ FILA CON COMPONENTE PEQUEÑO + BOTÓN A LA DERECHA */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Componente de venta - ANCHO AUTOMÁTICO */}
        <div className="inline-block">
          <EstadoVentaPacks
            ventaActiva={ventaActiva}
            totalPacks={packsActivos.length}
            totalCompradores={totalCompradores}
            precioTotal={precioTotalVenta}
            onActivar={handleActivarVenta}
            onDesactivar={handleDesactivarVenta}
          />
        </div>

        {/* Botón Crear Pack a la derecha */}
        <button
          onClick={() => {
            setPackEditar(null);
            setShowAgregarModal(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Crear Pack
        </button>
      </div>

      {/* Aviso si no hay packs activos */}
      {packsActivos.length === 0 && packs.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              No tienes packs activos
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Activa al menos un pack para poder iniciar las ventas
            </p>
          </div>
        </div>
      )}

      {/* ✅ ÁREA DE CONTENIDO CON BORDE PUNTEADO VISIBLE */}
      {packs.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Aún no tienes packs
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Crea tu primer pack combinando fotos y videos para vender
            </p>
            <button
              onClick={() => {
                setPackEditar(null);
                setShowAgregarModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              Crear tu Primer Pack
            </button>
          </div>
        </div>
      ) : (
        <ListadoPacks
          packs={packs}
          onTogglePack={handleTogglePack}
          onEditarPack={(pack) => {
            setPackEditar(pack);
            setShowAgregarModal(true);
          }}
          onEliminarPack={handleEliminarPack}
        />
      )}

      <AgregarPackModal
        isOpen={showAgregarModal}
        packEditar={packEditar}
        onClose={() => {
          setShowAgregarModal(false);
          setPackEditar(null);
        }}
        onGuardar={(packId, titulo, descripcion, precio, archivos) => {
          if (packId) {
            handleEditarPack(packId, titulo, descripcion, precio, archivos);
          } else {
            handleAgregarPack(titulo, descripcion, precio, archivos);
          }
        }}
        minimoArchivos={MINIMO_ARCHIVOS_PACK}
      />

      {showConfirmActivar && (
        <ConfirmacionModal
          isOpen={showConfirmActivar}
          title="Activar Venta de Packs"
          message={`¿Confirmas que deseas activar la venta de packs?\n\n• ${packsActivos.length} pack(s) activos\n• Precio total: S/.${precioTotalVenta}\n\nTus packs estarán disponibles para compra.`}
          confirmText="Activar Venta"
          type="info"
          onConfirm={confirmarActivarVenta}
          onCancel={() => setShowConfirmActivar(false)}
        />
      )}

      {showConfirmDesactivar && (
        <ConfirmacionModal
          isOpen={showConfirmDesactivar}
          title="Desactivar Venta de Packs"
          message="Al desactivar la venta de packs:\n\n• Tus packs dejarán de estar disponibles para compra\n• Este proceso es reversible\n\n¿Deseas continuar?"
          confirmText="Sí, desactivar"
          type="warning"
          onConfirm={confirmarDesactivarVenta}
          onCancel={() => setShowConfirmDesactivar(false)}
        />
      )}

      {showAlertNoPacks && (
        <ConfirmacionModal
          isOpen={showAlertNoPacks}
          title="No hay packs activos"
          message="Debes activar al menos un pack para iniciar las ventas.\n\nActiva los packs que deseas vender marcando el checkbox."
          confirmText="Entendido"
          cancelText=""
          type="warning"
          onConfirm={() => setShowAlertNoPacks(false)}
          onCancel={() => setShowAlertNoPacks(false)}
        />
      )}

      {showAlertNoEliminar && (
        <ConfirmacionModal
          isOpen={showAlertNoEliminar}
          title="No puedes eliminar este pack"
          message="Tu venta está activa y este es el último pack activo.\n\nDesactiva la venta primero o activa otro pack antes de eliminar este."
          confirmText="Entendido"
          cancelText=""
          type="warning"
          onConfirm={() => setShowAlertNoEliminar(false)}
          onCancel={() => setShowAlertNoEliminar(false)}
        />
      )}
    </>
  );
};

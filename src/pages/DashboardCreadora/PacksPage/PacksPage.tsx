// src/pages/DashboardCreadora/PacksPage/PacksPage.tsx
// ✅ PÁGINA DIRECTA SIN TABS — solo gestión de packs

import { useState } from 'react';
import { Package, AlertCircle, ShoppingBag, Users, DollarSign, Plus, Sparkles } from 'lucide-react';
import { AgregarPackModal } from '../../../components/DashboardCreadora/Tabs/Contenido/AgregarPackModal';
import { ListadoPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/ListadoPacks';
import { ConfirmacionModal } from '../../../components/Common/Modal/ConfirmacionModal';
import type { Pack, ArchivoContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/types';

const MINIMO_ARCHIVOS_PACK = 5;

export const PacksPage = () => {
  const [ventaActiva, setVentaActiva] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [packEditar, setPackEditar] = useState<Pack | null>(null);

  const [showConfirmActivar, setShowConfirmActivar] = useState(false);
  const [showConfirmDesactivar, setShowConfirmDesactivar] = useState(false);
  const [showAlertNoPacks, setShowAlertNoPacks] = useState(false);
  const [showAlertNoEliminar, setShowAlertNoEliminar] = useState(false);

  const packsActivos = packs.filter((p) => p.activo);
  const totalCompradores = packs.reduce((acc, p) => acc + (p.compradores || 0), 0);
  const precioTotalVenta = packsActivos.reduce((acc, p) => acc + p.precio, 0);

  const obtenerThumbnail = (archivos: ArchivoContenido[]): string => {
    const primerVideo = archivos.find((a) => a.tipo === 'video');
    if (primerVideo) return primerVideo.thumbnail || primerVideo.url;
    const primeraFoto = archivos.find((a) => a.tipo === 'foto');
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
    setPacks((prev) => [nuevoPack, ...prev]);
  };

  const handleEditarPack = (packId: string, titulo: string, descripcion: string, precio: number, archivos: ArchivoContenido[]) => {
    setPacks((prev) =>
      prev.map((p) =>
        p.id === packId
          ? { ...p, titulo, descripcion, precio, archivos, thumbnail: obtenerThumbnail(archivos) }
          : p
      )
    );
  };

  const handleTogglePack = (packId: string) => {
    setPacks((prev) => prev.map((p) => (p.id === packId ? { ...p, activo: !p.activo } : p)));
  };

  const handleEliminarPack = (packId: string) => {
    const packAEliminar = packs.find((p) => p.id === packId);
    if (ventaActiva && packAEliminar?.activo && packsActivos.length === 1) {
      setShowAlertNoEliminar(true);
      return;
    }
    setPacks((prev) => prev.filter((p) => p.id !== packId));
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
      {/* ── HEADER — igual al resto del dashboard ── */}
      <div className="bg-white border-b border-gray-200 -mx-3 -mt-3 mb-4 md:-mx-4 md:-mt-4">
        <div className="border-b border-gray-100 py-2.5 px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" strokeWidth={2} />
              Crea y activa tus packs para empezar a generar ventas
            </p>
          </div>
        </div>

        {/* Título de sección */}
        <div className="px-3 md:px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-semibold text-gray-800">Packs</span>
              {packs.length > 0 && (
                <span className="text-[10px] bg-pink-100 text-pink-600 font-semibold px-2 py-0.5 rounded-full">
                  {packs.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── FILA SUPERIOR: Estado de venta + Botón Crear ── */}
        <div className="flex items-center justify-between gap-4">

          {/* Estado de Venta — compacto */}
          <div
            className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all ${
              ventaActiva
                ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200'
                : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
            }`}
          >
            {/* Icono + Estado */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  ventaActiva ? 'bg-teal-500' : 'bg-slate-400'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Venta de Packs</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      ventaActiva ? 'bg-teal-500' : 'bg-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      ventaActiva ? 'text-teal-700' : 'text-slate-500'
                    }`}
                  >
                    {ventaActiva ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                  <span>
                    <span className="font-semibold text-slate-700">{packsActivos.length}</span> packs activos
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="font-semibold text-slate-700">{totalCompradores}</span> compradores
                  </span>
                </div>
              </div>
            </div>

            {/* Precio total */}
            <div className="flex items-center gap-1 ml-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-lg font-bold text-slate-800">S/.{precioTotalVenta}</span>
            </div>

            {/* Botón desactivar — solo visible cuando la venta está activa */}
            {ventaActiva && (
              <button
                onClick={handleDesactivarVenta}
                className="px-4 py-2 bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500 text-white rounded-lg font-semibold text-xs transition-all shadow-sm"
              >
                Desactivar
              </button>
            )}
          </div>

          {/* Botón Crear Pack */}
          <button
            onClick={() => {
              setPackEditar(null);
              setShowAgregarModal(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Crear Pack
          </button>
        </div>

        {/* Aviso sin packs activos */}
        {packsActivos.length === 0 && packs.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">No tienes packs activos</p>
              <p className="text-xs text-amber-700 mt-1">
                Activa al menos un pack para poder iniciar las ventas
              </p>
            </div>
          </div>
        )}

        {/* Lista o estado vacío */}
        {packs.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aún no tienes packs</h3>
              <p className="text-sm text-slate-500 mb-6">
                Crea tu primer pack combinando fotos y videos para vender
              </p>
              <button
                onClick={() => {
                  setPackEditar(null);
                  setShowAgregarModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
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
      </div>

      {/* ── MODALES ── */}
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

// src/components/DashboardCreadora/Modals/CalendarioModal.tsx
// ✅ CON REACT PORTAL - BLOQUEA TODA LA PANTALLA

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, Calendar, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

export interface EventoCalendario {
  id: string;
  fecha: Date;
  hora: string;
  titulo: string;
  tipoAcceso: 'publico' | 'suscriptores' | 'ppv';
  precioPPV?: number;
  descripcionPPV?: string;
}

interface CalendarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventos: EventoCalendario[];
  onGuardarEvento: (evento: Omit<EventoCalendario, 'id'>) => void;
  onEliminarEvento: (eventoId: string) => void;
}

export const CalendarioModal = ({
  isOpen,
  onClose,
  eventos,
  onGuardarEvento,
  onEliminarEvento
}: CalendarioModalProps) => {
  const [vistaActual, setVistaActual] = useState<'meses' | 'calendario' | 'crear'>('meses');
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [eventoAEliminar, setEventoAEliminar] = useState<string | null>(null);
  
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    hora: new Date().toTimeString().slice(0, 5),
    tipoAcceso: 'publico' as 'publico' | 'suscriptores' | 'ppv',
    precioPPV: 15,
    descripcionPPV: ''
  });

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (month: number, year: number) => 
    new Date(year, month + 1, 0).getDate();
  
  const getFirstDayOfMonth = (month: number, year: number) => 
    new Date(year, month, 1).getDay();
  
  const isDatePast = (day: number, month: number, year: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(year, month, day) < today;
  };

  const getEventosForDay = (day: number, month: number, year: number) => {
    return eventos.filter(e => {
      const eventDate = new Date(e.fecha);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  const handleSeleccionarMes = (index: number) => {
    setMesSeleccionado(index);
    setVistaActual('calendario');
  };

  const handleSeleccionarDia = (day: number) => {
    if (mesSeleccionado === null) return;
    const year = new Date().getFullYear();
    if (isDatePast(day, mesSeleccionado, year)) return;
    
    const eventosDelDia = getEventosForDay(day, mesSeleccionado, year);
    if (eventosDelDia.length >= 5) {
      alert('⚠️ Límite alcanzado: máximo 5 eventos por día');
      return;
    }
    
    setDiaSeleccionado(day);
  };

  const handleAbrirModalCrear = () => {
    setNuevoEvento({
      titulo: '',
      hora: new Date().toTimeString().slice(0, 5),
      tipoAcceso: 'publico',
      precioPPV: 15,
      descripcionPPV: ''
    });
    setVistaActual('crear');
  };

  const handleGuardar = () => {
    if (!diaSeleccionado || mesSeleccionado === null || !nuevoEvento.titulo.trim()) {
      alert('⚠️ El título es obligatorio');
      return;
    }
    
    if (nuevoEvento.tipoAcceso === 'ppv') {
      if (!nuevoEvento.precioPPV || nuevoEvento.precioPPV < 1) {
        alert('⚠️ Debes ingresar un precio válido para PPV');
        return;
      }
      if (!nuevoEvento.descripcionPPV?.trim()) {
        alert('⚠️ Debes ingresar una descripción para PPV');
        return;
      }
    }
    
    const year = new Date().getFullYear();
    onGuardarEvento({
      fecha: new Date(year, mesSeleccionado, diaSeleccionado),
      hora: nuevoEvento.hora,
      titulo: nuevoEvento.titulo,
      tipoAcceso: nuevoEvento.tipoAcceso,
      precioPPV: nuevoEvento.tipoAcceso === 'ppv' ? nuevoEvento.precioPPV : undefined,
      descripcionPPV: nuevoEvento.tipoAcceso === 'ppv' ? nuevoEvento.descripcionPPV : undefined
    });
    
    setVistaActual('calendario');
  };

  const handleConfirmarEliminacion = (eventoId: string) => {
    onEliminarEvento(eventoId);
    setEventoAEliminar(null);
  };

  const handleVolver = () => {
    if (vistaActual === 'crear') {
      setVistaActual('calendario');
    } else if (vistaActual === 'calendario') {
      setVistaActual('meses');
      setMesSeleccionado(null);
      setDiaSeleccionado(null);
    }
  };

  const handleCerrar = () => {
    setVistaActual('meses');
    setMesSeleccionado(null);
    setDiaSeleccionado(null);
    onClose();
  };

  if (!isOpen) return null;

  // ✅ CONTENIDO DEL MODAL
  const modalContent = (
    <>
      {/* VISTA 1: Selección de Meses */}
      {vistaActual === 'meses' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Programar Eventos</h2>
                <p className="text-xs text-slate-500 mt-0.5">Selecciona un mes para comenzar</p>
              </div>
              <button onClick={handleCerrar} className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-3">
                {meses.map((mes, index) => {
                  const mesActual = new Date().getMonth();
                  const añoActual = new Date().getFullYear();
                  const habilitado = index >= mesActual;
                  const eventosEnMes = eventos.filter(e => {
                    const fechaEvento = new Date(e.fecha);
                    return fechaEvento.getMonth() === index && fechaEvento.getFullYear() === añoActual;
                  });
                  
                  return (
                    <button
                      key={index}
                      onClick={() => habilitado && handleSeleccionarMes(index)}
                      disabled={!habilitado}
                      className={`relative rounded-xl p-4 transition-all ${
                        habilitado
                          ? 'bg-white border-2 border-slate-200 hover:border-violet-400 hover:shadow-md hover:scale-[1.02]'
                          : 'bg-slate-100 border-2 border-slate-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${habilitado ? 'text-slate-800' : 'text-slate-400'}`}>
                        {mes}
                      </p>
                      {eventosEnMes.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-[10px] text-white font-bold">{eventosEnMes.length}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: Calendario */}
      {vistaActual === 'calendario' && mesSeleccionado !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={handleVolver} className="p-2 hover:bg-violet-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{meses[mesSeleccionado]} 2026</h2>
                  <p className="text-xs text-slate-600">Haz clic en un día para crear eventos</p>
                </div>
              </div>
              <button onClick={handleCerrar} className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-violet-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
              <div className="w-[60%] border-r border-slate-200 p-6 flex-shrink-0 bg-slate-50">
                <div className="grid grid-cols-7 gap-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-semibold text-slate-600 text-sm py-2">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: getFirstDayOfMonth(mesSeleccionado, 2026) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: getDaysInMonth(mesSeleccionado, 2026) }).map((_, i) => {
                    const day = i + 1;
                    const isPast = isDatePast(day, mesSeleccionado, 2026);
                    const eventosDelDia = getEventosForDay(day, mesSeleccionado, 2026);
                    const isSelected = diaSeleccionado === day;

                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && handleSeleccionarDia(day)}
                        disabled={isPast}
                        className={`aspect-square p-2 rounded-xl text-sm font-medium transition-all relative ${
                          isPast
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-violet-500 text-white ring-2 ring-violet-300 shadow-md scale-105'
                            : eventosDelDia.length > 0
                            ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900 hover:bg-emerald-200 hover:scale-105'
                            : 'bg-white border-2 border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:scale-105'
                        }`}
                      >
                        {day}
                        {eventosDelDia.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-[9px] text-white font-bold">{eventosDelDia.length}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-[40%] flex flex-col bg-white">
                {diaSeleccionado === null ? (
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Calendar className="w-8 h-8 text-violet-600" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Selecciona un día</p>
                      <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
                        Haz clic en cualquier día para gestionar eventos
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50 flex-shrink-0 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900">Eventos</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {diaSeleccionado} de {meses[mesSeleccionado]} • {getEventosForDay(diaSeleccionado, mesSeleccionado, 2026).length}/5 eventos
                        </p>
                      </div>
                      <button
                        onClick={handleAbrirModalCrear}
                        disabled={getEventosForDay(diaSeleccionado, mesSeleccionado, 2026).length >= 5}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition inline-flex items-center gap-2 shadow-md ${
                          getEventosForDay(diaSeleccionado, mesSeleccionado, 2026).length >= 5
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-lg'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Crear
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-slate-50">
                      {getEventosForDay(diaSeleccionado, mesSeleccionado, 2026).length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-sm text-slate-500">No hay eventos</p>
                          <p className="text-xs text-slate-400 mt-1">Haz clic en "Crear" para agregar uno</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {getEventosForDay(diaSeleccionado, mesSeleccionado, 2026).map(evento => (
                            <div 
                              key={evento.id} 
                              className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-violet-300 transition-all"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 pr-3">
                                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1">
                                    {evento.titulo}
                                  </h4>
                                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {evento.hora}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setEventoAEliminar(evento.id)}
                                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                                  title="Eliminar evento"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <div className="flex gap-2 mt-2">
                                {evento.tipoAcceso === 'publico' && (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg">
                                    🌍 Gratis
                                  </span>
                                )}
                                {evento.tipoAcceso === 'suscriptores' && (
                                  <span className="px-2 py-1 bg-violet-100 text-violet-800 text-xs font-semibold rounded-lg">
                                    👑 VIP
                                  </span>
                                )}
                                {evento.tipoAcceso === 'ppv' && (
                                  <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs font-semibold rounded-lg">
                                    🎫 S/. {evento.precioPPV}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: Crear Evento */}
      {vistaActual === 'crear' && diaSeleccionado && mesSeleccionado !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nuevo Evento</h3>
                  <p className="text-xs text-slate-600">{diaSeleccionado} de {meses[mesSeleccionado]}</p>
                </div>
              </div>
              <button onClick={handleVolver} className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-violet-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Título del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value.slice(0, 100) })}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  placeholder="Ej: Sesión de Yoga Matutina"
                  maxLength={100}
                />
                <p className="text-xs text-slate-500 mt-1">{nuevoEvento.titulo.length}/100</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Hora
                </label>
                <input
                  type="time"
                  value={nuevoEvento.hora}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Tipo de Acceso</label>
                
                <button
                  onClick={() => setNuevoEvento({ ...nuevoEvento, tipoAcceso: 'publico' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    nuevoEvento.tipoAcceso === 'publico' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      nuevoEvento.tipoAcceso === 'publico' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                    }`}>
                      {nuevoEvento.tipoAcceso === 'publico' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🌍</span>
                        <h4 className="text-sm font-bold text-slate-900">Público (Gratis)</h4>
                      </div>
                      <p className="text-xs text-slate-600">Cualquiera puede ver sin costo</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setNuevoEvento({ ...nuevoEvento, tipoAcceso: 'suscriptores' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    nuevoEvento.tipoAcceso === 'suscriptores' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      nuevoEvento.tipoAcceso === 'suscriptores' ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                    }`}>
                      {nuevoEvento.tipoAcceso === 'suscriptores' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">👑</span>
                        <h4 className="text-sm font-bold text-slate-900">Solo Suscriptores</h4>
                      </div>
                      <p className="text-xs text-slate-600">Requiere suscripción</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setNuevoEvento({ ...nuevoEvento, tipoAcceso: 'ppv' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    nuevoEvento.tipoAcceso === 'ppv' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      nuevoEvento.tipoAcceso === 'ppv' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'
                    }`}>
                      {nuevoEvento.tipoAcceso === 'ppv' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🎫</span>
                        <h4 className="text-sm font-bold text-slate-900">Pago por Entrada</h4>
                      </div>
                      <p className="text-xs text-slate-600">Cobro único para este evento</p>
                    </div>
                  </div>
                </button>
              </div>

              {nuevoEvento.tipoAcceso === 'ppv' && (
                <div className="space-y-3 p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Precio (S/.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={nuevoEvento.precioPPV}
                      onChange={(e) => setNuevoEvento({ ...nuevoEvento, precioPPV: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="15"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={nuevoEvento.descripcionPPV}
                      onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcionPPV: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Ej: Evento especial..."
                      rows={2}
                      maxLength={100}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button
                onClick={handleVolver}
                className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={!nuevoEvento.titulo.trim()}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
                  !nuevoEvento.titulo.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:shadow-lg'
                }`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {eventoAEliminar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-red-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Confirmar Eliminación</h3>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm text-slate-700">
                ¿Estás segura de que deseas eliminar este evento? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button
                onClick={() => setEventoAEliminar(null)}
                className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmarEliminacion(eventoAEliminar)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition text-sm shadow-md hover:shadow-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ✅ RENDERIZAR CON PORTAL DIRECTAMENTE EN EL BODY
  return createPortal(modalContent, document.body);
};

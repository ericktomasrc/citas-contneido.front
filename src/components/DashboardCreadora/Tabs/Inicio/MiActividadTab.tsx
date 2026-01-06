// src/components/DashboardCreadora/Tabs/MiActividadTab.tsx
import { useState } from 'react';
import { Calendar, Video, Radio, Crown, X, Trash2 } from 'lucide-react';
import { CalendarioModal, EventoCalendario } from '../../../Modals/CalendarioModal';
import { useTransmision } from '../../../../contexts/TransmisionContext';

interface MiActividadTabProps {
  onProgramarEvento?: () => void;
}

export const MiActividadTab = ({ onProgramarEvento }: MiActividadTabProps) => {
  // Usar el contexto existente
  const { startTransmision, isTransmisionActive } = useTransmision();
  
  // Estados para modales
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showTipoTransmisionModal, setShowTipoTransmisionModal] = useState(false);
  
  // Estado de eventos - Por ahora en memoria
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  
  // Estados para el formulario de tipo de transmisión
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioEntrada, setPrecioEntrada] = useState(15);
  const [descripcionEntrada, setDescripcionEntrada] = useState('');

  // Funciones para eventos del calendario
  const handleGuardarEvento = (evento: Omit<EventoCalendario, 'id'>) => {
    const nuevoEvento: EventoCalendario = {
      ...evento,
      id: Date.now().toString()
    };
    
    setEventos(prev => [...prev, nuevoEvento]);
    console.log('✅ Evento guardado:', nuevoEvento);
    
    // TODO: Conectar al backend
    // await fetch('/api/eventos', { method: 'POST', body: JSON.stringify(nuevoEvento) });
  };

  const handleEliminarEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
    console.log('🗑️ Evento eliminado:', eventoId);
    
    // TODO: Conectar al backend
    // await fetch(`/api/eventos/${eventoId}`, { method: 'DELETE' });
  };

  // Abrir modal de tipo de transmisión
  const handleAbrirModalTransmision = () => {
    setShowTipoTransmisionModal(true);
  };

  // Confirmar e iniciar transmisión
  const handleConfirmarTransmision = () => {
    // Validar PPV
    if (tipoSeleccionado === 'ppv') {
      if (!precioEntrada || precioEntrada < 1) {
        alert('⚠️ Ingresa un precio válido para PPV');
        return;
      }
      if (!descripcionEntrada.trim()) {
        alert('⚠️ Ingresa una descripción para PPV');
        return;
      }
    }
    
    console.log('🎥 Iniciando transmisión:', {
      tipo: tipoSeleccionado,
      precio: tipoSeleccionado === 'ppv' ? precioEntrada : undefined,
      descripcion: tipoSeleccionado === 'ppv' ? descripcionEntrada : undefined
    });
    
    // Usar la función del contexto
    startTransmision(tipoSeleccionado, precioEntrada, descripcionEntrada);
    
    // Cerrar modal y resetear
    setShowTipoTransmisionModal(false);
    setTipoSeleccionado('gratis');
    setPrecioEntrada(15);
    setDescripcionEntrada('');
  };

  return (
    <>
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl mb-4">
            <Video className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-slate-800">
            Mi Actividad
          </h2>
          <p className="text-slate-500 text-sm max-w-md">
            Gestiona tus transmisiones en vivo y programa eventos especiales para tu audiencia
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          {/* Botón Iniciar Transmisión */}
          <button
            onClick={handleAbrirModalTransmision}
            disabled={isTransmisionActive}
            className={`flex-1 group relative px-8 py-4 rounded-xl font-medium text-base transition-all shadow-lg flex items-center justify-center gap-3 ${
              isTransmisionActive
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-slate-300/25'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02]'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isTransmisionActive ? 'bg-slate-400/30' : 'bg-white/10'
            }`}>
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold">
                {isTransmisionActive ? 'Transmisión Activa' : 'Iniciar Transmisión'}
              </div>
              <div className={`text-xs ${
                isTransmisionActive ? 'text-slate-400' : 'text-white/80'
              }`}>
                {isTransmisionActive ? 'En vivo ahora' : 'Comienza ahora en vivo'}
              </div>
            </div>
          </button>

          {/* Botón Programar Evento */}
          <button
            onClick={() => setShowCalendarioModal(true)}
            className="flex-1 group relative px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-base transition-all shadow-md border-2 border-slate-200 hover:border-violet-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg flex items-center justify-center group-hover:from-violet-100 group-hover:to-purple-100 transition-colors">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Programar Evento</div>
              <div className="text-xs text-slate-500">
                {eventos.length > 0 ? `${eventos.length} evento(s) programado(s)` : 'Agenda una transmisión'}
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span>Calidad HD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Baja Latencia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
            <span>Chat en Tiempo Real</span>
          </div>
        </div>

        {/* Listado de Próximos Eventos */}
        {eventos.length > 0 && (
          <div className="mt-8 w-full max-w-2xl">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Próximos Eventos</h3>
            <div className="grid gap-2">
              {eventos
                .filter(e => new Date(e.fecha) >= new Date())
                .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                .slice(0, 3)
                .map(evento => (
                  <div 
                    key={evento.id}
                    className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:border-violet-300 transition group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{evento.titulo}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(evento.fecha).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short' 
                          })} • {evento.hora}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {evento.tipoAcceso === 'publico' && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                          Gratis
                        </span>
                      )}
                      {evento.tipoAcceso === 'suscriptores' && (
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded">
                          VIP
                        </span>
                      )}
                      {evento.tipoAcceso === 'ppv' && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded">
                          S/. {evento.precioPPV}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás segura de que deseas eliminar este evento?')) {
                            handleEliminarEvento(evento.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded-lg text-red-500"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Calendario de Eventos */}
      <CalendarioModal
        isOpen={showCalendarioModal}
        onClose={() => setShowCalendarioModal(false)}
        eventos={eventos}
        onGuardarEvento={handleGuardarEvento}
        onEliminarEvento={handleEliminarEvento}
      />

      {/* Modal de Tipo de Transmisión */}
      {showTipoTransmisionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tipo de Transmisión</h3>
                  <p className="text-xs text-slate-600">Selecciona el tipo de acceso</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipoTransmisionModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-violet-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opciones */}
            <div className="p-5 space-y-3">
              {/* Público (Gratis) */}
              <button
                onClick={() => setTipoSeleccionado('gratis')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  tipoSeleccionado === 'gratis'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoSeleccionado === 'gratis'
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300'
                  }`}>
                    {tipoSeleccionado === 'gratis' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
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

              {/* Solo Suscriptores */}
              <button
                onClick={() => setTipoSeleccionado('suscriptores')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  tipoSeleccionado === 'suscriptores'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoSeleccionado === 'suscriptores'
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-slate-300'
                  }`}>
                    {tipoSeleccionado === 'suscriptores' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-violet-600" />
                      <h4 className="text-sm font-bold text-slate-900">Solo Suscriptores</h4>
                    </div>
                    <p className="text-xs text-slate-600">Requiere suscripción mensual (S/.20-150/mes)</p>
                  </div>
                </div>
              </button>

              {/* Pago por Entrada (PPV) */}
              <button
                onClick={() => setTipoSeleccionado('ppv')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  tipoSeleccionado === 'ppv'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoSeleccionado === 'ppv'
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-slate-300'
                  }`}>
                    {tipoSeleccionado === 'ppv' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🎫</span>
                      <h4 className="text-sm font-bold text-slate-900">Pago por Entrada (PPV)</h4>
                    </div>
                    <p className="text-xs text-slate-600">Cobro único para acceder a este live</p>
                  </div>
                </div>
              </button>

              {/* Formulario PPV */}
              {tipoSeleccionado === 'ppv' && (
                <div className="space-y-3 p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Precio de Entrada (S/.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={precioEntrada}
                      onChange={(e) => setPrecioEntrada(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="15"
                      min="1"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">💡 Sugerido: S/.10-30</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={descripcionEntrada}
                      onChange={(e) => setDescripcionEntrada(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Ej: Live especial con contenido exclusivo..."
                      rows={2}
                      maxLength={100}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">{descripcionEntrada.length}/100</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button
                onClick={() => setShowTipoTransmisionModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarTransmision}
                disabled={tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim())}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
                  tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim())
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:shadow-lg'
                }`}
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

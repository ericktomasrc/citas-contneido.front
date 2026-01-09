// src/components/DashboardCreadora/Tabs/Inicio/MiActividadTab.tsx
// ✅ CORREGIDO - Sin prop onProgramarEvento (lo manejamos internamente)

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Image, Video as VideoIcon, Type, Calendar as CalendarIcon, Clock, Users, Edit2, Trash2, Play, Radio, Crown, X, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { CalendarioModal, EventoCalendario } from '../../../Modals/CalendarioModal';
import { useTransmision } from '../../../../contexts/TransmisionContext';

interface Publicacion {
  id: string;
  tipo: 'foto' | 'video' | 'texto';
  contenido: string;
  descripcion?: string;
  mediaUrl?: string;
  fechaPublicacion: Date;
  reacciones: number;
  comentarios: number;
}

// ⭐ NUEVO: Interface sin prop onProgramarEvento
interface MiActividadTabProps {
  onProgramarEvento?: () => void; // ⭐ OPCIONAL
}

export const MiActividadTab = ({ onProgramarEvento }: MiActividadTabProps = {}) => {
  const { startTransmision, isTransmisionActive } = useTransmision();
  
  // Estados
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showTipoTransmisionModal, setShowTipoTransmisionModal] = useState(false);
  const [nuevoPost, setNuevoPost] = useState('');
  const [tipoPost, setTipoPost] = useState<'texto' | 'foto' | 'video'>('texto');

  // Estados para tipo de transmisión
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioEntrada, setPrecioEntrada] = useState(15);
  const [descripcionEntrada, setDescripcionEntrada] = useState('');

  // Handlers de Eventos
  const handleGuardarEvento = (evento: Omit<EventoCalendario, 'id'>) => {
    const nuevoEvento: EventoCalendario = {
      ...evento,
      id: Date.now().toString()
    };
    setEventos(prev => [...prev, nuevoEvento]);
    
    // ⭐ Llamar a la prop si existe
    onProgramarEvento?.();
  };

  const handleEliminarEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
  };

  const handleIniciarEvento = (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    console.log('▶ Iniciando evento:', evento.titulo);
    alert(`Iniciando: ${evento.titulo}`);
  };

  // Handler de Transmisión (CON LÓGICA ORIGINAL)
  const handleAbrirModalTransmision = () => {
    setShowTipoTransmisionModal(true);
  };

  const handleConfirmarTransmision = () => {
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
    
    startTransmision(tipoSeleccionado, precioEntrada, descripcionEntrada);
    
    setShowTipoTransmisionModal(false);
    setTipoSeleccionado('gratis');
    setPrecioEntrada(15);
    setDescripcionEntrada('');
  };

  // Handlers de Publicaciones
  const handlePublicar = () => {
    if (!nuevoPost.trim()) return;
    
    const nuevaPublicacion: Publicacion = {
      id: Date.now().toString(),
      tipo: tipoPost,
      contenido: nuevoPost,
      fechaPublicacion: new Date(),
      reacciones: 0,
      comentarios: 0
    };
    
    setPublicaciones(prev => [nuevaPublicacion, ...prev]);
    setNuevoPost('');
    setTipoPost('texto');
  };

  // Obtener badge del tipo de evento
  const getBadgeEvento = (evento: EventoCalendario) => {
    if (evento.tipoAcceso === 'publico') {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-emerald-200">
          <span className="text-sm">🌍</span>
          Gratis
        </span>
      );
    }
    if (evento.tipoAcceso === 'suscriptores') {
      return (
        <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-violet-200">
          <Crown className="w-3 h-3" />
          Solo Suscriptores
        </span>
      );
    }
    if (evento.tipoAcceso === 'ppv') {
      return (
        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-amber-200">
          <span className="text-sm">🎫</span>
          S/.{evento.precioPPV}
        </span>
      );
    }
  };

  // Verificar si el evento es hoy
  const esEventoHoy = (fecha: Date) => {
    const hoy = new Date();
    const fechaEvento = new Date(fecha);
    return hoy.toDateString() === fechaEvento.toDateString();
  };

  // ✅ MODAL DE TIPO DE TRANSMISIÓN CON PORTAL
  const modalTransmision = showTipoTransmisionModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
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

        <div className="p-5 space-y-3">
          {/* Público */}
          <button
            onClick={() => setTipoSeleccionado('gratis')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'gratis' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                tipoSeleccionado === 'gratis' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'gratis' && <div className="w-2 h-2 bg-white rounded-full" />}
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

          {/* Suscriptores */}
          <button
            onClick={() => setTipoSeleccionado('suscriptores')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'suscriptores' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                tipoSeleccionado === 'suscriptores' ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'suscriptores' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-violet-600" />
                  <h4 className="text-sm font-bold text-slate-900">Solo Suscriptores</h4>
                </div>
                <p className="text-xs text-slate-600">Requiere suscripción mensual</p>
              </div>
            </div>
          </button>

          {/* PPV */}
          <button
            onClick={() => setTipoSeleccionado('ppv')}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              tipoSeleccionado === 'ppv' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                tipoSeleccionado === 'ppv' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'
              }`}>
                {tipoSeleccionado === 'ppv' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎫</span>
                  <h4 className="text-sm font-bold text-slate-900">Pago por Entrada</h4>
                </div>
                <p className="text-xs text-slate-600">Cobro único para este live</p>
              </div>
            </div>
          </button>

          {/* Formulario PPV */}
          {tipoSeleccionado === 'ppv' && (
            <div className="space-y-3 p-4 bg-pink-50 rounded-xl border border-pink-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Precio (S/.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={precioEntrada}
                  onChange={(e) => setPrecioEntrada(parseInt(e.target.value) || 0)}
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
                  value={descripcionEntrada}
                  onChange={(e) => setDescripcionEntrada(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Ej: Live especial..."
                  rows={2}
                  maxLength={100}
                />
              </div>
            </div>
          )}
        </div>

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
    </div>,
    document.body
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/20">
    
      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Composer + Publicaciones */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* COMPOSER PREMIUM */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                M
              </div>
              <div className="flex-1">
                <textarea
                  value={nuevoPost}
                  onChange={(e) => setNuevoPost(e.target.value)}
                  placeholder="Comparte algo especial con tu comunidad... ✨"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm bg-white/50"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-slate-400 mt-2 text-right">{nuevoPost.length}/500</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setTipoPost('foto')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    tipoPost === 'foto'
                      ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">Foto</span>
                </button>
                <button
                  onClick={() => setTipoPost('video')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    tipoPost === 'video'
                      ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <VideoIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </button>
                <button
                  onClick={() => setTipoPost('texto')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    tipoPost === 'texto'
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Texto</span>
                </button>
              </div>

              <button
                onClick={handlePublicar}
                disabled={!nuevoPost.trim()}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                  !nuevoPost.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                Publicar
              </button>
            </div>
          </div>

          {/* PUBLICACIONES */}
          <div className="space-y-4">
            {publicaciones.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">¡Tu comunidad te espera!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">Comienza compartiendo tu primer contenido y conecta con tus seguidores</p>
              </div>
            ) : (
              publicaciones.map(pub => (
                <div key={pub.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                        M
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Tú</p>
                        <p className="text-xs text-slate-500">
                          Hace {Math.floor((Date.now() - pub.fechaPublicacion.getTime()) / 60000)} min
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">{pub.contenido}</p>

                    {pub.tipo === 'foto' && (
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl h-64 flex items-center justify-center mb-4">
                        <Image className="w-12 h-12 text-slate-400" />
                      </div>
                    )}

                    {pub.tipo === 'video' && (
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl h-64 flex items-center justify-center mb-4">
                        <VideoIcon className="w-12 h-12 text-white/80" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 border-t border-slate-200/50">
                      <button className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition group">
                        <Heart className="w-4 h-4 group-hover:fill-pink-600" />
                        <span className="text-sm font-semibold">{pub.reacciones}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
                        <span className="text-base">💬</span>
                        <span className="text-sm font-semibold">{pub.comentarios}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Botones + Eventos */}
        <div className="space-y-4">
          
          {/* BOTONES DE ACCIÓN PREMIUM */}
          <div className="space-y-3">
            <button
              onClick={handleAbrirModalTransmision}
              disabled={isTransmisionActive}
              className={`w-full px-5 py-4 rounded-2xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-3 group ${
                isTransmisionActive
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-[1.02]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isTransmisionActive ? 'bg-slate-400/30' : 'bg-white/20'
              }`}>
                <VideoIcon className="w-5 h-5" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold">
                  {isTransmisionActive ? 'Transmisión Activa' : 'Iniciar Transmisión'}
                </div>
                <div className={`text-xs ${isTransmisionActive ? 'text-slate-400' : 'text-white/80'}`}>
                  {isTransmisionActive ? 'En vivo ahora' : 'Comienza en vivo'}
                </div>
              </div>
              {!isTransmisionActive && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>

            <button
              onClick={() => setShowCalendarioModal(true)}
              className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 border-2 border-slate-200/50 hover:border-violet-300 rounded-2xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-3 hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-violet-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold">Programar Evento</div>
                <div className="text-xs text-slate-500">
                  {eventos.length} evento(s)
                </div>
              </div>
            </button>
          </div>

          {/* EVENTOS PROGRAMADOS PREMIUM */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 border-b border-slate-200/50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-violet-600" />
                Próximos Eventos ({eventos.length})
              </h3>
            </div>

            <div className="p-4 max-h-[600px] overflow-y-auto">
              {eventos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-violet-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-semibold">Sin eventos programados</p>
                  <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto">Programa tu primer evento y conecta con tu audiencia</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventos
                    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                    .map(evento => {
                      const esHoy = esEventoHoy(evento.fecha);
                      
                      return (
                        <div 
                          key={evento.id}
                          className="border-2 border-slate-200/50 rounded-xl p-4 hover:border-violet-300 transition-all bg-white hover:shadow-md group"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {evento.tipoAcceso === 'publico' && <span className="text-base">🔴</span>}
                            {evento.tipoAcceso === 'suscriptores' && <span className="text-base">🎬</span>}
                            {evento.tipoAcceso === 'ppv' && <span className="text-base">💎</span>}
                            <h4 className="font-bold text-sm text-slate-900 flex-1 line-clamp-2">
                              {evento.titulo}
                            </h4>
                          </div>

                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span>
                                {esHoy ? 'Hoy' : new Date(evento.fecha).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                              <span>•</span>
                              <Clock className="w-3.5 h-3.5" />
                              <span>{evento.hora}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Users className="w-3.5 h-3.5" />
                              <span>{Math.floor(Math.random() * 300) + 50} interesados</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            {getBadgeEvento(evento)}
                          </div>

                          <div className="flex gap-2">
                            {esHoy && (
                              <button
                                onClick={() => handleIniciarEvento(evento.id)}
                                className="flex-1 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                              >
                                <Play className="w-3.5 h-3.5" />
                                Iniciar
                              </button>
                            )}
                            <button className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Editar</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('¿Eliminar este evento?')) {
                                  handleEliminarEvento(evento.id);
                                }
                              }}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <CalendarioModal
        isOpen={showCalendarioModal}
        onClose={() => setShowCalendarioModal(false)}
        eventos={eventos}
        onGuardarEvento={handleGuardarEvento}
        onEliminarEvento={handleEliminarEvento}
      />

      {modalTransmision}
    </div>
  );
};

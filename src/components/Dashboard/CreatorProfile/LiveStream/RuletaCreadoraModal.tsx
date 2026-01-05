import { useState, useEffect } from 'react';
import { X, Settings, Play, Trophy, Sparkles, Plus, Trash2 } from 'lucide-react';
import { PremioRuleta } from '@/shared/types/ruleta.types';

interface RuletaCreadoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  onActivarRuleta?: (costoGiro: number, premios: PremioRuleta[]) => void;
  onDesactivarRuleta?: () => void;
  ruletaActiva?: boolean;
  premiosExistentes?: PremioRuleta[]; // ← NUEVA PROP para persistencia
}

// Galería de iconos disponibles
const ICONOS_DISPONIBLES = [
  '🎁', '💎', '👑', '⭐', '🎉', '🎊', '🏆', '💰',
  '💵', '💳', '🎯', '🎪', '🎭', '🎨', '🎬', '📸',
  '💌', '💝', '🌹', '🌟', '✨', '💫', '🔥', '❤️',
  '💜', '💙', '💚', '💛', '🧡', '🎀', '🎈', '🍾',
  '🥂', '🍰', '🍓', '🍒', '🍑', '🍇', '🌺', '🌸',
  '🦋', '🎵', '🎶', '🎼', '📱', '💻', '⏰', '🔔'
];

// Colores premium para los premios
const COLORES_PREMIUM = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', 
  '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
];

export default function RuletaCreadoraModal({
  isOpen,
  onClose,
  channelName,
  onActivarRuleta,
  onDesactivarRuleta,
  ruletaActiva,
  premiosExistentes // ← RECIBIR premios guardados
}: RuletaCreadoraModalProps) {
  const [costoGiroInput, setCostoGiroInput] = useState(10);
  const [premios, setPremios] = useState<PremioRuleta[]>([
    {
      id: '1',
      nombre: 'Premio Sorpresa',
      descripcion: 'Un regalo especial',
      icono: '🎁',
      valor: 10,
      probabilidad: 50,
      color: COLORES_PREMIUM[0],
      tipo: 'regalo'
    },
    {
      id: '2',
      nombre: 'Premio Extra',
      descripcion: 'Algo increíble',
      icono: '💎',
      valor: 20,
      probabilidad: 50,
      color: COLORES_PREMIUM[1],
      tipo: 'regalo'
    }
  ]);
  const [mostrarSelectorIconos, setMostrarSelectorIconos] = useState(false);
  const [premioSeleccionadoParaIcono, setPremioSeleccionadoParaIcono] = useState<string | null>(null);

  // ✅ CARGAR PREMIOS EXISTENTES cuando abre el modal
  useEffect(() => {
    if (isOpen && premiosExistentes && premiosExistentes.length > 0) {
      console.log('📥 Cargando premios existentes:', premiosExistentes);
      setPremios(premiosExistentes);
    }
  }, [isOpen, premiosExistentes]);

  const agregarPremio = () => {
    const nuevoId = Date.now().toString();
    const colorIndex = premios.length % COLORES_PREMIUM.length;
    setPremios([
      ...premios,
      {
        id: nuevoId,
        nombre: '',
        descripcion: '',
        icono: '🎁',
        valor: 10,
        probabilidad: 10,
        color: COLORES_PREMIUM[colorIndex],
        tipo: 'regalo'  
      }
    ]);
  };

  const eliminarPremio = (id: string) => {
    if (premios.length <= 2) {
      mostrarNotificacion('⚠️ Debe haber al menos 2 premios configurados', 'warning');
      return;
    }
    setPremios(premios.filter(p => p.id !== id));
  };

  const actualizarPremio = (id: string, campo: keyof PremioRuleta, valor: any) => {
    setPremios(premios.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const seleccionarIcono = (icono: string) => {
    if (premioSeleccionadoParaIcono) {
      actualizarPremio(premioSeleccionadoParaIcono, 'icono', icono);
      setMostrarSelectorIconos(false);
      setPremioSeleccionadoParaIcono(null);
    }
  };

  // Sistema de notificaciones toast profesional
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'warning' = 'error') => {
    const colores = {
      success: 'from-emerald-500 to-teal-500 border-emerald-300',
      error: 'from-rose-500 to-red-500 border-rose-300',
      warning: 'from-amber-500 to-orange-500 border-amber-300'
    };

    const iconos = {
      success: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />',
      error: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />',
      warning: '<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />'
    };

    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[99999] animate-fade-in-down';
    notificacion.innerHTML = `
      <div class="bg-gradient-to-r ${colores[tipo]} text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border-2 ${colores[tipo].split(' ').pop()} backdrop-blur-sm max-w-md">
        <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          ${iconos[tipo]}
        </svg>
        <span class="font-semibold text-sm">${mensaje}</span>
      </div>
    `;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
      notificacion.style.opacity = '0';
      notificacion.style.transform = 'translateX(-50%) translateY(-20px)';
      notificacion.style.transition = 'all 0.3s ease';
      setTimeout(() => notificacion.remove(), 300);
    }, 3500);
  };

  const validarPremios = (): boolean => {
    // Validar mínimo 2 premios
    if (premios.length < 2) {
      mostrarNotificacion('❌ Debe haber al menos 2 premios configurados', 'error');
      return false;
    }

    // Validar campos obligatorios
    for (const premio of premios) {
      if (!premio.nombre.trim()) {
        mostrarNotificacion('❌ Todos los premios deben tener un nombre', 'error');
        return false;
      }
      if (!premio.descripcion.trim()) {
        mostrarNotificacion('❌ Todos los premios deben tener una descripción', 'error');
        return false;
      }
      // Validar precio > 0
      if (!premio.valor || premio.valor <= 0) {
        mostrarNotificacion('❌ El precio debe ser mayor a 0', 'error');
        return false;
      }
      // Validar porcentaje > 0 y <= 100
      if (!premio.probabilidad || premio.probabilidad <= 0 || premio.probabilidad > 100) {
        mostrarNotificacion('❌ El porcentaje debe estar entre 1 y 100', 'error');
        return false;
      }
    }

    // Validar que no se repitan nombres
    const nombres = premios.map(p => p.nombre.trim().toLowerCase());
    const nombresUnicos = new Set(nombres);
    if (nombres.length !== nombresUnicos.size) {
      mostrarNotificacion('❌ Los nombres de los premios no pueden repetirse', 'warning');
      return false;
    }

    // Validar que la suma de porcentajes sea exactamente 100%
    const sumaProbabilidades = premios.reduce((sum, p) => sum + p.probabilidad, 0);
    if (sumaProbabilidades !== 100) {
      mostrarNotificacion(`❌ La suma debe ser exactamente 100%. Actualmente: ${sumaProbabilidades}%`, 'warning');
      return false;
    }

    return true;
  };

  const handleActivarRuleta = () => {
    // Validar costo por giro
    if (!costoGiroInput || costoGiroInput <= 0) {
      mostrarNotificacion('❌ El costo por giro debe ser mayor a 0', 'error');
      return;
    }
    
    if (!validarPremios()) return;
    onActivarRuleta?.(costoGiroInput, premios);
    // Mensaje eliminado aquí - FloatingTransmisionWindow lo muestra
  };

  const handleDesactivarRuleta = () => {
    onDesactivarRuleta?.();
    mostrarNotificacion('⚠️ ¡Ruleta desactivada! Ahora puedes editar los premios 📝', 'warning');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-100 shadow-xl">
        {/* Header - PREMIUM SUTIL */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 px-5 py-4 flex items-center justify-between border-b border-purple-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Ruleta de Premios
              </h2>
              <p className="text-slate-500 text-xs">Configuración</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 rounded-lg p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            {/* Configuración - SUTIL */}
            <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 rounded-xl p-4 border border-purple-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-slate-700">Configuración</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Costo por Giro (S/.)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={costoGiroInput === 0 ? '' : costoGiroInput}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/[^0-9]/g, '');
                      const numero = valor === '' ? 0 : Math.min(100, parseInt(valor));
                      setCostoGiroInput(numero);
                    }}
                    className="w-32 px-2 py-1 bg-white border border-purple-200 rounded-lg text-slate-700 text-sm text-center font-semibold focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm transition-all"
                    disabled={ruletaActiva}
                    placeholder="10"
                  />
                </div>

                {!ruletaActiva ? (
                  <button
                    onClick={handleActivarRuleta}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    Activar Ruleta
                  </button>
                ) : (
                  <button
                    onClick={handleDesactivarRuleta}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    Desactivar Ruleta
                  </button>
                )}
              </div>
            </div>

            {/* Premios - SUTIL */}
            <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 rounded-xl p-4 border border-purple-100/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-700">Premios</h3>
                </div>
                <button
                  onClick={agregarPremio}
                  disabled={ruletaActiva}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar Premio
                </button>
              </div>

              {/* Vista según estado de la ruleta */}
              {ruletaActiva ? (
                /* Vista ACTIVA: Tabla simple de solo lectura - MEJORADA */
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {premios.map((premio) => (
                    <div
                      key={premio.id}
                      className="bg-white/60 rounded-lg p-3 border border-purple-100/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{premio.icono}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-700 text-sm">{premio.nombre}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{premio.descripcion}</p>
                          <div className="mt-1.5 flex items-center gap-3 text-xs">
                            <span className="text-slate-600 font-medium">S/.{premio.valor}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-medium">{premio.probabilidad}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Vista DESACTIVADA: Formularios editables completos - MEJORADA SIN DISTORSIÓN */
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {premios.map((premio, index) => (
                    <div
                      key={premio.id}
                      className="bg-white/80 rounded-xl p-3.5 border border-purple-100/50 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="space-y-2.5">
                        {/* Icono y Título */}
                        <div className="flex gap-2.5">
                          <button
                            onClick={() => {
                              setPremioSeleccionadoParaIcono(premio.id);
                              setMostrarSelectorIconos(true);
                            }}
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/50 hover:border-purple-300 flex items-center justify-center text-2xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
                          >
                            {premio.icono}
                          </button>
                          <div className="flex-1 space-y-2 min-w-0">
                            <input
                              type="text"
                              value={premio.nombre}
                              onChange={(e) => actualizarPremio(premio.id, 'nombre', e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
                              placeholder="Título del premio *"
                              maxLength={50}
                            />
                            <input
                              type="text"
                              value={premio.descripcion}
                              onChange={(e) => actualizarPremio(premio.id, 'descripcion', e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
                              placeholder="Descripción *"
                              maxLength={100}
                            />
                          </div>
                          {premios.length > 1 && (
                            <button
                              onClick={() => eliminarPremio(premio.id)}
                              className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all self-start flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Precio y Porcentaje - INPUTS COMPACTOS */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Precio (S/.) *
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={premio.valor === 0 ? '' : premio.valor}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const valor = e.target.value.replace(/[^0-9]/g, '');
                                const numero = valor === '' ? 0 : parseInt(valor);
                                actualizarPremio(premio.id, 'valor', numero);
                              }}
                              className="w-full px-2 py-1 bg-white border border-purple-200 rounded-lg text-slate-700 text-sm text-center font-semibold focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Probabilidad (%) *
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={premio.probabilidad === 0 ? '' : premio.probabilidad}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const valor = e.target.value.replace(/[^0-9]/g, '');
                                const numero = valor === '' ? 0 : Math.min(100, parseInt(valor));
                                actualizarPremio(premio.id, 'probabilidad', numero);
                              }}
                              className="w-full px-2 py-1 bg-white border border-purple-200 rounded-lg text-slate-700 text-sm text-center font-semibold focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
                              placeholder="30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Selector de Iconos - SUTIL */}
      {mostrarSelectorIconos && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Selecciona un icono</h3>
              <button
                onClick={() => {
                  setMostrarSelectorIconos(false);
                  setPremioSeleccionadoParaIcono(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto">
              {ICONOS_DISPONIBLES.map((icono, index) => (
                <button
                  key={index}
                  onClick={() => seleccionarIcono(icono)}
                  className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 hover:scale-110 transition-all flex items-center justify-center text-2xl border border-purple-100 hover:border-purple-300 shadow-sm"
                >
                  {icono}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

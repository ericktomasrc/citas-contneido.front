import { useState } from 'react';
import { X, Settings, Play, Trophy, Sparkles, Plus, Trash2 } from 'lucide-react';
import { PremioRuleta } from '../../../../shared/types/ruleta.types';

interface RuletaCreadoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  onActivarRuleta?: (costoGiro: number, premios: PremioRuleta[]) => void;
  onDesactivarRuleta?: () => void;
  ruletaActiva?: boolean;
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
  ruletaActiva
}: RuletaCreadoraModalProps) {
  const [costoGiroInput, setCostoGiroInput] = useState(10);
  const [premios, setPremios] = useState<PremioRuleta[]>([
    {
      id: '1',
      nombre: 'Premio Sorpresa',
      descripcion: 'Un regalo especial',
      icono: '🎁',
      valor: 10,
      probabilidad: 30,
      color: COLORES_PREMIUM[0],
      tipo: 'regalo'
    }
  ]);
  const [mostrarSelectorIconos, setMostrarSelectorIconos] = useState(false);
  const [premioSeleccionadoParaIcono, setPremioSeleccionadoParaIcono] = useState<string | null>(null);

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
    if (premios.length === 1) {
      mostrarNotificacion('⚠️ Debe haber al menos un premio configurado', 'warning');
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
      success: 'from-emerald-600 to-teal-600 border-emerald-400',
      error: 'from-rose-600 to-red-600 border-rose-400',
      warning: 'from-amber-600 to-orange-600 border-amber-400'
    };

    const iconos = {
      success: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />',
      error: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />',
      warning: '<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />'
    };

    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down';
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
      if (!premio.valor || premio.valor <= 0) {
        mostrarNotificacion('❌ El precio no puede estar vacío y debe ser mayor a 0', 'error');
        return false;
      }
      if (!premio.probabilidad || premio.probabilidad <= 0 || premio.probabilidad > 100) {
        mostrarNotificacion('❌ El porcentaje no puede estar vacío y debe estar entre 1 y 100', 'error');
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

    // Validar que no se repitan porcentajes
    const probabilidades = premios.map(p => p.probabilidad);
    const probabilidadesUnicas = new Set(probabilidades);
    if (probabilidades.length !== probabilidadesUnicas.size) {
      mostrarNotificacion('❌ Los porcentajes no pueden repetirse', 'warning');
      return false;
    }

    // Validar que la suma de porcentajes sea exactamente 100%
    const sumaProbabilidades = premios.reduce((sum, p) => sum + p.probabilidad, 0);
    if (sumaProbabilidades !== 100) {
      mostrarNotificacion(`❌ La suma debe ser 100%. Actualmente: ${sumaProbabilidades}%`, 'warning');
      return false;
    }

    return true;
  };

  const handleActivarRuleta = () => {
    // Validar costo por giro
    if (!costoGiroInput || costoGiroInput <= 0) {
      mostrarNotificacion('❌ El costo por giro no puede estar vacío y debe ser mayor a 0', 'error');
      return;
    }
    
    if (!validarPremios()) return;
    onActivarRuleta?.(costoGiroInput, premios);
    mostrarNotificacion('✅ ¡Ruleta activada exitosamente! 🎉', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-200/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 flex items-center justify-between border-b border-purple-200/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ruleta de Premios
              </h2>
              <p className="text-slate-600 text-sm">Configuración</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-200 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {/* Configuración */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-semibold text-slate-800">Configuración</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    disabled={ruletaActiva}
                    placeholder="Mínimo 1"
                  />
                </div>

                {!ruletaActiva ? (
                  <button
                    onClick={handleActivarRuleta}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    Activar Ruleta
                  </button>
                ) : (
                  <button
                    onClick={onDesactivarRuleta}
                    className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Desactivar Ruleta
                  </button>
                )}
              </div>
            </div>

            {/* Premios */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-semibold text-slate-800">Premios</h3>
                </div>
                <button
                  onClick={agregarPremio}
                  disabled={ruletaActiva}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Premio
                </button>
              </div>

              {/* Vista según estado de la ruleta */}
              {ruletaActiva ? (
                /* Vista ACTIVA: Tabla simple de solo lectura */
                <div className="space-y-2">
                  {premios.map((premio) => (
                    <div
                      key={premio.id}
                      className="bg-white/50 rounded-lg p-3 border border-slate-200/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{premio.icono}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 text-sm">{premio.nombre}</h4>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{premio.descripcion}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs">
                            <span className="text-slate-700 font-medium">S/.{premio.valor}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-700 font-medium">{premio.probabilidad}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Vista DESACTIVADA: Formularios editables completos */
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {premios.map((premio, index) => (
                    <div
                      key={premio.id}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="space-y-3">
                        {/* Icono y Título */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setPremioSeleccionadoParaIcono(premio.id);
                              setMostrarSelectorIconos(true);
                            }}
                            className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-slate-300 hover:border-purple-400 flex items-center justify-center text-3xl transition-all shadow-sm hover:shadow-md"
                          >
                            {premio.icono}
                          </button>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={premio.nombre}
                              onChange={(e) => actualizarPremio(premio.id, 'nombre', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                              placeholder="Título del premio *"
                              maxLength={50}
                            />
                            <input
                              type="text"
                              value={premio.descripcion}
                              onChange={(e) => actualizarPremio(premio.id, 'descripcion', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                              placeholder="Descripción *"
                              maxLength={100}
                            />
                          </div>
                          {premios.length > 1 && (
                            <button
                              onClick={() => eliminarPremio(premio.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {/* Precio y Porcentaje */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
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
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                              placeholder="Mínimo 1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
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
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                              placeholder="1-100"
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

      {/* Modal Selector de Iconos */}
      {mostrarSelectorIconos && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Selecciona un icono</h3>
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
                  className="w-12 h-12 rounded-lg bg-slate-100 hover:bg-purple-100 hover:scale-110 transition-all flex items-center justify-center text-2xl border-2 border-transparent hover:border-purple-400"
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

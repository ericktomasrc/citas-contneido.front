import { useState, useRef, useEffect } from 'react';
import { X, DollarSign, Sparkles, TrendingUp } from 'lucide-react';
import { PremioRuleta } from '../../../../shared/types/ruleta.types';

interface RuletaEspectadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  onGirar?: () => void;
  costoGiro?: number;
  premioGanado?: PremioRuleta | null;
  girando?: boolean;
  premiosDisponibles?: PremioRuleta[];
  usuarioGirando?: string | null;
  currentUserName?: string;
  coinsBalance?: number;
  onRecargarCoins?: () => void;
}

export default function RuletaEspectadorModal({
  isOpen,
  onClose,
  channelName,
  onGirar,
  costoGiro = 10,
  premioGanado,
  girando = false,
  premiosDisponibles = [],
  usuarioGirando = null,
  currentUserName = '',
  coinsBalance = 0,
  onRecargarCoins
}: RuletaEspectadorModalProps) {
  const [anguloRuleta, setAnguloRuleta] = useState(0);
  const [girandoLocal, setGirandoLocal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    dibujarRuleta(premiosDisponibles);
  }, [isOpen, premiosDisponibles, anguloRuleta]);

  const dibujarRuleta = (premiosADibujar: PremioRuleta[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular total de probabilidades
    const totalProbabilidad = premiosADibujar.reduce((sum, p) => sum + p.probabilidad, 0);
    
    let currentAngle = anguloRuleta;

    premiosADibujar.forEach((premio) => {
      const sliceAngle = (premio.probabilidad / totalProbabilidad) * 2 * Math.PI;

      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = premio.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dibujar icono/texto
      const textAngle = currentAngle + sliceAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText(premio.icono, 0, 0);
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // Dibujar puntero (flecha)
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const iniciarAnimacionGiro = () => {
    console.log('[RULETA MODAL] Iniciando animación de giro visual');
    const duracion = 3000;
    const vueltasCompletas = 5;
    const anguloAleatorio = Math.random() * 360;
    const anguloFinal = (vueltasCompletas * 360 + anguloAleatorio) * (Math.PI / 180);
    
    const inicio = Date.now();
    const anguloInicial = anguloRuleta;

    const animar = () => {
      const ahora = Date.now();
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progreso, 3);
      const anguloActual = anguloInicial + anguloFinal * easeOut;
      
      setAnguloRuleta(anguloActual);

      if (progreso < 1) {
        requestAnimationFrame(animar);
      }
    };

    requestAnimationFrame(animar);
  };

  // Efecto para detectar cuando otro espectador gira la ruleta
  useEffect(() => {
    if (girando && !girandoLocal) {
      console.log('[RULETA MODAL] Otro espectador está girando, iniciando animación');
      iniciarAnimacionGiro();
    } else if (!girando && girandoLocal) {
      setGirandoLocal(false);
    }
  }, [girando, girandoLocal]);

  const handleGirarRuleta = () => {
    if (girando || !onGirar) return;
    
    console.log('[RULETA MODAL] Usuario presionó botón girar');
    setGirandoLocal(true);
    
    onGirar();
    iniciarAnimacionGiro();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-amber-600/10 border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ruleta de Premios</h2>
                <p className="text-xs text-slate-400">Gira y gana recompensas exclusivas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* COLUMNA IZQUIERDA - Premios (2/5) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Premio Ganado */}
              {premioGanado && (
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-emerald-900/40 border border-emerald-500/30 p-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                  <div className="relative text-center space-y-3">
                    <div className="text-5xl animate-bounce filter drop-shadow-lg">{premioGanado.icono}</div>
                    <div>
                      <p className="text-xs font-medium text-emerald-400 mb-1">¡Felicidades!</p>
                      <h3 className="text-lg font-bold text-white mb-1">{premioGanado.nombre}</h3>
                      <p className="text-xs text-slate-400">{premioGanado.descripcion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Premios */}
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Premios Disponibles</h3>
                </div>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {premiosDisponibles.map((premio) => (
                    <div
                      key={premio.id}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-amber-500/30 hover:bg-slate-900/80 transition-all"
                    >
                      <div className="text-2xl">{premio.icono}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{premio.nombre}</p>
                        <p className="text-xs text-slate-400 truncate">{premio.descripcion}</p>
                      </div>
                      <div className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                        {premio.probabilidad}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - Ruleta y Acciones (3/5) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center gap-6">
              {/* Notificación de otro usuario girando */}
              {girando && usuarioGirando && usuarioGirando !== currentUserName && (
                <div className="w-full max-w-md bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5">
                  <p className="text-sm font-medium text-white text-center flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    <span>{usuarioGirando} está participando...</span>
                  </p>
                </div>
              )}

              {/* Canvas de la Ruleta */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-full blur-2xl"></div>
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={340}
                  className="relative max-w-full rounded-full shadow-2xl"
                />
              </div>

              {/* Botón Girar */}
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={handleGirarRuleta}
                  disabled={girando}
                  className={`relative w-full py-4 px-6 rounded-xl font-semibold text-base transition-all ${
                    girando
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-600/40 hover:scale-[1.02]'
                  }`}
                >
                  {girando ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Girando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Girar por {costoGiro} Coins</span>
                    </span>
                  )}
                </button>

                {/* Balance y Recarga */}
                <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Balance actual</span>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-white">{coinsBalance.toLocaleString()}</span>
                      <span className="text-xs text-slate-400">coins</span>
                    </div>
                  </div>
                  {onRecargarCoins && (
                    <button
                      onClick={onRecargarCoins}
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium transition-all hover:scale-[1.02] shadow-lg shadow-emerald-600/20"
                    >
                      Recargar Coins
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

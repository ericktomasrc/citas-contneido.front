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

    const totalProbabilidad = premiosADibujar.reduce((sum, p) => sum + p.probabilidad, 0);
    
    let currentAngle = anguloRuleta;

    premiosADibujar.forEach((premio) => {
      const sliceAngle = (premio.probabilidad / totalProbabilidad) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = premio.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      const textAngle = currentAngle + sliceAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(premio.icono, 0, 0);
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // Puntero elegante
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
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
      
      const easeOut = 1 - Math.pow(1 - progreso, 3);
      const anguloActual = anguloInicial + anguloFinal * easeOut;
      
      setAnguloRuleta(anguloActual);

      if (progreso < 1) {
        requestAnimationFrame(animar);
      }
    };

    requestAnimationFrame(animar);
  };

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
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-rose-100/50 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Ruleta de Premios</h2>
                <p className="text-[10px] text-slate-500">Gira y gana recompensas exclusivas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* COLUMNA IZQUIERDA - Premios (2/5) */}
            <div className="lg:col-span-2 space-y-3">
              {/* Premio Ganado */}
              {premioGanado && (
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-transparent"></div>
                  <div className="relative text-center space-y-2">
                    <div className="text-5xl animate-bounce filter drop-shadow-xl">{premioGanado.icono}</div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 mb-0.5">¡Felicidades!</p>
                      <h3 className="text-base font-bold text-slate-800 mb-0.5">{premioGanado.nombre}</h3>
                      <p className="text-xs text-slate-600">{premioGanado.descripcion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Premios */}
              <div className="rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Premios Disponibles</h3>
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
                  {premiosDisponibles.map((premio) => (
                    <div
                      key={premio.id}
                      className="group flex items-center gap-2 p-2 rounded-lg bg-white border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
                    >
                      <div className="text-xl">{premio.icono}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{premio.nombre}</p>
                        <p className="text-[10px] text-slate-500 truncate">{premio.descripcion}</p>
                      </div>
                      <div className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-lg">
                        {premio.probabilidad}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - Ruleta y Acciones (3/5) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center gap-4">
              {/* Notificación de otro usuario girando */}
              {girando && usuarioGirando && usuarioGirando !== currentUserName && (
                <div className="w-full max-w-md bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg px-3 py-2">
                  <p className="text-xs font-semibold text-slate-700 text-center flex items-center justify-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></span>
                    <span>{usuarioGirando} está participando...</span>
                  </p>
                </div>
              )}

              {/* Canvas de la Ruleta */}
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-rose-200/30 via-pink-200/30 to-violet-200/30 rounded-full blur-xl"></div>
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  className="relative max-w-full rounded-full shadow-2xl border-4 border-white"
                />
              </div>

              {/* Botón Girar */}
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={handleGirarRuleta}
                  disabled={girando}
                  className={`relative w-full py-3 px-5 rounded-lg font-bold text-sm transition-all shadow-lg ${
                    girando
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02]'
                  }`}
                >
                  {girando ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-600">Balance actual</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-bold text-slate-800">{coinsBalance.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500">coins</span>
                    </div>
                  </div>
                  {onRecargarCoins && (
                    <button
                      onClick={onRecargarCoins}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
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

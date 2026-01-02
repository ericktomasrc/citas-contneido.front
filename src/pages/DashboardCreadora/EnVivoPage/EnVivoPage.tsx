import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { 
  Radio, 
  Eye, 
  Gift, 
  Video, 
  Calendar as CalendarIcon,
  MessageCircle,
  Settings,
  X,
  Plus,
  Send,
  Smile,
  Trash2,
  Clock,
  Mic,
  MicOff,
  VideoOff,
  Users,
  AlertCircle,
  Copy,
  Check,
  Maximize,
  Minimize
} from 'lucide-react';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Evento {
  id: string;
  fecha: Date;
  hora: string;
  titulo: string;
  tipo: 'gratis' | 'pagado';
  precio?: number;
  actividad: string;
  objetivo: string;
}

interface Recompensa {
  id: string;
  tipo: string;
  emoji: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export const EnVivoPage = () => {
  // Estados de Agora
  const [client] = useState<IAgoraRTCClient>(() => 
    AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
  );
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [channelName, setChannelName] = useState<string>('');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiempoSinEspectadores, setTiempoSinEspectadores] = useState(0);
  const [mostrarAlertaSinAudiencia, setMostrarAlertaSinAudiencia] = useState(false);
  const [espectadoresEnVivo, setEspectadoresEnVivo] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados UI originales
  const [enVivo, setEnVivo] = useState(false);
  const [showRecompensasModal, setShowRecompensasModal] = useState(false);
  const [showCrearEventoModal, setShowCrearEventoModal] = useState(false);
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [mensajeChat, setMensajeChat] = useState('');
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [chatMensajes, setChatMensajes] = useState<{user: string, mensaje: string}[]>([
    { user: 'erols40', mensaje: '😊' },
    { user: 'maria_lima', mensaje: 'Hola! 👋' },
  ]);
  
  const [nuevoEvento, setNuevoEvento] = useState({
    tipo: 'gratis' as 'gratis' | 'pagado',
    precio: 0,
    actividadObjetivo: '',
    titulo: '',
    hora: new Date().toTimeString().slice(0, 5)
  });

  // Stats
  const stats = {
    seguidores: 12400,
    suscriptores: 1200,
    publico: espectadoresEnVivo, // Usar contador real de Agora
  };

  // Configurar rol como broadcaster
  useEffect(() => {
    client.setClientRole('host');
  }, [client]);

  // Verificar APP_ID
  useEffect(() => {
    if (!APP_ID) {
      setError('❌ APP_ID no configurado en .env');
      console.error('VITE_AGORA_APP_ID no encontrado');
    }
  }, []);

  // Iniciar transmisión con Agora
  const iniciarTransmision = async () => {
    try {
      setCargando(true);
      setError(null);

      // 1. Verificar permisos
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // 2. Obtener token del backend
      const userId = Math.floor(Math.random() * 10000).toString();
      const newChannelName = `live_${Date.now()}`;
      
      const response = await fetch(
        `${BACKEND_URL}/api/agora/token?channelName=${newChannelName}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener token del servidor');
      }

      const { token } = await response.json();

      // 3. Unirse al canal
      await client.join(APP_ID, newChannelName, token, parseInt(userId));

      // 4. Crear tracks locales
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128,
          }
        },
        {
          encoderConfig: {
            width: 1280,
            height: 720,
            frameRate: 30,
            bitrateMin: 600,
            bitrateMax: 1000,
          }
        }
      );

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // 5. Reproducir video localmente
      videoTrack.play('local-player');

      // 6. Publicar tracks
      await client.publish([audioTrack, videoTrack]);

      setEnVivo(true);
      setChannelName(newChannelName);
      
      // Notificar al backend que el canal está activo
      try {
        await fetch(`${BACKEND_URL}/api/canal/iniciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName: newChannelName })
        });
      } catch (err) {
        console.warn('⚠️ No se pudo notificar al backend:', err);
      }
      
    } catch (error: any) {
      console.error('❌ Error al iniciar transmisión:', error);
      setError(error.message || 'Error desconocido');
      
      // Cleanup en caso de error
      localAudioTrack?.close();
      localVideoTrack?.close();
      await client.leave();
    } finally {
      setCargando(false);
    }
  };

  // Detener transmisión
  const detenerTransmision = async () => {
    try {
      setCargando(true);
      
      // Notificar al backend que el canal se cerró
      if (channelName) {
        try {
          await fetch(`${BACKEND_URL}/api/canal/finalizar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelName })
          });
        } catch (err) {
          console.warn('⚠️ No se pudo notificar cierre al backend:', err);
        }
      }
      
      // Cerrar tracks
      localAudioTrack?.close();
      localVideoTrack?.close();

      // Salir del canal
      await client.leave();

      setEnVivo(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setError(null);
      setChannelName('');
      setLinkCopiado(false);
      setEspectadoresEnVivo(0);
      
    } catch (error) {
      console.error('Error al detener transmisión:', error);
    } finally {
      setCargando(false);
    }
  };

  const toggleMic = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!micMuted);
      setMicMuted(!micMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!cameraOff);
      setCameraOff(!cameraOff);
    }
  };

  const copiarLink = () => {
    const link = `${window.location.origin}/live-creadora/${channelName}`;
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  const toggleFullscreen = async () => {
    const videoContainer = document.getElementById('video-container-transmision');
    if (!videoContainer) return;

    try {
      if (!document.fullscreenElement) {
        await videoContainer.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error al cambiar pantalla completa:', error);
    }
  };

  // Detectar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Actualizar contador de espectadores desde el backend
  useEffect(() => {
    if (!enVivo || !channelName) return;

    const intervalo = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/espectadores/${channelName}`);
        const data = await response.json();
        setEspectadoresEnVivo(data.espectadores);
      } catch (error) {
        console.error('Error al obtener espectadores:', error);
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [enVivo, channelName]);

  // Monitorear tiempo sin espectadores
  useEffect(() => {
    if (!enVivo) {
      setTiempoSinEspectadores(0);
      setMostrarAlertaSinAudiencia(false);
      return;
    }

    const intervalo = setInterval(() => {
      if (espectadoresEnVivo === 0) {
        setTiempoSinEspectadores(prev => {
          const nuevoTiempo = prev + 1;
          
          // Alerta a los 3 minutos (180 segundos)
          if (nuevoTiempo === 180) {
            setMostrarAlertaSinAudiencia(true);
          }
          
          // Auto-detener a los 10 minutos (600 segundos)
          if (nuevoTiempo >= 600) {
            detenerTransmision();
          }
          
          return nuevoTiempo;
        });
      } else {
        // Resetear si hay espectadores
        setTiempoSinEspectadores(0);
        setMostrarAlertaSinAudiencia(false);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [enVivo, espectadoresEnVivo]);

  // Recompensas DETALLADAS
  const recompensas: Recompensa[] = [
    { id: '1', tipo: 'Rosa', emoji: '🌹', cantidad: 45, precioUnitario: 10, total: 450 },
    { id: '2', tipo: 'Corazón', emoji: '💖', cantidad: 120, precioUnitario: 5, total: 600 },
    { id: '3', tipo: 'Diamante', emoji: '💎', cantidad: 15, precioUnitario: 100, total: 1500 },
    { id: '4', tipo: 'Corona', emoji: '👑', cantidad: 8, precioUnitario: 200, total: 1600 },
    { id: '5', tipo: 'Estrella', emoji: '⭐', cantidad: 50, precioUnitario: 20, total: 1000 },
    { id: '6', tipo: 'Fuego', emoji: '🔥', cantidad: 30, precioUnitario: 15, total: 450 },
  ];

  const totalCoins = recompensas.reduce((sum, r) => sum + r.total, 0);

  // Config chat
  const [chatConfig, setChatConfig] = useState({
    publicoPuedeChatear: true,
    suscriptoresPuedeChatear: true,
    soloEmoticonos: false,
    soloMensajes: false,
    palabrasRestringidas: ['spam', 'prohibido']
  });

  const [nuevaPalabraRestringida, setNuevaPalabraRestringida] = useState('');
  const emoticones = ['😊', '😎', '🎮', '💚', '🔥', '⭐', '❤️', '👍', '🎉', '💎'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  
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

  const handleDayClick = (day: number) => {
    if (selectedMonth === null) return;
    const year = new Date().getFullYear();
    if (isDatePast(day, selectedMonth, year)) return;

    setSelectedDate(new Date(year, selectedMonth, day));
    setNuevoEvento({
      tipo: 'gratis',
      precio: 0,
      actividadObjetivo: '',
      titulo: '',
      hora: new Date().toTimeString().slice(0, 5)
    });
    setShowCrearEventoModal(true);
  };

  const handleGuardarEvento = () => {
    if (!selectedDate) return;
    setEventos([...eventos, {
      id: Date.now().toString(),
      fecha: selectedDate,
      hora: nuevoEvento.hora,
      titulo: nuevoEvento.titulo,
      tipo: nuevoEvento.tipo,
      precio: nuevoEvento.precio,
      actividad: nuevoEvento.actividadObjetivo,
      objetivo: nuevoEvento.actividadObjetivo
    }]);
    setShowCrearEventoModal(false);
    setSelectedDate(null);
  };

  const handleEliminarEvento = (eventoId: string) => {
    setEventos(eventos.filter(e => e.id !== eventoId));
  };

  const handleEnviarMensaje = () => {
    if (!mensajeChat.trim()) return;
    setChatMensajes([...chatMensajes, { user: 'Tú', mensaje: mensajeChat }]);
    setMensajeChat('');
  };

  const handleEnviarEmoticon = (emoticon: string) => {
    setChatMensajes([...chatMensajes, { user: 'Tú', mensaje: emoticon }]);
  };

  const hayEventos = eventos.length > 0;

  return (
    <div className="space-y-4">
      {/* Header compacto */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Video className="w-5 h-5 text-pink-500" />
          <h1 className="text-lg font-bold text-gray-900">En Vivo</h1>
        </div>
        <p className="text-sm text-gray-600">Gestiona tus transmisiones y eventos en vivo</p>
      </div>
 
      {/* Stats COMPACTOS - Juntos y pequeños */}
      <div className="flex items-center gap-6 px-4 py-2">
        <div>
          <p className="text-sm font-bold text-gray-900">{(stats.seguidores / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-gray-600">Seguidores</p>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900">{(stats.suscriptores / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-gray-600">Suscriptores</p>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900">{(stats.publico / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-gray-600">Público</p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-bold text-orange-600">{totalCoins.toLocaleString()}</p>
            <p className="text-[10px] text-gray-600">Recompensas</p>
          </div>
          <button
            onClick={() => setShowRecompensasModal(true)}
            className="w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Card Transmisión */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        {/* Alerta de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Error</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Alerta de sin audiencia */}
        {mostrarAlertaSinAudiencia && enVivo && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3 animate-pulse mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">⚠️ No tienes espectadores</p>
              <p className="text-xs text-amber-700 mt-1">
                Llevas {Math.floor(tiempoSinEspectadores / 60)} minutos sin audiencia. 
                La transmisión se detendrá automáticamente a los 10 minutos para ahorrar recursos.
              </p>
              <button
                onClick={detenerTransmision}
                className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition"
              >
                Finalizar ahora
              </button>
            </div>
          </div>
        )}

        {/* Link para compartir */}
        {enVivo && channelName && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
              📺 Comparte este link con tus seguidores:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${window.location.origin}/live-creadora/${channelName}`}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-purple-300 rounded-lg text-sm focus:outline-none"
              />
              <button
                onClick={copiarLink}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                  linkCopiado
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {linkCopiado ? (
                  <>
                    <Check className="w-4 h-4" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Video Preview con Agora - Tamaño reducido */}
        <div id="video-container-transmision" className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ maxWidth: '800px', aspectRatio: '16/9', margin: '0 auto' }}>
          <div id="local-player" className="w-full h-full" />
          
          {!enVivo && !cargando && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-white/70" />
                </div>
                <h2 className="text-white text-xl font-bold mb-2">¡Bienvenida a tu Estudio!</h2>
                <p className="text-white/80 text-sm mb-4">
                  {hayEventos ? 'Lista para transmitir' : 'Programa un evento primero'}
                </p>
              </div>
            </div>
          )}

          {cargando && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white">Conectando...</p>
              </div>
            </div>
          )}

          {/* Stats en vivo */}
          {enVivo && (
            <>
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-sm font-bold">EN VIVO</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold">{espectadoresEnVivo}</span>
                </div>
              </div>
              
              {/* Botón Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition"
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {enVivo && (
            <>
              <button
                onClick={toggleMic}
                disabled={cargando}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  micMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                {micMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleCamera}
                disabled={cargando}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  cameraOff 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                {cameraOff ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>
            </>
          )}

          <button
            onClick={enVivo ? detenerTransmision : iniciarTransmision}
            disabled={cargando || !!error || (!hayEventos && !enVivo)}
            className={`px-5 py-2 rounded-lg font-bold text-sm text-white flex items-center gap-2 transition shadow-lg ${
              cargando || error || (!hayEventos && !enVivo)
                ? 'bg-gray-400 cursor-not-allowed'
                : enVivo
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/50'
                : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/50'
            }`}
          >
            <Radio className={`w-4 h-4 ${enVivo ? 'animate-pulse' : ''}`} />
            {cargando ? 'Conectando...' : 
             !hayEventos && !enVivo ? 'Programa un Evento' :
             enVivo ? 'Finalizar' : 'Iniciar Transmisión'}
          </button>
        </div>
      </div>

      {/* Menú flotante */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setNuevoEvento({ tipo: 'gratis', precio: 0, actividadObjetivo: '', titulo: '', hora: new Date().toTimeString().slice(0, 5) });
            setShowCrearEventoModal(true);
          }}
          className="group relative w-11 h-11 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <Radio className="w-5 h-5 text-white" />
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Crear En Vivo Ahora
          </span>
        </button>

        <button
          onClick={() => setShowCalendarioModal(true)}
          className="group relative w-11 h-11 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <CalendarIcon className="w-5 h-5 text-white" />
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Programar Evento
          </span>
        </button>

        <button
          onClick={() => {
            setShowChat(!showChat);
            if (showConfig) setShowConfig(false);
          }}
          className="group relative w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Chat
          </span>
        </button>

        <button
          onClick={() => {
            setShowConfig(!showConfig);
            if (showChat) setShowChat(false);
          }}
          className="group relative w-11 h-11 bg-gray-700 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition"
        >
          <Settings className="w-5 h-5 text-white" />
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Configuración
          </span>
        </button>
      </div>

      {/* Chat - COLORES CLAROS (Azul/Blanco) */}
      {showChat && (
        <div className="fixed right-16 top-16 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex items-center justify-between border-b border-blue-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Chat en Vivo</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {chatMensajes.map((msg, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white font-bold">{msg.user[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">{msg.user}</p>
                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200 inline-block">
                    <p className="text-sm text-gray-900">{msg.mensaje}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!chatConfig.soloMensajes && (
            <div className="px-4 py-2 bg-white border-t border-gray-200 flex-shrink-0">
              <div className="flex flex-wrap gap-1">
                {emoticones.map((emoticon, index) => (
                  <button key={index} onClick={() => handleEnviarEmoticon(emoticon)} className="text-xl hover:scale-125 transition">
                    {emoticon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!chatConfig.soloEmoticonos && (
            <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mensajeChat}
                  onChange={(e) => setMensajeChat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-100 text-gray-900 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                />
                <button onClick={handleEnviarMensaje} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-2 rounded-lg transition">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Config */}
      {showConfig && (
        <div className="fixed right-16 top-16 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h3 className="text-sm font-bold text-gray-900">Configuración de Chat</h3>
            <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Quién puede chatear</p>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700">Público</span>
                  <input type="checkbox" checked={chatConfig.publicoPuedeChatear} onChange={(e) => setChatConfig({...chatConfig, publicoPuedeChatear: e.target.checked})} className="w-4 h-4 text-pink-600 rounded" />
                </label>
                <label className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700">Suscriptores</span>
                  <input type="checkbox" checked={chatConfig.suscriptoresPuedeChatear} onChange={(e) => setChatConfig({...chatConfig, suscriptoresPuedeChatear: e.target.checked})} className="w-4 h-4 text-pink-600 rounded" />
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Tipo de mensajes</p>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700">Solo emoticones</span>
                  <input type="checkbox" checked={chatConfig.soloEmoticonos} onChange={(e) => setChatConfig({...chatConfig, soloEmoticonos: e.target.checked, soloMensajes: false})} className="w-4 h-4 text-pink-600 rounded" />
                </label>
                <label className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700">Solo mensajes</span>
                  <input type="checkbox" checked={chatConfig.soloMensajes} onChange={(e) => setChatConfig({...chatConfig, soloMensajes: e.target.checked, soloEmoticonos: false})} className="w-4 h-4 text-pink-600 rounded" />
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Palabras restringidas</p>
              <div className="flex gap-2 mb-2">
                <input type="text" value={nuevaPalabraRestringida} onChange={(e) => setNuevaPalabraRestringida(e.target.value)} placeholder="Agregar..." className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs" />
                <button
                  onClick={() => {
                    if (nuevaPalabraRestringida.trim()) {
                      setChatConfig({...chatConfig, palabrasRestringidas: [...chatConfig.palabrasRestringidas, nuevaPalabraRestringida]});
                      setNuevaPalabraRestringida('');
                    }
                  }}
                  className="px-2 py-1.5 bg-pink-500 text-white rounded-lg text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {chatConfig.palabrasRestringidas.map((palabra, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded-lg text-xs border border-red-200">
                    <span className="text-red-700 font-medium">{palabra}</span>
                    <button onClick={() => setChatConfig({...chatConfig, palabrasRestringidas: chatConfig.palabrasRestringidas.filter((_, i) => i !== index)})} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Recompensas CON TABLA DETALLADA */}
      {showRecompensasModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-500" />
                Recompensas Recibidas
              </h2>
              <button onClick={() => setShowRecompensasModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(80vh-180px)]">
              {/* Total */}
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4 mb-4 border-2 border-orange-300">
                <p className="text-sm text-orange-700 font-medium">Total Acumulado</p>
                <p className="text-3xl font-bold text-orange-900">{totalCoins.toLocaleString()} <span className="text-lg">coins</span></p>
              </div>

              {/* Tabla Detallada */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Regalo</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Cantidad</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio Unit.</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recompensas.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{r.emoji}</span>
                            <span className="font-medium text-gray-900">{r.tipo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">x{r.cantidad}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{r.precioUnitario} coins</td>
                        <td className="px-4 py-3 text-right font-bold text-orange-600">{r.total.toLocaleString()} coins</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-orange-50 border-t-2 border-orange-200">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">TOTAL:</td>
                      <td className="px-4 py-3 text-right font-bold text-orange-600 text-lg">{totalCoins.toLocaleString()} coins</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex gap-3">
              <button onClick={() => setShowRecompensasModal(false)} className="flex-1 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-sm">
                Canjear Después
              </button>
              <button onClick={() => {
                alert('¡Coins canjeados exitosamente!');
                setShowRecompensasModal(false);
              }} className="flex-1 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition shadow-lg text-sm">
                Canjear Ahora
              </button>
            </div>
          </div>
        </div>
      )}

  {/* Modal Calendario - 12 Meses */}
      {showCalendarioModal && !showMonthCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Programar Eventos</h2>
              <button onClick={() => setShowCalendarioModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
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
                      onClick={() => {
                        if (habilitado) {
                          setSelectedMonth(index);
                          setShowMonthCalendar(true);
                        }
                      }}
                      disabled={!habilitado}
                      className={`relative rounded-lg p-3 transition ${
                        habilitado
                          ? 'bg-white border-2 border-gray-200 hover:border-purple-500'
                          : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <p className={`text-xs font-bold ${habilitado ? 'text-gray-900' : 'text-gray-400'}`}>{mes}</p>
                      {eventosEnMes.length > 0 && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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

      {/* Modal Calendario Mensual */}
      {showMonthCalendar && selectedMonth !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 px-4 py-3 flex items-center justify-between sticky top-0">
              <h2 className="text-sm font-bold text-gray-900">{meses[selectedMonth]} 2026</h2>
              <button onClick={() => setShowMonthCalendar(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {/* Calendario */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center font-bold text-gray-600 text-xs py-1">
                    {day}
                  </div>
                ))}

                {Array.from({ length: getFirstDayOfMonth(selectedMonth, 2026) }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: getDaysInMonth(selectedMonth, 2026) }).map((_, i) => {
                  const day = i + 1;
                  const isPast = isDatePast(day, selectedMonth, 2026);
                  const eventosDelDia = getEventosForDay(day, selectedMonth, 2026);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast}
                      className={`aspect-square p-1 rounded-lg text-xs font-medium transition relative ${
                        isPast
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : eventosDelDia.length > 0
                          ? 'bg-green-100 border-2 border-green-400 text-green-900 hover:bg-green-200'
                          : 'bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      {day}
                      {eventosDelDia.length > 0 && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">{eventosDelDia.length}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lista de eventos del mes */}
              {eventos.filter(e => new Date(e.fecha).getMonth() === selectedMonth).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-700">Eventos programados:</p>
                  {eventos
                    .filter(e => new Date(e.fecha).getMonth() === selectedMonth)
                    .map(evento => (
                      <div key={evento.id} className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900">{evento.titulo}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(evento.fecha).toLocaleDateString('es-ES')} - {evento.hora}
                          </p>
                          <p className="text-xs text-green-600">
                            {evento.tipo === 'pagado' ? `S/. ${evento.precio}` : 'Gratis'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEliminarEvento(evento.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Evento */}
      {showCrearEventoModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Crear Evento</h2>
              <button onClick={() => setShowCrearEventoModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha</label>
                <p className="text-sm text-gray-900">{selectedDate.toLocaleDateString('es-ES')}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Hora (Actual - Bloqueada)
                </label>
                <input
                  type="time"
                  value={nuevoEvento.hora}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Se usa la hora actual automáticamente</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ej: Sesión de Yoga"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNuevoEvento({ ...nuevoEvento, tipo: 'gratis' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                      nuevoEvento.tipo === 'gratis'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Gratis
                  </button>
                  <button
                    onClick={() => setNuevoEvento({ ...nuevoEvento, tipo: 'pagado' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                      nuevoEvento.tipo === 'pagado'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Pagado
                  </button>
                </div>
              </div>

              {nuevoEvento.tipo === 'pagado' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Precio (S/.)</label>
                  <input
                    type="number"
                    value={nuevoEvento.precio}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, precio: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Actividad/Objetivo (Opcional)</label>
                <textarea
                  value={nuevoEvento.actividadObjetivo}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, actividadObjetivo: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Describe brevemente la actividad y objetivo de este evento..."
                />
              </div>

              <button
                onClick={handleGuardarEvento}
                disabled={!nuevoEvento.titulo.trim()}
                className={`w-full py-2 rounded-lg text-sm font-bold transition ${
                  !nuevoEvento.titulo.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                }`}
              >
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
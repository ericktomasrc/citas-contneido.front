import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { Video, Mic, MicOff, VideoOff, Radio, Users, AlertCircle, Copy, Check } from 'lucide-react';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const TransmisionReal = () => {
  const [client] = useState<IAgoraRTCClient>(() => 
    AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
  );
  
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  
  const [enVivo, setEnVivo] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [espectadores, setEspectadores] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [channelName, setChannelName] = useState<string>('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [tiempoSinEspectadores, setTiempoSinEspectadores] = useState(0);
  const [mostrarAlertaSinAudiencia, setMostrarAlertaSinAudiencia] = useState(false);

  // Verificar APP_ID
  useEffect(() => {
    if (!APP_ID) {
      setError('❌ APP_ID no configurado en .env');
      console.error('VITE_AGORA_APP_ID no encontrado');
    } else {
      console.log('✅ APP_ID cargado:', APP_ID);
    }
  }, []);

  // Configurar rol como broadcaster
  useEffect(() => {
    client.setClientRole('host');
  }, [client]);

  const iniciarTransmision = async () => {
    try {
      setCargando(true);
      setError(null);

      // 1. Verificar permisos
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // 2. Obtener token del backend
      const userId = Math.floor(Math.random() * 10000).toString();
      const newChannelName = `live_${Date.now()}`;
      
      console.log('🔄 Solicitando token para:', newChannelName, 'userId:', userId);
      
      const response = await fetch(
        `${BACKEND_URL}/api/agora/token?channelName=${newChannelName}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener token del servidor');
      }

      const { token } = await response.json();
      console.log('✅ Token obtenido');

      // 3. Unirse al canal
      console.log('🔄 Uniéndose al canal...');
      await client.join(APP_ID, newChannelName, token, parseInt(userId));
      console.log('✅ Unido al canal');

      // 4. Crear tracks locales
      console.log('🔄 Creando tracks de audio/video...');
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
      console.log('✅ Video reproduciéndose localmente');

      // 6. Publicar tracks
      await client.publish([audioTrack, videoTrack]);
      console.log('✅ Tracks publicados');

      setEnVivo(true);
      setChannelName(newChannelName);
      console.log('🔴 Transmisión ACTIVA:', newChannelName);
      console.log('📺 Link para espectadores:', `${window.location.origin}/live/${newChannelName}`);
      
      // Notificar al backend que el canal está activo
      try {
        await fetch(`${BACKEND_URL}/api/canal/iniciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName: newChannelName })
        });
        console.log('✅ Canal marcado como activo en backend');
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

  const detenerTransmision = async () => {
    try {
      setCargando(true);
      
      // 1. Notificar al backend que el canal se cerró
      if (channelName) {
        try {
          await fetch(`${BACKEND_URL}/api/canal/finalizar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelName })
          });
          console.log('✅ Canal marcado como cerrado en backend');
        } catch (err) {
          console.warn('⚠️ No se pudo notificar cierre al backend:', err);
        }
      }
      
      // 2. Cerrar tracks
      localAudioTrack?.close();
      localVideoTrack?.close();

      // 3. Salir del canal
      await client.leave();

      setEnVivo(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setError(null);
      setChannelName('');
      setLinkCopiado(false);
      
      console.log('⏹️ Transmisión finalizada');
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

  // Listener de usuarios - Obtener desde backend
  useEffect(() => {
    if (!enVivo || !channelName) return;

    // Consultar espectadores cada 3 segundos
    const intervalo = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/espectadores/${channelName}`);
        const data = await response.json();
        setEspectadores(data.espectadores);
        console.log('📊 Espectadores actualizados:', data.espectadores);
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
      if (espectadores === 0) {
        setTiempoSinEspectadores(prev => {
          const nuevoTiempo = prev + 1;
          
          // Alerta a los 3 minutos (180 segundos)
          if (nuevoTiempo === 180) {
            setMostrarAlertaSinAudiencia(true);
            console.log('⚠️ 3 minutos sin espectadores');
          }
          
          // Auto-detener a los 10 minutos (600 segundos)
          if (nuevoTiempo >= 600) {
            console.log('🛑 Auto-deteniendo transmisión: 10 minutos sin espectadores');
            detenerTransmision();
          }
          
          return nuevoTiempo;
        });
      } else {
        // Resetear si hay espectadores
        setTiempoSinEspectadores(0);
        setMostrarAlertaSinAudiencia(false);
      }
    }, 1000); // Cada segundo

    return () => clearInterval(intervalo);
  }, [enVivo, espectadores]);

  // Resetear espectadores cuando termina la transmisión
  useEffect(() => {
    if (!enVivo) {
      setEspectadores(0);
    }
  }, [enVivo]);

  return (
    <div className="space-y-4">
      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Alerta de sin audiencia */}
      {mostrarAlertaSinAudiencia && enVivo && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3 animate-pulse">
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
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
            📺 Comparte este link con tus seguidores:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={`${window.location.origin}/live/${channelName}`}
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

      {/* Video Preview */}
      <div className="relative bg-black rounded-2xl overflow-hidden" style={{ height: '600px' }}>
        <div id="local-player" className="w-full h-full" />
        
        {!enVivo && !cargando && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center">
              <Video className="w-12 h-12 text-white/50 mx-auto mb-2" />
              <p className="text-white text-lg">Vista previa de cámara</p>
              <p className="text-white/60 text-sm">Haz clic en "Iniciar Transmisión"</p>
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
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-bold">EN VIVO</span>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">{espectadores}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-3">
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
          disabled={cargando || !!error}
          className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition ${
            cargando || error
              ? 'bg-gray-400 cursor-not-allowed'
              : enVivo
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
          }`}
        >
          <Radio className="w-5 h-5" />
          {cargando ? 'Conectando...' : enVivo ? 'Finalizar Transmisión' : 'Iniciar Transmisión2'}
        </button>
      </div>
    </div>
  );
};
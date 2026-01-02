import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser,
  UID
} from 'agora-rtc-sdk-ng';
import { Users, Heart, Gift, MessageCircle, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

export const VerEnVivoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const channelName = slug; // El slug es el nombre del canal
  const [client] = useState<IAgoraRTCClient>(() => 
    AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
  );
  
  const [conectado, setConectado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [espectadores, setEspectadores] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<Map<UID, IAgoraRTCRemoteUser>>(new Map());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transmisionFinalizada, setTransmisionFinalizada] = useState(false);

  // Configurar como audiencia
  useEffect(() => {
    client.setClientRole('audience');
  }, [client]);

  // Actualizar contador de espectadores desde el backend
  useEffect(() => {
    if (!conectado || !channelName) return;

    const intervalo = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/espectadores/${channelName}`);
        const data = await response.json();
        setEspectadores(data.espectadores);
      } catch (error) {
        console.error('Error al obtener espectadores:', error);
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [conectado, channelName]);

  // Unirse a la transmisión
  const unirseATransmision = async () => {
    try {
      setCargando(true);
      setError(null);

      // Validar que existe el channelName
      if (!channelName) {
        throw new Error('No se especificó el canal de transmisión');
      }

      // IMPORTANTE: Verificar si el canal está activo ANTES de conectarse
      const verificarResponse = await fetch(`http://localhost:5000/api/canal/${channelName}/activo`);
      const { activo } = await verificarResponse.json();
      
      if (!activo) {
        console.log('❌ Canal cerrado, no se conecta a Agora');
        setTransmisionFinalizada(true);
        setCargando(false);
        return; // NO se conecta a Agora, ahorra recursos
      }

      console.log('✅ Canal activo, procediendo a conectar...');

      // Generar userId para espectador
      const userId = Math.floor(Math.random() * 10000);

      // Obtener token
      const response = await fetch(
        `http://localhost:5000/api/agora/token?channelName=${channelName}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener token');
      }

      const { token } = await response.json();

      // Unirse al canal
      await client.join(APP_ID, channelName!, token, userId);
      
      setConectado(true);
      console.log('✅ Conectado como espectador');
      console.log('📍 Canal:', channelName);
      console.log('👤 Mi UID:', userId);
      console.log('🎯 Rol:', 'audience');
      
      // Registrar espectador en el backend (no bloquear si falla)
      try {
        await fetch('http://localhost:5000/api/espectador/unirse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName, userId })
        });
        console.log('✅ Registrado en backend');
      } catch (err) {
        console.warn('⚠️ No se pudo registrar en backend:', err);
      }
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Manejar usuarios remotos
  useEffect(() => {
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      console.log('📡 Usuario publicó:', user.uid, mediaType);
      
      // Verificar que estamos conectados antes de suscribirse
      if (client.connectionState !== 'CONNECTED') {
        console.warn('⚠️ No se puede suscribir, cliente no conectado:', client.connectionState);
        return;
      }
      
      try {
        await client.subscribe(user, mediaType);
        console.log('✅ Suscrito a:', user.uid, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers(prev => new Map(prev).set(user.uid, user));
          setTransmisionFinalizada(false);
          
          // Reproducir video
          setTimeout(() => {
            const playerDiv = document.getElementById(`remote-player-${user.uid}`);
            console.log('🎥 Reproduciendo video en:', `remote-player-${user.uid}`, playerDiv ? 'Elemento encontrado' : 'Elemento NO encontrado');
            
            if (playerDiv && user.videoTrack) {
              user.videoTrack.play(`remote-player-${user.uid}`);
              console.log('✅ Video reproduciéndose');
            } else {
              console.error('❌ No se pudo reproducir video - elemento o track no disponible');
            }
          }, 200);
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
          console.log('🔊 Audio reproduciéndose');
        }
      } catch (error: any) {
        console.error('❌ Error al suscribirse:', error);
        console.error('Estado del cliente:', client.connectionState);
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      console.log('👋 Usuario dejó de publicar:', user.uid, mediaType);
      
      if (mediaType === 'video') {
        setRemoteUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(user.uid);
          
          // Si no quedan más usuarios con video, la transmisión finalizó
          if (newMap.size === 0) {
            console.log('🔴 Transmisión finalizada - no quedan transmisores');
            setTransmisionFinalizada(true);
            setEspectadores(0);
          }
          
          return newMap;
        });
      }
    };

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.log('👤 Usuario unido:', user.uid);
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.log('👋 Usuario salió del canal:', user.uid);
      
      // Si el usuario que salió tenía video publicado
      setRemoteUsers(prev => {
        const newMap = new Map(prev);
        if (newMap.has(user.uid)) {
          newMap.delete(user.uid);
          
          if (newMap.size === 0) {
            console.log('🔴 Transmisión finalizada - host salió del canal');
            setTransmisionFinalizada(true);
            setEspectadores(0);
          }
        }
        return newMap;
      });
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    // Listener para detectar desconexiones
    const handleConnectionStateChange = (curState: string, prevState: string) => {
      console.log(`🔌 Estado de conexión: ${prevState} → ${curState}`);
      if (curState === 'DISCONNECTED') {
        console.error('❌ Cliente desconectado');
        setError('Se perdió la conexión');
      }
    };
    
    client.on('connection-state-change', handleConnectionStateChange);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.off('connection-state-change', handleConnectionStateChange);
    };
  }, [client]);

  // Cleanup al desmontar - SIN dependencias para evitar re-ejecuciones
  useEffect(() => {
    return () => {
      const currentUserId = client.uid;
      const currentChannel = channelName;
      
      // Des-registrar espectador al salir
      if (currentChannel && currentUserId) {
        fetch('http://localhost:5000/api/espectador/salir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelName: currentChannel, userId: currentUserId })
        }).catch(err => console.error('Error al des-registrar:', err));
      }
      
      client.leave().catch(err => console.error('Error al salir del canal:', err));
    };
  }, []); // Sin dependencias - solo se ejecuta al desmontar

  const toggleAudio = () => {
    remoteUsers.forEach(user => {
      if (user.audioTrack) {
        if (audioMuted) {
          user.audioTrack.play();
        } else {
          user.audioTrack.stop();
        }
      }
    });
    setAudioMuted(!audioMuted);
  };

  const toggleFullscreen = async () => {
    const videoContainer = document.getElementById('video-container');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video principal */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video">
                {!channelName ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600">
                    <div className="text-center">
                      <h2 className="text-white text-2xl font-bold mb-4">
                        Canal no encontrado
                      </h2>
                      <p className="text-white text-sm">
                        No se especificó un canal de transmisión válido
                      </p>
                    </div>
                  </div>
                ) : !conectado ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                    <div className="text-center">
                      <h2 className="text-white text-2xl font-bold mb-4">
                        Transmisión en Vivo
                      </h2>
                      <button
                        onClick={unirseATransmision}
                        disabled={cargando}
                        className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition disabled:opacity-50"
                      >
                        {cargando ? 'Conectando...' : 'Ver Transmisión'}
                      </button>
                        {error && (
                          <p className="text-red-200 mt-4 text-sm">{error}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div id="video-container" className="absolute inset-0 bg-gray-900">
                        {remoteUsers.size === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {transmisionFinalizada ? (
                              <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <div className="w-8 h-8 bg-red-500 rounded-sm" />
                                </div>
                                <p className="text-white text-xl font-bold mb-2">
                                  Transmisión Finalizada
                                </p>
                                <p className="text-white/60 text-sm">
                                  La creadora ha terminado la transmisión
                                </p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-white text-lg">
                                  Esperando que el creador inicie la transmisión...
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                    {Array.from(remoteUsers.entries()).map(([uid, user]) => (
                      <div
                        key={uid}
                        id={`remote-player-${uid}`}
                        className="w-full h-full"
                      />
                    ))}

                    {/* Stats overlay */}
                    {!transmisionFinalizada && (
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

                    {/* Controles */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {/* Control de audio */}
                      <button
                        onClick={toggleAudio}
                        className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition"
                      >
                        {audioMuted ? (
                          <VolumeX className="w-6 h-6 text-white" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-white" />
                        )}
                      </button>

                      {/* Control de pantalla completa */}
                      <button
                        onClick={toggleFullscreen}
                        className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-6 h-6 text-white" />
                        ) : (
                          <Maximize className="w-6 h-6 text-white" />
                        )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Información del creador */}
            <div className="bg-white rounded-2xl p-6 mt-6 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Creadora"
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Nombre Creadora</h3>
                  <p className="text-gray-600">@username</p>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition">
                  Seguir
                </button>
              </div>
            </div>
          </div>

          {/* Chat lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 h-[600px] flex flex-col">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Chat en Vivo</h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {/* Mensajes de ejemplo */}
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Usuario1</p>
                    <p className="text-sm text-gray-600">Hola! 👋</p>
                  </div>
                </div>
              </div>

              {/* Input de mensaje */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Botones de interacción */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="py-2 px-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Me gusta
                </button>
                <button className="py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Regalo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
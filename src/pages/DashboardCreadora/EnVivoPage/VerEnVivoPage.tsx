import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser,
  UID
} from 'agora-rtc-sdk-ng';
import { Users, Heart, Gift, MessageCircle, Volume2, VolumeX, Maximize, Minimize, Crown, DollarSign, Send, Sparkles } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
// Controlado desde .env: VITE_REQUIERE_AUTENTICACION=true o false
const REQUIERE_AUTENTICACION = import.meta.env.VITE_REQUIERE_AUTENTICACION === 'true';

// Interfaces
interface ChatMessage {
  id: string;
  user: string;
  mensaje: string;
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
}

interface GiftMessage {
  id: string;
  user: string;
  isVIP: boolean;
  avatar: string;
  gift: {
    id: string;
    nombre: string;
    emoji: string;
    valor: number;
  };
  timestamp: Date;
}

interface ScreenNotification {
  id: string;
  type: 'gift' | 'message';
  user: string;
  isVIP: boolean;
  content: string; // emoji para regalos, texto para mensajes
  title: string; // nombre del regalo o mensaje
  valor?: number;
  tier: 'small' | 'medium' | 'large'; // determina el tipo de animación
  timestamp: Date;
}

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
  
  // Estados del chat
  const socketRef = useRef<Socket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [mensajeActual, setMensajeActual] = useState('');
  const [mostrarCatalogoRegalos, setMostrarCatalogoRegalos] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Estados para notificaciones en pantalla
  const [screenNotifications, setScreenNotifications] = useState<ScreenNotification[]>([]);
  const notificationQueueRef = useRef<ScreenNotification[]>([]);
  const isProcessingRef = useRef(false);

  // Estados para restricciones del chat
  const [chatConfig, setChatConfig] = useState({
    publicoPuedeChatear: true,
    suscriptoresPuedeChatear: true,
    soloEmoticonos: false,
    soloMensajes: false,
    palabrasRestringidas: [] as string[]
  });
  const [alertaChat, setAlertaChat] = useState<string | null>(null);
  
  // Trackear regalos enviados por este usuario para no mostrarle la notificación
  const regalosPropiosRef = useRef<Set<string>>(new Set());

  // Determinar tier del regalo según su valor
  const getTier = (valor: number): 'small' | 'medium' | 'large' => {
    if (valor >= 200) return 'large';
    if (valor >= 50) return 'medium';
    return 'small';
  };

  // Configurar como audiencia
  useEffect(() => {
    client.setClientRole('audience');
  }, [client]);

  // Conectar Socket.io cuando nos unamos
  useEffect(() => {
    if (conectado && channelName) {
      // Conectar al servidor Socket.io
      socketRef.current = io(BACKEND_URL);

      // Unirse al canal
      socketRef.current.emit('join-channel', {
        channelName,
        userName: 'Espectador' + Math.floor(Math.random() * 1000), // TODO: usar nombre real del usuario
        isVIP: false // TODO: verificar suscripción del usuario
      });

      // Recibir configuración del chat
      socketRef.current.on('chat-config-updated', (config: any) => {
        console.log('📋 Configuración del chat recibida:', config);
        setChatConfig(config);
      });

      // Escuchar mensajes nuevos
      socketRef.current.on('new-message', (message: ChatMessage) => {
        setChatMessages(prev => [...prev, message]);
      });

      // Escuchar regalos nuevos
      socketRef.current.on('new-gift', (gift: GiftMessage) => {
        // Solo agregar al chat, NO crear notificación en pantalla para espectadores
        setGiftMessages(prev => [...prev, gift]);
      });

      // Cleanup
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [conectado, channelName]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, giftMessages]);

  // Sistema de cola de notificaciones en pantalla
  const processNotificationQueue = async () => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const notification = notificationQueueRef.current.shift()!;
    
    // Mostrar notificación
    setScreenNotifications(prev => [...prev, notification]);
    
    // Duración según el tier
    const duration = notification.tier === 'large' ? 5000 : notification.tier === 'medium' ? 4000 : 3000;
    
    // Remover después del tiempo
    setTimeout(() => {
      setScreenNotifications(prev => prev.filter(n => n.id !== notification.id));
      isProcessingRef.current = false;
      
      // Procesar siguiente en la cola
      if (notificationQueueRef.current.length > 0) {
        setTimeout(() => processNotificationQueue(), 500); // delay entre notificaciones
      }
    }, duration);
  };

  // Agregar notificación a la cola
  const addScreenNotification = (notification: ScreenNotification) => {
    notificationQueueRef.current.push(notification);
    processNotificationQueue();
  };

  // Actualizar contador de espectadores desde el backend
  useEffect(() => {
    if (!conectado || !channelName) return;

    const intervalo = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/espectadores/${channelName}`);
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

      // Validar autenticación si está habilitada
      if (REQUIERE_AUTENTICACION) {
        // TODO: Cuando tengas login, descomentar esto:
        // const usuarioAutenticado = verificarSesion(); // Tu función de verificación
        // if (!usuarioAutenticado) {
        //   window.location.href = '/login';
        //   return;
        // }
        console.log('⚠️ REQUIERE_AUTENTICACION está activo pero aún no implementado');
      }

      // Validar que existe el channelName
      if (!channelName) {
        throw new Error('No se especificó el canal de transmisión');
      }

      // IMPORTANTE: Verificar si el canal está activo ANTES de conectarse
      const verificarResponse = await fetch(`${BACKEND_URL}/api/canal/${channelName}/activo`);
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
        `${BACKEND_URL}/api/agora/token?channelName=${channelName}&userId=${userId}`
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
        await fetch(`${BACKEND_URL}/api/espectador/unirse`, {
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
        fetch(`${BACKEND_URL}/api/espectador/salir`, {
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

  // Enviar mensaje
  const handleEnviarMensaje = () => {
    if (!mensajeActual.trim() || !socketRef.current) return;

    // Validar si el público puede chatear
    if (!chatConfig.publicoPuedeChatear) {
      setAlertaChat('❌ El chat está restringido solo para suscriptores');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    // Validar solo emoticones
    const esEmoticon = /^[\p{Emoji}\s]+$/u.test(mensajeActual);
    if (chatConfig.soloEmoticonos && !esEmoticon) {
      setAlertaChat('❌ Solo se permiten emoticones en el chat');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    // Validar solo mensajes (sin emoticones)
    if (chatConfig.soloMensajes && esEmoticon) {
      setAlertaChat('❌ Solo se permiten mensajes de texto, no emoticones');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    // Validar palabras restringidas
    const mensajeLower = mensajeActual.toLowerCase();
    console.log('🔍 Validando palabras restringidas:', {
      mensaje: mensajeLower,
      palabrasRestringidas: chatConfig.palabrasRestringidas
    });
    const contieneRestriccion = chatConfig.palabrasRestringidas.some(
      palabra => mensajeLower.includes(palabra.toLowerCase())
    );
    if (contieneRestriccion) {
      setAlertaChat('❌ El mensaje contiene palabras no permitidas');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    const nuevoMensaje: ChatMessage = {
      id: Date.now().toString(),
      user: 'Espectador' + Math.floor(Math.random() * 1000), // TODO: usar nombre real
      mensaje: mensajeActual,
      isVIP: false, // TODO: verificar suscripción
      avatar: 'https://via.placeholder.com/32',
      timestamp: new Date()
    };

    // Agregar mensaje localmente PRIMERO para que el espectador lo vea inmediatamente
    setChatMessages(prev => [...prev, nuevoMensaje]);

    // Luego enviar al servidor para que otros lo vean
    socketRef.current.emit('chat-message', {
      channelName,
      mensaje: mensajeActual,
      user: nuevoMensaje.user,
      isVIP: false,
      avatar: 'https://via.placeholder.com/32'
    });

    setMensajeActual('');
  };

  // Estado para mostrar confirmación de regalo
  const [regaloEnviado, setRegaloEnviado] = useState<{ show: boolean; gift?: any }>({ show: false });

  // Enviar regalo
  const handleEnviarRegalo = (gift: { id: string; nombre: string; emoji: string; valor: number }) => {
    if (!socketRef.current) return;

    // Generar un ID único para este regalo
    const giftId = Date.now().toString();
    
    // Marcar este regalo como enviado por este usuario
    regalosPropiosRef.current.add(giftId);

    socketRef.current.emit('send-gift', {
      channelName,
      giftId,
      user: 'Espectador' + Math.floor(Math.random() * 1000), // TODO: usar nombre real
      isVIP: false,
      avatar: 'https://via.placeholder.com/32',
      gift
    });

    setMostrarCatalogoRegalos(false);
    
    // Mostrar confirmación
    setRegaloEnviado({ show: true, gift });
    setTimeout(() => setRegaloEnviado({ show: false }), 3000);
  };

  // Catálogo de regalos premium
  const catalogoRegalos = [
    { id: '1', nombre: 'Rosa', emoji: '🌹', valor: 10 },
    { id: '2', nombre: 'Corazón', emoji: '💖', valor: 25 },
    { id: '3', nombre: 'Diamante', emoji: '💎', valor: 50 },
    { id: '4', nombre: 'Corona', emoji: '👑', valor: 100 },
    { id: '5', nombre: 'Cohete', emoji: '🚀', valor: 200 },
    { id: '6', nombre: 'Unicornio', emoji: '🦄', valor: 500 },
  ];

  // Combinar mensajes y regalos en timeline
  const timeline = [...chatMessages, ...giftMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Alerta de restricción de chat */}
      {alertaChat && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl px-5 py-3.5 shadow-2xl border-2 border-white/30 backdrop-blur-lg max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{alertaChat}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notificación de regalo enviado */}
      {regaloEnviado.show && regaloEnviado.gift && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl px-6 py-4 shadow-2xl border-2 border-white/30 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">{regaloEnviado.gift.emoji}</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">¡Regalo Enviado!</p>
                <p className="text-white/90 text-xs">{regaloEnviado.gift.nombre} • ${regaloEnviado.gift.valor}</p>
              </div>
              <div className="ml-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video principal */}
          <div className="lg:col-span-3">
            <div className="bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 mt-6 shadow-2xl border border-pink-500/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/80"
                    alt="Creadora"
                    className="w-20 h-20 rounded-full border-2 border-pink-500/30"
                  />
                  <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Nombre Creadora</h3>
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-gray-400">@username</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-pink-400 font-semibold">15.2K seguidores</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">Nivel Premium</span>
                  </div>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>

          {/* Chat lateral premium */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl border border-gray-200 p-4 h-[600px] flex flex-col">
              {/* Header del chat */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-pink-500" />
                  Chat Exclusivo
                </h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 rounded-full">
                  <Users className="w-3 h-3 text-pink-600" />
                  <span className="text-xs text-pink-600 font-semibold">{espectadores}</span>
                </div>
              </div>
              
              {/* Timeline de mensajes y regalos */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {timeline.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Sé el primero en saludar</p>
                    </div>
                  </div>
                ) : (
                  timeline.map((item) => {
                    if ('mensaje' in item) {
                      // Es un mensaje de chat
                      return (
                        <div key={item.id} className="flex items-start gap-2 animate-fade-in">
                          <img
                            src={item.avatar}
                            alt={item.user}
                            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-purple-300"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <p className={`text-sm font-semibold truncate ${
                                item.isVIP ? 'text-orange-600' : 'text-purple-600'
                              }`}>
                                {item.user}
                              </p>
                              {item.isVIP && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-sm">
                              <p className="text-sm text-gray-800 break-words">{item.mensaje}</p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Es un regalo
                      return (
                        <div key={item.id} className="animate-fade-in">
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-400/40 rounded-lg p-2.5">
                            <div className="flex items-center gap-2 mb-1.5">
                              <img
                                src={item.avatar}
                                alt={item.user}
                                className="w-5 h-5 rounded-full border border-yellow-500/50"
                              />
                              <p className="text-xs font-bold text-gray-800">
                                {item.user}
                              </p>
                              {item.isVIP && <Crown className="w-3 h-3 text-yellow-500" />}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{item.gift.emoji}</span>
                              <div className="flex-1">
                                <p className="text-gray-900 font-bold text-sm">{item.gift.nombre}</p>
                                <div className="flex items-center gap-1 text-orange-600">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="text-xs font-bold">{item.gift.valor} coins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input de mensaje premium */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mensajeActual}
                    onChange={(e) => setMensajeActual(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                    placeholder="Mensaje exclusivo..."
                    disabled={!conectado}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-50 shadow-sm"
                  />
                  <button
                    onClick={handleEnviarMensaje}
                    disabled={!conectado || !mensajeActual.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Botones de interacción premium */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    disabled={!conectado}
                    className="py-2.5 px-4 bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Me gusta</span>
                  </button>
                  <button 
                    onClick={() => setMostrarCatalogoRegalos(true)}
                    disabled={!conectado}
                    className="py-2.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
                  >
                    <Gift className="w-4 h-4" />
                    <span className="text-sm">Regalo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de notificaciones en pantalla */}
      {screenNotifications.map((notif) => (
        <div key={notif.id} className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center pt-20">
          {notif.tier === 'large' && (
            // Animación grande para regalos premium (200+ coins)
            <div className="animate-bounce-in pointer-events-none">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-8 shadow-2xl border-4 border-white/50 backdrop-blur-xl relative overflow-hidden">
                {/* Partículas de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-orange-300/20 to-pink-300/20 animate-pulse" />
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className="text-8xl animate-bounce">{notif.content}</div>
                  <div className="text-left">
                    <p className="text-white text-3xl font-black mb-2">{notif.user}</p>
                    <p className="text-white text-5xl font-extrabold mb-2">{notif.title}</p>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                      <DollarSign className="w-6 h-6 text-white" />
                      <span className="text-white text-2xl font-bold">{notif.valor} coins</span>
                    </div>
                  </div>
                </div>
                
                {/* Efectos de brillo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/20 rotate-45 animate-shimmer" />
                </div>
              </div>
            </div>
          )}

          {notif.tier === 'medium' && (
            // Animación mediana para regalos medianos (50-100 coins)
            <div className="animate-slide-down pointer-events-none">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 shadow-xl border-2 border-white/30 backdrop-blur-lg">
                <div className="flex items-center gap-4">
                  <div className="text-6xl animate-bounce">{notif.content}</div>
                  <div>
                    <p className="text-white text-xl font-bold">{notif.user}</p>
                    <p className="text-white text-3xl font-extrabold">{notif.title}</p>
                    <div className="flex items-center gap-1 text-yellow-300 mt-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-lg font-bold">{notif.valor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notif.tier === 'small' && (
            // Animación pequeña para regalos pequeños (10-25 coins)
            <div className="animate-slide-down pointer-events-none">
              <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-4 shadow-lg border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{notif.content}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{notif.user}</p>
                    <p className="text-white text-lg font-bold">{notif.title}</p>
                  </div>
                  <div className="ml-2 flex items-center gap-1 text-yellow-200">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-sm font-bold">{notif.valor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal de catálogo de regalos premium */}
      {mostrarCatalogoRegalos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-pink-500/30 p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-400" />
                Catálogo Exclusivo
              </h3>
              <button
                onClick={() => setMostrarCatalogoRegalos(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
              {catalogoRegalos.map((regalo) => (
                <button
                  key={regalo.id}
                  onClick={() => handleEnviarRegalo(regalo)}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500/20 rounded-xl p-4 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all group hover:scale-105"
                >
                  <div className="text-4xl mb-2">{regalo.emoji}</div>
                  <p className="text-white font-bold text-sm mb-1 group-hover:text-pink-400 transition">
                    {regalo.nombre}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-yellow-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-bold">{regalo.valor}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Tu balance:</span>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <DollarSign className="w-4 h-4" />
                  <span>1,250 coins</span>
                </div>
              </div>
              <button className="w-full mt-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-[1.02]">
                Comprar más coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
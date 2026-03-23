import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID
} from 'agora-rtc-sdk-ng';
import { Users, Heart, Gift, MessageCircle, Volume2, VolumeX, Maximize, Minimize, Crown, DollarSign, Send, Sparkles, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { SuperChatModal } from './SuperChatModal';
import { RecargarCoinsModal } from '../../../components/Modals/RecargarCoinsModal';
import { CatalogoRegalosModal } from './CatalogoRegalosModal';
import RuletaModal from '../../../components/Dashboard/CreatorProfile/LiveStream/RuletaModal';
import { verificarSuscripcion, verificarAccesoPPV, crearSuscripcion, pagarPPV } from '../../../shared/services/subscription.service';
import { PLANES_SUSCRIPCION } from '../../../shared/types/subscription.types';
import { PremioRuleta, PREMIOS_DEFAULT } from '../../../shared/types/ruleta.types';

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

interface TipMessage {
  id: string;
  user: string;
  monto: number;
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
}

interface SuperChatMessage {
  id: string;
  user: string;
  mensaje: string;
  monto: number;
  tier: 'basic' | 'premium' | 'elite';
  isVIP: boolean;
  avatar: string;
  timestamp: Date;
  expiresAt?: Date;
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

interface FloatingHeart {
  id: string;
  left: number; // posición horizontal en %
  animationDuration: number; // duración en segundos
  delay: number; // delay inicial
}

export const VerEnVivoPage = () => {
  const [transmisionFinalizada, setTransmisionFinalizada] = useState(false);
  // Cerrar todos los modales cuando la transmisión finaliza
  useEffect(() => {
    if (transmisionFinalizada) {
      setMostrarCatalogoRegalos(false);
      setMostrarModalSuperChat(false);
      setMostrarModalRecarga(false);
      setMostrarModalAcceso(false);
    }
  }, [transmisionFinalizada]);
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

  // Estados del chat
  const socketRef = useRef<Socket | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>(''); // Nombre del usuario actual
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [tipMessages, setTipMessages] = useState<TipMessage[]>([]);
  const [superChatMessages, setSuperChatMessages] = useState<SuperChatMessage[]>([]);
  const [pinnedSuperChat, setPinnedSuperChat] = useState<SuperChatMessage | null>(null);
  const [mensajeActual, setMensajeActual] = useState('');
  const [mostrarCatalogoRegalos, setMostrarCatalogoRegalos] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Estados para Super Chat
  const [mostrarModalSuperChat, setMostrarModalSuperChat] = useState(false);

  // Estados para control de acceso
  const [tipoTransmision, setTipoTransmision] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioPPV, setPrecioPPVAcceso] = useState(0);
  const [descripcionPPV, setDescripcionPPVAcceso] = useState('');
  const [mostrarModalAcceso, setMostrarModalAcceso] = useState(false);
  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [esSuscriptor, setEsSuscriptor] = useState(false); // Simulado por ahora

  // Estados para notificaciones toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Estado para rastrear quién está girando la ruleta
  const [usuarioGirandoRuleta, setUsuarioGirandoRuleta] = useState<string | null>(null);

  // Estados para el sistema de coins
  const [coinsBalance, setCoinsBalance] = useState(1250); // Balance de coins del usuario
  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<{ tipo: 'ruleta' | 'regalo' | 'superchat', dato?: any } | null>(null);

  // Estados para notificaciones en pantalla
  const [screenNotifications, setScreenNotifications] = useState<ScreenNotification[]>([]);
  const notificationQueueRef = useRef<ScreenNotification[]>([]);
  const isProcessingRef = useRef(false);

  // Estados para emoticones y corazones flotantes
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Estados para Meta (sincronizados con la creadora)
  const [metaActiva, setMetaActiva] = useState(false);
  const [metaActual, setMetaActual] = useState(0);
  const [descripcionMeta, setDescripcionMeta] = useState('');
  const [progresoMeta, setProgresoMeta] = useState(0);
  const porcentajeMeta = metaActual > 0 ? Math.min((progresoMeta / metaActual) * 100, 100) : 0;

  // Estados para restricciones del chat
  const [chatConfig, setChatConfig] = useState({
    publicoPuedeChatear: true,
    suscriptoresPuedeChatear: true,
    soloEmoticonos: true,
    soloMensajes: true,
    palabrasRestringidas: [] as string[]
  });
  const [alertaChat, setAlertaChat] = useState<string | null>(null);

  // Estados para Ruleta
  const [showRuletaModal, setShowRuletaModal] = useState(false);
  const [ruletaActiva, setRuletaActiva] = useState(false);
  const [costoGiroRuleta, setCostoGiroRuleta] = useState(10);
  const [girandoRuleta, setGirandoRuleta] = useState(false);
  const [premioGanado, setPremioGanado] = useState<any>(null);
  const [premiosRuleta, setPremiosRuleta] = useState<PremioRuleta[]>(PREMIOS_DEFAULT);

  // Estados para procesamiento de pagos
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Trackear regalos enviados por este usuario para no mostrarle la notificación
  const regalosPropiosRef = useRef<Set<string>>(new Set());

  // Verificar suscripción al cargar (para uso futuro del creadoraId)
  useEffect(() => {
    const checkSuscripcion = async () => {
      // TODO: BACKEND - Obtener creadoraId real del canal
      const creadoraId = 'temp_creadora_123'; // Temporal
      const resultado = await verificarSuscripcion(creadoraId);
      setEsSuscriptor(resultado.esSuscriptor);
    };
    checkSuscripcion();
  }, []);

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

      // Generar y guardar nombre del usuario actual - VERDADERAMENTE Único
      const userName = 'Espectador_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      setCurrentUserName(userName);
      console.log('👤 [INIT] Mi nombre de usuario único:', userName);

      // Unirse al canal
      socketRef.current.emit('join-channel', {
        channelName,
        userName,
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
        console.log('🎁 Espectador recibió regalo:', gift);
        console.log('🎯 Estado meta antes de actualizar:', { metaActiva, metaActual, progresoMeta });

        // Agregar al chat
        setGiftMessages(prev => [...prev, gift]);

        // Actualizar progreso de meta localmente SIEMPRE (el componente decide si mostrar)
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + gift.gift.valor;
          console.log(`📊 Actualizando progreso: ${prev} + ${gift.gift.valor} = ${nuevoProgreso}`);
          return nuevoProgreso;
        });

        // No mostrar notificación en pantalla si fue enviado por este usuario
        if (regalosPropiosRef.current.has(gift.id)) {
          console.log('🎁 Regalo propio detectado, no mostrar notificación:', gift.id);
          regalosPropiosRef.current.delete(gift.id);
          return;
        }
        // Agregar notificación en pantalla para regalos de otros usuarios
        const tier = getTier(gift.gift.valor);
        const notification: ScreenNotification = {
          id: gift.id,
          type: 'gift',
          user: gift.user,
          isVIP: gift.isVIP,
          content: gift.gift.emoji,
          title: gift.gift.nombre,
          valor: gift.gift.valor,
          tier,
          timestamp: gift.timestamp
        };
        addScreenNotification(notification);
      });

      // Escuchar estado inicial del canal (cuando se une)
      socketRef.current.on('channel-joined', (data: any) => {
        console.log('✅ Canal unido, estado inicial recibido:', data);
        if (data.meta) {
          console.log('🎯 Inicializando meta del espectador:', data.meta);
          setMetaActiva(data.meta.activa);
          setMetaActual(data.meta.monto);
          setDescripcionMeta(data.meta.descripcion);
          setProgresoMeta(data.meta.progreso);
        }
      });

      // Escuchar actualizaciones de la meta
      socketRef.current.on('meta-updated', (data: any) => {
        console.log('🎯 [ESPECTADOR] Meta actualizada recibida:', data);
        console.log('🎯 [ESPECTADOR] Progreso actual ANTES:', progresoMeta);
        setMetaActiva(data.activa);
        setMetaActual(data.monto);
        setDescripcionMeta(data.descripcion);
        setProgresoMeta(data.progreso);
        console.log('🎯 [ESPECTADOR] Progreso actual DESPUÉS:', data.progreso);
      });

      // Escuchar activación/desactivación de ruleta
      socketRef.current.on('ruleta-activada', (data: { channelName: string, costoGiro: number, premios: PremioRuleta[] }) => {
        console.log('🎰 [ESPECTADOR] Ruleta activada recibida:', data);
        setRuletaActiva(true);
        setCostoGiroRuleta(data.costoGiro);
        setPremiosRuleta(data.premios); // Guardar premios recibidos
      });

      socketRef.current.on('ruleta-desactivada', () => {
        console.log('🎰 [ESPECTADOR] Ruleta desactivada');
        setRuletaActiva(false);

        // Mostrar mensaje antes de cerrar
        setToastMessage('⚠️ La creadora desactivó la ruleta');
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          setShowRuletaModal(false);
        }, 2500);
      });

      // Solicitar estado actual de la ruleta al unirse
      socketRef.current.emit('solicitar-estado-ruleta', { channelName });

      socketRef.current.on('estado-ruleta', (data: { activa: boolean, costoGiro: number, premios?: PremioRuleta[] }) => {
        console.log('🎰 [ESPECTADOR] Estado inicial de ruleta:', data);
        setRuletaActiva(data.activa);
        if (data.activa) {
          setCostoGiroRuleta(data.costoGiro);
          if (data.premios && data.premios.length > 0) {
            setPremiosRuleta(data.premios);
          }
        }
      });

      // Escuchar cuando el servidor RECHAZA el giro (alguien ya está girando)
      socketRef.current.on('ruleta-ocupada', () => {
        console.log('❌ [ESPECTADOR] Ruleta ocupada - solicitud rechazada');
        setToastMessage('⏳ Otro espectador está girando. Espera tu turno...');
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
        setGirandoRuleta(false); // Desbloquear para que pueda reintentar
      });

      // Escuchar cuando el servidor OTORGA permiso para girar (solo al solicitante)
      socketRef.current.on('permiso-giro-concedido', (data: { usuario: string }) => {
        console.log('✅ [ESPECTADOR] Permiso concedido para girar');

        // TODO: BACKEND C# - Validar saldo y cobrar antes de ejecutar el giro

        // SIMULACIÓN: Esperar animación y seleccionar premio aleatorio
        setTimeout(() => {
          // Seleccionar premio basado en probabilidades de premiosRuleta (NO hardcoded)
          const totalProbabilidad = premiosRuleta.reduce((sum, p) => sum + p.probabilidad, 0);
          let random = Math.random() * totalProbabilidad;
          let premioSeleccionado = premiosRuleta[0];

          for (const premio of premiosRuleta) {
            random -= premio.probabilidad;
            if (random <= 0) {
              premioSeleccionado = premio;
              break;
            }
          }

          setPremioGanado(premioSeleccionado);

          console.log('🎰 [ESPECTADOR] Emitiendo resultado:', { channelName, usuario: userName, premio: premioSeleccionado.nombre });

          // Emitir resultado a todos via Socket.io (esto también desbloquea los botones)
          socketRef.current?.emit('girar-ruleta', {
            channelName,
            usuario: userName,
            premio: premioSeleccionado
          });

          setToastMessage(`¡Ganaste: ${premioSeleccionado.nombre}!`);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);

          // Limpiar premio después de 5 segundos
          setTimeout(() => setPremioGanado(null), 5000);
        }, 3000);
      });

      // Escuchar cuando alguien INICIA un giro (bloquear botón para TODOS y mostrar animación)
      socketRef.current.on('ruleta-iniciando-giro', (data: { usuario: string, channelName: string }) => {
        console.log('='.repeat(80));
        console.log('🔴 [EVENTO RECIBIDO] ruleta-iniciando-giro');
        console.log('🎰 Usuario que está girando:', data.usuario);
        console.log('👤 Mi nombre:', userName);
        console.log('🔒 BLOQUEANDO BOTÓN PARA TODOS');
        console.log('='.repeat(80));
        setGirandoRuleta(true); // Bloquear para TODOS sin excepción
        setUsuarioGirandoRuleta(data.usuario); // Guardar quién está girando

        // Si NO soy el que está girando, también activo la animación visual en mi modal
        if (data.usuario !== userName) {
          console.log('🎨 Activando animación de giro para espectador que NO es el que giró');
          // La animación se sincroniza automáticamente porque girandoRuleta se pone en true
        }
      });

      // Escuchar resultados de giros (cuando termina un giro)
      socketRef.current.on('ruleta-resultado', (data: { usuario: string, premio: PremioRuleta }) => {
        console.log('🎰 [ESPECTADOR] Resultado recibido:', data);
        console.log('🎰 [ESPECTADOR] Desbloqueando botón para TODOS');
        console.log('👤 Mi nombre:', userName);
        console.log('🎯 Ganador:', data.usuario);

        // SOLO mostrar mensaje flotante si NO soy el ganador
        if (data.usuario !== userName) {
          console.log('✅ No soy el ganador, mostrando mensaje flotante ADELANTE del modal');
          setToastMessage(`${data.usuario} ganó: ${data.premio.nombre} ${data.premio.icono}`);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);
        } else {
          console.log('🚫 Soy el ganador, NO muestro mensaje flotante (solo modal)');
        }

        // Desbloquear botón para TODOS después del resultado
        setTimeout(() => {
          setGirandoRuleta(false);
          setUsuarioGirandoRuleta(null); // Limpiar el usuario que estaba girando
          console.log('🎰 [ESPECTADOR] Botón desbloqueado');
        }, 500);
      });

      // Escuchar Super Chats
      socketRef.current.on('new-superchat', (superchat: SuperChatMessage) => {
        console.log('💬💰 [ESPECTADOR] Super Chat recibido:', superchat);
        setSuperChatMessages(prev => [...prev, superchat]);

        // Solo fijar el super chat flotante si fue enviado por este usuario
        if (superchat.user === currentUserName) {
          console.log('✅ Super chat propio, mostrando flotante');
          const duration = superchat.tier === 'elite' ? 120000 : superchat.tier === 'premium' ? 60000 : 30000;
          const expiresAt = new Date(Date.now() + duration);
          setPinnedSuperChat({ ...superchat, expiresAt });

          // Desfijar después del tiempo
          setTimeout(() => {
            setPinnedSuperChat(prev => prev?.id === superchat.id ? null : prev);
          }, duration);
        } else {
          console.log('ℹ️ Super chat de otro usuario, solo en chat');
        }

        // Actualizar progreso de meta localmente
        setProgresoMeta(prev => prev + superchat.monto);
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

      // IMPORTANTE: Verificar si el canal está activo Y obtener configuración de acceso
      const verificarResponse = await fetch(`${BACKEND_URL}/api/canal/${channelName}/activo`);
      const canalData = await verificarResponse.json();

      if (!canalData.activo) {
        console.log('❌ Canal cerrado, no se conecta a Agora');
        setTransmisionFinalizada(true);
        setCargando(false);
        return; // NO se conecta a Agora, ahorra recursos
      }

      // Verificar tipo de acceso
      setTipoTransmision(canalData.tipoTransmision || 'gratis');
      setPrecioPPVAcceso(canalData.precioPPV || 0);
      setDescripcionPPVAcceso(canalData.descripcionPPV || '');

      // Validar acceso según tipo de transmisión
      if (canalData.tipoTransmision === 'suscriptores' && !esSuscriptor) {
        setMostrarModalAcceso(true);
        setCargando(false);
        return;
      }

      if (canalData.tipoTransmision === 'ppv' && !accesoPermitido) {
        setMostrarModalAcceso(true);
        setCargando(false);
        return;
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
              user.videoTrack.play(`remote-player-${user.uid}`, { fit: 'contain' });
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

  // Emoticones más usados en lives
  const emojisPopulares = [
    '❤️', '😍', '🔥', '👏', '😂', '😊', '🎉', '💜',
    '✨', '👍', '🥰', '😘', '💕', '🌟', '💯', '🙌'
  ];

  // Manejar click en Me gusta - Crear múltiples corazones flotantes (efecto premium)
  const handleMeGusta = () => {
    if (!conectado || transmisionFinalizada) return;

    // Generar entre 3 y 5 corazones por click (como TikTok/Instagram)
    const cantidadCorazones = Math.floor(Math.random() * 3) + 3; // 3-5 corazones

    for (let i = 0; i < cantidadCorazones; i++) {
      setTimeout(() => {
        const nuevoCorazon: FloatingHeart = {
          id: Date.now().toString() + Math.random(),
          left: Math.random() * 70 + 15, // Entre 15% y 85%
          animationDuration: 2.5 + Math.random() * 1.5, // Entre 2.5 y 4 segundos
          delay: 0
        };

        setFloatingHearts(prev => [...prev, nuevoCorazon]);

        // Remover después de la animación
        setTimeout(() => {
          setFloatingHearts(prev => prev.filter(h => h.id !== nuevoCorazon.id));
        }, (nuevoCorazon.animationDuration + 0.5) * 1000);
      }, i * 150); // Delay de 150ms entre cada corazón
    }

    // Enviar al servidor para que otros lo vean (un solo evento)
    if (socketRef.current) {
      socketRef.current.emit('send-like', {
        channelName,
        user: currentUserName,
        timestamp: Date.now()
      });
    }
  };

  // Escuchar likes de otros usuarios
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewLike = () => {
      // Generar entre 3 y 5 corazones por like recibido
      const cantidadCorazones = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < cantidadCorazones; i++) {
        setTimeout(() => {
          const nuevoCorazon: FloatingHeart = {
            id: Date.now().toString() + Math.random(),
            left: Math.random() * 70 + 15,
            animationDuration: 2.5 + Math.random() * 1.5,
            delay: 0
          };

          setFloatingHearts(prev => [...prev, nuevoCorazon]);

          setTimeout(() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== nuevoCorazon.id));
          }, (nuevoCorazon.animationDuration + 0.5) * 1000);
        }, i * 150); // Delay de 150ms entre cada corazón
      }
    };

    socketRef.current.on('new-like', handleNewLike);

    return () => {
      socketRef.current?.off('new-like', handleNewLike);
    };
  }, [socketRef.current]);

  // Enviar mensaje
  const handleEnviarMensaje = () => {
    if (!mensajeActual.trim() || !socketRef.current) return;

    // Validar si el público puede chatear
    if (!chatConfig.publicoPuedeChatear) {
      setAlertaChat('❌ El chat está restringido solo para suscriptores');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    // Validar tipo de mensajes
    const esEmoticon = /^[\p{Emoji}\s]+$/u.test(mensajeActual);

    const ambosActivos = chatConfig.soloEmoticonos && chatConfig.soloMensajes;
    const ambosInactivos = !chatConfig.soloEmoticonos && !chatConfig.soloMensajes;

    // Si ambos están inactivos, bloquear todo
    if (ambosInactivos) {
      setAlertaChat('❌ El chat está deshabilitado');
      setTimeout(() => setAlertaChat(null), 3000);
      return;
    }

    // Si ambos están activos, permitir todo (no validar)
    // Si solo uno está activo, validar según corresponda
    if (!ambosActivos) {
      if (chatConfig.soloEmoticonos && !esEmoticon) {
        setAlertaChat('❌ Solo se permiten emoticones en el chat');
        setTimeout(() => setAlertaChat(null), 3000);
        return;
      }

      if (chatConfig.soloMensajes && esEmoticon) {
        setAlertaChat('❌ Solo se permiten mensajes de texto, no emoticones');
        setTimeout(() => setAlertaChat(null), 3000);
        return;
      }
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

    // Enviar mensaje al servidor - el servidor lo reenviará a todos (incluido este usuario)
    socketRef.current.emit('chat-message', {
      channelName,
      mensaje: mensajeActual,
      user: currentUserName,
      isVIP: false,
      avatar: '👤'
    });

    setMensajeActual('');
  };

  // Estado para mostrar confirmación de regalo
  const [regaloEnviado, setRegaloEnviado] = useState<{ show: boolean; gift?: any }>({ show: false });

  // Enviar regalo
  const handleEnviarRegalo = (gift: { id: string; nombre: string; emoji: string; valor: number }) => {
    if (!socketRef.current) return;

    // Validar saldo suficiente
    if (coinsBalance < gift.valor) {
      setAccionPendiente({ tipo: 'regalo', dato: gift });
      setMostrarModalRecarga(true);
      setToastMessage('⚠️ No tienes suficientes coins');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }

    // Descontar coins
    setCoinsBalance(prev => prev - gift.valor);

    // Generar un ID único para este regalo
    const giftId = Date.now().toString();

    // Marcar este regalo como enviado por este usuario
    regalosPropiosRef.current.add(giftId);

    socketRef.current.emit('send-gift', {
      channelName,
      giftId,
      user: currentUserName,
      isVIP: false,
      avatar: '🎁',
      gift
    });

    setMostrarCatalogoRegalos(false);

    // Mostrar confirmación
    setRegaloEnviado({ show: true, gift });
    setTimeout(() => setRegaloEnviado({ show: false }), 3000);
  };

  // Manejar propinas rápidas
  const handleEnviarPropina = (monto: number) => {
    if (!socketRef.current) return;

    // Validar saldo suficiente
    if (coinsBalance < monto) {
      setAccionPendiente({ tipo: 'regalo', dato: { monto } });
      setMostrarModalRecarga(true);
      setToastMessage('⚠️ No tienes suficientes coins');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }

    // Descontar coins
    setCoinsBalance(prev => prev - monto);

    const tipId = Date.now().toString();

    // Agregar al chat local del espectador
    const newTip: TipMessage = {
      id: tipId,
      user: currentUserName,
      monto,
      isVIP: false,
      avatar: '💵',
      timestamp: new Date()
    };
    setTipMessages(prev => [...prev, newTip]);

    // Enviar al servidor
    socketRef.current.emit('send-tip', {
      channelName,
      tipId,
      user: currentUserName,
      monto,
      isVIP: false,
      avatar: '💵'
    });

    // Mostrar toast de confirmación
    setToastMessage(`💵 Propina de S/.${monto} enviada`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);

    console.log('💵 Propina enviada:', monto);
  };

  // Manejar envío de Super Chat
  const handleEnviarSuperChat = (mensaje: string, tier: 'basic' | 'premium' | 'elite') => {
    if (!socketRef.current || !mensaje.trim()) return;

    const tiersPrecios = {
      basic: 5,
      premium: 10,
      elite: 20
    };

    const costoTier = tiersPrecios[tier];

    // Validar saldo suficiente
    if (coinsBalance < costoTier) {
      setAccionPendiente({ tipo: 'superchat', dato: { mensaje, tier } });
      setMostrarModalRecarga(true);
      setToastMessage('⚠️ No tienes suficientes coins');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }

    // Descontar coins
    setCoinsBalance(prev => prev - costoTier);

    socketRef.current.emit('send-superchat', {
      channelName,
      superChatId: Date.now().toString(),
      user: currentUserName,
      mensaje: mensaje,
      monto: costoTier,
      tier: tier,
      isVIP: false,
      avatar: '⭐'
    });

    console.log('⭐ Super Chat enviado:', { mensaje, tier });
    // Mostrar mensaje de confirmación en español
    setToastMessage('✅ ¡Tu Mensaje Brillante fue enviado exitosamente!');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  // Manejar giro de ruleta
  const handleGirarRuleta = async () => {
    if (!socketRef.current) return;

    // Validar saldo suficiente
    if (coinsBalance < costoGiroRuleta) {
      setAccionPendiente({ tipo: 'ruleta' });
      setMostrarModalRecarga(true);
      setToastMessage('⚠️ No tienes suficientes coins');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }

    // Validar si alguien ya está girando (validación LOCAL)
    if (girandoRuleta) {
      setToastMessage('⏳ Otro espectador está usando la ruleta. Espera tu turno...');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      return;
    }

    // Descontar coins
    setCoinsBalance(prev => prev - costoGiroRuleta);

    // Bloquear INMEDIATAMENTE de forma local (UI responsive)
    setGirandoRuleta(true);

    const nombreUsuario = currentUserName || 'Espectador' + Math.floor(Math.random() * 1000);
    console.log('🎰 [HANDLEGIRAR] Solicitando permiso para girar:', { channelName, usuario: nombreUsuario });

    // SOLICITAR PERMISO al servidor (validación CENTRALIZADA)
    socketRef.current.emit('solicitar-giro-ruleta', {
      channelName,
      usuario: nombreUsuario
    });

    // La lógica del giro se ejecutará SOLO cuando el servidor responda con 'permiso-giro-concedido'
    // Ver listener en useEffect de Socket.io
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

  // Combinar mensajes, regalos, propinas y super chats en timeline
  const timeline = [...chatMessages, ...giftMessages, ...tipMessages, ...superChatMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black">
      {/* Alerta de restricción de chat */}
      {alertaChat && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl px-6 py-4 shadow-2xl border-2 border-white/30 backdrop-blur-lg max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">{alertaChat}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de regalo enviado */}
      {regaloEnviado.show && regaloEnviado.gift && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl px-6 py-4 shadow-2xl border-2 border-white/30 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">{regaloEnviado.gift.emoji}</span>
              </div>
              <div>
                <p className="text-white font-bold text-base">¡Regalo Enviado!</p>
                <p className="text-white/90 text-sm">{regaloEnviado.gift.nombre} • ${regaloEnviado.gift.valor}</p>
              </div>
              <div className="ml-2">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video principal - Pantalla Completa */}
      <div className="absolute inset-0 right-[420px] z-10">
        <div className="w-full h-full">
          <div className="relative w-full h-full">
            {!channelName ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 z-10">
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
              /* ============================================
    PANTALLA DE INICIO PREMIUM
    Reemplaza la sección "Ver Transmisión" en VerEnVivoPage
    ============================================ */

              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-10">
                <div className="text-center px-6 max-w-md">
                  {/* Icono/Logo Premium */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 rotate-3 hover:rotate-0 transition-transform">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="text-white text-3xl md:text-4xl font-bold mb-3">
                    Transmisión en Vivo
                  </h2>

                  {/* Subtítulo */}
                  <p className="text-slate-400 text-sm md:text-base mb-8">
                    Prepárate para una experiencia premium
                  </p>

                  {/* Botón Premium */}
                  <button
                    onClick={unirseATransmision}
                    disabled={cargando}
                    className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 disabled:hover:scale-100 overflow-hidden"
                  >
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    {/* Contenido del botón */}
                    <span className="relative flex items-center justify-center gap-2">
                      {cargando ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Conectando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          <span>Ver Transmisión</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Mensaje de error premium */}
                  {error && (
                    <div className="mt-6 animate-fade-in">
                      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Indicadores visuales */}
                  <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>HD Quality</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Low Latency</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div id="video-container" className="absolute inset-0 bg-gray-900 z-10">
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
                      style={{ objectFit: 'contain' }}
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

                  {/* Super Chats Flotantes sobre el video */}
                  {pinnedSuperChat && (
                    <div className="absolute top-4 left-4 max-w-2xl z-30 animate-slide-down">
                      {pinnedSuperChat.tier === 'elite' && (
                        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg p-3 shadow-2xl border-2 border-yellow-400/80 backdrop-blur-lg">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Crown className="w-4 h-4 text-yellow-300 animate-pulse" />
                            <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Super Chat Elite</p>
                            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                          </div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {pinnedSuperChat.isVIP && <Crown className="w-3 h-3 text-yellow-400" />}
                            <p className="text-white text-sm font-bold">{pinnedSuperChat.user}</p>
                            <span className="text-yellow-300 text-sm font-bold ml-auto">S/.{pinnedSuperChat.monto}</span>
                          </div>
                          <p className="text-white text-xs font-medium leading-relaxed break-words whitespace-pre-wrap word-break-all">{pinnedSuperChat.mensaje}</p>
                        </div>
                      )}

                      {pinnedSuperChat.tier === 'premium' && (
                        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-lg p-3 shadow-xl border-2 border-yellow-300/60 backdrop-blur-lg">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                            <p className="text-white text-xs font-bold uppercase tracking-wide">Super Chat Premium</p>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {pinnedSuperChat.isVIP && <Crown className="w-3 h-3 text-yellow-200" />}
                            <p className="text-white text-sm font-bold">{pinnedSuperChat.user}</p>
                            <span className="text-white text-sm font-bold ml-auto">S/.{pinnedSuperChat.monto}</span>
                          </div>
                          <p className="text-white text-xs font-medium leading-relaxed break-words whitespace-pre-wrap word-break-all">{pinnedSuperChat.mensaje}</p>
                        </div>
                      )}

                      {pinnedSuperChat.tier === 'basic' && (
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2.5 shadow-lg border border-cyan-300/50 backdrop-blur-md">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="w-3.5 h-3.5 text-white" />
                            <p className="text-white text-xs font-bold uppercase tracking-wide">Super Chat</p>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {pinnedSuperChat.isVIP && <Crown className="w-3 h-3 text-yellow-200" />}
                            <p className="text-white text-xs font-bold">{pinnedSuperChat.user}</p>
                            <span className="text-white text-xs font-bold ml-auto">S/.{pinnedSuperChat.monto}</span>
                          </div>
                          <p className="text-white text-xs font-medium leading-relaxed break-words whitespace-pre-wrap word-break-all">{pinnedSuperChat.mensaje}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Barra de Progreso de Meta - VISIBLE PARA ESPECTADORES */}
                  {!transmisionFinalizada && metaActiva && metaActual > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 z-30">
                      <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🎯</span>
                            <div>
                              <p className="text-white text-sm font-bold">{descripcionMeta}</p>
                              <p className="text-white/60 text-xs">{progresoMeta} / {metaActual} coins</p>
                            </div>
                          </div>
                          <div className="text-white/80 text-xs font-medium">
                            {porcentajeMeta.toFixed(0)}%
                          </div>
                        </div>
                        <div className="relative w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 rounded-full"
                            style={{ width: `${porcentajeMeta}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corazones flotantes */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {floatingHearts.map((heart) => {
                      // Generar variaciones aleatorias para cada corazón
                      const variation = parseInt(heart.id.slice(-1)) % 5;
                      const gradients = [
                        'from-pink-500 via-rose-500 to-red-500',
                        'from-red-500 via-pink-500 to-rose-400',
                        'from-rose-500 via-pink-400 to-red-400',
                        'from-pink-600 via-red-500 to-rose-500',
                        'from-red-400 via-rose-500 to-pink-500'
                      ];
                      const sizes = ['w-10 h-10', 'w-12 h-12', 'w-9 h-9', 'w-11 h-11', 'w-8 h-8'];

                      return (
                        <div
                          key={heart.id}
                          className="absolute bottom-0 animate-float-up"
                          style={{
                            left: `${heart.left}%`,
                            animationDuration: `${heart.animationDuration}s`,
                            animationDelay: `${heart.delay}s`
                          }}
                        >
                          <div className={`${sizes[variation]} relative`}>
                            {/* Corazón con gradiente */}
                            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-2xl">
                              <defs>
                                <linearGradient id={`gradient-${heart.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" className="text-pink-400" style={{ stopColor: 'currentColor' }} />
                                  <stop offset="50%" className="text-rose-500" style={{ stopColor: 'currentColor' }} />
                                  <stop offset="100%" className="text-red-500" style={{ stopColor: 'currentColor' }} />
                                </linearGradient>
                                {/* Sombra interior */}
                                <filter id={`shadow-${heart.id}`}>
                                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                                  <feOffset dx="0" dy="1" result="offsetblur" />
                                  <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.3" />
                                  </feComponentTransfer>
                                  <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                                </filter>
                              </defs>
                              <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                fill={`url(#gradient-${heart.id})`}
                                filter={`url(#shadow-${heart.id})`}
                                stroke="white"
                                strokeWidth="0.5"
                                strokeOpacity="0.6"
                              />
                            </svg>
                            {/* Brillo/destello */}
                            <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Controles */}
                  <div className="absolute bottom-6 right-[430px] flex gap-3 z-20">
                    {/* Control de audio */}
                    <button
                      onClick={toggleAudio}
                      className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition shadow-xl"
                    >
                      {audioMuted ? (
                        <VolumeX className="w-7 h-7 text-white" />
                      ) : (
                        <Volume2 className="w-7 h-7 text-white" />
                      )}
                    </button>

                    {/* Control de pantalla completa */}
                    <button
                      onClick={toggleFullscreen}
                      className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition shadow-xl"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-7 h-7 text-white" />
                      ) : (
                        <Maximize className="w-7 h-7 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chat lateral flotante - Premium */}

      {/* Chat lateral flotante - Premium Sutil */}
      <div className="absolute top-0 right-0 bottom-0 w-[420px] bg-white border-l border-slate-200 flex flex-col z-30 shadow-lg">
        {/* Header del chat */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
          <h3 className="font-semibold text-base text-slate-800 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-violet-600" />
            Chat en Vivo
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-violet-200 rounded-lg shadow-sm">
            <Users className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-sm text-slate-800 font-semibold">{espectadores}</span>
          </div>
        </div>

        {/* Super Chat Fijado */}
        {pinnedSuperChat && (() => {
          let bgClass = '';
          let borderClass = '';
          let amountClass = '';
          let badgeText = '';
          if (pinnedSuperChat.tier === 'elite') {
            bgClass = 'from-amber-50 to-yellow-50';
            borderClass = 'border-l-amber-400';
            amountClass = 'bg-gradient-to-r from-amber-500 to-yellow-500';
            badgeText = '👑 Legendario';
          } else if (pinnedSuperChat.tier === 'premium') {
            bgClass = 'from-violet-50 to-purple-50';
            borderClass = 'border-l-violet-400';
            amountClass = 'bg-violet-500';
            badgeText = '⭐ Plus';
          } else {
            bgClass = 'from-blue-50 to-cyan-50';
            borderClass = 'border-l-blue-400';
            amountClass = 'bg-blue-500';
            badgeText = '💎 Brillante';
          }
          return (
            <div className="mb-3 bg-white flex-shrink-0 shadow-sm rounded-xl overflow-hidden border border-slate-100 mx-3 mt-3">
              <div className={`p-3 bg-gradient-to-r ${bgClass} border-l-4 ${borderClass}`}>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="text-xs font-medium text-slate-600">{badgeText}</span>
                  <span className="ml-auto text-[10px] text-slate-400">
                    {pinnedSuperChat.tier === 'basic' ? '30s' : pinnedSuperChat.tier === 'premium' ? '60s' : '120s'}
                  </span>
                  <button
                    onClick={() => setPinnedSuperChat(null)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-sm text-white font-bold">{pinnedSuperChat.avatar || '⭐'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-sm font-semibold text-slate-800">{pinnedSuperChat.user}</p>
                      {pinnedSuperChat.isVIP && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                      <div className={`ml-auto flex items-center gap-0.5 ${amountClass} rounded-lg px-2 py-0.5 shadow-sm`}>
                        <DollarSign className="w-3 h-3 text-white" />
                        <span className="text-xs text-white font-bold">{pinnedSuperChat.monto}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 break-words leading-snug">{pinnedSuperChat.mensaje}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Timeline de mensajes */}
        <div className="flex-1 overflow-y-auto space-y-2.5 px-3 py-3 bg-slate-50">
          {timeline.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Sé el primero en saludar</p>
              </div>
            </div>
          ) : (
            timeline.map((item) => {
              // Super Chat
              if ('tier' in item && 'monto' in item && 'mensaje' in item) {
                const superChat = item as SuperChatMessage;
                const tierConfig = {
                  basic: {
                    gradient: 'from-blue-50 to-cyan-50',
                    border: 'border-blue-200',
                    text: 'text-blue-700',
                    badge: 'bg-blue-500',
                    icon: '💎'
                  },
                  premium: {
                    gradient: 'from-violet-50 to-purple-50',
                    border: 'border-violet-200',
                    text: 'text-violet-700',
                    badge: 'bg-violet-500',
                    icon: '⭐'
                  },
                  elite: {
                    gradient: 'from-amber-50 to-yellow-50',
                    border: 'border-amber-200',
                    text: 'text-amber-700',
                    badge: 'bg-gradient-to-r from-amber-500 to-yellow-500',
                    icon: '👑'
                  }
                };
                const config = tierConfig[superChat.tier];

                return (
                  <div key={superChat.id} className="animate-fade-in">
                    <div className={`bg-gradient-to-r ${config.gradient} border ${config.border} rounded-xl p-3 shadow-sm`}>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-sm text-white">{config.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            <p className={`text-sm font-semibold ${config.text}`}>{superChat.user}</p>
                            {superChat.isVIP && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                            <div className={`ml-auto flex items-center gap-1 ${config.badge} rounded-lg px-2 py-1 shadow-sm`}>
                              <DollarSign className="w-3 h-3 text-white" />
                              <p className="text-xs text-white font-bold">{superChat.monto}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 break-words">{superChat.mensaje}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {superChat.tier === 'basic' ? '30s' : superChat.tier === 'premium' ? '60s' : '120s'} destacado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Propina
              if ('monto' in item && !('gift' in item)) {
                return (
                  <div key={item.id} className="animate-fade-in">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-sm">💵</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-semibold text-emerald-700 truncate">{item.user}</p>
                            {item.isVIP && <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-500">envió una propina</p>
                        </div>
                        <div className="flex items-center gap-0.5 bg-emerald-500 rounded-lg px-2 py-1 flex-shrink-0 shadow-sm">
                          <DollarSign className="w-3 h-3 text-white" />
                          <span className="text-xs text-white font-bold">{item.monto}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Mensaje de chat
              if ('mensaje' in item) {
                return (
                  <div key={item.id} className="flex items-start gap-2 animate-fade-in">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${item.isVIP
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                        : 'bg-gradient-to-br from-violet-500 to-purple-500'
                      }`}>
                      <span className="text-xs text-white font-bold">{item.avatar || item.user[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <p className={`text-xs font-semibold truncate ${item.isVIP ? 'text-amber-600' : 'text-violet-600'
                          }`}>
                          {item.user}
                        </p>
                        {item.isVIP && <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 shadow-sm">
                        <p className="text-sm text-slate-700 break-words">{item.mensaje}</p>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Regalo
                const giftItem = item as GiftMessage;
                return (
                  <div key={giftItem.id} className="animate-fade-in">
                    <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${giftItem.isVIP
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                            : 'bg-gradient-to-br from-violet-500 to-purple-500'
                          }`}>
                          <span className="text-xs text-white font-bold">{giftItem.avatar || giftItem.user[0]}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                          {giftItem.user}
                          {giftItem.isVIP && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </p>
                        <span className="ml-auto text-xs text-slate-500 font-medium">envió un regalo</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-amber-100 shadow-sm">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                          <span className="text-2xl">{giftItem.gift.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 font-semibold text-base leading-tight">{giftItem.gift.nombre}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-sm font-semibold text-amber-600">{giftItem.gift.valor} coins</span>
                          </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-amber-500" />
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
        <div className="p-3 space-y-3 border-t border-slate-100 bg-white">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={mensajeActual}
                  onChange={(e) => setMensajeActual(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !transmisionFinalizada && handleEnviarMensaje()}
                  placeholder={transmisionFinalizada ? "Transmisión finalizada" : "Escribe un mensaje..."}
                  disabled={!conectado || transmisionFinalizada}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setMostrarEmojis(!mostrarEmojis)}
                  disabled={!conectado || transmisionFinalizada}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                >
                  <span className="text-lg">😊</span>
                </button>
              </div>
              <button
                onClick={handleEnviarMensaje}
                disabled={!conectado || !mensajeActual.trim() || transmisionFinalizada}
                className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-md hover:shadow-violet-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Panel de emoticones */}
            {mostrarEmojis && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-10">
                <div className="grid grid-cols-8 gap-2">
                  {emojisPopulares.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMensajeActual(prev => prev + emoji);
                        setMostrarEmojis(false);
                      }}
                      className="text-2xl hover:bg-slate-50 rounded-lg p-1 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Propinas Rápidas + Interacciones - HORIZONTAL */}
          <div className="space-y-2">
            {/* Propinas Rápidas */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 px-1">Propinas Rápidas</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[1, 3, 5, 10, 15, 20].map((monto) => (
                  <button
                    key={monto}
                    onClick={() => handleEnviarPropina(monto)}
                    disabled={!conectado || transmisionFinalizada}
                    className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 text-emerald-700 rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md flex items-center gap-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{monto}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interacciones */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5 px-1">Interacciones</p>
              <div className="grid grid-cols-4 gap-1.5">
                {/* Me gusta */}
                <button
                  onClick={handleMeGusta}
                  disabled={!conectado || transmisionFinalizada}
                  className="py-2 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 text-pink-700 rounded-lg font-medium transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Me gusta</span>
                </button>

                {/* Regalos */}
                <button
                  onClick={() => !transmisionFinalizada && setMostrarCatalogoRegalos(true)}
                  disabled={!conectado || transmisionFinalizada}
                  className="py-2 bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-200 text-violet-700 rounded-lg font-medium transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Regalos</span>
                </button>

                {/* Destacado */}
                <button
                  onClick={() => !transmisionFinalizada && setMostrarModalSuperChat(true)}
                  disabled={!conectado || transmisionFinalizada}
                  className="py-2 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 text-amber-700 rounded-lg font-medium transition-all flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Destacado</span>
                </button>

                {/* Ruleta */}
                <button
                  onClick={() => ruletaActiva && setShowRuletaModal(true)}
                  disabled={!conectado || transmisionFinalizada || !ruletaActiva}
                  className={`py-2 rounded-lg font-medium transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm ${ruletaActiva
                      ? 'bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 text-indigo-700 cursor-pointer hover:shadow-md active:scale-95'
                      : 'bg-slate-50 border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={ruletaActiva ? 'Gira la ruleta' : 'Ruleta no disponible'}
                >
                  <span className="text-base">🎰</span>
                  <span className="text-[10px]">Ruleta</span>
                </button>
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

          {notif.type === 'gift' && notif.tier === 'medium' && (
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

          {notif.type === 'gift' && notif.tier === 'small' && (
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
      <CatalogoRegalosModal
        isOpen={mostrarCatalogoRegalos}
        onClose={() => setMostrarCatalogoRegalos(false)}
        catalogoRegalos={catalogoRegalos}
        coinsBalance={coinsBalance}
        onEnviarRegalo={handleEnviarRegalo}
        onRecargarCoins={() => {
          setAccionPendiente({ tipo: 'regalo' });
          setMostrarModalRecarga(true);
        }}
      />

      {/* Modal de Super Chat */}
      <SuperChatModal
        isOpen={mostrarModalSuperChat}
        onClose={() => setMostrarModalSuperChat(false)}
        onSend={handleEnviarSuperChat}
        coinsBalance={coinsBalance}
        onRecargarCoins={() => {
          setAccionPendiente({ tipo: 'superchat' });
          setMostrarModalRecarga(true);
        }}
      />

      {/* Modal de Control de Acceso */}
      {mostrarModalAcceso && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full overflow-hidden">
            {tipoTransmision === 'suscriptores' ? (
              // ========================================
              // MODAL DE SUSCRIPCIÓN REQUERIDA - PREMIUM
              // ========================================
              <>
                {/* Header Premium */}
                <div className="relative bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 border-b border-slate-700/50 px-6 py-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Contenido Exclusivo</h3>
                    <p className="text-slate-400 text-sm">
                      Esta transmisión es solo para suscriptores
                    </p>
                  </div>
                </div>

                {/* Planes de Suscripción */}
                <div className="p-6 space-y-3">
                  {PLANES_SUSCRIPCION.map((plan) => {
                    const planStyles = {
                      basico: {
                        bg: 'from-purple-900/30 to-violet-900/30',
                        border: 'border-purple-500/50',
                        shadow: 'hover:shadow-purple-500/20'
                      },
                      vip: {
                        bg: 'from-blue-900/30 to-cyan-900/30',
                        border: 'border-blue-500/50',
                        shadow: 'hover:shadow-blue-500/20'
                      },
                      premium: {
                        bg: 'from-amber-900/30 to-yellow-900/30',
                        border: 'border-amber-500/50',
                        shadow: 'hover:shadow-amber-500/20'
                      }
                    };

                    const style = planStyles[plan.tipo as keyof typeof planStyles] || planStyles.basico;

                    return (
                      <div
                        key={plan.id}
                        className={`relative group bg-gradient-to-br ${style.bg} border ${style.border} rounded-xl p-4 hover:scale-[1.02] transition-all cursor-pointer shadow-lg ${style.shadow}`}
                      >
                        {/* Efecto de brillo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{plan.icono}</span>
                              <span className="text-white font-bold text-lg">{plan.nombre}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-lg">S/. {plan.precio}</div>
                              <div className="text-slate-400 text-xs">/mes</div>
                            </div>
                          </div>
                          <ul className="text-slate-300 text-sm space-y-1.5">
                            {plan.beneficios.slice(0, 3).map((beneficio, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{beneficio}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botones de Acción */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all hover:scale-[1.02]"
                    >
                      Volver
                    </button>
                    <button
                      onClick={async () => {
                        setProcesandoPago(true);
                        const creadoraId = 'temp_creadora_123'; // TODO: BACKEND - ID real
                        const resultado = await crearSuscripcion(creadoraId, 'basico');

                        if (resultado.success) {
                          setEsSuscriptor(true);
                          setMostrarModalAcceso(false);
                          unirseATransmision();
                        } else {
                          alert('Error al procesar suscripción: ' + resultado.error);
                        }
                        setProcesandoPago(false);
                      }}
                      disabled={procesandoPago}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {procesandoPago ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Suscribirme</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // ========================================
              // MODAL DE PPV (PAGO POR ENTRADA) - PREMIUM
              // ========================================
              <>
                {/* Header Premium */}
                <div className="relative bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-pink-600/10 border-b border-slate-700/50 px-6 py-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                        <span className="text-5xl">🎫</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Live Premium</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {descripcionPPV || 'Transmisión especial con contenido exclusivo'}
                    </p>

                    {/* Precio Badge */}
                    <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/50 rounded-xl px-6 py-3 shadow-lg">
                      <DollarSign className="w-6 h-6 text-pink-400" />
                      <span className="text-white text-3xl font-bold">S/. {precioPPV}</span>
                    </div>
                  </div>
                </div>

                {/* Contenido del Live */}
                <div className="p-6 space-y-4">
                  {/* Card de Beneficios */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Lo que incluye:</span>
                    </h4>
                    <ul className="text-slate-300 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Acceso completo a esta transmisión</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Chat sin restricciones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Envío de regalos y propinas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Calidad HD premium</span>
                      </li>
                    </ul>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all hover:scale-[1.02]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={async () => {
                        if (!channelName) return;

                        setProcesandoPago(true);
                        const resultado = await pagarPPV(channelName, precioPPV);

                        if (resultado.success) {
                          setAccesoPermitido(true);
                          setMostrarModalAcceso(false);
                          unirseATransmision();
                        } else {
                          alert('Error al procesar pago: ' + resultado.error);
                        }
                        setProcesandoPago(false);
                      }}
                      disabled={procesandoPago}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {procesandoPago ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          <span>Pagar S/. {precioPPV}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      )}

      {/* Toast de notificación - Z-INDEX MÁXIMO para aparecer ADELANTE del modal */}
      {toastVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in-down">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modal de Ruleta */}
      <RuletaModal
        isOpen={showRuletaModal}
        onClose={() => setShowRuletaModal(false)}
        isCreadora={false}
        channelName={channelName || ''}
        onGirar={handleGirarRuleta}
        costoGiro={costoGiroRuleta}
        premioGanado={premioGanado}
        girando={girandoRuleta}
        premiosDisponibles={premiosRuleta}
        usuarioGirando={usuarioGirandoRuleta}
        currentUserName={currentUserName}
        coinsBalance={coinsBalance}
        onRecargarCoins={() => {
          setAccionPendiente({ tipo: 'ruleta' });
          setMostrarModalRecarga(true);
        }}
      />

      {/* Modal Universal de Recarga de Coins */}
      <RecargarCoinsModal
        isOpen={mostrarModalRecarga}
        onClose={() => {
          setMostrarModalRecarga(false);
          setAccionPendiente(null);
        }}
        onRecargar={(cantidad) => {
          setCoinsBalance(prev => prev + cantidad);
          setMostrarModalRecarga(false);
          setToastMessage(`✅ ¡${cantidad} coins agregados!`);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 2000);
          setAccionPendiente(null);
        }}
        coinsBalance={coinsBalance}
      />
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { io, Socket } from 'socket.io-client';
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
  Minimize,
  Crown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles
} from 'lucide-react';
import RuletaModal from '../../../components/Dashboard/CreatorProfile/LiveStream/RuletaModal';
import { PremioRuleta } from '../../../shared/types/ruleta.types';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ChatMessage {
  id: number;
  user: string;
  mensaje: string;
  isVIP: boolean;
  avatar?: string;
  timestamp: string;
}

interface GiftMessage {
  id: number;
  user: string;
  gift: {
    id: string;
    nombre: string;
    emoji: string;
    valor: number;
  };
  isVIP: boolean;
  avatar?: string;
  timestamp: string;
}

interface TipMessage {
  id: number;
  user: string;
  monto: number;
  isVIP: boolean;
  avatar?: string;
  timestamp: string;
}

interface SuperChatMessage {
  id: number;
  user: string;
  mensaje: string;
  monto: number;
  tier: 'basic' | 'premium' | 'elite';
  isVIP: boolean;
  avatar?: string;
  timestamp: string;
  expiresAt?: Date;
}

interface ScreenNotification {
  id: string;
  type: 'gift' | 'message';
  user: string;
  isVIP: boolean;
  content: string;
  title: string;
  valor?: number;
  tier: 'small' | 'medium' | 'large';
  timestamp: Date;
}

interface ScreenNotification {
  id: string;
  type: 'gift' | 'message';
  user: string;
  isVIP: boolean;
  content: string;
  title: string;
  valor?: number;
  tier: 'small' | 'medium' | 'large';
  timestamp: Date;
  isExiting?: boolean;
}

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
  
  // Socket.io para chat
  const socketRef = useRef<Socket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [tipMessages, setTipMessages] = useState<TipMessage[]>([]);
  const [superChatMessages, setSuperChatMessages] = useState<SuperChatMessage[]>([]);
  const [pinnedSuperChat, setPinnedSuperChat] = useState<SuperChatMessage | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Estados para notificaciones en pantalla
  const [screenNotifications, setScreenNotifications] = useState<ScreenNotification[]>([]);
  const notificationQueueRef = useRef<ScreenNotification[]>([]);
  const isProcessingRef = useRef(false);
  
  // Estado para corazones flotantes
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  
  // Estados UI originales
  const [enVivo, setEnVivo] = useState(false);
  const [showRecompensasModal, setShowRecompensasModal] = useState(false);
  const [showCrearEventoModal, setShowCrearEventoModal] = useState(false);
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isEventoProgramado, setIsEventoProgramado] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [mensajeChat, setMensajeChat] = useState('');
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  
  // Sistema de Metas
  const [metaActiva, setMetaActiva] = useState(false); // Si la meta está activa o no
  const [metaActual, setMetaActual] = useState(0); // Meta en coins
  const [descripcionMeta, setDescripcionMeta] = useState(''); // Descripción/título de la meta
  const [progresoMeta, setProgresoMeta] = useState(0); // Progreso actual en coins
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaAlcanzada, setMetaAlcanzada] = useState(false);
  const [topDonadores, setTopDonadores] = useState<{user: string, total: number, avatar?: string}[]>([]);
  const [showTopDonadores, setShowTopDonadores] = useState(false); // Colapsable
  
  // Modal de tipo de transmisión
  const [showTipoTransmisionModal, setShowTipoTransmisionModal] = useState(false);
  const [tipoTransmisionSeleccionado, setTipoTransmisionSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioPPV, setPrecioPPV] = useState(0);
  const [descripcionPPV, setDescripcionPPV] = useState('');
  
  // Sistema de Moderación
  const [usuariosSilenciados, setUsuariosSilenciados] = useState<string[]>([]);
  const [showModeracionModal, setShowModeracionModal] = useState(false);
  const [nuevoUsuarioSilenciar, setNuevoUsuarioSilenciar] = useState('');
  
  // Sistema de Ruleta
  const [showRuletaModal, setShowRuletaModal] = useState(false);
  const [ruletaActiva, setRuletaActiva] = useState(false);
  const [costoGiroRuleta, setCostoGiroRuleta] = useState(10);
  
  // Sistema de Sonidos con Web Audio API
  const playSound = (type: 'small' | 'medium' | 'large' | 'goal') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurar según el tipo de sonido
    if (type === 'small') {
      // Sonido suave - ding simple
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'medium') {
      // Sonido medio - chime ascendente
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'large') {
      // Sonido grande - fanfare celebratorio
      const playTone = (freq: number, delay: number, duration: number) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.5, audioContext.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
        osc.start(audioContext.currentTime + delay);
        osc.stop(audioContext.currentTime + delay + duration);
      };
      playTone(523, 0, 0.2);    // C
      playTone(659, 0.15, 0.2); // E
      playTone(784, 0.3, 0.4);  // G
    } else if (type === 'goal') {
      // Sonido de meta cumplida - fanfare largo y celebratorio
      const playTone = (freq: number, delay: number, duration: number) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.6, audioContext.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
        osc.start(audioContext.currentTime + delay);
        osc.stop(audioContext.currentTime + delay + duration);
      };
      // Secuencia festiva: C-E-G-C (do-mi-sol-do)
      playTone(523, 0, 0.3);    // C
      playTone(659, 0.2, 0.3);  // E
      playTone(784, 0.4, 0.3);  // G
      playTone(1047, 0.6, 0.6); // C alto
    }
  };
  
  // Remover chat mensajes estáticos - ahora viene de Socket.io
  
  // Determinar tier del regalo
  const getTier = (valor: number): 'small' | 'medium' | 'large' => {
    if (valor >= 200) return 'large';
    if (valor >= 50) return 'medium';
    return 'small';
  };

  // Sistema de cola de notificaciones
  const processNotificationQueue = async () => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const notification = notificationQueueRef.current.shift()!;
    
    setScreenNotifications(prev => [...prev, { ...notification, isExiting: false }]);
    
    const duration = notification.tier === 'large' ? 5000 : notification.tier === 'medium' ? 4000 : 3000;
    
    setTimeout(() => {
      // Marcar como "saliendo" para aplicar animación
      setScreenNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isExiting: true } : n)
      );
      
      // Esperar que termine la animación antes de remover
      setTimeout(() => {
        setScreenNotifications(prev => prev.filter(n => n.id !== notification.id));
        isProcessingRef.current = false;
        
        if (notificationQueueRef.current.length > 0) {
          setTimeout(() => processNotificationQueue(), 500);
        }
      }, 800); // Duración de la animación pixel-dissolve
    }, duration);
  };

  const addScreenNotification = (notification: ScreenNotification) => {
    notificationQueueRef.current.push(notification);
    processNotificationQueue();
  };
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

  // Conectar Socket.io cuando inicia transmisión
  useEffect(() => {
    if (enVivo && channelName) {
      // Conectar Socket.io
      socketRef.current = io(BACKEND_URL);
      
      socketRef.current.on('connect', () => {
        console.log('✅ Socket.io conectado');
        socketRef.current?.emit('join-channel', channelName);
        
        // Enviar configuración inicial del chat
        socketRef.current?.emit('update-chat-config', {
          channelName,
          config: chatConfig
        });
        console.log('📤 Configuración inicial enviada:', chatConfig);
        
        // Si hay una meta activa, enviar su estado inicial
        if (metaActiva && metaActual > 0) {
          console.log('🎯 Enviando estado inicial de meta:', { metaActual, descripcionMeta, progresoMeta });
          socketRef.current?.emit('update-meta', {
            channelName,
            activa: metaActiva,
            monto: metaActual,
            descripcion: descripcionMeta,
            progreso: progresoMeta
          });
        }
      });

      // Escuchar nuevos mensajes
      socketRef.current.on('new-message', (message: ChatMessage) => {
        setChatMessages(prev => [...prev, message]);
      });

      // Escuchar nuevos regalos
      socketRef.current.on('new-gift', (gift: GiftMessage) => {
        setGiftMessages(prev => [...prev, gift]);
        
        // Actualizar progreso de meta
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + gift.gift.valor;
          
          // Emitir actualización de progreso a espectadores
          if (socketRef.current && channelName && metaActiva) {
            socketRef.current.emit('update-meta', {
              channelName,
              activa: metaActiva,
              monto: metaActual,
              descripcion: descripcionMeta,
              progreso: nuevoProgreso
            });
          }
          
          // Verificar si se alcanzó la meta
          if (nuevoProgreso >= metaActual && prev < metaActual && metaActiva) {
            setMetaAlcanzada(true);
            // Reproducir sonido de meta cumplida
            playSound('goal');
            // Ocultar la animación después de 5 segundos
            setTimeout(() => setMetaAlcanzada(false), 5000);
          }
          
          return nuevoProgreso;
        });
        
        // Actualizar ranking de donadores
        setTopDonadores(prev => {
          const donadorExistente = prev.find(d => d.user === gift.user);
          if (donadorExistente) {
            return prev
              .map(d => d.user === gift.user ? {...d, total: d.total + gift.gift.valor} : d)
              .sort((a, b) => b.total - a.total);
          } else {
            return [...prev, { user: gift.user, total: gift.gift.valor, avatar: gift.avatar }]
              .sort((a, b) => b.total - a.total)
              .slice(0, 10); // Top 10
          }
        });
        
        // Crear notificación en pantalla
        const screenNotif: ScreenNotification = {
          id: 'screen-' + gift.id,
          type: 'gift',
          user: gift.user,
          isVIP: gift.isVIP,
          content: gift.gift.emoji,
          title: gift.gift.nombre,
          valor: gift.gift.valor,
          tier: getTier(gift.gift.valor),
          timestamp: new Date(gift.timestamp)
        };
        addScreenNotification(screenNotif);
        
        // Reproducir sonido según el tier del regalo
        const tier = getTier(gift.gift.valor);
        playSound(tier);
      });

      // Escuchar reacciones (corazones, aplausos, etc.)
      socketRef.current.on('send-reaction', (reactionData: { reaction: string; username: string; timestamp: string }) => {
        console.log('❤️ Reacción recibida:', reactionData);
        
        // Crear corazón flotante cuando se recibe una reacción de corazón
        if (reactionData.reaction === '❤️') {
          const newHeart = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, // 10% a 90% del ancho
            delay: Math.random() * 0.5,
          };
          setFloatingHearts(prev => [...prev, newHeart]);

          // Remover después de la animación (3 segundos)
          setTimeout(() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
          }, 3000);
        }
      });

      // Escuchar propinas rápidas
      socketRef.current.on('new-tip', (tip: TipMessage) => {
        console.log('💵 Propina recibida:', tip);
        setTipMessages(prev => [...prev, tip]);
        
        // Actualizar progreso de meta (las propinas también cuentan)
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + tip.monto;
          
          // Emitir actualización de progreso a espectadores
          if (socketRef.current && channelName && metaActiva) {
            socketRef.current.emit('update-meta', {
              channelName,
              activa: metaActiva,
              monto: metaActual,
              descripcion: descripcionMeta,
              progreso: nuevoProgreso
            });
          }
          
          // Verificar si se alcanzó la meta
          if (nuevoProgreso >= metaActual && prev < metaActual && metaActiva) {
            setMetaAlcanzada(true);
            playSound('goal');
            setTimeout(() => setMetaAlcanzada(false), 5000);
          }
          
          return nuevoProgreso;
        });
        
        // Actualizar ranking de donadores (propinas también cuentan)
        setTopDonadores(prev => {
          const donadorExistente = prev.find(d => d.user === tip.user);
          if (donadorExistente) {
            return prev
              .map(d => d.user === tip.user ? {...d, total: d.total + tip.monto} : d)
              .sort((a, b) => b.total - a.total);
          } else {
            return [...prev, { user: tip.user, total: tip.monto, avatar: tip.avatar }]
              .sort((a, b) => b.total - a.total)
              .slice(0, 10);
          }
        });
        
        // Reproducir sonido suave para propinas
        playSound('small');
      });

      // Escuchar super chats
      socketRef.current.on('new-superchat', (superchat: SuperChatMessage) => {
        console.log('💬💰 Super Chat recibido:', superchat);
        setSuperChatMessages(prev => [...prev, superchat]);
        
        // Fijar el super chat en la parte superior
        const duration = superchat.tier === 'elite' ? 120000 : superchat.tier === 'premium' ? 60000 : 30000; // 2min, 1min, 30seg
        const expiresAt = new Date(Date.now() + duration);
        setPinnedSuperChat({ ...superchat, expiresAt });
        
        // Actualizar progreso de meta (super chats también cuentan)
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + superchat.monto;
          
          if (socketRef.current && channelName && metaActiva) {
            socketRef.current.emit('update-meta', {
              channelName,
              activa: metaActiva,
              monto: metaActual,
              descripcion: descripcionMeta,
              progreso: nuevoProgreso
            });
          }
          
          if (nuevoProgreso >= metaActual && prev < metaActual && metaActiva) {
            setMetaAlcanzada(true);
            playSound('goal');
            setTimeout(() => setMetaAlcanzada(false), 5000);
          }
          
          return nuevoProgreso;
        });
        
        // Actualizar ranking de donadores
        setTopDonadores(prev => {
          const donadorExistente = prev.find(d => d.user === superchat.user);
          if (donadorExistente) {
            return prev
              .map(d => d.user === superchat.user ? {...d, total: d.total + superchat.monto} : d)
              .sort((a, b) => b.total - a.total);
          } else {
            return [...prev, { user: superchat.user, total: superchat.monto, avatar: superchat.avatar }]
              .sort((a, b) => b.total - a.total)
              .slice(0, 10);
          }
        });
        
        // Reproducir sonido según tier
        playSound(superchat.tier === 'elite' ? 'large' : superchat.tier === 'premium' ? 'medium' : 'small');
        
        // Desfijar después del tiempo
        setTimeout(() => {
          setPinnedSuperChat(prev => prev?.id === superchat.id ? null : prev);
        }, duration);
      });

      // Escuchar resultados de ruleta
      socketRef.current.on('ruleta-resultado', (data: { usuario: string; premio: PremioRuleta }) => {
        console.log('🎰 Resultado de ruleta recibido:', data);
        
        // Crear notificación en pantalla para la creadora
        const notificacion = document.createElement('div');
        notificacion.className = 'fixed top-20 right-6 z-50 animate-fade-in-right';
        notificacion.innerHTML = `
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-purple-400 max-w-sm">
            <div class="flex items-center gap-3">
              <div class="text-4xl">${data.premio.icono}</div>
              <div>
                <div class="font-bold text-lg">¡Ruleta Girada! 🎉</div>
                <div class="text-sm opacity-90 mt-1">
                  <span class="font-semibold">${data.usuario}</span> ganó:<br/>
                  <span class="font-bold text-yellow-300">${data.premio.nombre}</span>
                </div>
                <div class="text-xs opacity-75 mt-1">${data.premio.descripcion}</div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(notificacion);
        
        // Reproducir sonido de celebración
        playSound('large');
        
        // Remover notificación después de 6 segundos
        setTimeout(() => {
          notificacion.remove();
        }, 6000);
      });

      return () => {
        socketRef.current?.disconnect();
        console.log('🔌 Socket.io desconectado');
      };
    }
  }, [enVivo, channelName]);

  // Sincronizar estado de meta periódicamente para nuevos espectadores
  useEffect(() => {
    if (!enVivo || !channelName || !socketRef.current || !metaActiva) return;

    const intervalo = setInterval(() => {
      if (socketRef.current && metaActiva && metaActual > 0) {
        console.log('🔄 Sincronizando meta periódicamente:', { progresoMeta, metaActual });
        socketRef.current.emit('update-meta', {
          channelName,
          activa: metaActiva,
          monto: metaActual,
          descripcion: descripcionMeta,
          progreso: progresoMeta
        });
      }
    }, 3000); // Cada 3 segundos

    return () => clearInterval(intervalo);
  }, [enVivo, channelName, metaActiva, metaActual, descripcionMeta, progresoMeta]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, giftMessages, tipMessages]);

  // Iniciar transmisión con Agora
  const iniciarTransmision = async () => {
    try {
      setCargando(true);
      setError(null);

      // Resetear progreso de meta al iniciar nueva transmisión (cada stream es independiente)
      setProgresoMeta(0);
      setTopDonadores([]);
      setMetaActiva(false);
      setMetaAlcanzada(false);

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
            width: 3840,
            height: 2160,
            frameRate: 30,
            bitrateMin: 15000,
            bitrateMax: 20000,
          }
        }
      );

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // 5. Reproducir video localmente con ajuste "contain" para evitar zoom
      videoTrack.play('local-player', { fit: 'contain' });

      // 6. Publicar tracks
      await client.publish([audioTrack, videoTrack]);

      setEnVivo(true);
      setChannelName(newChannelName);
      
      // Notificar al backend que el canal está activo con su tipo
      try {
        await fetch(`${BACKEND_URL}/api/canal/iniciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            channelName: newChannelName,
            tipoTransmision: tipoTransmisionSeleccionado,
            precioPPV: tipoTransmisionSeleccionado === 'ppv' ? precioPPV : undefined,
            descripcionPPV: tipoTransmisionSeleccionado === 'ppv' ? descripcionPPV : undefined
          })
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
      setChatMessages([]);
      setGiftMessages([]);
      setTipMessages([]);
      setSuperChatMessages([]);
      setPinnedSuperChat(null);
      
      // Resetear completamente la meta
      setMetaActual(0);
      setDescripcionMeta('');
      setProgresoMeta(0);
      setTopDonadores([]);
      setMetaActiva(false);
      setMetaAlcanzada(false);
      
      // Resetear ruleta
      setRuletaActiva(false);
      setCostoGiroRuleta(10);
      setShowRuletaModal(false);
      
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
    soloEmoticonos: true,
    soloMensajes: true,
    palabrasRestringidas: ['spam', 'prohibido']
  });

  // Emitir configuración del chat cuando cambie
  useEffect(() => {
    if (socketRef.current && enVivo && channelName) {
      socketRef.current.emit('update-chat-config', {
        channelName,
        config: chatConfig
      });
    }
  }, [chatConfig, enVivo, channelName]);

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
    setIsEventoProgramado(true); // Evento programado = hora editable
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

  // Funciones de Moderación
  const handleSilenciarUsuario = (username: string) => {
    if (!usuariosSilenciados.includes(username)) {
      setUsuariosSilenciados(prev => [...prev, username]);
      // Emitir evento al backend
      socketRef.current?.emit('silenciar-usuario', { channelName, username });
    }
  };

  const handleDesilenciarUsuario = (username: string) => {
    setUsuariosSilenciados(prev => prev.filter(u => u !== username));
    socketRef.current?.emit('desilenciar-usuario', { channelName, username });
  };

  // Funciones de Ruleta
  const handleActivarRuleta = (costoGiro: number, premios: PremioRuleta[]) => {
    setCostoGiroRuleta(costoGiro);
    setRuletaActiva(true);
    setShowRuletaModal(false);
    
    // TODO: BACKEND C# - Guardar configuración de ruleta
    // await fetch(`${BACKEND_URL}/api/ruleta/configurar`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ channelName, costoGiro, premios, activa: true })
    // });
    
    // Emitir evento Socket.io para notificar espectadores
    socketRef.current?.emit('ruleta-activada', {
      channelName,
      costoGiro,
      premios
    });
  };

  const handleDesactivarRuleta = () => {
    setRuletaActiva(false);
    // NO cerrar el modal, mantenerlo abierto para editar
    // setShowRuletaModal(false); <- REMOVIDO
    
    // Mostrar mensaje de desactivación
    const mensajeDesactivado = document.createElement('div');
    mensajeDesactivado.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down';
    mensajeDesactivado.innerHTML = `
      <div class="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-orange-400">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="font-semibold">¡Ruleta desactivada! Puedes editar los premios 📝</span>
      </div>
    `;
    document.body.appendChild(mensajeDesactivado);
    
    setTimeout(() => {
      mensajeDesactivado.remove();
    }, 3000);
    
    // TODO: BACKEND C# - Desactivar ruleta
    // await fetch(`${BACKEND_URL}/api/ruleta/configurar`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ channelName, activa: false })
    // });
    
    socketRef.current?.emit('ruleta-desactivada', { channelName });
  };

  // Funciones de Meta
  const handleGuardarMeta = (nuevaMeta: number, descripcion: string) => {
    if (nuevaMeta > 0) {
      setMetaActual(nuevaMeta);
      setDescripcionMeta(descripcion);
      setProgresoMeta(0);
      setTopDonadores([]);
      setMetaActiva(true); // Activar automáticamente al guardar
      setMetaAlcanzada(false);
      setShowMetaModal(false);
      
      // Emitir actualización de meta a todos los espectadores
      if (socketRef.current && channelName) {
        console.log('🎯 Enviando meta a espectadores:', { channelName, monto: nuevaMeta, descripcion });
        socketRef.current.emit('update-meta', {
          channelName,
          activa: true,
          monto: nuevaMeta,
          descripcion: descripcion,
          progreso: 0
        });
      }
    }
  };

  const handleToggleMeta = () => {
    if (!metaActiva && metaActual === 0) {
      // Si no hay meta configurada, abrir modal
      setShowMetaModal(true);
    } else {
      // Activar/Desactivar meta existente
      const nuevoEstado = !metaActiva;
      setMetaActiva(nuevoEstado);
      
      // Emitir cambio de estado a espectadores
      if (socketRef.current && channelName) {
        socketRef.current.emit('update-meta', {
          channelName,
          activa: nuevoEstado,
          monto: metaActual,
          descripcion: descripcionMeta,
          progreso: progresoMeta
        });
      }
    }
  };

  const porcentajeMeta = Math.min((progresoMeta / metaActual) * 100, 100);

  // Verificador automático de eventos programados
  useEffect(() => {
    const checkScheduledEvents = () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      // Buscar eventos que coincidan con fecha y hora actual
      const matchingEvent = eventos.find(evento => {
        const eventoDate = new Date(evento.fecha).toISOString().split('T')[0];
        return eventoDate === currentDate && evento.hora === currentTime;
      });

      // Si hay un evento programado que llegó a su hora, habilitar el botón de transmisión
      if (matchingEvent && !enVivo) {
        console.log('🎬 Evento programado listo:', matchingEvent);
        // Puedes agregar una notificación visual aquí si lo deseas
        // setShowNotification({ type: 'info', message: `¡Es hora de: ${matchingEvent.titulo}!` });
      }
    };

    // Verificar cada minuto (60000 ms)
    const intervalId = setInterval(checkScheduledEvents, 60000);
    
    // Verificar inmediatamente al montar
    checkScheduledEvents();

    return () => clearInterval(intervalId);
  }, [eventos, enVivo]);

  const handleEnviarMensaje = () => {
    if (!mensajeChat.trim() || !socketRef.current) return;
    
    // Enviar mensaje vía Socket.io
    socketRef.current.emit('chat-message', {
      channelName,
      user: 'María (Creadora)',
      mensaje: mensajeChat,
      isVIP: true, // La creadora siempre es VIP
      avatar: '👑'
    });
    
    setMensajeChat('');
  };

  const handleEnviarEmoticon = (emoticon: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('chat-message', {
      channelName,
      user: 'María (Creadora)',
      mensaje: emoticon,
      isVIP: true,
      avatar: '👑'
    });
  };

  const hayEventos = eventos.length > 0;

  return (
    <div className="space-y-4">
      {/* Header compacto */}
      
 
      {/* Stats COMPACTOS - Juntos y pequeños */}
      <div className="flex items-center gap-6 px-4 py-2">
        <div>
          <p className="text-base font-bold text-gray-900">{(stats.seguidores / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-600">Seguidores</p>
        </div>

        <div>
          <p className="text-base font-bold text-gray-900">{(stats.suscriptores / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-600">Suscriptores</p>
        </div>

        <div>
          <p className="text-base font-bold text-gray-900">{(stats.publico / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-600">Público</p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <p className="text-base font-bold text-orange-600">{totalCoins.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Recompensas</p>
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

        {/* Video Preview con Agora - Tamaño completo */}
        <div id="video-container-transmision" className="relative bg-black rounded-2xl overflow-hidden mb-4 h-[600px]">
          <div id="local-player" className="w-full h-full" />
          
          {/* Corazones flotantes desde espectadores */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {floatingHearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute bottom-0 text-4xl animate-float-up"
                style={{
                  left: `${heart.x}%`,
                  animationDelay: `${heart.delay}s`,
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* Super Chat Flotante sobre el video */}
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
          
          {/* Barra de Progreso de Meta - SOLO VISIBLE CUANDO ESTÁ ACTIVA */}
          {enVivo && metaActiva && metaActual > 0 && (
            <div className="absolute bottom-4 left-4 right-4 z-30">
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="text-white text-sm font-bold">{descripcionMeta || 'Meta del Stream'}</p>
                      <p className="text-white/60 text-xs">{progresoMeta} / {metaActual} coins</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMetaModal(true)}
                    className="text-white/60 hover:text-white text-xs underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="relative w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 rounded-full"
                    style={{ width: `${porcentajeMeta}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                      {porcentajeMeta.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animación de Meta Alcanzada */}
          {metaAlcanzada && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-pulse">
              <div className="text-center px-8">
                <div className="text-8xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-white text-4xl font-bold mb-2">¡META ALCANZADA!</h2>
                {descripcionMeta && (
                  <p className="text-purple-300 text-2xl font-semibold mb-2">"{descripcionMeta}"</p>
                )}
                <p className="text-white/80 text-xl">¡Increíble trabajo! {metaActual} coins recaudados 💰</p>
              </div>
            </div>
          )}
          
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
              {/* Barra de Herramientas Superior */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
                <div className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 border border-white/10 shadow-lg">
                  {/* Botón Meta */}
                  <button 
                    onClick={handleToggleMeta}
                    className={`p-2 rounded-full transition-all ${
                      metaActiva 
                        ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={metaActiva ? 'Desactivar Meta' : 'Activar Meta'}
                  >
                    <span className="text-lg">{metaActiva ? '🎯' : '⭕'}</span>
                  </button>
                  
                  {/* Botón Moderación */}
                  <button 
                    onClick={() => setShowModeracionModal(true)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    title="Moderación"
                  >
                    <span className="text-lg">🛡️</span>
                  </button>
                  
                  {/* Botón Ruleta */}
                  <button 
                    onClick={() => setShowRuletaModal(true)}
                    className={`p-2 rounded-full transition-all ${
                      ruletaActiva 
                        ? 'bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-500/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={ruletaActiva ? 'Ruleta Activa' : 'Activar Ruleta'}
                  >
                    <Sparkles className={`w-5 h-5 ${ruletaActiva ? 'text-white' : 'text-yellow-400'}`} />
                  </button>
                  
                  {/* Divisor */}
                  <div className="w-px h-6 bg-white/20" />
                  
                  {/* EN VIVO Badge */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-bold">EN VIVO</span>
                  </div>
                  
                  {/* Espectadores */}
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-white/80" />
                    <span className="text-white text-sm font-bold">{espectadoresEnVivo}</span>
                  </div>
                </div>
              </div>
              
              {/* Botón Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition z-40"
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
            onClick={enVivo ? detenerTransmision : () => setShowTipoTransmisionModal(true)}
            disabled={cargando || !!error}
            className={`px-5 py-2 rounded-lg font-bold text-sm text-white flex items-center gap-2 transition shadow-lg ${
              cargando || error
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

      {/* Menú flotante - Premium */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <button
          onClick={() => {
            setShowChat(!showChat);
            if (showConfig) setShowConfig(false);
          }}
          className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute right-16 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Chat
          </span>
        </button>

        <button
          onClick={() => {
            setShowConfig(!showConfig);
            if (showChat) setShowChat(false);
          }}
          className="group relative w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Settings className="w-5 h-5 text-white" />
          <span className="absolute right-16 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Configuración
          </span>
        </button>
      </div>

      {/* Overlay de notificaciones en pantalla */}
      {screenNotifications.map((notif) => (
        <div key={notif.id} className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center pt-20">
          {notif.tier === 'large' && (
            <div className={notif.isExiting ? 'animate-pixel-dissolve' : 'animate-elegant-entrance'}>
              <div className="bg-gradient-to-r from-yellow-400/95 via-orange-500/95 to-pink-500/95 rounded-2xl p-5 shadow-2xl border-2 border-white/40 backdrop-blur-lg relative overflow-hidden max-w-md animate-soft-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/10 via-orange-300/10 to-pink-300/10 animate-pulse" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="text-5xl animate-bounce">{notif.content}</div>
                  <div className="text-left flex-1">
                    <p className="text-white text-lg font-bold mb-1">{notif.user}</p>
                    <p className="text-white text-2xl font-extrabold mb-1">{notif.title}</p>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 w-fit">
                      <DollarSign className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-bold">{notif.valor} coins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notif.tier === 'medium' && (
            <div className={notif.isExiting ? 'animate-pixel-dissolve' : 'animate-elegant-entrance'}>
              <div className="bg-gradient-to-r from-purple-500/95 via-pink-500/95 to-red-500/95 rounded-xl p-4 shadow-xl border-2 border-white/30 backdrop-blur-lg max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{notif.content}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">{notif.user}</p>
                    <p className="text-white text-xl font-extrabold">{notif.title}</p>
                    <div className="flex items-center gap-1 text-yellow-300 mt-0.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">{notif.valor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notif.tier === 'small' && (
            <div className={notif.isExiting ? 'animate-pixel-dissolve' : 'animate-elegant-entrance'}>
              <div className="bg-gradient-to-r from-pink-400/90 to-purple-400/90 rounded-lg p-3 shadow-lg border border-white/20 backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{notif.content}</span>
                  <div className="flex-1">
                    <p className="text-white text-xs font-semibold">{notif.user}</p>
                    <p className="text-white text-sm font-bold">{notif.title}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-yellow-200">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-xs font-bold">{notif.valor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Chat - PREMIUM CON REGALOS */}
      {showChat && (
        <div className="fixed right-16 top-16 bottom-20 w-96 bg-white shadow-2xl z-50 flex flex-col rounded-l-3xl border border-gray-200">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0 rounded-tl-3xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Chat & Regalos</h3>
              <div className="px-2 py-0.5 bg-white/20 rounded-full">
                <span className="text-xs text-white font-bold">{chatMessages.length + giftMessages.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Donadores - Colapsable */}
          {topDonadores.length > 0 && (
            <div className="border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowTopDonadores(!showTopDonadores)}
                className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 px-4 py-2 flex items-center justify-between transition"
              >
                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <span>👑</span> Top Donadores ({topDonadores.length})
                </h4>
                <span className="text-xs text-gray-500">
                  {showTopDonadores ? '▲' : '▼'}
                </span>
              </button>
              
              {showTopDonadores && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 px-4 pb-3 space-y-1">
                  {topDonadores.slice(0, 3).map((donador, index) => (
                    <div key={donador.user} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`
                          ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'}
                          font-bold
                        `}>
                          #{index + 1}
                        </span>
                        <span className="text-gray-700 font-medium">{donador.user}</span>
                      </div>
                      <span className="text-green-600 font-bold">{donador.total} 💎</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Super Chat Fijado en el Chat */}
          {pinnedSuperChat && (
            <div className="border-b border-gray-300 bg-white flex-shrink-0 shadow-lg">
              <div className={`p-3 bg-gradient-to-r ${
                pinnedSuperChat.tier === 'elite' 
                  ? 'from-yellow-500/30 via-orange-500/30 to-pink-500/30' 
                  : pinnedSuperChat.tier === 'premium'
                  ? 'from-purple-600/30 to-indigo-600/30'
                  : 'from-blue-600/30 to-cyan-600/30'
              } border-l-4 ${
                pinnedSuperChat.tier === 'elite' 
                  ? 'border-yellow-500' 
                  : pinnedSuperChat.tier === 'premium'
                  ? 'border-purple-600'
                  : 'border-blue-600'
              }`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-bold text-gray-700">📌 Super Chat Fijado</span>
                  <span className="ml-auto text-[10px] text-gray-500">
                    {pinnedSuperChat.tier === 'basic' ? '30s' : pinnedSuperChat.tier === 'premium' ? '60s' : '120s'}
                  </span>
                  <button
                    onClick={() => setPinnedSuperChat(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-white font-bold">{pinnedSuperChat.avatar || '⭐'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-sm font-bold text-gray-900">{pinnedSuperChat.user}</p>
                      {pinnedSuperChat.isVIP && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                      <div className={`ml-auto flex items-center gap-0.5 ${
                        pinnedSuperChat.tier === 'elite' 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : pinnedSuperChat.tier === 'premium'
                          ? 'bg-purple-500'
                          : 'bg-blue-500'
                      } rounded-lg px-2 py-0.5`}>
                        <DollarSign className="w-3 h-3 text-white" />
                        <span className="text-xs text-white font-bold">{pinnedSuperChat.monto}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 break-words leading-snug">{pinnedSuperChat.mensaje}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {/* Combinar mensajes, regalos, propinas y super chats ordenados por timestamp */}
            {[...chatMessages, ...giftMessages, ...tipMessages, ...superChatMessages]
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((item) => {
                // Es un Super Chat
                if ('tier' in item && 'monto' in item) {
                  const superChat = item as SuperChatMessage;
                  const tierConfig = {
                    basic: { gradient: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-700', badge: 'bg-blue-500' },
                    premium: { gradient: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/50', text: 'text-purple-700', badge: 'bg-purple-500' },
                    elite: { gradient: 'from-yellow-500/20 to-orange-600/20', border: 'border-yellow-500/50', text: 'text-yellow-700', badge: 'bg-gradient-to-r from-yellow-500 to-orange-500' }
                  };
                  const config = tierConfig[superChat.tier];
                  
                  return (
                    <div key={superChat.id} className={`bg-gradient-to-r ${config.gradient} border ${config.border} rounded-lg p-3 shadow-lg`}>
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-white font-bold">{superChat.avatar || '⭐'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <p className={`text-sm font-bold ${config.text}`}>{superChat.user}</p>
                            {superChat.isVIP && <Crown className="w-4 h-4 text-yellow-400" />}
                            <div className={`ml-auto flex items-center gap-1 ${config.badge} rounded-lg px-2 py-1`}>
                              <DollarSign className="w-3 h-3 text-white" />
                              <p className="text-xs text-white font-bold">{superChat.monto}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{superChat.mensaje}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Super Chat • {superChat.tier === 'basic' ? '30s' : superChat.tier === 'premium' ? '60s' : '120s'} destacado</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Es un regalo
                if ('gift' in item) {
                  const gift = item as GiftMessage;
                  return (
                    <div key={gift.id} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-3 animate-pulse">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{gift.avatar || '🎁'}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-yellow-300">{gift.user}</p>
                            {gift.isVIP && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <p className="text-[10px] text-gray-400">envió un regalo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2">
                        <span className="text-3xl">{gift.gift.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{gift.gift.nombre}</p>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <p className="text-xs text-green-400 font-bold">{gift.gift.valor} coins</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Es una propina
                if ('monto' in item && !('gift' in item)) {
                  const tip = item as TipMessage;
                  return (
                    <div key={tip.id} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tip.avatar || '💵'}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-green-700">{tip.user}</p>
                            {tip.isVIP && <Crown className="w-3 h-3 text-yellow-500" />}
                          </div>
                          <p className="text-[10px] text-gray-500">envió una propina</p>
                        </div>
                        <div className="flex items-center gap-0.5 bg-green-500 rounded-lg px-2 py-1">
                          <DollarSign className="w-3 h-3 text-white" />
                          <p className="text-xs text-white font-bold">{tip.monto}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Es un mensaje
                const msg = item as ChatMessage;
                const estaSilenciado = usuariosSilenciados.includes(msg.user);
                return (
                  <div key={msg.id} className="flex items-start gap-2 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isVIP 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      <span className="text-sm text-white font-semibold">{msg.avatar || msg.user[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <p className={`text-xs font-bold ${msg.isVIP ? 'text-orange-600' : 'text-purple-600'}`}>
                          {msg.user}
                        </p>
                        {msg.isVIP && <Crown className="w-3 h-3 text-yellow-500" />}
                        {estaSilenciado && <span className="text-[10px] text-red-500">🔇</span>}
                      </div>
                      <div className={`rounded-xl px-3 py-2 ${
                        msg.isVIP 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300' 
                          : 'bg-white border border-gray-300 shadow-sm'
                      }`}>
                        <p className="text-sm text-gray-800 break-words">{msg.mensaje}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => estaSilenciado ? handleDesilenciarUsuario(msg.user) : handleSilenciarUsuario(msg.user)}
                      className="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600"
                      title={estaSilenciado ? 'Desilenciar' : 'Silenciar'}
                    >
                      {estaSilenciado ? '🔊' : '🔇'}
                    </button>
                  </div>
                );
              })}
            <div ref={chatEndRef} />
          </div>

          {/* Emoticones - SIEMPRE VISIBLE PARA CREADORA */}
          <div className="px-3 py-2 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {emoticones.map((emoticon, index) => (
                <button 
                  key={index} 
                  onClick={() => handleEnviarEmoticon(emoticon)} 
                  className="text-xl hover:scale-125 transition hover:bg-gray-100 rounded-lg p-1"
                >
                  {emoticon}
                </button>
              ))}
            </div>
          </div>

          {/* Input de mensajes - SIEMPRE VISIBLE PARA CREADORA */}
          <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0 rounded-bl-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={mensajeChat}
                onChange={(e) => setMensajeChat(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-100 text-gray-900 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-300 placeholder-gray-400"
              />
              <button onClick={handleEnviarMensaje} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition shadow-lg hover:scale-105">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config */}
      {showConfig && (
      /* Panel de Configuración - Versión Profesional */
      <div className="fixed right-20 top-20 bottom-20 w-80 bg-white shadow-lg z-50 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
        {/* Header - Sin gradiente */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">Configuración de Chat</h3>
          <button 
            onClick={() => setShowConfig(false)} 
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50">
          {/* Quién puede chatear */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2.5">Quién puede chatear</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition">
                <span className="text-gray-700 font-medium">Público</span>
                <input 
                  type="checkbox" 
                  checked={chatConfig.publicoPuedeChatear} 
                  onChange={(e) => setChatConfig({...chatConfig, publicoPuedeChatear: e.target.checked})} 
                  className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900"
                />
              </label>
              <label className="flex items-center justify-between text-xs p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition">
                <span className="text-gray-700 font-medium">Suscriptores</span>
                <input 
                  type="checkbox" 
                  checked={chatConfig.suscriptoresPuedeChatear} 
                  onChange={(e) => setChatConfig({...chatConfig, suscriptoresPuedeChatear: e.target.checked})} 
                  className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900"
                />
              </label>
            </div>
          </div>

          {/* Tipo de mensajes */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2.5">Tipo de mensajes</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition">
                <span className="text-gray-700 font-medium">Solo emoticones</span>
                <input 
                  type="checkbox" 
                  checked={chatConfig.soloEmoticonos} 
                  onChange={(e) => setChatConfig({...chatConfig, soloEmoticonos: e.target.checked})} 
                  className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900"
                />
              </label>
              <label className="flex items-center justify-between text-xs p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition">
                <span className="text-gray-700 font-medium">Solo mensajes</span>
                <input 
                  type="checkbox" 
                  checked={chatConfig.soloMensajes} 
                  onChange={(e) => setChatConfig({...chatConfig, soloMensajes: e.target.checked})} 
                  className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-2 focus:ring-gray-900"
                />
              </label>
            </div>
          </div>

          {/* Palabras restringidas */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2.5">Palabras restringidas</p>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={nuevaPalabraRestringida} 
                onChange={(e) => setNuevaPalabraRestringida(e.target.value)} 
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && nuevaPalabraRestringida.trim()) {
                    setChatConfig({...chatConfig, palabrasRestringidas: [...chatConfig.palabrasRestringidas, nuevaPalabraRestringida]});
                    setNuevaPalabraRestringida('');
                  }
                }}
                placeholder="Agregar palabra..." 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (nuevaPalabraRestringida.trim()) {
                    setChatConfig({...chatConfig, palabrasRestringidas: [...chatConfig.palabrasRestringidas, nuevaPalabraRestringida]});
                    setNuevaPalabraRestringida('');
                  }
                }}
                className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs transition flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Lista de palabras */}
            {chatConfig.palabrasRestringidas.length > 0 ? (
              <div className="space-y-1.5">
                {chatConfig.palabrasRestringidas.map((palabra, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-white p-2.5 rounded-lg text-xs border border-gray-200"
                  >
                    <span className="text-gray-700 font-medium">{palabra}</span>
                    <button 
                      onClick={() => setChatConfig({
                        ...chatConfig, 
                        palabrasRestringidas: chatConfig.palabrasRestringidas.filter((_, i) => i !== index)
                      })} 
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-4 bg-white rounded-lg border border-gray-200 border-dashed">
                No hay palabras restringidas
              </div>
            )}
          </div>
        </div>

        {/* Footer con estadísticas (opcional) */}
        <div className="px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center">
            {chatConfig.palabrasRestringidas.length} palabra{chatConfig.palabrasRestringidas.length !== 1 ? 's' : ''} restringida{chatConfig.palabrasRestringidas.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      )}

      {/* Modal Recompensas CON TABLA DETALLADA */}
      {showRecompensasModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[75vh] overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-500" />
                Recompensas Recibidas
              </h2>
              <button onClick={() => setShowRecompensasModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(75vh-120px)]">
              {/* Total */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3.5 mb-3.5 border border-orange-200">
                <p className="text-xs text-orange-700 font-medium">Total Acumulado</p>
                <p className="text-2xl font-bold text-orange-900">{totalCoins.toLocaleString()} <span className="text-sm">coins</span></p>
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

  {/* Modal Calendario - 12 Meses - Premium */}
      {showCalendarioModal && !showMonthCalendar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Programar Eventos</h2>
              <button onClick={() => setShowCalendarioModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
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

      {/* Modal Calendario Mensual - Vista Split */}
      {showMonthCalendar && selectedMonth !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
                  className="p-1.5 hover:bg-purple-100 rounded-lg transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <h2 className="text-base font-bold text-gray-900">{meses[selectedMonth]} 2026</h2>
                <button 
                  onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
                  className="p-1.5 hover:bg-purple-100 rounded-lg transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <button onClick={() => {
                setShowMonthCalendar(false);
                setSelectedDay(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Split */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Panel Izquierdo: Calendario Mini */}
              <div className="w-[55%] border-r border-gray-200 p-4 flex-shrink-0">
                <div className="grid grid-cols-7 gap-1.5">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
                    <div key={day} className="text-center font-bold text-gray-600 text-xs py-1.5">
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
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (!isPast) {
                            setSelectedDay(day);
                          }
                        }}
                        disabled={isPast}
                        className={`aspect-square p-2 rounded-lg text-sm font-medium transition relative ${
                          isPast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                            : eventosDelDia.length > 0
                            ? 'bg-green-100 border-2 border-green-400 text-green-900 hover:bg-green-200'
                            : 'bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        {day}
                        {eventosDelDia.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-[10px] text-white font-bold">{eventosDelDia.length}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel Derecho: Eventos del día seleccionado */}
              <div className="w-[45%] flex flex-col bg-gray-50">
                {selectedDay === null ? (
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div className="space-y-3">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                      <p className="text-sm text-gray-500 font-medium">Selecciona un día del calendario</p>
                      <p className="text-xs text-gray-400">Haz clic en un día para ver o crear eventos</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header del día con botón al costado */}
                    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900">
                          {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][
                            new Date(2026, selectedMonth, selectedDay).getDay()
                          ]} {selectedDay}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getEventosForDay(selectedDay, selectedMonth, 2026).length} evento(s) programado(s)
                        </p>
                      </div>
                      <button
                        onClick={() => handleDayClick(selectedDay)}
                        className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nuevo
                      </button>
                    </div>

                    {/* Lista de eventos con scroll */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0">
                      {getEventosForDay(selectedDay, selectedMonth, 2026).length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-xs text-gray-400">No hay eventos programados para este día</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {getEventosForDay(selectedDay, selectedMonth, 2026).map(evento => (
                            <div key={evento.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">{evento.titulo}</p>
                                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {evento.hora}
                                  </p>
                                  {evento.actividad && (
                                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{evento.actividad}</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleEliminarEvento(evento.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                {evento.tipo === 'pagado' ? (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                    S/. {evento.precio}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    Gratis
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Evento */}
      {showCrearEventoModal && selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Crear Evento</h2>
              <button onClick={() => setShowCrearEventoModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha</label>
                <p className="text-sm text-gray-900 font-medium">{selectedDate.toLocaleDateString('es-ES')}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isEventoProgramado ? 'Hora Programada' : 'Hora (Actual - Bloqueada)'}
                </label>
                <input
                  type="time"
                  value={nuevoEvento.hora}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                  readOnly={!isEventoProgramado}
                  disabled={!isEventoProgramado}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    isEventoProgramado 
                      ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isEventoProgramado 
                    ? 'Elige la hora para tu transmisión programada' 
                    : 'Se usa la hora actual automáticamente'}
                </p>
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
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                  !nuevoEvento.titulo.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurar Meta */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🎯</span> {metaActual > 0 ? 'Editar Meta' : 'Crear Meta'}
              </h3>
              <button onClick={() => setShowMetaModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Información */}
              <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg">
                <p className="text-xs text-purple-900 leading-snug">
                  💡 Las metas con descripciones reciben más apoyo
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción de la Meta ✨ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={descripcionMeta}
                  onChange={(e) => setDescripcionMeta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Ej: Nueva cámara 4K"
                  maxLength={50}
                  required
                />
                <p className="text-xs text-gray-500 mt-0.5">Máx. 50 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Meta de Coins 💰 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={metaActual || ''}
                  onChange={(e) => setMetaActual(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
                  placeholder="500"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-0.5">Coins a recaudar</p>
              </div>

              {metaActual > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-600">
                    <strong>Progreso actual:</strong> {progresoMeta} / {metaActual} coins
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${porcentajeMeta}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">{porcentajeMeta.toFixed(0)}% completado</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleGuardarMeta(metaActual, descripcionMeta)}
                  disabled={!metaActual || metaActual <= 0 || !descripcionMeta.trim()}
                  className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition shadow-sm ${
                    metaActual > 0 && descripcionMeta.trim()
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {metaActiva ? 'Actualizar' : 'Activar'}
                </button>
                <button
                  onClick={() => setShowMetaModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Moderación */}
      {showModeracionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>🛡️</span> Moderación
              </h3>
              <button onClick={() => setShowModeracionModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Usuarios Silenciados */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">Usuarios Silenciados</h4>
                
                {/* Input para agregar usuario */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={nuevoUsuarioSilenciar}
                    onChange={(e) => setNuevoUsuarioSilenciar(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && nuevoUsuarioSilenciar.trim()) {
                        handleSilenciarUsuario(nuevoUsuarioSilenciar.trim());
                        setNuevoUsuarioSilenciar('');
                      }
                    }}
                    placeholder="Nombre de usuario..."
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={() => {
                      if (nuevoUsuarioSilenciar.trim()) {
                        handleSilenciarUsuario(nuevoUsuarioSilenciar.trim());
                        setNuevoUsuarioSilenciar('');
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded-lg transition shadow-sm"
                  >
                    🔇
                  </button>
                </div>

                {usuariosSilenciados.length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic">No hay usuarios silenciados</p>
                ) : (
                  <div className="space-y-1.5">
                    {usuariosSilenciados.map(user => (
                      <div key={user} className="flex items-center justify-between bg-gray-50 p-1.5 rounded-lg">
                        <span className="text-xs text-gray-700">{user}</span>
                        <button
                          onClick={() => handleDesilenciarUsuario(user)}
                          className="text-[10px] bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition"
                        >
                          Desilenciar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowModeracionModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-1.5 rounded-lg text-xs font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Tipo de Transmisión */}
      {showTipoTransmisionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4">
            <div className="mb-3">
              <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Radio className="w-4 h-4 text-pink-500" />
                Tipo de Transmisión
              </h3>
              <p className="text-xs text-gray-600">Selecciona el tipo de acceso para tu transmisión</p>
            </div>

            <div className="space-y-2 mb-4">
              {/* Opción Gratis */}
              <button
                onClick={() => setTipoTransmisionSeleccionado('gratis')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  tipoTransmisionSeleccionado === 'gratis'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoTransmisionSeleccionado === 'gratis'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {tipoTransmisionSeleccionado === 'gratis' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-lg">🌍</span>
                      <h4 className="text-sm font-bold text-gray-900">Público (Gratis)</h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      Cualquiera puede ver sin costo
                    </p>
                  </div>
                </div>
              </button>

              {/* Opción Solo Suscriptores */}
              <button
                onClick={() => setTipoTransmisionSeleccionado('suscriptores')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  tipoTransmisionSeleccionado === 'suscriptores'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoTransmisionSeleccionado === 'suscriptores'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {tipoTransmisionSeleccionado === 'suscriptores' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-bold text-gray-900">Solo Suscriptores</h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      Requiere suscripción mensual activa (S/.20-150/mes)
                    </p>
                  </div>
                </div>
              </button>

              {/* Opción PPV */}
              <button
                onClick={() => setTipoTransmisionSeleccionado('ppv')}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  tipoTransmisionSeleccionado === 'ppv'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    tipoTransmisionSeleccionado === 'ppv'
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-gray-300'
                  }`}>
                    {tipoTransmisionSeleccionado === 'ppv' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-lg">🎫</span>
                      <h4 className="text-sm font-bold text-gray-900">Pago por Entrada (PPV)</h4>
                    </div>
                    <p className="text-xs text-gray-600">
                      Cobro único para acceder a este live
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Formulario PPV */}
            {tipoTransmisionSeleccionado === 'ppv' && (
              <div className="space-y-2 mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Precio de Entrada (S/.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={precioPPV || ''}
                    onChange={(e) => setPrecioPPV(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="15"
                    min="1"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">💡 Sugerido: S/.10-30 para lives especiales</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Descripción del Live <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descripcionPPV}
                    onChange={(e) => setDescripcionPPV(e.target.value.slice(0, 100))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ej: Live especial de año nuevo con show exclusivo..."
                    rows={2}
                    maxLength={100}
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">{descripcionPPV.length}/100 caracteres</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTipoTransmisionModal(false);
                  setPrecioPPV(0);
                  setDescripcionPPV('');
                }}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowTipoTransmisionModal(false);
                  iniciarTransmision();
                }}
                disabled={tipoTransmisionSeleccionado === 'ppv' && (!precioPPV || precioPPV < 1 || !descripcionPPV.trim())}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition shadow-lg ${
                  tipoTransmisionSeleccionado === 'ppv' && (!precioPPV || precioPPV < 1 || !descripcionPPV.trim())
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                }`}
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ruleta */}
      <RuletaModal
        isOpen={showRuletaModal}
        onClose={() => setShowRuletaModal(false)}
        isCreadora={true}
        channelName={channelName}
        onActivarRuleta={handleActivarRuleta}
        onDesactivarRuleta={handleDesactivarRuleta}
        ruletaActiva={ruletaActiva}
      />
    </div>
  );
};
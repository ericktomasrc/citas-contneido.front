// src/components/Transmision/FloatingTransmisionWindow.tsx
import { useState, useRef, useEffect } from 'react';
import { 
  X, Minus, Square, Maximize2, Users, Radio, Settings, 
  MessageCircle, ChevronDown, ChevronUp, Mic, MicOff, 
  Video as VideoIcon, VideoOff, Send, Crown, Copy, Check, Sparkles,
  DollarSign, Trash2, Plus,
  AlertCircle
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useTransmision } from '../../contexts/TransmisionContext';
import { useAgoraTransmision } from '../../hooks/useAgoraTransmision';
import { useTransmisionChat } from '../../hooks/useTransmisionChat';
// import { ChatConfigModal } from './ChatConfigModal'; // Ya no se usa - ahora es dropdown integrado
import { ToastConfirmation } from '../Modals/ToastConfirmation';
import { ConfirmacionModal } from '../Common/ConfirmacionModal';
import RuletaModal from '../Dashboard/CreatorProfile/LiveStream/RuletaModal';
import { PremioRuleta } from '@/shared/types/ruleta.types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
  content: string;
  title: string;
  valor?: number;
  tier: 'small' | 'medium' | 'large' | 'mega';
  timestamp: Date;
  isExiting?: boolean;
}

export const FloatingTransmisionWindow = () => {
  const { 
    isTransmisionActive, 
    windowState, 
    tipoTransmision,
    precioPPV,
    descripcionPPV,
    closeTransmision, 
    minimizeWindow, 
    maximizeWindow, 
    restoreWindow 
  } = useTransmision();
  
  const {
    enVivo,
    cargando,
    error,
    channelName,
    micMuted,
    cameraOff,
    iniciarTransmision,
    detenerTransmision,
    toggleMic,
    toggleCamera
  } = useAgoraTransmision();

  const {
    chatMessages,
    chatConfig,
    setChatConfig,
    enviarMensaje
  } = useTransmisionChat(channelName, enVivo);
  
  // Window state
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [size, setSize] = useState({ width: 1200, height: 750 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [statsCollapsed, setStatsCollapsed] = useState(false);
  
  // Chat & Config
  const [showChatConfig, setShowChatConfig] = useState(false);
  const [inputMensaje, setInputMensaje] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  
  // Socket.io - Estados de chat extendidos
  const socketRef = useRef<Socket | null>(null);
  const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
  const [tipMessages, setTipMessages] = useState<TipMessage[]>([]);
  const [superChatMessages, setSuperChatMessages] = useState<SuperChatMessage[]>([]);
  const [pinnedSuperChat, setPinnedSuperChat] = useState<SuperChatMessage | null>(null);
  
  // Notificaciones en pantalla
  const [screenNotifications, setScreenNotifications] = useState<ScreenNotification[]>([]);
  const notificationQueueRef = useRef<ScreenNotification[]>([]);
  const isProcessingRef = useRef(false);
  
  // Corazones flotantes
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  
  // Sistema de Metas
  const [metaActiva, setMetaActiva] = useState(false);
  const [metaActual, setMetaActual] = useState(0);
  const [descripcionMeta, setDescripcionMeta] = useState('');
  const [progresoMeta, setProgresoMeta] = useState(0);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaAlcanzada, setMetaAlcanzada] = useState(false);
  const [topDonadores, setTopDonadores] = useState<{user: string, total: number, avatar?: string}[]>([]);
  const [showTopDonadores, setShowTopDonadores] = useState(false);
  
  // Sistema de Moderación
  const [usuariosSilenciados, setUsuariosSilenciados] = useState<string[]>([]);
  const [showModeracionModal, setShowModeracionModal] = useState(false);
  const [nuevoUsuarioSilenciar, setNuevoUsuarioSilenciar] = useState('');
  
  // Sistema de Ruleta
  const [showRuletaModal, setShowRuletaModal] = useState(false);
  const [ruletaActiva, setRuletaActiva] = useState(false);
  const [costoGiroRuleta, setCostoGiroRuleta] = useState(10);
  const [premiosRuleta, setPremiosRuleta] = useState<PremioRuleta[]>([]);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [espectadoresEnVivo, setEspectadoresEnVivo] = useState(0);
const [tiempoSinEspectadores, setTiempoSinEspectadores] = useState(0);
const [mostrarAlertaSinAudiencia, setMostrarAlertaSinAudiencia] = useState(false);

  // Stats
  const stats = {
    seguidores: 12400,
    suscriptores: 1200,
    publico: espectadoresEnVivo
  };


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
  }, 3000); // Actualizar cada 3 segundos

  return () => clearInterval(intervalo);
}, [enVivo, channelName]);

// Monitorear tiempo sin espectadores (alerta a los 3 min, auto-detener a los 10 min)
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
          confirmarCierre(); // Llamar a la función de cierre
        }
        
        return nuevoTiempo;
      });
    } else {
      // Resetear si hay espectadores
      setTiempoSinEspectadores(0);
      setMostrarAlertaSinAudiencia(false);
    }
  }, 1000); // Verificar cada segundo

  return () => clearInterval(intervalo);
}, [enVivo, espectadoresEnVivo]);
  
  const porcentajeMeta = metaActual > 0 ? Math.min((progresoMeta / metaActual) * 100, 100) : 0;

  // Sistema de tiers CONFIGURABLE para regalos
  const getGiftTierConfig = (valor: number) => {
    if (valor >= 500) return {
      tier: 'mega' as const,
      gradient: 'from-purple-100 via-pink-100 to-rose-100',
      border: 'border-purple-300',
      textSize: 'text-7xl',
      padding: 'p-8',
      duration: 6000,
      sound: 'large' as const
    };
    if (valor >= 200) return {
      tier: 'large' as const,
      gradient: 'from-amber-100 via-orange-100 to-yellow-100',
      border: 'border-amber-300',
      textSize: 'text-6xl',
      padding: 'p-6',
      duration: 5000,
      sound: 'large' as const
    };
    if (valor >= 50) return {
      tier: 'medium' as const,
      gradient: 'from-violet-100 via-purple-100 to-fuchsia-100',
      border: 'border-violet-300',
      textSize: 'text-5xl',
      padding: 'p-5',
      duration: 4000,
      sound: 'medium' as const
    };
    return {
      tier: 'small' as const,
      gradient: 'from-blue-100 via-cyan-100 to-teal-100',
      border: 'border-blue-300',
      textSize: 'text-3xl',
      padding: 'p-4',
      duration: 3000,
      sound: 'small' as const
    };
  };

  // Sistema de sonidos
  const playSound = (type: 'small' | 'medium' | 'large' | 'goal') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'small') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'medium') {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'large') {
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
      playTone(523, 0, 0.2);
      playTone(659, 0.15, 0.2);
      playTone(784, 0.3, 0.4);
    } else if (type === 'goal') {
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
      playTone(523, 0, 0.3);
      playTone(659, 0.2, 0.3);
      playTone(784, 0.4, 0.3);
      playTone(1047, 0.6, 0.6);
    }
  };

  // Cola de notificaciones en pantalla
  const processNotificationQueue = async () => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const notification = notificationQueueRef.current.shift()!;
    
    setScreenNotifications(prev => [...prev, { ...notification, isExiting: false }]);
    
    const duration = notification.tier === 'large' ? 5000 : notification.tier === 'medium' ? 4000 : 3000;
    
    setTimeout(() => {
      setScreenNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isExiting: true } : n)
      );
      
      setTimeout(() => {
        setScreenNotifications(prev => prev.filter(n => n.id !== notification.id));
        isProcessingRef.current = false;
        
        if (notificationQueueRef.current.length > 0) {
          setTimeout(() => processNotificationQueue(), 500);
        }
      }, 800);
    }, duration);
  };

  const addScreenNotification = (notification: ScreenNotification) => {
    notificationQueueRef.current.push(notification);
    processNotificationQueue();
  };

  // Conectar Socket.io cuando está en vivo
  useEffect(() => {
    if (enVivo && channelName) {
      socketRef.current = io(BACKEND_URL);
      
      socketRef.current.on('connect', () => {
        console.log('✅ Socket.io conectado (Creadora)');
        socketRef.current?.emit('join-channel', channelName);
        
        // Enviar configuración inicial del chat
        socketRef.current?.emit('update-chat-config', {
          channelName,
          config: chatConfig
        });
        
        // Si hay una meta activa, enviar su estado inicial
        if (metaActiva && metaActual > 0) {
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
        // Ya manejado por useTransmisionChat, pero podemos agregar aquí si necesitamos
      });

      // Escuchar nuevos regalos
      socketRef.current.on('new-gift', (gift: GiftMessage) => {
        console.log('🎁 REGALO RECIBIDO (Creadora):', gift);
        
        setGiftMessages(prev => [...prev, gift]);
        
        // Actualizar progreso de meta
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + gift.gift.valor;
          
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
          const donadorExistente = prev.find(d => d.user === gift.user);
          if (donadorExistente) {
            return prev
              .map(d => d.user === gift.user ? {...d, total: d.total + gift.gift.valor} : d)
              .sort((a, b) => b.total - a.total);
          } else {
            return [...prev, { user: gift.user, total: gift.gift.valor, avatar: gift.avatar }]
              .sort((a, b) => b.total - a.total)
              .slice(0, 10);
          }
        });
        
        // Crear notificación en pantalla con tier configurable
        const tierConfig = getGiftTierConfig(gift.gift.valor);
        console.log(`📢 CREANDO NOTIFICACIÓN (Tier: ${tierConfig.tier}, Valor: ${gift.gift.valor}):`, gift.gift.nombre);
        
        const screenNotif: ScreenNotification = {
          id: 'screen-' + gift.id,
          type: 'gift',
          user: gift.user,
          isVIP: gift.isVIP,
          content: gift.gift.emoji,
          title: gift.gift.nombre,
          valor: gift.gift.valor,
          tier: tierConfig.tier,
          timestamp: new Date(gift.timestamp)
        };
        addScreenNotification(screenNotif);
        
        playSound(tierConfig.sound);
      });

      // Escuchar reacciones (corazones)
      socketRef.current.on('send-reaction', (reactionData: { reaction: string; username: string; timestamp: string }) => {
        if (reactionData.reaction === '❤️') {
          const newHeart = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            delay: Math.random() * 0.5,
          };
          setFloatingHearts(prev => [...prev, newHeart]);

          setTimeout(() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
          }, 3000);
        }
      });

      // Escuchar propinas rápidas
      socketRef.current.on('new-tip', (tip: TipMessage) => {
        setTipMessages(prev => [...prev, tip]);
        
        setProgresoMeta(prev => {
          const nuevoProgreso = prev + tip.monto;
          
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
        
        playSound('small');
      });

      // Escuchar super chats
      socketRef.current.on('new-superchat', (superchat: SuperChatMessage) => {
        console.log('🎯 SUPER CHAT RECIBIDO (Creadora):', superchat);
        
        setSuperChatMessages(prev => [...prev, superchat]);
        
        const duration = superchat.tier === 'elite' ? 120000 : superchat.tier === 'premium' ? 60000 : 30000;
        const expiresAt = new Date(Date.now() + duration);
        
        console.log('📌 FIJANDO SUPER CHAT:', { user: superchat.user, tier: superchat.tier, duration });
        setPinnedSuperChat({ ...superchat, expiresAt });
        
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
        
        playSound(superchat.tier === 'elite' ? 'large' : superchat.tier === 'premium' ? 'medium' : 'small');
        
        setTimeout(() => {
          console.log('⏰ DESFIJANDO SUPER CHAT:', superchat.user);
          setPinnedSuperChat(prev => prev?.id === superchat.id ? null : prev);
        }, duration);
      });

      // Escuchar resultados de ruleta
      socketRef.current.on('ruleta-resultado', (data: { usuario: string; premio: PremioRuleta }) => {
        console.log('🎰 RESULTADO RULETA:', data);
        
        // Crear notificación DENTRO de la ventana
        const notifRuleta = {
          id: 'ruleta-' + Date.now(),
          mensaje: `🎰 ${data.usuario} ganó: ${data.premio.nombre} (${data.premio.descripcion})`,
          emoji: data.premio.icono,
          valor: data.premio.nombre
        };
        
        // Agregar a notificaciones en pantalla temporalmente
        const tempDiv = document.createElement('div');
        tempDiv.className = 'fixed top-20 right-6 z-50 animate-fade-in-right max-w-sm';
        tempDiv.innerHTML = `
          <div class="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 text-slate-800 px-6 py-4 rounded-xl shadow-2xl">
            <div class="flex items-center gap-3">
              <div class="text-4xl">${data.premio.icono}</div>
              <div>
                <div class="font-bold text-lg text-purple-900">¡Ruleta Girada! 🎉</div>
                <div class="text-sm text-slate-700 mt-1">
                  <span class="font-semibold">${data.usuario}</span> ganó:<br/>
                  <span class="font-bold text-purple-700">${data.premio.nombre}</span>
                </div>
                <div class="text-xs text-slate-600 mt-1">${data.premio.descripcion}</div>
              </div>
            </div>
          </div>
        `;
        
        // Agregar DENTRO del windowRef
        if (windowRef.current) {
          windowRef.current.appendChild(tempDiv);
        }
        
        playSound('large');
        
        setTimeout(() => {
          tempDiv.remove();
        }, 6000);
      });

      return () => {
        socketRef.current?.disconnect();
        console.log('🔌 Socket.io desconectado');
      };
    }
  }, [enVivo, channelName]);

  // Sincronizar meta periódicamente
  useEffect(() => {
    if (!enVivo || !channelName || !socketRef.current || !metaActiva) return;

    const intervalo = setInterval(() => {
      if (socketRef.current && metaActiva && metaActual > 0) {
        socketRef.current.emit('update-meta', {
          channelName,
          activa: metaActiva,
          monto: metaActual,
          descripcion: descripcionMeta,
          progreso: progresoMeta
        });
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [enVivo, channelName, metaActiva, metaActual, descripcionMeta, progresoMeta]);

  // Emitir configuración del chat cuando cambie
  useEffect(() => {
    if (socketRef.current && enVivo && channelName) {
      socketRef.current.emit('update-chat-config', {
        channelName,
        config: chatConfig
      });
    }
  }, [chatConfig, enVivo, channelName]);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, giftMessages, tipMessages, superChatMessages]);

  // Cerrar dropdown de config al hacer clic fuera
  useEffect(() => {
    if (!showChatConfig) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.chat-config-dropdown') && !target.closest('.chat-config-button')) {
        setShowChatConfig(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChatConfig]);

  // Iniciar transmisión automáticamente
  useEffect(() => {
    if (isTransmisionActive && !enVivo && !cargando) {
      iniciarTransmision(tipoTransmision, precioPPV, descripcionPPV);
    }
  }, [isTransmisionActive]);

  const handleClose = () => {
    setShowConfirmClose(true);
  };
  
  const confirmarCierre = async () => {
    setShowConfirmClose(false);
    
    // RESET COMPLETO de todos los estados
    console.log('🔄 Reseteando todos los estados...');
    
    // 1. Mensajes y chat (AHORA INCLUYE chatMessages del hook)
    setGiftMessages([]);
    setTipMessages([]);
    setSuperChatMessages([]);
    setPinnedSuperChat(null);
    // Nota: chatMessages viene del hook useTransmisionChat, se limpia automáticamente al cerrar
    
    // 2. Notificaciones
    setScreenNotifications([]);
    notificationQueueRef.current = [];
    isProcessingRef.current = false;
    setFloatingHearts([]);
    
    // 3. Sistema de Meta
    setMetaActiva(false);
    setMetaActual(0);
    setDescripcionMeta('');
    setProgresoMeta(0);
    setMetaAlcanzada(false);
    setTopDonadores([]);
    setShowTopDonadores(false);
    
    // 4. Sistema de Moderación
    setUsuariosSilenciados([]);
    setNuevoUsuarioSilenciar('');
    
    // 5. Sistema de Ruleta (AHORA RESETEA PREMIOS)
    setRuletaActiva(false);
    setCostoGiroRuleta(10);
    setPremiosRuleta([]); // ← RESETEAR PREMIOS AL CERRAR TRANSMISIÓN
    
    // 6. Estados de UI
    setShowMetaModal(false);
    setShowModeracionModal(false);
    setShowRuletaModal(false);

     // Agregar reset de contador de espectadores
  setEspectadoresEnVivo(0);
  setTiempoSinEspectadores(0);
  setMostrarAlertaSinAudiencia(false);
    
    console.log('✅ Reset completo finalizado');
    
    // Detener transmisión y cerrar ventana
    await detenerTransmision();
    closeTransmision();
   // setToast({ message: 'Transmisión finalizada exitosamente', type: 'success' });
  };

  const copiarLink = () => {
    const link = `${window.location.origin}/live-creadora/${channelName}`;
    navigator.clipboard.writeText(link);
    setLinkCopiado(true);
    setToast({ message: '¡Link copiado al portapapeles!', type: 'success' });
    setTimeout(() => setLinkCopiado(false), 3000);
  };

  const handleActivarRuleta = (costoGiro: number, premios: PremioRuleta[]) => {
    setCostoGiroRuleta(costoGiro);
    setPremiosRuleta(premios); // ← GUARDAR PREMIOS
    setRuletaActiva(true);
    setShowRuletaModal(false);
    
    // Emitir evento Socket.io
    socketRef.current?.emit('ruleta-activada', {
      channelName,
      costoGiro,
      premios
    });
    
    // Mostrar notificación de ACTIVACIÓN dentro de la ventana
    if (windowRef.current) {
      const mensajeActivado = document.createElement('div');
      mensajeActivado.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down';
      mensajeActivado.innerHTML = `
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-semibold">¡Ruleta activada! 🎰 Espectadores pueden girar</span>
        </div>
      `;
      windowRef.current.appendChild(mensajeActivado);
      
      setTimeout(() => {
        mensajeActivado.remove();
      }, 3000);
    }
  };

  const handleDesactivarRuleta = () => {
    setRuletaActiva(false);
    // NO resetear premios ni costo - se mantienen durante la transmisión
    
    // Mostrar notificación de DESACTIVACIÓN dentro de la ventana
    if (windowRef.current) {
      const mensajeDesactivado = document.createElement('div');
      mensajeDesactivado.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down';
      mensajeDesactivado.innerHTML = `
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-orange-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="font-semibold">¡Ruleta desactivada! Puedes editar los premios 📝</span>
        </div>
      `;
      windowRef.current.appendChild(mensajeDesactivado);
      
      setTimeout(() => {
        mensajeDesactivado.remove();
      }, 3000);
    }
    
    // Emitir evento
    socketRef.current?.emit('ruleta-desactivada', { channelName });
  };

  // Funciones de Moderación
  const handleSilenciarUsuario = (username: string) => {
    if (!usuariosSilenciados.includes(username)) {
      setUsuariosSilenciados(prev => [...prev, username]);
      socketRef.current?.emit('silenciar-usuario', { channelName, username });
    }
  };

  const handleDesilenciarUsuario = (username: string) => {
    setUsuariosSilenciados(prev => prev.filter(u => u !== username));
    socketRef.current?.emit('desilenciar-usuario', { channelName, username });
  };

  // Funciones de Meta
  const handleGuardarMeta = (nuevaMeta: number, descripcion: string) => {
    if (nuevaMeta > 0) {
      setMetaActual(nuevaMeta);
      setDescripcionMeta(descripcion);
      setProgresoMeta(0);
      setTopDonadores([]);
      setMetaActiva(true);
      setMetaAlcanzada(false);
      setShowMetaModal(false);
      
      if (socketRef.current && channelName) {
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
      setShowMetaModal(true);
    } else {
      const nuevoEstado = !metaActiva;
      setMetaActiva(nuevoEstado);
      
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

  const handleEnviarMensaje = () => {
    if (inputMensaje.trim()) {
      enviarMensaje(inputMensaje);
      setInputMensaje('');
    }
  };

  // Manejar arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    if (windowState === 'maximized') return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowState !== 'maximized') {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x)),
          y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y))
        });
      }
      
      if (isResizing) {
        const newWidth = Math.max(900, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(500, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, windowState]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  if (!isTransmisionActive) return null;

  const windowStyles = windowState === 'maximized'
    ? { top: 0, left: 0, width: '100vw', height: '100vh' }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  // Combinar timeline de mensajes
  const timeline = [...chatMessages, ...giftMessages, ...tipMessages, ...superChatMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <>
      {/* Botón Minimizado - Solo visible cuando windowState === 'minimized' */}
      {windowState === 'minimized' && (
        <div className="fixed bottom-6 right-6 z-[10001] flex items-center gap-2">
          <button
            onClick={restoreWindow}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-3 border border-emerald-400"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">Transmisión en Vivo</span>
            <Square className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all hover:scale-105 border border-red-500 z-[10002]"
            title="Cerrar transmisión"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ventana Principal - Siempre en el DOM, solo oculta cuando está minimizada */}
      <div
        ref={windowRef}
        className="fixed bg-white rounded-2xl shadow-2xl overflow-hidden z-[9999] flex flex-col border border-slate-200"
        style={{
          ...windowStyles,
          display: windowState === 'minimized' ? 'none' : 'flex'
        }}
      >
        {/* Barra título */}
        <div
          className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200 text-slate-800 px-4 py-3 flex items-center justify-between cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <Radio className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <span className="font-semibold text-sm">Transmisión en Vivo</span>
              <span className="text-xs text-slate-500 ml-2">Dashboard</span>
            </div>
          </div>

          <div className="window-controls flex items-center gap-2">
            <button
              onClick={minimizeWindow}
              className="w-8 h-8 hover:bg-slate-200 rounded-lg transition flex items-center justify-center group"
            >
              <Minus className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
            </button>
            
            <button
              onClick={windowState === 'maximized' ? restoreWindow : maximizeWindow}
              className="w-8 h-8 hover:bg-slate-200 rounded-lg transition flex items-center justify-center group"
            >
              {windowState === 'maximized' ? (
                <Square className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-900" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-8 h-8 hover:bg-red-50 rounded-lg transition flex items-center justify-center group"
            >
              <X className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="no-drag flex-shrink-0 border-b border-slate-200 bg-slate-50">
          {!statsCollapsed && (
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Seguidores</span>
                  <span className="text-sm font-bold text-slate-800">{(stats.seguidores / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Suscriptores</span>
                  <span className="text-sm font-bold text-slate-800">{(stats.suscriptores / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-bold text-slate-800">{stats.publico}</span>
                </div>
              </div>
              <button
                onClick={() => setStatsCollapsed(true)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {statsCollapsed && (
            <button
              onClick={() => setStatsCollapsed(false)}
              className="w-full px-4 py-1.5 flex items-center justify-center hover:bg-slate-100 transition"
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Link para compartir */}
        {enVivo && channelName && (
          <div className="no-drag flex-shrink-0 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200 px-4 py-3">
            <p className="text-xs font-semibold text-violet-900 mb-2 flex items-center gap-1.5">
              📺 Comparte este link con tus seguidores:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${window.location.origin}/live-creadora/${channelName}`}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-violet-300 rounded-lg text-xs focus:outline-none text-slate-700"
              />
              <button
                onClick={copiarLink}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition flex items-center gap-2 ${
                  linkCopiado
                    ? 'bg-emerald-500 text-white'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                {linkCopiado ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Video + Chat */}
        <div className="flex-1 flex overflow-hidden min-h-0 no-drag">
          {/* Video 70% */}
          <div className="flex-[7] bg-slate-950 relative flex flex-col">
            <div className="flex-1 relative">
              <div id="local-player" className="w-full h-full" />
              
              {/* Notificaciones de Regalos - SISTEMA CONFIGURABLE */}
              {screenNotifications.length > 0 && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-35 pointer-events-none w-full max-w-2xl px-4">
                  {screenNotifications.map((notif) => {
                    const tierConfig = getGiftTierConfig(notif.valor || 0);
                    
                    return (
                      <div key={notif.id} className="mb-4">
                        <div className={notif.isExiting ? 'animate-pixel-dissolve' : 'animate-elegant-entrance'}>
                          <div className={`bg-gradient-to-r ${tierConfig.gradient} rounded-3xl ${tierConfig.padding} shadow-2xl border-2 ${tierConfig.border}`}>
                            <div className="flex items-center gap-4">
                              <div className={`${tierConfig.textSize} animate-bounce drop-shadow-lg`}>{notif.content}</div>
                              <div className="text-left flex-1">
                                <p className="text-slate-700 text-lg font-semibold mb-1 drop-shadow-sm">{notif.user}</p>
                                <p className="text-slate-800 text-2xl font-bold mb-2 drop-shadow-sm">{notif.title}</p>
                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 w-fit">
                                  <DollarSign className="w-5 h-5 text-slate-600" />
                                  <span className="text-slate-700 text-lg font-bold">{notif.valor} coins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Corazones flotantes */}
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

              {/* Super Chat Flotante - COLORES VIBRANTES COMO EN IMÁGENES */}
              {pinnedSuperChat && (
                <div className="absolute top-4 left-4 max-w-md z-30 animate-slide-down">
                  {pinnedSuperChat.tier === 'elite' && (
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 shadow-2xl border-2 border-purple-400">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-white animate-pulse drop-shadow-lg" />
                        <p className="text-white text-sm font-bold uppercase tracking-wider drop-shadow-md">👑 SUPER CHAT ELITE ✨</p>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pinnedSuperChat.isVIP && <Crown className="w-4 h-4 text-yellow-300 drop-shadow-md" />}
                          <p className="text-white text-base font-bold drop-shadow-md">{pinnedSuperChat.user}</p>
                        </div>
                        <span className="text-white text-base font-bold drop-shadow-md">S/.{pinnedSuperChat.monto}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white text-sm font-semibold leading-relaxed break-words">{pinnedSuperChat.mensaje}</p>
                      </div>
                    </div>
                  )}

                  {pinnedSuperChat.tier === 'premium' && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 shadow-2xl border-2 border-orange-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-white animate-pulse drop-shadow-lg" />
                        <p className="text-white text-sm font-bold uppercase tracking-wider drop-shadow-md">⭐ SUPER CHAT PREMIUM</p>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pinnedSuperChat.isVIP && <Crown className="w-4 h-4 text-yellow-300 drop-shadow-md" />}
                          <p className="text-white text-base font-bold drop-shadow-md">{pinnedSuperChat.user}</p>
                        </div>
                        <span className="text-white text-base font-bold drop-shadow-md">S/.{pinnedSuperChat.monto}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <p className="text-white text-sm font-semibold leading-relaxed break-words">{pinnedSuperChat.mensaje}</p>
                      </div>
                    </div>
                  )}

                  {pinnedSuperChat.tier === 'basic' && (
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 shadow-xl border-2 border-cyan-300">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-white drop-shadow-md" />
                        <p className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-md">💎 SUPER CHAT</p>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pinnedSuperChat.isVIP && <Crown className="w-3.5 h-3.5 text-yellow-300 drop-shadow-md" />}
                          <p className="text-white text-sm font-bold drop-shadow-md">{pinnedSuperChat.user}</p>
                        </div>
                        <span className="text-white text-sm font-bold drop-shadow-md">S/.{pinnedSuperChat.monto}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/30">
                        <p className="text-white text-sm font-medium leading-relaxed break-words">{pinnedSuperChat.mensaje}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Barra de Progreso de Meta */}
              {enVivo && metaActiva && metaActual > 0 && (
                <div className="absolute bottom-4 left-4 right-4 z-30">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="text-white text-sm font-bold">{descripcionMeta || 'Meta del Stream'}</p>
                          <p className="text-white/70 text-xs">{progresoMeta} / {metaActual} coins</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMetaModal(true)}
                        className="text-white/60 hover:text-white text-xs underline"
                      >
                        Editar
                      </button>
                    </div>
                    <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-400 to-purple-400 transition-all duration-500 rounded-full"
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
              
              {/* Herramientas superiores */}
              {enVivo && (
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
                    
                    <button 
                      onClick={() => setShowModeracionModal(true)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                      title="Moderación"
                    >
                      <span className="text-lg">🛡️</span>
                    </button>
                    
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
                    
                    <div className="w-px h-6 bg-white/20" />
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-bold">EN VIVO</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-white/80" />
                      <span className="text-white text-sm font-bold">{stats.publico}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!enVivo && cargando && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white font-medium">Conectando...</p>
                  </div>
                </div>
              )}

              {/* Alerta de sin audiencia */}
              {mostrarAlertaSinAudiencia && enVivo && (
                <div className="no-drag flex-shrink-0 bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3 animate-pulse mx-4 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900">⚠️ No tienes espectadores</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Llevas {Math.floor(tiempoSinEspectadores / 60)} minutos sin audiencia. 
                      La transmisión se detendrá automáticamente a los 10 minutos para ahorrar recursos.
                    </p>
                    <button
                      onClick={confirmarCierre}
                      className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition"
                    >
                      Finalizar ahora
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/90">
                  <p className="text-white px-4 py-2 bg-red-800 rounded-lg">{error}</p>
                </div>
              )}
            </div>

            {/* Controles de transmisión */}
            {enVivo && (
              <div className="flex-shrink-0 bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-center gap-3">
                <button
                  onClick={toggleMic}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    micMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {micMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    cameraOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {cameraOff ? <VideoOff className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
                </button>

                <button
                  onClick={handleClose}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-sm transition"
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>

          {/* Chat 25% - MÁS COMPACTO */}
          <div className="flex-[2.5] bg-white border-l border-slate-200 flex flex-col relative">
            {/* Header del Chat con Config INTEGRADO */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-slate-800">Chat</h3>
                <button
                  onClick={() => setShowChatConfig(!showChatConfig)}
                  className="chat-config-button w-6 h-6 rounded-lg hover:bg-slate-200 transition flex items-center justify-center ml-1"
                  title="Configuración del chat"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>{stats.publico}</span>
              </div>
            </div>

            {/* Dropdown de Config - Modal tipo Dropdown */}
            {showChatConfig && (
              <div className="chat-config-dropdown absolute top-14 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 animate-fade-in">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-800">⚙️ Configuración del Chat</h4>
                    <button
                      onClick={() => setShowChatConfig(false)}
                      className="text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-slate-700">Público puede chatear</span>
                      <input
                        type="checkbox"
                        checked={chatConfig.publicoPuedeChatear}
                        onChange={(e) => setChatConfig({ ...chatConfig, publicoPuedeChatear: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-slate-700">Suscriptores pueden chatear</span>
                      <input
                        type="checkbox"
                        checked={chatConfig.suscriptoresPuedeChatear}
                        onChange={(e) => setChatConfig({ ...chatConfig, suscriptoresPuedeChatear: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-slate-700">Solo emoticones</span>
                      <input
                        type="checkbox"
                        checked={chatConfig.soloEmoticonos}
                        onChange={(e) => setChatConfig({ ...chatConfig, soloEmoticonos: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-slate-700">Solo mensajes</span>
                      <input
                        type="checkbox"
                        checked={chatConfig.soloMensajes}
                        onChange={(e) => setChatConfig({ ...chatConfig, soloMensajes: e.target.checked })}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                    </label>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Palabras Restringidas
                      </label>
                      <input
                        type="text"
                        placeholder="Separadas por comas"
                        value={chatConfig.palabrasRestringidas.join(', ')}
                        onChange={(e) => setChatConfig({
                          ...chatConfig,
                          palabrasRestringidas: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                        })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>

                    <button
                      onClick={() => setShowChatConfig(false)}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Top Donadores - Colapsable */}
            {topDonadores.length > 0 && (
              <div className="border-b border-slate-200 flex-shrink-0">
                <button
                  onClick={() => setShowTopDonadores(!showTopDonadores)}
                  className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 px-4 py-2 flex items-center justify-between transition"
                >
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>👑</span> Top Donadores ({topDonadores.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    {showTopDonadores ? '▲' : '▼'}
                  </span>
                </button>
                
                {showTopDonadores && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 px-4 pb-3 space-y-1">
                    {topDonadores.slice(0, 3).map((donador, index) => (
                      <div key={donador.user} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`
                            ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : 'text-orange-600'}
                            font-bold
                          `}>
                            #{index + 1}
                          </span>
                          <span className="text-slate-700 font-medium">{donador.user}</span>
                        </div>
                        <span className="text-emerald-600 font-bold">{donador.total} 💎</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline de mensajes */}
            <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-3">
              {timeline.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">Chat en tiempo real</p>
                    <p className="text-xs text-slate-400 mt-1">Los mensajes aparecerán aquí</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {timeline.map((item) => {
                    // Super Chat
                    if ('tier' in item && 'monto' in item && 'mensaje' in item) {
                      const superChat = item as SuperChatMessage;
                      const tierConfig = {
                        basic: { 
                          gradient: 'from-blue-50 to-cyan-50', 
                          border: 'border-blue-200', 
                          badge: 'bg-blue-500 text-white',
                          icon: '💎'
                        },
                        premium: { 
                          gradient: 'from-violet-50 to-purple-50', 
                          border: 'border-violet-200', 
                          badge: 'bg-violet-500 text-white',
                          icon: '⭐'
                        },
                        elite: { 
                          gradient: 'from-amber-50 to-yellow-50', 
                          border: 'border-amber-200', 
                          badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
                          icon: '👑'
                        }
                      };
                      const config = tierConfig[superChat.tier];
                      
                      return (
                        <div key={superChat.id} className="animate-fade-in">
                          <div className={`bg-gradient-to-r ${config.gradient} border ${config.border} rounded-xl p-3 shadow-sm`}>
                            <div className="flex items-start gap-2">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">{config.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <p className="text-sm font-semibold text-slate-800">{superChat.user}</p>
                                  {superChat.isVIP && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                                  <div className={`ml-auto flex items-center gap-1 ${config.badge} rounded-lg px-2 py-1`}>
                                    <DollarSign className="w-3 h-3" />
                                    <p className="text-xs font-semibold">{superChat.monto}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-700 font-medium break-words">{superChat.mensaje}</p>
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
                      const tip = item as TipMessage;
                      return (
                        <div key={tip.id} className="animate-fade-in">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">💵</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="text-xs font-semibold text-emerald-700 truncate">{tip.user}</p>
                                  {tip.isVIP && <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                                </div>
                                <p className="text-[10px] text-emerald-600">envió una propina</p>
                              </div>
                              <div className="flex items-center gap-0.5 bg-emerald-500 rounded-lg px-2 py-1 flex-shrink-0">
                                <DollarSign className="w-3 h-3 text-white" />
                                <span className="text-xs text-white font-semibold">{tip.monto}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Regalo
                    if ('gift' in item) {
                      const gift = item as GiftMessage;
                      return (
                        <div key={gift.id} className="animate-fade-in">
                          <div className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 border border-amber-200/50 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                gift.isVIP ? 'bg-gradient-to-br from-amber-100 to-yellow-100' : 'bg-gradient-to-br from-violet-100 to-purple-100'
                              }`}>
                                <span className="text-sm">{gift.avatar || gift.user[0]}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                {gift.user}
                                {gift.isVIP && <Crown className="w-3 h-3 text-amber-500" />}
                              </p>
                              <span className="ml-auto text-[10px] text-slate-500 font-medium">envió un regalo</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-2.5 border border-amber-200/30">
                              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-100/50 to-yellow-100/50 rounded-xl border border-amber-200/30">
                                <span className="text-2xl">{gift.gift.emoji}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-800 font-semibold text-sm leading-tight">{gift.gift.nombre}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-semibold text-amber-600">{gift.gift.valor} coins</span>
                                </div>
                              </div>
                              <Sparkles className="w-4 h-4 text-amber-400" />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Mensaje
                    const msg = item as ChatMessage;
                    const estaSilenciado = usuariosSilenciados.includes(msg.user);
                    return (
                      <div key={msg.id} className="flex items-start gap-2 group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.isVIP ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}>
                          <span className="text-sm text-white font-semibold">{msg.avatar || msg.user[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <p className={`text-xs font-bold ${msg.isVIP ? 'text-orange-600' : 'text-purple-600'}`}>
                              {msg.user}
                            </p>
                            {msg.isVIP && <Crown className="w-3 h-3 text-amber-500" />}
                            {estaSilenciado && <span className="text-[10px] text-red-500">🔇</span>}
                          </div>
                          <div className={`rounded-xl px-3 py-2 ${
                            msg.isVIP ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300' : 'bg-white border border-slate-300 shadow-sm'
                          }`}>
                            <p className="text-sm text-slate-800 break-words">{msg.mensaje}</p>
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
              )}
            </div>

            <div className="flex-shrink-0 p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMensaje}
                  onChange={(e) => setInputMensaje(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button
                  onClick={handleEnviarMensaje}
                  disabled={!inputMensaje.trim()}
                  className="w-9 h-9 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 flex items-center justify-center transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resize handle */}
        {windowState === 'normal' && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-slate-300 group-hover:border-violet-500 transition"></div>
          </div>
        )}
      </div>

      {/* Modal de Configuración del Chat - AHORA ES DROPDOWN INTEGRADO */}
      {/* <ChatConfigModal
        isOpen={showChatConfig}
        onClose={() => setShowChatConfig(false)}
        config={chatConfig}
        onUpdateConfig={setChatConfig}
      /> */}

      {/* Modal de Meta */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>🎯</span> {metaActual > 0 ? 'Editar Meta' : 'Crear Meta'}
              </h3>
              <button onClick={() => setShowMetaModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-violet-50 border border-violet-200 p-2 rounded-lg">
                <p className="text-xs text-violet-900 leading-snug">
                  💡 Las metas con descripciones reciben más apoyo
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Descripción de la Meta ✨ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={descripcionMeta}
                  onChange={(e) => setDescripcionMeta(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Ej: Nueva cámara 4K"
                  maxLength={50}
                  required
                />
                <p className="text-xs text-slate-500 mt-0.5">Máx. 50 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Meta de Coins 💰 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={metaActual || ''}
                  onChange={(e) => setMetaActual(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-semibold"
                  placeholder="500"
                  min="1"
                />
                <p className="text-xs text-slate-500 mt-0.5">Coins a recaudar</p>
              </div>

              {metaActual > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-slate-600">
                    <strong>Progreso actual:</strong> {progresoMeta} / {metaActual} coins
                  </p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
                      style={{ width: `${porcentajeMeta}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-500">{porcentajeMeta.toFixed(0)}% completado</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleGuardarMeta(metaActual, descripcionMeta)}
                  disabled={!metaActual || metaActual <= 0 || !descripcionMeta.trim()}
                  className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition shadow-sm ${
                    metaActual > 0 && descripcionMeta.trim()
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white hover:shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {metaActiva ? 'Actualizar' : 'Activar'}
                </button>
                <button
                  onClick={() => setShowMetaModal(false)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>🛡️</span> Moderación
              </h3>
              <button onClick={() => setShowModeracionModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Usuarios Silenciados</h4>
                
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
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  <p className="text-[10px] text-slate-500 italic">No hay usuarios silenciados</p>
                ) : (
                  <div className="space-y-1.5">
                    {usuariosSilenciados.map(user => (
                      <div key={user} className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-xs text-slate-700">{user}</span>
                        <button
                          onClick={() => handleDesilenciarUsuario(user)}
                          className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-1 rounded transition"
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
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 rounded-lg text-xs font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ruleta - Z-INDEX MUY ALTO */}
      {showRuletaModal && (
        <div className="fixed inset-0 z-[99999]">
          <RuletaModal
            isOpen={showRuletaModal}
            onClose={() => setShowRuletaModal(false)}
            isCreadora={true}
            channelName={channelName}
            onActivarRuleta={handleActivarRuleta}
            onDesactivarRuleta={handleDesactivarRuleta}
            ruletaActiva={ruletaActiva}  
            premiosExistentes={premiosRuleta} 
          />
        </div>
      )}

      {/* Modal de Confirmación - Z-INDEX MÁXIMO */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-[100000]">
          <ConfirmacionModal
            isOpen={showConfirmClose}
            title="Finalizar Transmisión"
            message="¿Estás segura/o de que deseas finalizar la transmisión?"
            confirmText="Sí, finalizar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmarCierre}
            onCancel={() => setShowConfirmClose(false)}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <ToastConfirmation
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

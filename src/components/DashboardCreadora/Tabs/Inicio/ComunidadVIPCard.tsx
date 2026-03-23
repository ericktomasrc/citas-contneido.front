import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, X, Gift, Crown, Timer, Star, Search, Users, ChevronRight, Clock, CheckCheck } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Toast } from '../../Modal/Toast';
import { useToast } from '../../hooks/useToast';

interface Mensaje {
  id: string;
  texto: string;
  propina?: number;
  tiempoRestante: number;
  estado: 'nuevo' | 'respondido' | 'expirado';
  fecha: Date;
  respuesta?: {
    texto: string;
    fecha: Date;
  };
}

interface Suscriptor {
  id: string;
  nombre: string;
  username: string;
  avatar: string;
  avatarPremium?: 'gold' | 'diamond' | 'platinum' | 'vip';
  online: boolean;
  esPremium: boolean;
  mensaje?: {
    texto: string;
    propina?: number;
    tiempoRestante: number;
    estado: 'nuevo' | 'respondido' | 'expirado';
  };
  historialMensajes?: Mensaje[];
}

interface ComunidadVIPCardProps {
  className?: string;
}

const getAvatarPremiumStyles = (tier: 'gold' | 'diamond' | 'platinum' | 'vip') => {
  const styles = {
    gold: {
      border: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500',
      shine: 'from-amber-400/30 to-yellow-400/30',
      badge: '💰',
      name: 'Gold VIP',
      glow: 'shadow-lg shadow-amber-400/50'
    },
    diamond: {
      border: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500',
      shine: 'from-cyan-400/30 to-purple-400/30',
      badge: '💎',
      name: 'Diamond Elite',
      glow: 'shadow-lg shadow-cyan-400/50'
    },
    platinum: {
      border: 'bg-gradient-to-br from-slate-300 via-gray-200 to-slate-400',
      shine: 'from-slate-300/30 to-gray-300/30',
      badge: '⭐',
      name: 'Platinum',
      glow: 'shadow-lg shadow-slate-400/50'
    },
    vip: {
      border: 'bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500',
      shine: 'from-rose-400/30 to-violet-400/30',
      badge: '🔥',
      name: 'VIP Exclusivo',
      glow: 'shadow-lg shadow-rose-400/50'
    }
  };
  return styles[tier];
};

const generarUsuarios = (): Suscriptor[] => {
  const nombres = ['Ana', 'Luis', 'María', 'Carlos', 'Laura', 'Pedro', 'Sofia', 'Diego', 'Valentina', 'Miguel', 'Camila', 'Andrés', 'Isabella', 'Jorge', 'Daniela', 'Roberto', 'Fernanda', 'Gabriel', 'Paula', 'Ricardo'];
  const apellidos = ['García', 'López', 'Martínez', 'Rodríguez', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Ruiz', 'Castro'];
  const mensajesEjemplo = ['Hola hermosa! 💕', 'Eres increíble ⭐', 'Para tu café ☕', 'Gracias por tu contenido', 'Me encanta tu perfil', 'Hola! 👋', 'Saludos desde Lima', 'Eres la mejor', 'Info de precios?', 'Cuando es tu próximo live?'];

  const usuarios: Suscriptor[] = [];
  for (let i = 0; i < 500; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const tieneMsg = Math.random() < 0.08;
    const tienePropina = tieneMsg && Math.random() < 0.3;

    const tieneAvatarPremium = Math.random() < 0.1;
    const avatarPremium = tieneAvatarPremium
      ? (['gold', 'diamond', 'platinum', 'vip'] as const)[Math.floor(Math.random() * 4)]
      : undefined;

    const tieneHistorial = Math.random() < 0.3;
    const historial: Mensaje[] = [];

    if (tieneHistorial) {
      const cantidadMensajes = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < cantidadMensajes; j++) {
        const fechaMensaje = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        const fueRespondido = Math.random() < 0.7;
        historial.push({
          id: `msg-${i}-${j}`,
          texto: mensajesEjemplo[Math.floor(Math.random() * mensajesEjemplo.length)],
          propina: Math.random() < 0.2 ? Math.floor(Math.random() * 50) + 10 : undefined,
          tiempoRestante: 0,
          estado: fueRespondido ? 'respondido' : 'expirado',
          fecha: fechaMensaje,
          respuesta: fueRespondido ? {
            texto: '¡Gracias! 💕',
            fecha: new Date(fechaMensaje.getTime() + Math.random() * 3600000)
          } : undefined
        });
      }
      historial.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    }

    usuarios.push({
      id: `user-${i}`,
      nombre: `${nombre} ${apellido}`,
      username: `${nombre.toLowerCase()}-${apellido.toLowerCase()}-${Math.random().toString(36).substr(2, 4)}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      avatarPremium,
      online: Math.random() < 0.25,
      esPremium: Math.random() < 0.2,
      mensaje: tieneMsg ? {
        texto: mensajesEjemplo[Math.floor(Math.random() * mensajesEjemplo.length)],
        propina: tienePropina ? Math.floor(Math.random() * 50) + 10 : undefined,
        tiempoRestante: tienePropina ? 120 : 60,
        estado: 'nuevo' as const
      } : undefined,
      historialMensajes: historial.length > 0 ? historial : undefined
    });
  }
  return usuarios;
};

export const ComunidadVIPCard = ({ className = '' }: ComunidadVIPCardProps) => {
  const navigate = useNavigate();
  const { showToast, toastMessage, toastType, toast, closeToast } = useToast();

  const [tabActivo, setTabActivo] = useState<'todos' | 'mensajes' | 'historial'>('todos');
  const [suscriptorSeleccionado, setSuscriptorSeleccionado] = useState<Suscriptor | null>(null);
  const [hoveredSuscriptorId, setHoveredSuscriptorId] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [showVerTodos, setShowVerTodos] = useState(false);
  const [filtroVerTodos, setFiltroVerTodos] = useState<'todos' | 'online' | 'premium' | 'mensajes'>('todos');

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>(() => generarUsuarios());

  const mensajesEjemplo = ['Hola hermosa! 💕', 'Eres increíble ⭐', 'Para tu café ☕', 'Gracias por tu contenido', 'Me encanta tu perfil', 'Hola! 👋', 'Saludos desde Lima', 'Eres la mejor', 'Info de precios?', 'Cuando es tu próximo live?', 'Te admiro mucho 💖', 'Nuevo fan aquí! 🙋', 'Contenido top! 🔥', 'Increíble! 😍'];

  useEffect(() => {
    const interval = setInterval(() => {
      setSuscriptores(prev => prev.map(s => {
        if (s.mensaje && s.mensaje.estado === 'nuevo' && s.mensaje.tiempoRestante > 0) {
          const nuevoTiempo = s.mensaje.tiempoRestante - 1;
          if (nuevoTiempo <= 0) {
            return { ...s, mensaje: { ...s.mensaje, tiempoRestante: 0, estado: 'expirado' as const } };
          }
          return { ...s, mensaje: { ...s.mensaje, tiempoRestante: nuevoTiempo } };
        }
        return s;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const usuariosOrdenados = useMemo(() => {
    let filtrados = suscriptores;
    if (busqueda) filtrados = filtrados.filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()) || s.username.toLowerCase().includes(busqueda.toLowerCase()));

    if (tabActivo === 'mensajes') {
      filtrados = filtrados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo');
    } else if (tabActivo === 'historial') {
      filtrados = filtrados.filter(s => s.historialMensajes && s.historialMensajes.length > 0);
    }

    return filtrados.sort((a, b) => {
      const aPropina = a.mensaje?.propina && a.mensaje.estado === 'nuevo';
      const bPropina = b.mensaje?.propina && b.mensaje.estado === 'nuevo';
      const aMsgActivo = a.mensaje && a.mensaje.estado === 'nuevo' && !a.mensaje.propina;
      const bMsgActivo = b.mensaje && b.mensaje.estado === 'nuevo' && !b.mensaje.propina;
      if (aPropina && bPropina) return b.mensaje!.propina! - a.mensaje!.propina!;
      if (aPropina && !bPropina) return -1;
      if (!aPropina && bPropina) return 1;
      if (aMsgActivo && !bMsgActivo) return -1;
      if (!aMsgActivo && bMsgActivo) return 1;
      if (a.online && !b.online) return -1;
      if (!a.online && b.online) return 1;
      if (a.esPremium && !b.esPremium) return -1;
      if (!a.esPremium && b.esPremium) return 1;
      return 0;
    });
  }, [suscriptores, tabActivo, busqueda]);

  const usuariosVerTodos = useMemo(() => {
    let filtrados = suscriptores;
    if (busqueda) filtrados = filtrados.filter(s => s.nombre.toLowerCase().includes(busqueda.toLowerCase()) || s.username.toLowerCase().includes(busqueda.toLowerCase()));
    switch (filtroVerTodos) {
      case 'online': filtrados = filtrados.filter(s => s.online); break;
      case 'premium': filtrados = filtrados.filter(s => s.esPremium); break;
      case 'mensajes': filtrados = filtrados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo'); break;
    }
    return filtrados.sort((a, b) => {
      const aPropina = a.mensaje?.propina && a.mensaje.estado === 'nuevo';
      const bPropina = b.mensaje?.propina && b.mensaje.estado === 'nuevo';
      if (aPropina && bPropina) return b.mensaje!.propina! - a.mensaje!.propina!;
      if (aPropina && !bPropina) return -1;
      if (!aPropina && bPropina) return 1;
      if (a.online && !b.online) return -1;
      if (!a.online && b.online) return 1;
      return 0;
    });
  }, [suscriptores, busqueda, filtroVerTodos]);

  const formatTiempo = (segundos: number) => { const mins = Math.floor(segundos / 60); const secs = segundos % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };

  const formatFechaRelativa = (fecha: Date) => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 60) return `Hace ${minutos}min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  };

  const handleResponder = () => {
    if (!respuesta.trim() || !suscriptorSeleccionado) return;
    setSuscriptores(prev => prev.map(s => {
      if (s.id === suscriptorSeleccionado.id) {
        if (s.mensaje) {
          const mensajeRespondido: Mensaje = {
            id: s.mensaje.texto + Date.now(),
            texto: s.mensaje.texto,
            propina: s.mensaje.propina,
            tiempoRestante: 0,
            estado: 'respondido',
            fecha: new Date(),
            respuesta: {
              texto: respuesta,
              fecha: new Date()
            }
          };
          return {
            ...s,
            mensaje: undefined,
            historialMensajes: [mensajeRespondido, ...(s.historialMensajes || [])]
          };
        }
      }
      return s;
    }));
    toast(`💬 Respuesta enviada a ${suscriptorSeleccionado.nombre}`, 'success');
    setSuscriptorSeleccionado(null);
    setRespuesta('');
  };

  const handleIrAlChat = (username: string) => { setSuscriptorSeleccionado(null); setShowVerTodos(false); navigate(`/chat/${username}`); };

  const handleDescartarMensaje = (suscriptorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSuscriptores(prev => prev.map(s => {
      if (s.id === suscriptorId && s.mensaje) {
        const mensajeDescartado: Mensaje = {
          id: s.mensaje.texto + Date.now(),
          texto: s.mensaje.texto,
          propina: s.mensaje.propina,
          tiempoRestante: 0,
          estado: 'expirado',
          fecha: new Date(),
        };
        return {
          ...s,
          mensaje: undefined,
          historialMensajes: [mensajeDescartado, ...(s.historialMensajes || [])]
        };
      }
      return s;
    }));
    toast('💬 Mensaje descartado', 'info');
  };

  const handleMouseEnterAvatar = (suscriptorId: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    setHoveredSuscriptorId(suscriptorId);
  };

  const handleMouseLeaveAvatar = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredSuscriptorId(null), 150);
  };

  const totalOnline = suscriptores.filter(s => s.online).length;
  const totalMensajes = suscriptores.filter(s => s.mensaje && s.mensaje.estado === 'nuevo').length;
  const totalPremium = suscriptores.filter(s => s.esPremium).length;
  const totalPropinas = suscriptores.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').length;
  const totalHistorial = suscriptores.filter(s => s.historialMensajes && s.historialMensajes.length > 0).length;

  const AvatarItem = ({ suscriptor, size = 'normal' }: { suscriptor: Suscriptor; size?: 'normal' | 'small' }) => {
    const sizeClass = size === 'small' ? 'w-10 h-10' : 'w-12 h-12';
    const tieneMensajeActivo = suscriptor.mensaje && suscriptor.mensaje.estado === 'nuevo';
    const isHovered = hoveredSuscriptorId === suscriptor.id;

    let borderClasses = '';

    if (suscriptor.avatarPremium) {
      const premiumStyle = getAvatarPremiumStyles(suscriptor.avatarPremium);
      borderClasses = `${premiumStyle.border} ${premiumStyle.glow} p-[3px]`;
    } else if (suscriptor.mensaje?.propina && suscriptor.mensaje.estado === 'nuevo') {
      borderClasses = 'border-2 border-rose-400';
    } else if (tieneMensajeActivo) {
      borderClasses = 'border-2 border-fuchsia-300';
    } else if (suscriptor.online) {
      borderClasses = 'border-2 border-emerald-300';
    } else {
      borderClasses = 'border border-slate-200';
    }

    const opacity = !suscriptor.online && !tieneMensajeActivo ? 'opacity-50' : '';

    return (
      <div
        className="relative cursor-pointer group/avatar flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();
          if (!suscriptor.online && !tieneMensajeActivo) {
            toast(`${suscriptor.nombre} no está en línea`, 'error');
            return;
          }
          setSuscriptorSeleccionado(suscriptor);
        }}
        onMouseEnter={() => handleMouseEnterAvatar(suscriptor.id)}
        onMouseLeave={handleMouseLeaveAvatar}
      >
        {tabActivo === 'historial' && suscriptor.historialMensajes && suscriptor.historialMensajes.length > 0 && (
          <div className={`mb-2 relative z-50 transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-xl border border-slate-200/60 px-3 py-2 min-w-[140px] max-w-[160px]">
              <p className="text-[10px] font-semibold text-slate-700 truncate">{suscriptor.nombre}</p>
              <p className="text-[9px] text-slate-500 mt-0.5 truncate">"{suscriptor.historialMensajes[0].texto}"</p>
              {suscriptor.historialMensajes[0].respuesta && (
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCheck className="w-2.5 h-2.5 text-emerald-500" />
                  <p className="text-[8px] text-emerald-600">Respondido</p>
                </div>
              )}
              <p className="text-[8px] text-slate-400 mt-0.5">{formatFechaRelativa(suscriptor.historialMensajes[0].fecha)}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-200/60"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-slate-50"></div>
          </div>
        )}

        {tieneMensajeActivo && tabActivo !== 'historial' && (
          <div className={`mb-2 relative z-50 transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-xl border border-slate-200/60 px-3 py-2 min-w-[140px] max-w-[160px] relative group/tooltip">
              <button
                onClick={(e) => handleDescartarMensaje(suscriptor.id, e)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover/tooltip:opacity-100 z-10"
                title="Descartar mensaje"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              <p className="text-[10px] font-semibold text-slate-700 truncate">{suscriptor.nombre}</p>
              <p className="text-[9px] text-slate-500 mt-0.5 truncate">"{suscriptor.mensaje!.texto}"</p>
              {suscriptor.mensaje!.propina && (
                <p className="text-[9px] font-semibold text-amber-500 mt-0.5">🎁 +S/.{suscriptor.mensaje!.propina}</p>
              )}
              <p className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Timer className="w-2.5 h-2.5" />
                {formatTiempo(suscriptor.mensaje!.tiempoRestante)}
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-200/60"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-slate-50"></div>
          </div>
        )}

        <div className={`${sizeClass} rounded-full overflow-hidden ${borderClasses} ${opacity} transition-transform duration-200 ${isHovered ? 'scale-110' : ''} relative`}>
          <img src={suscriptor.avatar} alt={suscriptor.nombre} className="w-full h-full object-cover rounded-full" />

          {suscriptor.avatarPremium && (
            <div className={`absolute inset-0 bg-gradient-to-br ${getAvatarPremiumStyles(suscriptor.avatarPremium).shine} opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 rounded-full`} />
          )}
        </div>

        <div className="mt-1.5 text-center">
          <div className="flex items-center justify-center gap-0.5 max-w-[90px] mx-auto">
            <p className="text-[9px] font-semibold text-gray-700 truncate">
              {suscriptor.nombre.split(' ')[0]}
            </p>
            {suscriptor.avatarPremium && (
              <span className="text-[11px] flex-shrink-0 leading-none">
                {getAvatarPremiumStyles(suscriptor.avatarPremium).badge}
              </span>
            )}
          </div>
        </div>

        {suscriptor.online && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
        )}

        {suscriptor.esPremium && (
          <div className={`absolute top-0 left-0 ${size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md ${opacity}`}>
            <Star className={`${size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-white fill-white`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden flex flex-col ${className}`}>
        <div className="px-4 py-3 bg-gradient-to-br from-rose-50/30 via-white to-violet-50/30 border-b border-rose-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm"><Crown className="w-3 h-3 text-white" /></div>
              <div><h2 className="text-[11px] font-semibold text-gray-800">Tu Comunidad VIP</h2><p className="text-[9px] text-gray-400">{totalOnline} online ahora</p></div>
            </div>
            <span className="px-2 py-1 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 text-[10px] font-semibold rounded-lg border border-rose-200">{suscriptores.length}</span>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTabActivo('todos')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${tabActivo === 'todos'
                  ? 'bg-white text-gray-700 shadow-sm border-2 border-gray-300'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTabActivo('mensajes')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${tabActivo === 'mensajes'
                  ? 'bg-white text-gray-700 shadow-sm border-2 border-gray-300'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
            >
              <MessageCircle className="w-3 h-3" />
              Activos
              {totalMensajes > 0 && (
                <span className="px-1.5 py-0.5 bg-gray-700 text-white text-[8px] font-bold rounded-full">
                  {totalMensajes}
                </span>
              )}
            </button>
            <button
              onClick={() => setTabActivo('historial')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${tabActivo === 'historial'
                  ? 'bg-white text-gray-700 shadow-sm border-2 border-gray-300'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Clock className="w-3 h-3" />
              Historial
              {totalHistorial > 0 && (
                <span className="text-[8px] text-gray-400">({totalHistorial})</span>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              style={{ outline: 'none', boxShadow: 'none' }}
              className="w-full pl-8 pr-3 py-2 text-[10px] bg-rose-50/50 border border-gray-200 rounded-lg focus:border-gray-300 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4 mt-3 text-[9px] text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Propinas ({totalPropinas})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-300"></span>Mensajes ({totalMensajes - totalPropinas})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-300"></span>Online</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[8px] text-gray-400">
            <span className="flex items-center gap-1">💰 Gold</span>
            <span className="flex items-center gap-1">💎 Diamond</span>
            <span className="flex items-center gap-1">⭐ Platinum</span>
            <span className="flex items-center gap-1">🔥 VIP</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tabActivo === 'historial' && (
            <div>
              <div className="flex items-center gap-2 mb-4"><Clock className="w-3.5 h-3.5 text-violet-400" /><span className="text-[10px] font-semibold text-violet-500">Historial de mensajes</span><span className="text-[9px] text-violet-300">({usuariosOrdenados.length})</span></div>
              {usuariosOrdenados.length === 0 ? (
                <div className="text-center py-10"><MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-[11px] text-slate-400">No hay historial de mensajes</p></div>
              ) : (
                <div className="grid grid-cols-3 gap-x-10 gap-y-10">{usuariosOrdenados.map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
              )}
            </div>
          )}

          {tabActivo !== 'historial' && (
            <>
              {usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').length > 0 && (
                <div className="mb-8 pt-2">
                  <div className="flex items-center gap-2 mb-4"><Gift className="w-3.5 h-3.5 text-rose-400" /><span className="text-[10px] font-semibold text-rose-500">Propinas</span><span className="text-[9px] text-rose-300">({usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').length})</span></div>
                  <div className="grid grid-cols-3 gap-x-10 gap-y-10">{usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).length > 0 && (
                <div className="mb-8 pt-2">
                  <div className="flex items-center gap-2 mb-4"><MessageCircle className="w-3.5 h-3.5 text-fuchsia-400" /><span className="text-[10px] font-semibold text-fuchsia-500">Mensajes</span><span className="text-[9px] text-fuchsia-300">({usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).length})</span></div>
                  <div className="grid grid-cols-3 gap-x-10 gap-y-10">{usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div><span className="text-[10px] font-semibold text-slate-500">Online</span><span className="text-[9px] text-slate-400">({usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length})</span></div>
                  <div className="flex flex-wrap gap-8 content-start">{usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).map((suscriptor) => <AvatarItem key={suscriptor.id} suscriptor={suscriptor} />)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div><span className="text-[10px] font-semibold text-slate-400">Offline</span><span className="text-[9px] text-slate-300">({usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length})</span></div>
                  <div className="flex flex-wrap gap-6 content-start">{usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).map((suscriptor) => <AvatarItem key={suscriptor.id} suscriptor={suscriptor} size="small" />)}</div>
                </div>
              )}
              {usuariosOrdenados.length === 0 && <div className="flex items-center justify-center h-full"><div className="text-center py-10"><MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-[11px] text-slate-400">No hay resultados</p></div></div>}
            </>
          )}
        </div>
        <div className="px-4 py-2.5 bg-gradient-to-r from-rose-50/30 to-pink-50/30 border-t border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px]"><span className="text-gray-400">{suscriptores.length} suscriptores</span><span className="text-emerald-500 font-medium">+4 nuevos</span></div>
            <button onClick={() => setShowVerTodos(true)} className="flex items-center gap-1 text-[10px] text-rose-500 hover:text-rose-600 font-medium transition-colors"><Users className="w-3.5 h-3.5" />Ver todos<ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={closeToast}
        position="top"
        duration={3000}
      />

      {/* MODAL "VER TODOS" - Estilo oscuro profesional */}
      {showVerTodos && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => setShowVerTodos(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col border border-rose-100" onClick={(e) => e.stopPropagation()}>

            {/* ✅ HEADER VIP PREMIUM */}
            <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 rounded-t-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Todos los Suscriptores</h3>
                    <p className="text-[10px] text-gray-500">{usuariosVerTodos.length} de {suscriptores.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerTodos(false)}
                  className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-1.5 mb-3">
                {[
                  { key: 'todos', label: 'Todos', count: suscriptores.length },
                  { key: 'online', label: 'Online', count: totalOnline },
                  { key: 'premium', label: 'VIP', count: totalPremium },
                  { key: 'mensajes', label: 'Mensajes', count: totalMensajes }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFiltroVerTodos(f.key as any)}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all ${filtroVerTodos === f.key
                        ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm'
                        : 'bg-white text-gray-500 hover:bg-rose-50 border border-rose-200'
                      }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-3 py-2 text-[10px] bg-white rounded-lg outline-none border border-rose-200 focus:border-rose-300"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {usuariosVerTodos.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[11px] text-slate-400">No hay resultados</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {usuariosVerTodos.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        if (!s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')) {
                          toast(`${s.nombre} no está en línea`, 'error');
                          return;
                        }
                        setSuscriptorSeleccionado(s);
                        setShowVerTodos(false);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${s.mensaje?.propina
                          ? 'bg-amber-50/50 hover:bg-amber-50'
                          : s.mensaje
                            ? 'bg-teal-50/50 hover:bg-teal-50'
                            : 'hover:bg-slate-50'
                        }`}
                    >
                      <div className="relative">
                        <img
                          src={s.avatar}
                          alt=""
                          className={`w-10 h-10 rounded-full object-cover border ${s.mensaje?.propina
                              ? 'border-amber-300'
                              : s.mensaje
                                ? 'border-teal-300'
                                : s.online
                                  ? 'border-emerald-200'
                                  : 'border-slate-200'
                            } ${!s.online && !s.mensaje ? 'opacity-50' : ''}`}
                        />
                        {s.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                        )}
                        {s.esPremium && (
                          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                            <Star className="w-2 h-2 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-semibold text-slate-700 truncate">{s.nombre}</p>
                          {s.mensaje?.propina && (
                            <span className="px-1.5 py-0.5 bg-amber-400 text-white text-[8px] font-bold rounded">
                              S/.{s.mensaje.propina}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 truncate">@{s.username}</p>
                        {s.mensaje && s.mensaje.estado === 'nuevo' && (
                          <p className="text-[9px] text-slate-500 truncate mt-0.5">"{s.mensaje.texto}"</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* MODAL "RESPONDER MENSAJE" - Estilo oscuro profesional */}
      {suscriptorSeleccionado && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => setSuscriptorSeleccionado(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden border border-rose-100" onClick={(e) => e.stopPropagation()}>

            {/* ✅ HEADER VIP PREMIUM */}
            <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative cursor-pointer" onClick={() => handleIrAlChat(suscriptorSeleccionado.username)}>
                  <img
                    src={suscriptorSeleccionado.avatar}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover hover:ring-2 hover:ring-rose-300 transition-all"
                    onClick={(e) => { e.stopPropagation(); navigate(`/perfil-usuario/${suscriptorSeleccionado.username}`); }}
                  />
                  {suscriptorSeleccionado.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p
                    className="text-[12px] font-semibold text-gray-800 hover:text-gray-600 cursor-pointer transition-colors"
                    onClick={() => navigate(`/perfil-usuario/${suscriptorSeleccionado.username}`)}
                  >
                    {suscriptorSeleccionado.nombre}
                  </p>
                  <p className="text-[10px] text-gray-500">@{suscriptorSeleccionado.username}</p>
                </div>
              </div>
              <button
                onClick={() => setSuscriptorSeleccionado(null)}
                className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {suscriptorSeleccionado.mensaje?.propina && suscriptorSeleccionado.mensaje.estado === 'nuevo' && (
              <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] text-amber-600 font-semibold">+S/.{suscriptorSeleccionado.mensaje.propina}</span>
              </div>
            )}

            {suscriptorSeleccionado.mensaje && suscriptorSeleccionado.mensaje.estado === 'nuevo' ? (
              <div className="p-4">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-[11px] text-gray-700">{suscriptorSeleccionado.mensaje.texto}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResponder()}
                    placeholder="Responder..."
                    style={{ outline: 'none', boxShadow: 'none' }}
                    className="flex-1 px-4 py-2 text-[11px] bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-300 transition-all"
                    maxLength={200}
                  />
                  <button
                    onClick={handleResponder}
                    disabled={!respuesta.trim()}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${respuesta.trim()
                        ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white'
                        : 'bg-rose-100 text-rose-300'
                      }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-[11px] text-gray-500">Sin mensajes pendientes</p>
              </div>
            )}

            {/* ✅ FOOTER VIP PREMIUM */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-violet-50/30 border-t border-rose-100 flex items-center justify-between">
              {suscriptorSeleccionado.mensaje && suscriptorSeleccionado.mensaje.estado === 'nuevo' ? (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTiempo(suscriptorSeleccionado.mensaje.tiempoRestante)}</span>
                </div>
              ) : (
                <div />
              )}
              <button
                onClick={() => handleIrAlChat(suscriptorSeleccionado.username)}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-[11px] font-semibold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ir al chat privado
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

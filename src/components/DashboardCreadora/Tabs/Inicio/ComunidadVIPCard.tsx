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
      online: Math.random() < 0.25,
      esPremium: Math.random() < 0.2,
      mensaje: tieneMsg ? {
        texto: mensajesEjemplo[Math.floor(Math.random() * mensajesEjemplo.length)],
        propina: tienePropina ? Math.floor(Math.random() * 50) + 10 : undefined,
        tiempoRestante: Math.floor(Math.random() * 300) + 30,
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
    const sizeClass = size === 'small' ? 'w-10 h-10' : 'w-11 h-11';
    const borderColor = suscriptor.mensaje?.propina && suscriptor.mensaje.estado === 'nuevo'
      ? 'border-2 border-rose-400'
      : suscriptor.mensaje && suscriptor.mensaje.estado === 'nuevo'
        ? 'border-2 border-fuchsia-300'
        : suscriptor.online
          ? 'border-2 border-emerald-300'
          : 'border border-slate-200';
    const opacity = !suscriptor.online && (!suscriptor.mensaje || suscriptor.mensaje.estado !== 'nuevo') ? 'opacity-50' : '';
    const tieneMensajeActivo = suscriptor.mensaje && suscriptor.mensaje.estado === 'nuevo';

    const isHovered = hoveredSuscriptorId === suscriptor.id;

    return (
      <div
        className="relative cursor-pointer group/avatar flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();

          if (!suscriptor.online && (!suscriptor.mensaje || suscriptor.mensaje.estado !== 'nuevo')) {
            toast(`${suscriptor.nombre} no está en línea`, 'error');
            return;
          }

          setSuscriptorSeleccionado(suscriptor);
        }}
        onMouseEnter={() => handleMouseEnterAvatar(suscriptor.id)}
        onMouseLeave={handleMouseLeaveAvatar}
      >
        {tabActivo === 'historial' && suscriptor.historialMensajes && suscriptor.historialMensajes.length > 0 && (
          <div className={`mb-1.5 relative z-50 transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-lg border border-slate-200/60 px-3 py-2 min-w-[140px] max-w-[160px]">
              <p className="text-[10px] font-semibold text-slate-700 truncate">{suscriptor.nombre}</p>
              <p className="text-[9px] text-slate-500 mt-0.5 truncate">"{suscriptor.historialMensajes[0].texto}"</p>
              {suscriptor.historialMensajes[0].respuesta && (
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCheck className="w-2.5 h-2.5 text-emerald-500" />
                  <p className="text-[8px] text-emerald-600">Respondido</p>
                </div>
              )}
              <p className="text-[8px] text-slate-400 mt-0.5">{formatFechaRelativa(suscriptor.historialMensajes[0].fecha)}</p>
              <p className="text-[7px] text-slate-400 mt-1 text-center">Click para ver</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-200/60"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-slate-50"></div>
          </div>
        )}

        {tieneMensajeActivo && tabActivo !== 'historial' && (
          <div className={`mb-1.5 relative z-50 transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
            <div className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-lg border border-slate-200/60 px-3 py-2 min-w-[140px] max-w-[160px]">
              <p className="text-[10px] font-semibold text-slate-700 truncate">{suscriptor.nombre}</p>
              {suscriptor.mensaje && (
                <>
                  <p className="text-[9px] text-slate-500 mt-0.5 truncate">"{suscriptor.mensaje.texto}"</p>
                  {suscriptor.mensaje.propina && <p className="text-[9px] font-semibold text-amber-500 mt-0.5">🎁 +S/.{suscriptor.mensaje.propina}</p>}
                  <p className="text-[8px] text-slate-400 mt-0.5 flex items-center gap-1"><Timer className="w-2.5 h-2.5" />{formatTiempo(suscriptor.mensaje.tiempoRestante)}</p>
                </>
              )}
              <p className="text-[7px] text-slate-400 mt-1 text-center">Click para más</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-200/60"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-slate-50"></div>
          </div>
        )}

        <div className={`${sizeClass} rounded-full overflow-hidden ${borderColor} ${opacity} transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
          <img src={suscriptor.avatar} alt={suscriptor.nombre} className="w-full h-full object-cover" />
        </div>
        {suscriptor.online && <div className="absolute bottom-0 right-1/2 translate-x-3 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />}
        {suscriptor.esPremium && <div className={`absolute top-auto bottom-0 right-1/2 -translate-x-3 ${size === 'small' ? 'w-3 h-3' : 'w-3.5 h-3.5'} bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-sm ${opacity}`}><Star className={`${size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2'} text-white fill-white`} /></div>}
      </div>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col ${className}`}>
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm"><Crown className="w-3 h-3 text-white" /></div>
              <div><h2 className="text-[11px] font-semibold text-slate-800">Tu Comunidad VIP</h2><p className="text-[9px] text-slate-400">{totalOnline} online ahora</p></div>
            </div>
            <span className="px-2 py-1 bg-violet-50 text-violet-600 text-[10px] font-semibold rounded-lg">{suscriptores.length}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setTabActivo('todos')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${tabActivo === 'todos' ? 'bg-white text-slate-700 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Todos</button>
            <button onClick={() => setTabActivo('mensajes')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${tabActivo === 'mensajes' ? 'bg-white text-slate-700 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><MessageCircle className="w-3 h-3" />Activos{totalMensajes > 0 && <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded-full">{totalMensajes}</span>}</button>
            <button onClick={() => setTabActivo('historial')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${tabActivo === 'historial' ? 'bg-white text-slate-700 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><Clock className="w-3 h-3" />Historial{totalHistorial > 0 && <span className="text-[8px] text-slate-400">({totalHistorial})</span>}</button>
          </div>
          <div className="relative"><Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." className="w-full pl-8 pr-3 py-2 text-[10px] bg-slate-50 border border-violet-100 rounded-lg outline-none focus:border-violet-200 focus:bg-white transition-all" /></div>
          <div className="flex items-center gap-4 mt-3 text-[9px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span>Propinas ({totalPropinas})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-300"></span>Mensajes ({totalMensajes - totalPropinas})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-300"></span>Online</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tabActivo === 'historial' && (
            <div>
              <div className="flex items-center gap-2 mb-4"><Clock className="w-3.5 h-3.5 text-violet-400" /><span className="text-[10px] font-semibold text-violet-500">Historial de mensajes</span><span className="text-[9px] text-violet-300">({usuariosOrdenados.length})</span></div>
              {usuariosOrdenados.length === 0 ? (
                <div className="text-center py-10"><MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-[11px] text-slate-400">No hay historial de mensajes</p></div>
              ) : (
                <div className="grid grid-cols-3 gap-x-8 gap-y-8">{usuariosOrdenados.map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
              )}
            </div>
          )}

          {tabActivo !== 'historial' && (
            <>
              {usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').length > 0 && (
                <div className="mb-8 pt-2">
                  <div className="flex items-center gap-2 mb-4"><Gift className="w-3.5 h-3.5 text-rose-400" /><span className="text-[10px] font-semibold text-rose-500">Propinas</span><span className="text-[9px] text-rose-300">({usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').length})</span></div>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-8">{usuariosOrdenados.filter(s => s.mensaje?.propina && s.mensaje.estado === 'nuevo').map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).length > 0 && (
                <div className="mb-8 pt-2">
                  <div className="flex items-center gap-2 mb-4"><MessageCircle className="w-3.5 h-3.5 text-fuchsia-400" /><span className="text-[10px] font-semibold text-fuchsia-500">Mensajes</span><span className="text-[9px] text-fuchsia-300">({usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).length})</span></div>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-8">{usuariosOrdenados.filter(s => s.mensaje && s.mensaje.estado === 'nuevo' && !s.mensaje.propina).map((suscriptor) => <div key={suscriptor.id} className="flex justify-center"><AvatarItem suscriptor={suscriptor} /></div>)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div><span className="text-[10px] font-semibold text-slate-500">Online</span><span className="text-[9px] text-slate-400">({usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length})</span></div>
                  <div className="flex flex-wrap gap-6 content-start">{usuariosOrdenados.filter(s => s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).map((suscriptor) => <AvatarItem key={suscriptor.id} suscriptor={suscriptor} />)}</div>
                </div>
              )}
              {usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div><span className="text-[10px] font-semibold text-slate-400">Offline</span><span className="text-[9px] text-slate-300">({usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).length})</span></div>
                  <div className="flex flex-wrap gap-4 content-start">{usuariosOrdenados.filter(s => !s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')).map((suscriptor) => <AvatarItem key={suscriptor.id} suscriptor={suscriptor} size="small" />)}</div>
                </div>
              )}
              {usuariosOrdenados.length === 0 && <div className="flex items-center justify-center h-full"><div className="text-center py-10"><MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-[11px] text-slate-400">No hay resultados</p></div></div>}
            </>
          )}
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px]"><span className="text-slate-400">{suscriptores.length} suscriptores</span><span className="text-emerald-500 font-medium">+4 nuevos</span></div>
            <button onClick={() => setShowVerTodos(true)} className="flex items-center gap-1 text-[10px] text-violet-500 hover:text-violet-600 font-medium transition-colors"><Users className="w-3.5 h-3.5" />Ver todos<ChevronRight className="w-3.5 h-3.5" /></button>
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

      {showVerTodos && createPortal(
        <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4" onClick={() => setShowVerTodos(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"><Users className="w-3.5 h-3.5 text-white" /></div><div><h3 className="text-[11px] font-semibold text-slate-800">Todos los Suscriptores</h3><p className="text-[9px] text-slate-400">{usuariosVerTodos.length} de {suscriptores.length}</p></div></div>
                <button onClick={() => setShowVerTodos(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-1.5 mb-3">{[{ key: 'todos', label: 'Todos', count: suscriptores.length }, { key: 'online', label: 'Online', count: totalOnline }, { key: 'premium', label: 'VIP', count: totalPremium }, { key: 'mensajes', label: 'Mensajes', count: totalMensajes }].map(f => <button key={f.key} onClick={() => setFiltroVerTodos(f.key as any)} className={`flex-1 py-1.5 rounded-lg text-[8px] font-medium transition-all ${filtroVerTodos === f.key ? 'bg-violet-100 text-violet-600' : 'text-slate-400 hover:bg-slate-100'}`}>{f.label} ({f.count})</button>)}</div>
              <div className="relative"><Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." className="w-full pl-8 pr-3 py-2 text-[10px] bg-white rounded-lg outline-none border border-violet-100 focus:border-violet-200" /></div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {usuariosVerTodos.length === 0 ? <div className="text-center py-10"><Users className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-[11px] text-slate-400">No hay resultados</p></div> : <div className="space-y-1.5">{usuariosVerTodos.map(s => <div key={s.id} onClick={() => {
                if (!s.online && (!s.mensaje || s.mensaje.estado !== 'nuevo')) {
                  toast(`${s.nombre} no está en línea`, 'error');
                  return;
                }
                setSuscriptorSeleccionado(s); setShowVerTodos(false);
              }} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${s.mensaje?.propina ? 'bg-amber-50/50 hover:bg-amber-50' : s.mensaje ? 'bg-teal-50/50 hover:bg-teal-50' : 'hover:bg-slate-50'}`}><div className="relative"><img src={s.avatar} alt="" className={`w-10 h-10 rounded-full object-cover border ${s.mensaje?.propina ? 'border-amber-300' : s.mensaje ? 'border-teal-300' : s.online ? 'border-emerald-200' : 'border-slate-200'} ${!s.online && !s.mensaje ? 'opacity-50' : ''}`} />{s.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}{s.esPremium && <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center"><Star className="w-2 h-2 text-white fill-white" /></div>}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-[11px] font-semibold text-slate-700 truncate">{s.nombre}</p>{s.mensaje?.propina && <span className="px-1.5 py-0.5 bg-amber-400 text-white text-[8px] font-bold rounded">S/.{s.mensaje.propina}</span>}</div><p className="text-[9px] text-slate-400 truncate">@{s.username}</p>{s.mensaje && s.mensaje.estado === 'nuevo' && <p className="text-[9px] text-slate-500 truncate mt-0.5">"{s.mensaje.texto}"</p>}</div><ChevronRight className="w-4 h-4 text-slate-300" /></div>)}</div>}
            </div>
          </div>
        </div>,
        document.body
      )}

      {suscriptorSeleccionado && createPortal(
        <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4" onClick={() => setSuscriptorSeleccionado(null)}>
          <div className="w-full max-w-xs bg-white rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 flex items-center justify-between bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative cursor-pointer" onClick={() => handleIrAlChat(suscriptorSeleccionado.username)}><img src={suscriptorSeleccionado.avatar} alt="" className="w-11 h-11 rounded-full object-cover hover:ring-2 hover:ring-violet-300 transition-all" onClick={(e) => { e.stopPropagation(); navigate(`/perfil-usuario/${suscriptorSeleccionado.username}`); }} />{suscriptorSeleccionado.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}</div>
                <div><p className="text-[12px] font-semibold text-slate-700 hover:text-violet-600 cursor-pointer transition-colors" onClick={() => navigate(`/perfil-usuario/${suscriptorSeleccionado.username}`)}>{suscriptorSeleccionado.nombre}</p><p className="text-[10px] text-slate-400">@{suscriptorSeleccionado.username}</p></div>
              </div>
              <button onClick={() => setSuscriptorSeleccionado(null)} className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            {suscriptorSeleccionado.mensaje?.propina && <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2"><Gift className="w-4 h-4 text-amber-500" /><span className="text-[11px] text-amber-600 font-semibold">+S/.{suscriptorSeleccionado.mensaje.propina}</span></div>}
            {suscriptorSeleccionado.mensaje ? <div className="p-4"><div className="bg-slate-50 rounded-xl p-3"><p className="text-[11px] text-slate-600">{suscriptorSeleccionado.mensaje.texto}</p></div>{suscriptorSeleccionado.mensaje.estado === 'nuevo' && <div className="flex items-center gap-2 mt-3"><input type="text" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleResponder()} placeholder="Responder..." className="flex-1 px-4 py-2 text-[11px] bg-slate-50 border border-violet-100 rounded-xl outline-none focus:border-violet-200" maxLength={200} /><button onClick={handleResponder} disabled={!respuesta.trim()} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${respuesta.trim() ? 'bg-violet-500 text-white hover:bg-violet-600' : 'bg-slate-100 text-slate-300'}`}><Send className="w-4 h-4" /></button></div>}</div> : <div className="p-6 text-center"><p className="text-[11px] text-slate-400">Sin mensajes pendientes</p></div>}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">{suscriptorSeleccionado.mensaje && suscriptorSeleccionado.mensaje.estado === 'nuevo' ? <div className="flex items-center gap-1.5 text-[10px] text-slate-400"><Timer className="w-3.5 h-3.5" /><span>{formatTiempo(suscriptorSeleccionado.mensaje.tiempoRestante)}</span></div> : <div />}<button onClick={() => handleIrAlChat(suscriptorSeleccionado.username)} className="px-4 py-2 bg-violet-500 text-white text-[10px] font-semibold rounded-xl flex items-center gap-2 hover:bg-violet-600 transition-colors"><MessageCircle className="w-3.5 h-3.5" />Ir al chat privado</button></div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Video as VideoIcon, Calendar as CalendarIcon, Trash2, Play, Radio, Crown, X, Sparkles, Globe, ChevronLeft, ChevronRight, Eye, MessageCircle, Send, ThumbsDown, ThumbsUp, Coins, Clock, Check, Plus, Users, User, Shuffle, ThumbsUp as Vote, Trash, Lightbulb, ChevronUp, ChevronDown } from 'lucide-react';
import { CalendarioModal, EventoCalendario } from '../../../Modals/CalendarioModal';
import { useTransmision } from '../../../../contexts/TransmisionContext';
import { ConfirmDeleteModalFotoPublicacion } from '../../../Modals/ConfirmDeleteModal.tsx';
import { ComunidadVIPCard } from './ComunidadVIPCard';
import { MomentosSection } from './MomentosSection';
import { ComposerSection } from './ComposerSection';
import { ModalProgramarTransmision } from './ModalProgramarTransmision';
import { ConfirmDetenerTransmision } from '../../../Modals/ConfirmDetenerTransmision';

interface Usuario { id: string; nombre: string; username: string; avatar: string; }
interface Comentario { id: string; usuario: Usuario; texto: string; fecha: Date; }
interface Publicacion { id: string; tipo: 'foto' | 'video' | 'texto'; visibilidad: 'publico' | 'suscriptores'; contenido: string; archivos?: File[]; fechaPublicacion: Date; meGusta: Usuario[]; noMeGusta: Usuario[]; vistas: Usuario[]; comentarios: Comentario[]; }
interface Reto { id: string; descripcion: string; votos: number; estado: 'activo' | 'completado'; creadoPor: 'creadora' | 'suscriptor'; creador?: Usuario; fechaCreacion: Date; }
interface Programacion { id: string; titulo: string; fecha: Date; hora: string; tipo: 'gratis' | 'suscriptores' | 'ppv'; precio?: number; }

export const MiActividadTab = ({ onProgramarEvento }: { onProgramarEvento?: () => void } = {}) => {
  const { enTransmision, iniciarTransmisionExterna, detenerTransmisionExterna } = useTransmision();

  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showTipoTransmisionModal, setShowTipoTransmisionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageFiles, setCurrentImageFiles] = useState<File[]>([]);
  const [showMeGustaModal, setShowMeGustaModal] = useState(false);
  const [showNoMeGustaModal, setShowNoMeGustaModal] = useState(false);
  const [showVistosModal, setShowVistosModal] = useState(false);
  const [showComentariosModal, setShowComentariosModal] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<Publicacion | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioEntrada, setPrecioEntrada] = useState(15);
  const [descripcionEntrada, setDescripcionEntrada] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState<string | null>(null);
  const [fotoIndexAEliminar, setFotoIndexAEliminar] = useState<number | null>(null);
  const [panelProgramacionAbierto, setPanelProgramacionAbierto] = useState(false);
  const [panelRetosAbierto, setPanelRetosAbierto] = useState(false);
  const [retosActivos, setRetosActivos] = useState(false);
  const [modoRetos, setModoRetos] = useState<'creadora' | 'suscriptores' | 'mixto'>('creadora');
  const [nuevoReto, setNuevoReto] = useState('');
  const [showConfirmDetener, setShowConfirmDetener] = useState(false);

  const [retos, setRetos] = useState<Reto[]>([
    { id: '1', descripcion: 'Baila tu canción favorita en live', votos: 45, estado: 'activo', creadoPor: 'creadora', fechaCreacion: new Date() },
    { id: '2', descripcion: 'Haz un Q&A respondiendo preguntas picantes', votos: 38, estado: 'activo', creadoPor: 'creadora', fechaCreacion: new Date() },
    { id: '3', descripcion: 'Cocina tu plato favorito en vivo', votos: 27, estado: 'activo', creadoPor: 'suscriptor', creador: { id: '1', nombre: 'Carlos M.', username: 'carlos', avatar: 'https://i.pravatar.cc/150?img=12' }, fechaCreacion: new Date() },
    { id: '4', descripcion: 'Muestra tu rutina de skincare', votos: 19, estado: 'completado', creadoPor: 'suscriptor', creador: { id: '2', nombre: 'Ana G.', username: 'ana', avatar: 'https://i.pravatar.cc/150?img=5' }, fechaCreacion: new Date() },
  ]);
  const [ideasLiveActivo, setIdeasLiveActivo] = useState(false);
  const [modoIdeasLive, setModoIdeasLive] = useState<'creadora' | 'suscriptores' | 'mixto'>('mixto');
  const [nuevaIdeaLive, setNuevaIdeaLive] = useState('');
  const [ideasLive, setIdeasLive] = useState<Reto[]>([
    { id: 'l1', descripcion: 'Tutorial de maquillaje en vivo', votos: 52, estado: 'activo', creadoPor: 'suscriptor', creador: { id: '1', nombre: 'Laura S.', username: 'laura', avatar: 'https://i.pravatar.cc/150?img=9' }, fechaCreacion: new Date() },
    { id: 'l2', descripcion: 'Karaoke con suscriptores', votos: 41, estado: 'activo', creadoPor: 'creadora', fechaCreacion: new Date() },
    { id: 'l3', descripcion: 'Preguntas y respuestas sin filtro', votos: 35, estado: 'activo', creadoPor: 'suscriptor', creador: { id: '2', nombre: 'Pedro R.', username: 'pedro', avatar: 'https://i.pravatar.cc/150?img=15' }, fechaCreacion: new Date() },
  ]);
  const [showModalProgramacion, setShowModalProgramacion] = useState(false);
  const [programaciones, setProgramaciones] = useState<Programacion[]>([
    { id: '1', titulo: 'Live especial viernes', fecha: new Date(Date.now() + 86400000 * 2), hora: '20:00', tipo: 'suscriptores' },
    { id: '2', titulo: 'Q&A con suscriptores', fecha: new Date(Date.now() + 86400000 * 5), hora: '18:00', tipo: 'gratis' },
  ]);

  const retosActivosCount = retos.filter(r => r.estado === 'activo').length;
  const ideasLiveCount = ideasLive.filter(i => i.estado === 'activo').length;
  const [panelIdeasLiveAbierto, setPanelIdeasLiveAbierto] = useState(false);
  const anyPanelOpen = panelProgramacionAbierto || panelRetosAbierto || panelIdeasLiveAbierto;

  const cerrarTooltip = () => { if ((window as any).closeComunidadVIPTooltip) (window as any).closeComunidadVIPTooltip(); };
  const abrirPanelProgramacion = () => { cerrarTooltip(); setPanelRetosAbierto(false); setPanelIdeasLiveAbierto(false); setPanelProgramacionAbierto(!panelProgramacionAbierto); };
  const abrirPanelRetos = () => { cerrarTooltip(); setPanelProgramacionAbierto(false); setPanelIdeasLiveAbierto(false); setPanelRetosAbierto(!panelRetosAbierto); };
  const abrirPanelIdeasLive = () => { cerrarTooltip(); setPanelProgramacionAbierto(false); setPanelRetosAbierto(false); setPanelIdeasLiveAbierto(!panelIdeasLiveAbierto); };

  const usuariosEjemplo: Usuario[] = [
    { id: '1', nombre: 'Juan Pérez', username: 'juan', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', nombre: 'Ana García', username: 'ana', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', nombre: 'Carlos Ruiz', username: 'carlos', avatar: 'https://i.pravatar.cc/150?img=33' },
  ];

  const handleGuardarEvento = (evento: Omit<EventoCalendario, 'id'>) => { setEventos(prev => [...prev, { ...evento, id: Date.now().toString() }]); onProgramarEvento?.(); };

  const handleConfirmarTransmision = () => {
    if (!tipoSeleccionado) return;

    if (tipoSeleccionado === 'ppv') {
      if (!precioEntrada || precioEntrada <= 0) {
        alert('Ingresa un precio válido');
        return;
      }
      if (!descripcionEntrada.trim()) {
        alert('Ingresa una descripción');
        return;
      }
    }

    setShowTipoTransmisionModal(false);
    iniciarTransmisionExterna(
      tipoSeleccionado,
      tipoSeleccionado === 'ppv' ? precioEntrada : 0,
      tipoSeleccionado === 'ppv' ? descripcionEntrada : ''
    );

    setTipoSeleccionado('gratis');
    setPrecioEntrada(15);
    setDescripcionEntrada('');
  };

  const handleDetenerTransmision = () => {
    setShowConfirmDetener(true);
  };

  const confirmarDetenerTransmision = async () => {
    setShowConfirmDetener(false);
    await detenerTransmisionExterna();
  };

  const handleNuevaPublicacion = (pub: Publicacion) => setPublicaciones(prev => [pub, ...prev]);
  const handleOpenImageModal = (files: File[], index: number) => { setCurrentImageFiles(files); setCurrentImageIndex(index); setShowImageModal(true); };
  const simularInteracciones = (pubId: string) => { setPublicaciones(prev => prev.map(p => p.id === pubId && p.meGusta.length === 0 ? { ...p, meGusta: usuariosEjemplo.slice(0, 2), noMeGusta: usuariosEjemplo.slice(2, 3), vistas: usuariosEjemplo } : p)); };
  const handleEnviarComentario = () => { if (!nuevoComentario.trim() || !publicacionSeleccionada) return; const comentario: Comentario = { id: Date.now().toString(), usuario: { id: 'c', nombre: 'Tú', username: 'm', avatar: 'https://i.pravatar.cc/150?img=47' }, texto: nuevoComentario, fecha: new Date() }; setPublicaciones(prev => prev.map(p => p.id === publicacionSeleccionada.id ? { ...p, comentarios: [...p.comentarios, comentario] } : p)); setPublicacionSeleccionada(prev => prev ? { ...prev, comentarios: [...prev.comentarios, comentario] } : null); setNuevoComentario(''); };
  const handleConfirmarEliminar = () => { if (publicacionAEliminar) { if (fotoIndexAEliminar !== null) { setPublicaciones(prev => prev.map(p => { if (p.id === publicacionAEliminar && p.archivos) { const n = p.archivos.filter((_, i) => i !== fotoIndexAEliminar); return n.length === 0 ? null : { ...p, archivos: n }; } return p; }).filter(Boolean) as Publicacion[]); } else { setPublicaciones(prev => prev.filter(p => p.id !== publicacionAEliminar)); } } setShowDeleteModal(false); setPublicacionAEliminar(null); setFotoIndexAEliminar(null); };
  const handleCrearReto = () => { if (!nuevoReto.trim()) return; setRetos(prev => [{ id: Date.now().toString(), descripcion: nuevoReto, votos: 0, estado: 'activo', creadoPor: 'creadora', fechaCreacion: new Date() }, ...prev]); setNuevoReto(''); };
  const handleCompletarReto = (retoId: string) => setRetos(prev => prev.map(r => r.id === retoId ? { ...r, estado: 'completado' } : r));
  const handleEliminarReto = (retoId: string) => setRetos(prev => prev.filter(r => r.id !== retoId));
  const handleCrearIdeaLive = () => { if (!nuevaIdeaLive.trim()) return; setIdeasLive(prev => [{ id: Date.now().toString(), descripcion: nuevaIdeaLive, votos: 0, estado: 'activo', creadoPor: 'creadora', fechaCreacion: new Date() }, ...prev]); setNuevaIdeaLive(''); };
  const handleEliminarIdeaLive = (ideaId: string) => setIdeasLive(prev => prev.filter(i => i.id !== ideaId));

  const handleCrearProgramacion = (nuevaProg: { titulo: string; fecha: Date | null; hora: string; tipo: 'gratis' | 'suscriptores' | 'ppv'; precio: number; ideaSeleccionada: string }) => {
    if (!nuevaProg.titulo.trim() || !nuevaProg.fecha || !nuevaProg.hora) return;
    const prog: Programacion = {
      id: Date.now().toString(),
      titulo: nuevaProg.titulo,
      fecha: nuevaProg.fecha,
      hora: nuevaProg.hora,
      tipo: nuevaProg.tipo,
      precio: nuevaProg.tipo === 'ppv' ? nuevaProg.precio : undefined
    };
    setProgramaciones(prev => [...prev, prog].sort((a, b) => a.fecha.getTime() - b.fecha.getTime()));
    if (nuevaProg.ideaSeleccionada) setIdeasLive(prev => prev.filter(i => i.id !== nuevaProg.ideaSeleccionada));
  };

  const handleEliminarProgramacion = (progId: string) => setProgramaciones(prev => prev.filter(p => p.id !== progId));

  const formatFecha = (fecha: Date) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' ' + meses[fecha.getMonth()];
  };

  const retosActuales = retos.filter(r => r.estado === 'activo').sort((a, b) => b.votos - a.votos);
  const retosCompletados = retos.filter(r => r.estado === 'completado');

  const ListaUsuarios = ({ usuarios, titulo }: { usuarios: Usuario[], titulo: string }) => (
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => { setShowMeGustaModal(false); setShowNoMeGustaModal(false); setShowVistosModal(false); }}>
      <div className="bg-white rounded-xl shadow-xl max-w-xs w-full max-h-[60vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-slate-700">{titulo} ({usuarios.length})</h3>
          <button onClick={() => { setShowMeGustaModal(false); setShowNoMeGustaModal(false); setShowVistosModal(false); }} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {usuarios.length === 0 ? (
            <p className="text-[10px] text-slate-400 text-center py-6">Nadie aún</p>
          ) : (
            usuarios.map(u => (
              <button key={u.id} onClick={() => navigate('/perfil-usuario/' + u.username)} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-left transition-all">
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                <p className="text-[10px] font-semibold text-slate-700">{u.nombre}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-4 pt-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5"><ComunidadVIPCard className="h-[calc(100vh-50px)] sticky top-1" /></div>
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6"><MomentosSection compact={true} /></div>
              <div className="col-span-3"><div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 h-full flex flex-col"><div className="flex items-center gap-1.5 mb-1"><div className="w-5 h-5 bg-gradient-to-br from-rose-300 to-pink-400 rounded-lg flex items-center justify-center"><Lightbulb className="w-2.5 h-2.5 text-white" /></div><h3 className="text-[10px] font-bold text-slate-700">Contenido sugerido</h3>{retosActivos && retosActivosCount > 0 && <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">({retosActivosCount})</span>}</div><p className="text-[10px] text-slate-500 leading-relaxed mb-2 flex-1">Deja que tus suscriptores propongan ideas de contenido</p><div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg"><span className="text-[9px] font-medium text-slate-600">{retosActivos ? '💡 Activo' : 'Activar'}</span><button onClick={() => { setRetosActivos(!retosActivos); if (!retosActivos) { setPanelProgramacionAbierto(false); setPanelIdeasLiveAbierto(false); setPanelRetosAbierto(true); } }} className={'relative w-9 h-5 rounded-full transition-all duration-200 ' + (retosActivos ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-slate-300')}><div className={'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ' + (retosActivos ? 'left-[18px]' : 'left-0.5')} /></button></div></div></div>
              <div className="col-span-3"><div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 h-full flex flex-col"><div className="flex items-center gap-1.5 mb-1"><div className="w-5 h-5 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg flex items-center justify-center"><Radio className="w-2.5 h-2.5 text-white" /></div><h3 className="text-[10px] font-bold text-slate-700">Ideas para live</h3>{ideasLiveActivo && ideasLiveCount > 0 && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">({ideasLiveCount})</span>}</div><p className="text-[10px] text-slate-500 leading-relaxed mb-2 flex-1">Recibe sugerencias para tu próximo en vivo</p><div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg"><span className="text-[9px] font-medium text-slate-600">{ideasLiveActivo ? '🎯 Activo' : 'Activar'}</span><button onClick={() => { setIdeasLiveActivo(!ideasLiveActivo); if (!ideasLiveActivo) { setPanelProgramacionAbierto(false); setPanelRetosAbierto(false); setPanelIdeasLiveAbierto(true); } }} className={'relative w-9 h-5 rounded-full transition-all duration-200 ' + (ideasLiveActivo ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-slate-300')}><div className={'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ' + (ideasLiveActivo ? 'left-[18px]' : 'left-0.5')} /></button></div></div></div>
            </div>
            <ComposerSection onPublicar={handleNuevaPublicacion} retosSugeridos={retos} retosActivos={retosActivos} />
            <div className="space-y-3">
              {publicaciones.length === 0 ? (
                <div className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 rounded-2xl border-2 border-rose-200/50 p-12 text-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-100/20 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-100/20 to-transparent rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Sparkles className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">¡Tu comunidad VIP te espera!</h3>
                    <p className="text-[11px] text-gray-600 leading-relaxed max-w-xs mx-auto">
                      Comparte contenido exclusivo y conecta con tus suscriptores más fieles
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="w-2 h-2 rounded-full bg-rose-300"></div>
                      <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                      <div className="w-2 h-2 rounded-full bg-rose-300"></div>
                    </div>
                  </div>
                </div>
              ) : publicaciones.map(pub => (
                <div key={pub.id} className={'bg-white rounded-xl shadow-sm overflow-hidden border ' + (pub.visibilidad === 'publico' ? 'border-emerald-100' : (pub as any).esPPV ? 'border-amber-100' : 'border-fuchsia-100')}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=47" alt="" className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-700">Tú</p>
                          <p className="text-[9px] text-slate-400">Hace {Math.floor((Date.now() - pub.fechaPublicacion.getTime()) / 60000)} min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pub.meGusta.length === 0 && (
                          <button onClick={() => simularInteracciones(pub.id)} className="text-[8px] px-2 py-1 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all">
                            Simular
                          </button>
                        )}
                        {(pub as any).ideaSugerida && (
                          <span className="px-2 py-1 text-[8px] font-bold rounded-full bg-rose-100 text-rose-600 flex items-center gap-1">
                            📣 Pedido por la comunidad
                          </span>
                        )}
                        <span className={'px-2.5 py-1 text-[8px] font-bold rounded-full flex items-center gap-1 ' + (pub.visibilidad === 'publico' ? 'bg-emerald-500 text-white' : (pub as any).esPPV ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-fuchsia-500 text-white')}>
                          {pub.visibilidad === 'publico' ? (
                            <>
                              <Globe className="w-3 h-3" />
                              PÚBLICO
                            </>
                          ) : (pub as any).esPPV ? (
                            <>
                              <Coins className="w-3 h-3" />
                              PPV S/.{(pub as any).precioPPV}
                            </>
                          ) : (
                            <>
                              <Crown className="w-3 h-3" />
                              SUSCRIPTORES
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-3 leading-relaxed whitespace-pre-line">{pub.contenido}</p>
                    {pub.archivos && pub.archivos.length > 0 && (
                      <div className={'mb-3 ' + (pub.archivos.length === 1 ? '' : 'grid grid-cols-2 gap-2')}>
                        {pub.archivos.map((file, i) => (
                          <div
                            key={i}
                            className={'relative rounded-xl overflow-hidden cursor-pointer group ' + (pub.archivos!.length === 1 ? 'max-h-[380px]' : 'h-[240px]')}
                            onClick={() => handleOpenImageModal(pub.archivos!, i)}
                          >
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                              <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                                <Eye className="w-3 h-3 text-slate-600" />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPublicacionAEliminar(pub.id);
                                  setFotoIndexAEliminar(i);
                                  setShowDeleteModal(true);
                                }}
                                className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm"
                              >
                                <Trash2 className="w-3 h-3 text-white" />
                              </button>
                            </div>
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className={pub.archivos!.length === 1 ? 'max-h-[380px] w-full object-cover rounded-xl' : 'w-full h-full object-cover'}
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white/60" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setPublicacionSeleccionada(pub);
                          setShowMeGustaModal(true);
                        }}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{pub.meGusta.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPublicacionSeleccionada(pub);
                          setShowNoMeGustaModal(true);
                        }}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{pub.noMeGusta.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPublicacionSeleccionada(pub);
                          setShowVistosModal(true);
                        }}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{pub.vistas.length}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPublicacionSeleccionada(pub);
                          setShowComentariosModal(true);
                        }}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-violet-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{pub.comentarios.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR BOTONES */}
      <div className={'fixed top-1/2 -translate-y-1/2 z-[9000] flex flex-col gap-2 transition-all duration-300 ' + (anyPanelOpen ? 'right-[340px]' : 'right-0')}>
        <button onClick={abrirPanelProgramacion} className={'w-16 rounded-l-2xl flex flex-col items-center justify-center gap-1 text-white shadow-lg transition-all pb-2 pt-3 ' + (panelProgramacionAbierto ? 'bg-gradient-to-b from-red-600 to-rose-700' : 'bg-gradient-to-b from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700')}><div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center"><Radio className="w-4 h-4" /></div><span className="text-[7px] font-bold tracking-wide">EN VIVO</span><div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mt-1">{panelProgramacionAbierto ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</div></button>
        {retosActivos && (<button onClick={abrirPanelRetos} className={'w-16 rounded-l-2xl flex flex-col items-center justify-center gap-1 text-white shadow-lg transition-all relative pb-2 pt-3 ' + (panelRetosAbierto ? 'bg-gradient-to-b from-rose-400 to-pink-500' : 'bg-gradient-to-b from-rose-300 to-pink-400 hover:from-rose-400 hover:to-pink-500')}><div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center"><Lightbulb className="w-4 h-4" /></div><span className="text-[7px] font-bold tracking-wide">SUGERIDO</span>{retosActivosCount > 0 && <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] bg-rose-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-md px-1">{retosActivosCount}</span>}<div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mt-1">{panelRetosAbierto ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</div></button>)}
        {ideasLiveActivo && (<button onClick={abrirPanelIdeasLive} className={'w-16 rounded-l-2xl flex flex-col items-center justify-center gap-1 text-white shadow-lg transition-all relative pb-2 pt-3 ' + (panelIdeasLiveAbierto ? 'bg-gradient-to-b from-amber-500 to-orange-500' : 'bg-gradient-to-b from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500')}><div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center"><Radio className="w-4 h-4" /></div><span className="text-[7px] font-bold tracking-wide">IDEAS</span>{ideasLiveCount > 0 && <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] bg-amber-700 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-md px-1">{ideasLiveCount}</span>}<div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mt-1">{panelIdeasLiveAbierto ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</div></button>)}
      </div>

      {/* PANEL EN VIVO */}
      <div className={'fixed top-0 right-0 h-full bg-white shadow-2xl border-l border-slate-200 transition-transform duration-300 ease-in-out z-[8999] ' + (panelProgramacionAbierto ? 'translate-x-0' : 'translate-x-full')} style={{ width: '340px' }}>
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
            <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              EN VIVO
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-gradient-to-r from-red-50/40 to-rose-50/40 rounded-xl border border-red-100/50">
              <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-red-500" />
                Gestión de transmisiones
              </h4>
              <button
                onClick={() => setPanelProgramacionAbierto(false)}
                className="w-6 h-6 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all text-white shadow-sm flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setShowModalProgramacion(true)}
                className="px-2.5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg text-[10px] font-bold hover:from-red-600 hover:to-rose-700 transition-all flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="text-[9px]">Programar transmisión</span>
              </button>

              {!enTransmision ? (
                <button
                  onClick={() => setShowTipoTransmisionModal(true)}
                  className="px-2.5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg text-[10px] font-bold hover:from-rose-600 hover:to-pink-700 transition-all flex flex-col items-center justify-center gap-1 shadow-sm"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span className="text-[9px]">Iniciar Transmisión</span>
                </button>
              ) : (
                <button
                  onClick={handleDetenerTransmision}
                  className="px-2.5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-sm animate-pulse"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[9px]">🔴 Detener</span>
                  <span className="text-[7px] opacity-90">(En vivo)</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 font-semibold mb-3">
              📅 Próximas transmisiones ({programaciones.length})
            </p>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              {programaciones.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-4">
                  No hay transmisiones programadas
                </p>
              ) : (
                programaciones.map(prog => (
                  <div key={prog.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-slate-700">{prog.titulo}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatFecha(prog.fecha)} - {prog.hora}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={'text-[8px] px-2 py-1 rounded-full font-bold ' +
                          (prog.tipo === 'gratis' ? 'bg-emerald-50 text-emerald-600' :
                            prog.tipo === 'suscriptores' ? 'bg-fuchsia-50 text-fuchsia-600' :
                              'bg-amber-50 text-amber-600')}>
                          {prog.tipo === 'gratis' ? 'PÚBLICO' : prog.tipo === 'suscriptores' ? 'SUBS' : 'PPV'}
                        </span>
                        <button
                          onClick={() => handleEliminarProgramacion(prog.id)}
                          className="w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL CONTENIDO SUGERIDO */}
      <div className={'fixed top-0 right-0 h-full bg-white shadow-2xl border-l border-slate-200 transition-transform duration-300 ease-in-out z-[8998] ' + (panelRetosAbierto ? 'translate-x-0' : 'translate-x-full')} style={{ width: '340px' }}>
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
            <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-rose-400" />
              Contenido Sugerido
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-gradient-to-r from-rose-50/40 to-pink-50/40 rounded-xl border border-rose-100/50">
              <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-rose-400" />
                Configuración de sugerencias
              </h4>
              <button
                onClick={() => setPanelRetosAbierto(false)}
                className="w-6 h-6 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all text-white shadow-sm flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 font-medium">¿Quién sugiere el contenido?</p>

                <button
                  onClick={() => {
                    if (modoRetos === 'creadora') {
                      console.log('Notificar: Solicitar votación');
                    } else if (modoRetos === 'suscriptores') {
                      console.log('Notificar: Solicitar ideas');
                    } else {
                      console.log('Notificar: Abrir participación');
                    }
                  }}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-lg text-[8px] font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  {modoRetos === 'creadora' && (
                    <>
                      <Vote className="w-3 h-3" />
                      Solicitar votación
                    </>
                  )}
                  {modoRetos === 'suscriptores' && (
                    <>
                      <Lightbulb className="w-3 h-3" />
                      Solicitar ideas
                    </>
                  )}
                  {modoRetos === 'mixto' && (
                    <>
                      <Sparkles className="w-3 h-3" />
                      Abrir participación
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setModoRetos('creadora')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoRetos === 'creadora' ? 'bg-rose-50 text-rose-600 border-2 border-rose-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <User className="w-4 h-4" />
                  Yo
                </button>
                <button
                  onClick={() => setModoRetos('suscriptores')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoRetos === 'suscriptores' ? 'bg-rose-50 text-rose-600 border-2 border-rose-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <Users className="w-4 h-4" />
                  Subs
                </button>
                <button
                  onClick={() => setModoRetos('mixto')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoRetos === 'mixto' ? 'bg-rose-50 text-rose-600 border-2 border-rose-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <Shuffle className="w-4 h-4" />
                  Mixto
                </button>
              </div>
            </div>

            {(modoRetos === 'creadora' || modoRetos === 'mixto') && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Escribe una sugerencia..."
                  value={nuevoReto}
                  onChange={e => setNuevoReto(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCrearReto()}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
                />
                <button
                  onClick={handleCrearReto}
                  disabled={!nuevoReto.trim()}
                  className="w-8 h-8 bg-rose-400 text-white rounded-lg disabled:bg-slate-300 hover:bg-rose-500 transition-all flex items-center justify-center flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <p className="text-[9px] text-slate-400 mb-3 italic">
              {modoRetos === 'creadora' ? '👆 Tú propones ideas, tus suscriptores votan' :
                modoRetos === 'suscriptores' ? '👥 Tus suscriptores proponen y votan las ideas' :
                  '🤝 Ambos pueden proponer, todos votan'}
            </p>

            <h4 className="text-[11px] font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Vote className="w-4 h-4 text-rose-400" />
              Ideas de la comunidad
            </h4>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                <span>💡 Ideas activas ({retosActuales.length})</span>
                <span className="text-rose-400">Por votos</span>
              </p>

              <div className="max-h-[calc(100vh-480px)] overflow-y-auto pr-1 space-y-2">
                {retosActuales.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-4">No hay sugerencias activas</p>
                ) : (
                  retosActuales.map((reto, index) => (
                    <div
                      key={reto.id}
                      className={'p-3 rounded-xl border transition-all group ' +
                        (index === 0 ? 'bg-gradient-to-r from-rose-50/80 to-pink-50/80 border-rose-200' : 'bg-white border-slate-100 hover:border-rose-200')}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {index === 0 && <span className="text-[9px] px-2 py-0.5 bg-rose-400 text-white rounded-full font-bold">🔥 TOP</span>}
                            {reto.creadoPor === 'suscriptor' && reto.creador && (
                              <span className="text-[9px] text-slate-400">por {reto.creador.nombre}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-700 mt-1">{reto.descripcion}</p>
                          <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                            <Vote className="w-3.5 h-3.5" />
                            {reto.votos} votos
                          </span>
                        </div>
                        <button
                          onClick={() => handleEliminarReto(reto.id)}
                          className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          title="Eliminar"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-4 text-center bg-slate-50 p-2.5 rounded-lg">
              💡 Los votos son solo una guía. Tú decides qué contenido crear.
            </p>
          </div>
        </div>
      </div>

      {/* PANEL IDEAS PARA LIVE */}
      <div className={'fixed top-0 right-0 h-full bg-white shadow-2xl border-l border-slate-200 transition-transform duration-300 ease-in-out z-[8997] ' + (panelIdeasLiveAbierto ? 'translate-x-0' : 'translate-x-full')} style={{ width: '340px' }}>
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
            <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              Ideas para Live
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-gradient-to-r from-amber-50/40 to-orange-50/40 rounded-xl border border-amber-100/50">
              <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" />
                Configuración de ideas
              </h4>
              <button
                onClick={() => setPanelIdeasLiveAbierto(false)}
                className="w-6 h-6 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all text-white shadow-sm flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 font-medium">¿Quién sugiere ideas para live?</p>

                <button
                  onClick={() => {
                    if (modoIdeasLive === 'creadora') {
                      console.log('Notificar: Solicitar votación de ideas live');
                    } else if (modoIdeasLive === 'suscriptores') {
                      console.log('Notificar: Solicitar ideas para live');
                    } else {
                      console.log('Notificar: Abrir participación para live');
                    }
                  }}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-lg text-[8px] font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  {modoIdeasLive === 'creadora' && (
                    <>
                      <Vote className="w-3 h-3" />
                      Solicitar votación
                    </>
                  )}
                  {modoIdeasLive === 'suscriptores' && (
                    <>
                      <Lightbulb className="w-3 h-3" />
                      Solicitar ideas
                    </>
                  )}
                  {modoIdeasLive === 'mixto' && (
                    <>
                      <Sparkles className="w-3 h-3" />
                      Abrir participación
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setModoIdeasLive('creadora')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoIdeasLive === 'creadora' ? 'bg-amber-50 text-amber-600 border-2 border-amber-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <User className="w-4 h-4" />
                  Yo
                </button>
                <button
                  onClick={() => setModoIdeasLive('suscriptores')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoIdeasLive === 'suscriptores' ? 'bg-amber-50 text-amber-600 border-2 border-amber-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <Users className="w-4 h-4" />
                  Subs
                </button>
                <button
                  onClick={() => setModoIdeasLive('mixto')}
                  className={'px-3 py-2.5 rounded-lg text-[9px] font-semibold flex flex-col items-center gap-1 transition-all ' +
                    (modoIdeasLive === 'mixto' ? 'bg-amber-50 text-amber-600 border-2 border-amber-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200')}
                >
                  <Shuffle className="w-4 h-4" />
                  Mixto
                </button>
              </div>
            </div>

            {(modoIdeasLive === 'creadora' || modoIdeasLive === 'mixto') && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Escribe una idea para live..."
                  value={nuevaIdeaLive}
                  onChange={e => setNuevaIdeaLive(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCrearIdeaLive()}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-200"
                />
                <button
                  onClick={handleCrearIdeaLive}
                  disabled={!nuevaIdeaLive.trim()}
                  className="w-8 h-8 bg-amber-400 text-white rounded-lg disabled:bg-slate-300 hover:bg-amber-500 transition-all flex items-center justify-center flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <p className="text-[9px] text-slate-400 mb-3 italic">
              {modoIdeasLive === 'creadora' ? '👆 Tú propones ideas, tus suscriptores votan' :
                modoIdeasLive === 'suscriptores' ? '👥 Tus suscriptores proponen y votan' :
                  '🤝 Ambos pueden proponer, todos votan'}
            </p>

            <h4 className="text-[11px] font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Vote className="w-4 h-4 text-amber-500" />
              Ideas de la comunidad
            </h4>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                <span>🎯 Ideas activas ({ideasLive.filter(i => i.estado === 'activo').length})</span>
                <span className="text-amber-500">Por votos</span>
              </p>

              <div className="max-h-[calc(100vh-450px)] overflow-y-auto pr-1 space-y-2">
                {ideasLive.filter(i => i.estado === 'activo').length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-4">No hay ideas para live aún</p>
                ) : (
                  ideasLive.filter(i => i.estado === 'activo').sort((a, b) => b.votos - a.votos).map((idea, index) => (
                    <div
                      key={idea.id}
                      className={'p-3 rounded-xl border transition-all group ' +
                        (index === 0 ? 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200' : 'bg-white border-slate-100 hover:border-amber-200')}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {index === 0 && <span className="text-[9px] px-2 py-0.5 bg-amber-400 text-white rounded-full font-bold">🔥 TOP</span>}
                            {idea.creadoPor === 'suscriptor' && idea.creador && (
                              <span className="text-[9px] text-slate-400">por {idea.creador.nombre}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-700 mt-1">{idea.descripcion}</p>
                          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                            <Vote className="w-3.5 h-3.5" />
                            {idea.votos} votos
                          </span>
                        </div>
                        <button
                          onClick={() => handleEliminarIdeaLive(idea.id)}
                          className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          title="Eliminar"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-4 text-center bg-slate-50 p-2.5 rounded-lg">
              🎯 Las ideas más votadas te guían para tu próximo live.
            </p>
          </div>
        </div>
      </div>

      <CalendarioModal isOpen={showCalendarioModal} onClose={() => setShowCalendarioModal(false)} eventos={eventos} onGuardarEvento={handleGuardarEvento} onEliminarEvento={(id) => setEventos(prev => prev.filter(e => e.id !== id))} />

      <ModalProgramarTransmision
        isOpen={showModalProgramacion}
        onClose={() => setShowModalProgramacion(false)}
        onCrear={handleCrearProgramacion}
        ideasLive={ideasLive}
        ideasLiveActivo={ideasLiveActivo}
      />

      {showConfirmDetener && (
        <ConfirmDetenerTransmision
          isOpen={showConfirmDetener}
          onConfirm={confirmarDetenerTransmision}
          onCancel={() => setShowConfirmDetener(false)}
        />
      )}

{showTipoTransmisionModal && createPortal(
  <div
    className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4"
    onClick={() => setShowTipoTransmisionModal(false)}
  >
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-rose-100" onClick={e => e.stopPropagation()}>
      <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Iniciar Transmisión</h3>
            <p className="text-[10px] text-gray-500">Elige el tipo de acceso</p>
          </div>
        </div>
        <button
          onClick={() => setShowTipoTransmisionModal(false)}
          className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={() => setTipoSeleccionado('gratis')}
          className={'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all border-2 ' +
            (tipoSeleccionado === 'gratis'
              ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-sm'
              : 'bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30')}
        >
          <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'gratis' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300')}>
            {tipoSeleccionado === 'gratis' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
          <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'gratis' ? 'bg-emerald-100' : 'bg-gray-50')}>
            <Globe className={'w-4.5 h-4.5 ' + (tipoSeleccionado === 'gratis' ? 'text-emerald-600' : 'text-gray-400')} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-800">Público (Gratis)</p>
            <p className="text-[9px] text-gray-500 mt-0.5">Cualquiera puede ver tu transmisión</p>
          </div>
        </button>

        <button
          onClick={() => setTipoSeleccionado('suscriptores')}
          className={'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all border-2 ' +
            (tipoSeleccionado === 'suscriptores'
              ? 'bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-300 shadow-sm'
              : 'bg-white border-gray-200 hover:border-fuchsia-200 hover:bg-fuchsia-50/30')}
        >
          <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'suscriptores' ? 'border-fuchsia-500 bg-fuchsia-500' : 'border-gray-300')}>
            {tipoSeleccionado === 'suscriptores' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
          <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'suscriptores' ? 'bg-fuchsia-100' : 'bg-gray-50')}>
            <Crown className={'w-4.5 h-4.5 ' + (tipoSeleccionado === 'suscriptores' ? 'text-fuchsia-600' : 'text-gray-400')} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-800">Solo Suscriptores</p>
            <p className="text-[9px] text-gray-500 mt-0.5">Requiere suscripción activa</p>
          </div>
        </button>

        <button
          onClick={() => setTipoSeleccionado('ppv')}
          className={'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all border-2 ' +
            (tipoSeleccionado === 'ppv'
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-sm'
              : 'bg-white border-gray-200 hover:border-amber-200 hover:bg-amber-50/30')}
        >
          <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'ppv' ? 'border-amber-500 bg-amber-500' : 'border-gray-300')}>
            {tipoSeleccionado === 'ppv' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
          <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' +
            (tipoSeleccionado === 'ppv' ? 'bg-amber-100' : 'bg-gray-50')}>
            <Coins className={'w-4.5 h-4.5 ' + (tipoSeleccionado === 'ppv' ? 'text-amber-600' : 'text-gray-400')} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-800">Pago por Entrada (PPV)</p>
            <p className="text-[9px] text-gray-500 mt-0.5">Cobro único por acceso</p>
          </div>
        </button>

        {tipoSeleccionado === 'ppv' && (
          <div className="mt-3 p-3 bg-amber-50/50 rounded-xl space-y-2.5 border border-amber-200">
            <div>
              <label className="block text-[9px] font-bold text-gray-700 mb-1.5">Precio de entrada (S/.)</label>
              <input
                type="number"
                value={precioEntrada}
                onChange={(e) => setPrecioEntrada(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                min="1"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-700 mb-1.5">Descripción del evento</label>
              <textarea
                value={descripcionEntrada}
                onChange={(e) => setDescripcionEntrada(e.target.value)}
                placeholder="Ej: Show especial de viernes..."
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-[10px] text-gray-700 resize-none focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                rows={2}
                maxLength={100}
              />
              <p className="text-[8px] text-gray-400 mt-1 text-right">{descripcionEntrada.length}/100</p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Footer VIP Premium */}
      <div className="px-4 py-3.5 border-t border-rose-100 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-violet-50/30 flex gap-2.5">
        <button
          onClick={() => setShowTipoTransmisionModal(false)}
          className="flex-1 px-4 py-2.5 bg-white border border-rose-200 text-gray-700 text-[11px] font-bold rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmarTransmision}
          disabled={tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim())}
          className={'flex-1 px-4 py-2.5 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 ' +
            (tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim())
              ? 'bg-rose-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600')}
        >
          <Radio className="w-3.5 h-3.5" />
          Iniciar EN VIVO
        </button>
      </div>
    </div>
  </div>,
  document.body
)}


      {showMeGustaModal && publicacionSeleccionada && createPortal(<ListaUsuarios usuarios={publicacionSeleccionada.meGusta} titulo="Me gusta" />, document.body)}
      {showNoMeGustaModal && publicacionSeleccionada && createPortal(<ListaUsuarios usuarios={publicacionSeleccionada.noMeGusta} titulo="No me gusta" />, document.body)}
      {showVistosModal && publicacionSeleccionada && createPortal(<ListaUsuarios usuarios={publicacionSeleccionada.vistas} titulo="Visto por" />, document.body)}
      {showComentariosModal && publicacionSeleccionada && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => setShowComentariosModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-slate-700">Comentarios ({publicacionSeleccionada.comentarios.length})</h3>
              <button onClick={() => setShowComentariosModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
              {publicacionSeleccionada.comentarios.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-8">Aún no hay comentarios</p>
              ) : (
                publicacionSeleccionada.comentarios.map(c => (
                  <div key={c.id} className="flex items-start gap-2">
                    <img src={c.usuario.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="bg-white rounded-xl px-3 py-2 shadow-sm">
                      <p className="text-[10px] font-semibold text-slate-700">{c.usuario.nombre}</p>
                      <p className="text-[11px] text-slate-600">{c.texto}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviarComentario()}
                placeholder="Escribe un comentario..."
                className="flex-1 px-3 py-2.5 bg-slate-50 rounded-xl text-[11px] focus:outline-none"
              />
              <button
                onClick={handleEnviarComentario}
                disabled={!nuevoComentario.trim()}
                className={'w-9 h-9 rounded-xl flex items-center justify-center transition-all ' + (nuevoComentario.trim() ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-300')}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {showImageModal && createPortal(<div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4" style={{ zIndex: 99999 }} onClick={() => setShowImageModal(false)}><button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"><X className="w-5 h-5" /></button>{currentImageFiles.length > 1 && (<><button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p - 1 + currentImageFiles.length) % currentImageFiles.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"><ChevronLeft className="w-5 h-5" /></button><button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p + 1) % currentImageFiles.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"><ChevronRight className="w-5 h-5" /></button></>)}<div className="max-w-5xl max-h-[85vh]" onClick={e => e.stopPropagation()}>{currentImageFiles[currentImageIndex]?.type.startsWith('image/') ? <img src={URL.createObjectURL(currentImageFiles[currentImageIndex])} alt="" className="max-w-full max-h-full object-contain rounded-xl" /> : <VideoIcon className="w-16 h-16 text-white/50" />}</div>{currentImageFiles.length > 1 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-[11px] font-medium">{currentImageIndex + 1} / {currentImageFiles.length}</div>}</div>, document.body)}
      {showDeleteModal && createPortal(<ConfirmDeleteModalFotoPublicacion onConfirm={handleConfirmarEliminar} onCancel={() => { setShowDeleteModal(false); setPublicacionAEliminar(null); setFotoIndexAEliminar(null); }} esEliminacionFoto={fotoIndexAEliminar !== null} />, document.body)}
    
    </div>
  );
};
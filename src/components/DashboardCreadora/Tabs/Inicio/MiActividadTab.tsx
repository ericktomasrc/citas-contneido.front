import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Image, Video as VideoIcon, Calendar as CalendarIcon, Clock,
  Edit2, Trash2, Play, Radio, Crown, X, Sparkles, Heart,
  Info, Lock, Globe, Camera, ChevronLeft, ChevronRight, Eye,
  MessageCircle, Send, ThumbsDown, ThumbsUp
} from 'lucide-react';
import { CalendarioModal, EventoCalendario } from '../../../Modals/CalendarioModal';
import { useTransmision } from '../../../../contexts/TransmisionContext';
import { ConfirmDeleteModalFotoPublicacion } from '../../../Modals/ConfirmDeleteModal.tsx';

interface Usuario {
  id: string;
  nombre: string;
  username: string;
  avatar: string;
}

interface Comentario {
  id: string;
  usuario: Usuario;
  texto: string;
  fecha: Date;
}

interface Publicacion {
  id: string;
  tipo: 'foto' | 'video' | 'texto';
  visibilidad: 'publico' | 'suscriptores';
  contenido: string;
  descripcion?: string;
  mediaUrl?: string;
  archivos?: File[];
  fechaPublicacion: Date;
  meGusta: Usuario[];
  noMeGusta: Usuario[];
  vistas: Usuario[];
  comentarios: Comentario[];
}

interface MiActividadTabProps {
  onProgramarEvento?: () => void;
}

export const MiActividadTab = ({ onProgramarEvento }: MiActividadTabProps = {}) => {
  const { startTransmision, isTransmisionActive } = useTransmision();
  const navigate = useNavigate();

  // Estados
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [showCalendarioModal, setShowCalendarioModal] = useState(false);
  const [showTipoTransmisionModal, setShowTipoTransmisionModal] = useState(false);
  const [nuevoPost, setNuevoPost] = useState('');
  const [visibilidad, setVisibilidad] = useState<'publico' | 'suscriptores'>('publico');

  // Estados para modales de captura
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showVideoRecordModal, setShowVideoRecordModal] = useState(false);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [descripcionArchivos, setDescripcionArchivos] = useState('');

  // Estados para modal de imagen fullscreen
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageFiles, setCurrentImageFiles] = useState<File[]>([]);

  // Estados para modales de detalles
  const [showMeGustaModal, setShowMeGustaModal] = useState(false);
  const [showNoMeGustaModal, setShowNoMeGustaModal] = useState(false);
  const [showVistosModal, setShowVistosModal] = useState(false);
  const [showComentariosModal, setShowComentariosModal] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<Publicacion | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // Estados para tipo de transmisión
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioEntrada, setPrecioEntrada] = useState(15);
  const [descripcionEntrada, setDescripcionEntrada] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Usuarios de ejemplo para simular interacciones
  const usuariosEjemplo: Usuario[] = [
    { id: '1', nombre: 'Juan Pérez', username: 'juan-perez-x7m3', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', nombre: 'Ana García', username: 'ana-garcia-k9p2', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', nombre: 'Carlos Ruiz', username: 'carlos-ruiz-m4n8', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: '4', nombre: 'Lucía Torres', username: 'lucia-torres-q2w7', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: '5', nombre: 'Miguel Ángel', username: 'miguel-angel-r5t1', avatar: 'https://i.pravatar.cc/150?img=15' },
  ];

  // Handlers de Eventos
  const handleGuardarEvento = (evento: Omit<EventoCalendario, 'id'>) => {
    const nuevoEvento: EventoCalendario = { ...evento, id: Date.now().toString() };
    setEventos(prev => [...prev, nuevoEvento]);
    onProgramarEvento?.();
  };

  const handleEliminarEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
  };

  const handleIniciarEvento = (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    alert(`Iniciando: ${evento.titulo}`);
  };

  const handleAbrirModalTransmision = () => {
    setShowTipoTransmisionModal(true);
  };

  const handleConfirmarTransmision = () => {
    if (tipoSeleccionado === 'ppv') {
      if (!precioEntrada || precioEntrada < 1 || !descripcionEntrada.trim()) {
        alert('⚠️ Completa precio y descripción');
        return;
      }
    }
    startTransmision(tipoSeleccionado, precioEntrada, descripcionEntrada);
    setShowTipoTransmisionModal(false);
    setTipoSeleccionado('gratis');
    setPrecioEntrada(15);
    setDescripcionEntrada('');
  };

  // Handler para publicar texto
  const handlePublicar = () => {
    if (!nuevoPost.trim()) return;

    const nuevaPublicacion: Publicacion = {
      id: Date.now().toString(),
      tipo: 'texto',
      visibilidad,
      contenido: nuevoPost,
      fechaPublicacion: new Date(),
      meGusta: [],
      noMeGusta: [],
      vistas: [],
      comentarios: []
    };

    setPublicaciones(prev => [nuevaPublicacion, ...prev]);
    setNuevoPost('');
  };

  // Handler seleccionar archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setArchivosSeleccionados(files);
      setShowPreviewModal(true);
    }
  };

  // Handler confirmar subida de archivos
  const handleConfirmarSubida = () => {
    const nuevaPublicacion: Publicacion = {
      id: Date.now().toString(),
      tipo: archivosSeleccionados.some(f => f.type.startsWith('video/')) ? 'video' : 'foto',
      visibilidad,
      contenido: descripcionArchivos,
      archivos: archivosSeleccionados,
      fechaPublicacion: new Date(),
      meGusta: [],
      noMeGusta: [],
      vistas: [],
      comentarios: []
    };

    setPublicaciones(prev => [nuevaPublicacion, ...prev]);
    handleCancelarPreview();
  };

  // Handler cancelar preview
  const handleCancelarPreview = () => {
    setShowPreviewModal(false);
    setArchivosSeleccionados([]);
    setDescripcionArchivos('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handler abrir cámara
  const handleAbrirCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      setShowCameraModal(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      alert('No se pudo acceder a la cámara');
    }
  };

  // Handler capturar foto
  const handleCapturarFoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setArchivosSeleccionados([file]);
        handleCerrarCamera();
        setShowPreviewModal(true);
      }
    }, 'image/jpeg');
  };

  // Handler cerrar cámara
  const handleCerrarCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCameraModal(false);
  };

  // Handler abrir grabadora de video
  const handleAbrirVideoRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      setShowVideoRecordModal(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      alert('No se pudo acceder a la cámara/micrófono');
    }
  };

  // Handler grabar video
  const handleGrabarVideo = () => {
    alert('Grabación de video: Funcionalidad en desarrollo');
    handleCerrarVideoRecorder();
  };

  // Handler cerrar grabadora
  const handleCerrarVideoRecorder = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setShowVideoRecordModal(false);
  };

  // Handler abrir imagen en modal
  const handleOpenImageModal = (files: File[], index: number) => {
    setCurrentImageFiles(files);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  // Handler navegación de imágenes
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImageFiles.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImageFiles.length) % currentImageFiles.length);
  };

  // Handlers para abrir modales de detalles
  const handleAbrirMeGusta = (pub: Publicacion) => {
    setPublicacionSeleccionada(pub);
    setShowMeGustaModal(true);
  };

  const handleAbrirNoMeGusta = (pub: Publicacion) => {
    setPublicacionSeleccionada(pub);
    setShowNoMeGustaModal(true);
  };

  const handleAbrirVistos = (pub: Publicacion) => {
    setPublicacionSeleccionada(pub);
    setShowVistosModal(true);
  };

  const handleAbrirComentarios = (pub: Publicacion) => {
    setPublicacionSeleccionada(pub);
    setShowComentariosModal(true);
  };

  // Handler enviar comentario
  const handleEnviarComentario = () => {
    if (!nuevoComentario.trim() || !publicacionSeleccionada) return;

    const comentario: Comentario = {
      id: Date.now().toString(),
      usuario: {
        id: 'creadora',
        nombre: 'Tú',
        username: 'maria-lima1',
        avatar: 'https://i.pravatar.cc/150?img=47'
      },
      texto: nuevoComentario,
      fecha: new Date()
    };

    setPublicaciones(prev => prev.map(pub => {
      if (pub.id === publicacionSeleccionada.id) {
        return {
          ...pub,
          comentarios: [...pub.comentarios, comentario]
        };
      }
      return pub;
    }));

    setPublicacionSeleccionada(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comentarios: [...prev.comentarios, comentario]
      };
    });

    setNuevoComentario('');
  };

  // Handler ir a perfil de usuario
  const handleIrAPerfil = (username: string) => {
    navigate(`/perfil-usuario/${username}`);
  };

  // Simular interacciones (para demo)
  const simularInteracciones = (pubId: string) => {
    setPublicaciones(prev => prev.map(pub => {
      if (pub.id === pubId && pub.meGusta.length === 0) {
        const numUsuarios = Math.floor(Math.random() * 5) + 1;
        return {
          ...pub,
          meGusta: usuariosEjemplo.slice(0, numUsuarios),
          noMeGusta: usuariosEjemplo.slice(numUsuarios, numUsuarios + 1),
          vistas: usuariosEjemplo
        };
      }
      return pub;
    }));
  };

  const getBadgeEvento = (evento: EventoCalendario) => {
    if (evento.tipoAcceso === 'publico') {
      return <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-green-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-green-200 shadow-sm"><Globe className="w-3 h-3" />Gratis</span>;
    }
    if (evento.tipoAcceso === 'suscriptores') {
      return <span className="px-2.5 py-1 bg-gradient-to-r from-pink-50 to-fuchsia-50 text-pink-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-pink-200 shadow-sm"><Crown className="w-3 h-3" />Suscriptores</span>;
    }
    if (evento.tipoAcceso === 'ppv') {
      return <span className="px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 border border-amber-200 shadow-sm"><span className="text-sm">💰</span>S/.{evento.precioPPV}</span>;
    }
  };

  const esEventoHoy = (fecha: Date) => {
    const hoy = new Date();
    const fechaEvento = new Date(fecha);
    return hoy.toDateString() === fechaEvento.toDateString();
  };

  // Modal de transmisión
  const modalTransmision = showTipoTransmisionModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-b border-red-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30"><Radio className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tipo de Transmisión</h3>
              <p className="text-xs text-slate-600">Selecciona el tipo de acceso</p>
            </div>
          </div>
          <button onClick={() => setShowTipoTransmisionModal(false)} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-3">
          <button onClick={() => setTipoSeleccionado('gratis')} className={`w-full p-4 rounded-xl border-2 transition-all text-left ${tipoSeleccionado === 'gratis' ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md shadow-green-100' : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${tipoSeleccionado === 'gratis' ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                {tipoSeleccionado === 'gratis' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-bold text-slate-900">Público (Gratis)</h4>
                </div>
                <p className="text-xs text-slate-600">Cualquiera puede ver sin costo</p>
              </div>
            </div>
          </button>

          <button onClick={() => setTipoSeleccionado('suscriptores')} className={`w-full p-4 rounded-xl border-2 transition-all text-left ${tipoSeleccionado === 'suscriptores' ? 'border-pink-500 bg-gradient-to-br from-pink-50 via-fuchsia-50 to-pink-50 shadow-md shadow-pink-100' : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${tipoSeleccionado === 'suscriptores' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'}`}>
                {tipoSeleccionado === 'suscriptores' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-pink-600" />
                  <h4 className="text-sm font-bold text-slate-900">Solo Suscriptores</h4>
                </div>
                <p className="text-xs text-slate-600">Requiere suscripción mensual</p>
              </div>
            </div>
          </button>

          <button onClick={() => setTipoSeleccionado('ppv')} className={`w-full p-4 rounded-xl border-2 transition-all text-left ${tipoSeleccionado === 'ppv' ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md shadow-indigo-100' : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${tipoSeleccionado === 'ppv' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                {tipoSeleccionado === 'ppv' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💰</span>
                  <h4 className="text-sm font-bold text-slate-900">Pago por Entrada</h4>
                </div>
                <p className="text-xs text-slate-600">Cobro único para este live</p>
              </div>
            </div>
          </button>

          {tipoSeleccionado === 'ppv' && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Precio (S/.) <span className="text-red-500">*</span></label>
                <input type="number" value={precioEntrada} onChange={(e) => setPrecioEntrada(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="15" min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Descripción <span className="text-red-500">*</span></label>
                <textarea value={descripcionEntrada} onChange={(e) => setDescripcionEntrada(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" placeholder="Ej: Live especial..." rows={2} maxLength={100} />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button onClick={() => setShowTipoTransmisionModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm">Cancelar</button>
          <button onClick={handleConfirmarTransmision} disabled={tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim())} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${tipoSeleccionado === 'ppv' && (!precioEntrada || !descripcionEntrada.trim()) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/30'}`}>Iniciar</button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Componente reutilizable para lista de usuarios
  const ListaUsuarios = ({ usuarios, titulo }: { usuarios: Usuario[], titulo: string }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden max-h-[70vh] flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
          <h3 className="text-sm font-bold text-slate-900">{titulo} ({usuarios.length})</h3>
          <button onClick={() => { setShowMeGustaModal(false); setShowNoMeGustaModal(false); setShowVistosModal(false); }} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-slate-200 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {usuarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">Nadie aún</p>
            </div>
          ) : (
            <div className="space-y-2">
              {usuarios.map(usuario => (
                <button
                  key={usuario.id}
                  onClick={() => handleIrAPerfil(usuario.username)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-pink-50 hover:to-fuchsia-50 rounded-lg transition text-left group"
                >
                  <img
                    src={usuario.avatar}
                    alt={usuario.nombre}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:border-pink-300 flex-shrink-0 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{usuario.nombre}</p>
                    <p className="text-xs text-slate-500 truncate">@{usuario.username}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-pink-600 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 1. ACTUALIZA LOS ESTADOS para manejar eliminación de foto individual
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState<string | null>(null);
  const [fotoIndexAEliminar, setFotoIndexAEliminar] = useState<number | null>(null); // NUEVO

  // 2. ACTUALIZA LAS FUNCIONES DE ELIMINACIÓN
  const handleAbrirModalEliminar = (pubId: string, fotoIndex: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setPublicacionAEliminar(pubId);
    setFotoIndexAEliminar(fotoIndex); // null = eliminar toda la publicación, número = eliminar solo esa foto
    setShowDeleteModal(true);
  };

  const handleConfirmarEliminar = () => {
    if (publicacionAEliminar) {
      if (fotoIndexAEliminar !== null) {
        // ELIMINAR SOLO UNA FOTO
        setPublicaciones(prev => prev.map(pub => {
          if (pub.id === publicacionAEliminar && pub.archivos) {
            const nuevosArchivos = pub.archivos.filter((_, idx) => idx !== fotoIndexAEliminar);

            // Si era la última foto, elimina toda la publicación
            if (nuevosArchivos.length === 0) {
              return null;
            }

            return {
              ...pub,
              archivos: nuevosArchivos
            };
          }
          return pub;
        }).filter(pub => pub !== null) as Publicacion[]);
      } else {
        // ELIMINAR TODA LA PUBLICACIÓN
        setPublicaciones(prev => prev.filter(p => p.id !== publicacionAEliminar));
      }
    }
    setShowDeleteModal(false);
    setPublicacionAEliminar(null);
    setFotoIndexAEliminar(null);
  };

  const handleCancelarEliminar = () => {
    setShowDeleteModal(false);
    setPublicacionAEliminar(null);
    setFotoIndexAEliminar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* COLUMNA IZQUIERDA (8 cols) */}
        <div className="lg:col-span-8 space-y-3">

          {/* ✨ COMPOSER PREMIUM LIMPIO - REQ 1: BORDE DE COLOR */}
          <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex bg-slate-50 rounded-xl p-1">
                <button onClick={() => setVisibilidad('publico')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${visibilidad === 'publico' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Globe className="w-3.5 h-3.5" />Público
                </button>
                <button onClick={() => setVisibilidad('suscriptores')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${visibilidad === 'suscriptores' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Crown className="w-3.5 h-3.5" />Premium
                </button>
              </div>
            </div>

            <div className="flex gap-2.5">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Avatar"
                className="w-9 h-9 rounded-full shadow-sm flex-shrink-0 object-cover"
              />

              <div className="flex-1 relative">
                {/* REQ 1: BORDE SEGÚN TIPO DE CONTENIDO */}
                <input
                  type="text"
                  value={nuevoPost}
                  onChange={(e) => setNuevoPost(e.target.value)}
                  placeholder={visibilidad === 'publico'
                    ? '¿Qué quieres compartir con todos?'
                    : '✨ Contenido VIP exclusivo para tus suscriptores...'}
                  className={`w-full pl-4 pr-32 py-2.5 rounded-full text-sm focus:outline-none focus:ring-0
                  ${visibilidad === 'publico'
                      ? 'bg-emerald-50/30 border border-emerald-200 focus:border-emerald-300 focus:bg-emerald-50/50'
                      : 'bg-pink-50/30 border border-pink-200 focus:border-pink-300 focus:bg-pink-50/50'
                    }`}
                  maxLength={500}
                />

                {/* REQ 3: ICONOS LUCIDE REACT */}
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <label className="cursor-pointer">
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
                    <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all" title="Subir foto/video">
                      <Image className="w-4.5 h-4.5" />
                    </div>
                  </label>

                  <button onClick={handleAbrirCamera} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all" title="Tomar foto">
                    <Camera className="w-4.5 h-4.5" />
                  </button>

                  <button onClick={handleAbrirVideoRecorder} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all" title="Grabar video">
                    <VideoIcon className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handlePublicar}
                disabled={!nuevoPost.trim()}
                className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm flex-shrink-0 ${!nuevoPost.trim() ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : visibilidad === 'publico' ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white' : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white'}`}
              >
                Publicar
              </button>
            </div>

            {nuevoPost.length > 0 && (
              <div className="mt-2 text-right"><span className="text-[10px] text-slate-400">{nuevoPost.length}/500</span></div>
            )}
          </div>

          {/* ✨ PUBLICACIONES - REQ 2: BADGE ARRIBA A LA DERECHA */}
          <div className="space-y-3">
            {publicaciones.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-3"><Sparkles className="w-7 h-7 text-slate-400" /></div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">¡Tu comunidad te espera!</h3>
                <p className="text-xs text-slate-600">Comparte tu primer contenido</p>
              </div>
            ) : (
              publicaciones.map(pub => (
                <div key={pub.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">

                  {/* REQ 2: BADGE ARRIBA A LA DERECHA EN PUBLICACIONES */}
                  <div className="absolute top-3 right-3 z-10">
                    {pub.visibilidad === 'publico' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        PÚBLICO
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <div className="relative p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Avatar"
                        className="w-8 h-8 rounded-full shadow-sm flex-shrink-0 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-xs">Tú</p>
                        <p className="text-[10px] text-slate-500">Hace {Math.floor((Date.now() - pub.fechaPublicacion.getTime()) / 60000)} min</p>
                      </div>

                      {pub.meGusta.length === 0 && (
                        <button
                          onClick={() => simularInteracciones(pub.id)}
                          className="text-[9px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all"
                        >
                          Simular
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 mb-2 leading-relaxed">{pub.contenido}</p>

                    {/* Galería limpia */}
                    {pub.archivos && pub.archivos.length > 0 && (
                      <div className={`mb-3 ${pub.archivos.length === 1 ? '' : 'grid grid-cols-2 gap-2'}`}>
                        {pub.archivos.map((file, i) => (
                          <div
                            key={i}
                            className={`group/img relative rounded-xl overflow-hidden cursor-pointer 
                    transition-all duration-300
                    border border-slate-200 hover:border-blue-300
                    ${pub.archivos!.length === 1
                                ? 'max-h-[600px] flex items-center justify-center bg-slate-50'
                                : 'aspect-square'
                              }`}
                            onClick={() => handleOpenImageModal(pub.archivos!, i)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent 
                        opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10" />

                            {/* Botones en hover - MÁS PEQUEÑOS */}
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 
                        transition-all duration-300 z-30">
                              {/* Botón Ver - MÁS PEQUEÑO */}
                              <div className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full 
                          flex items-center justify-center shadow-lg">
                                <Eye className="w-3.5 h-3.5 text-slate-700" />
                              </div>

                              {/* Botón Eliminar - MÁS PEQUEÑO - ELIMINA SOLO ESTA FOTO */}
                              <button
                                onClick={(e) => handleAbrirModalEliminar(pub.id, i, e)}
                                className="w-7 h-7 bg-red-500/95 hover:bg-red-600 backdrop-blur-sm 
                       rounded-full flex items-center justify-center shadow-lg hover:scale-110
                       transition-all duration-200"
                                title="Eliminar esta foto"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>

                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className={`${pub.archivos!.length === 1
                                  ? 'max-h-[600px] w-auto mx-auto'
                                  : 'w-full h-full object-cover'
                                  } transition-transform duration-300 group-hover/img:scale-[1.01]`}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 
                          flex items-center justify-center">
                                <div className="text-center">
                                  <Play className="w-12 h-12 text-white/80 mx-auto mb-2" />
                                  <p className="text-xs text-white/60 font-semibold">Video</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MÉTRICAS */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleAbrirMeGusta(pub)}
                        className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300"
                      >
                        <div className="relative">
                          <ThumbsUp className="w-4 h-4 text-slate-600 group-hover/btn:text-green-600 transition-all" />
                          {pub.meGusta.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{pub.meGusta.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirNoMeGusta(pub)}
                        className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300"
                      >
                        <ThumbsDown className="w-4 h-4 text-slate-600 group-hover/btn:text-red-600 transition-all" />
                        <span className="text-xs font-bold text-slate-700">{pub.noMeGusta.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirVistos(pub)}
                        className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-600 transition-all" />
                        <span className="text-xs font-bold text-slate-700">{pub.vistas.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirComentarios(pub)}
                        className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-600 group-hover/btn:text-pink-600 transition-all" />
                        <span className="text-xs font-bold text-slate-700">{pub.comentarios.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA (4 cols) */}
        <div className="lg:col-span-4 space-y-3">

          <div className="grid grid-cols-2 gap-2">
            {/* 🔴 BOTÓN EN VIVO */}
            <button
              onClick={handleAbrirModalTransmision}
              disabled={isTransmisionActive}
              className={`group relative px-3 py-2 rounded-xl font-bold text-xs transition-all duration-300 overflow-hidden shadow-sm ${isTransmisionActive ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-md hover:scale-105'}`}
            >
              {!isTransmisionActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              <div className="relative flex items-center justify-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span className="truncate">En Vivo</span>
              </div>
            </button>

            <button
              onClick={() => setShowCalendarioModal(true)}
              className="group relative px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            >
              <div className="flex items-center justify-center gap-1.5 text-slate-700">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="truncate">Programar</span>
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900">Sugerencias</h3>
            </div>
            <div className="p-3">
              <div className="text-center py-6">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500">Próximamente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-600" />
                Próximos Eventos
                <span className="ml-auto px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full font-bold">
                  {eventos.length}
                </span>
              </h3>
            </div>

            <div className="p-3 max-h-[400px] overflow-y-auto">
              {eventos.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CalendarIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Sin eventos</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Programa tu primer evento</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {eventos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()).map(evento => {
                    const esHoy = esEventoHoy(evento.fecha);
                    return (
                      <div key={evento.id} className="border border-slate-200 rounded-xl p-2.5 hover:border-slate-300 transition-all bg-white shadow-sm hover:shadow">
                        <h4 className="font-bold text-xs text-slate-900 mb-1 line-clamp-2">{evento.titulo}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-600 mb-1.5">
                          <CalendarIcon className="w-2.5 h-2.5" />
                          <span>{esHoy ? 'Hoy' : new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                          <span>•</span>
                          <Clock className="w-2.5 h-2.5" />
                          <span>{evento.hora}</span>
                        </div>
                        <div className="mb-2">{getBadgeEvento(evento)}</div>
                        <div className="flex gap-1">
                          {esHoy && (
                            <button onClick={() => handleIniciarEvento(evento.id)} className="flex-1 px-2 py-1.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white rounded-md text-[10px] font-semibold transition shadow-sm flex items-center justify-center gap-1">
                              <Play className="w-2.5 h-2.5" />Iniciar
                            </button>
                          )}
                          <button className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-[10px] transition">
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                          <button onClick={() => { if (window.confirm('¿Eliminar?')) handleEliminarEvento(evento.id); }} className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-[10px] transition">
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <CalendarioModal isOpen={showCalendarioModal} onClose={() => setShowCalendarioModal(false)} eventos={eventos} onGuardarEvento={handleGuardarEvento} onEliminarEvento={handleEliminarEvento} />

      {modalTransmision}

      {/* MODALES DE DETALLES */}
      {showMeGustaModal && publicacionSeleccionada && createPortal(
        <ListaUsuarios usuarios={publicacionSeleccionada.meGusta} titulo="Me gusta" />,
        document.body
      )}

      {showNoMeGustaModal && publicacionSeleccionada && createPortal(
        <ListaUsuarios usuarios={publicacionSeleccionada.noMeGusta} titulo="No me gusta" />,
        document.body
      )}

      {showVistosModal && publicacionSeleccionada && createPortal(
        <ListaUsuarios usuarios={publicacionSeleccionada.vistas} titulo="Visto por" />,
        document.body
      )}

      {/* MODAL DE COMENTARIOS */}
      {showComentariosModal && publicacionSeleccionada && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Comentarios ({publicacionSeleccionada.comentarios.length})</h3>
              <button onClick={() => setShowComentariosModal(false)} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="flex items-start gap-2 mb-1.5">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full shadow-sm flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-xs">Tú</p>
                  <p className="text-[10px] text-slate-500">Hace {Math.floor((Date.now() - publicacionSeleccionada.fechaPublicacion.getTime()) / 60000)} min</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{publicacionSeleccionada.contenido}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
              {publicacionSeleccionada.comentarios.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Aún no hay comentarios</p>
                  <p className="text-xs text-slate-400">Sé el primero en comentar</p>
                </div>
              ) : (
                publicacionSeleccionada.comentarios.map(comentario => (
                  <div key={comentario.id} className="flex items-start gap-2">
                    <button
                      onClick={() => handleIrAPerfil(comentario.usuario.username)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={comentario.usuario.avatar}
                        alt={comentario.usuario.nombre}
                        className="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-all"
                      />
                    </button>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl px-3 py-2 border border-slate-200 shadow-sm hover:shadow transition-shadow">
                        <button
                          onClick={() => handleIrAPerfil(comentario.usuario.username)}
                          className="text-xs font-bold text-slate-900 mb-0.5 hover:text-pink-600 transition"
                        >
                          {comentario.usuario.nombre}
                        </button>
                        <p className="text-xs text-slate-700 leading-relaxed">{comentario.texto}</p>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 ml-3">Hace {Math.floor((Date.now() - comentario.fecha.getTime()) / 60000)} min</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full shadow-sm flex-shrink-0 object-cover"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnviarComentario()}
                    placeholder="Escribe un comentario..."
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 focus:border-slate-400 rounded-full text-sm focus:outline-none transition-all"
                    maxLength={500}
                  />
                  <button
                    onClick={handleEnviarComentario}
                    disabled={!nuevoComentario.trim()}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${nuevoComentario.trim() ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL PREVIEW */}
      {showPreviewModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">

            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-slate-100">
                  <Image className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Vista Previa - {visibilidad === 'publico' ? '🌍 Público' : '✨ Premium'}
                  </h3>
                  <p className="text-[10px] text-slate-600 font-semibold">
                    {archivosSeleccionados.length} archivo(s) seleccionados
                  </p>
                </div>
              </div>
              <button onClick={handleCancelarPreview} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {archivosSeleccionados.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 group bg-slate-100 transition-all shadow-sm hover:shadow">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <VideoIcon className="w-10 h-10 text-white/80" />
                      </div>
                    )}
                    <button onClick={() => {
                      const nuevos = archivosSeleccionados.filter((_, idx) => idx !== i);
                      setArchivosSeleccionados(nuevos);
                      if (nuevos.length === 0) handleCancelarPreview();
                    }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[8px] font-bold rounded">
                      {file.type.startsWith('image/') ? '📸' : '🎬'} {(file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Descripción</label>
                <textarea value={descripcionArchivos} onChange={(e) => setDescripcionArchivos(e.target.value)} placeholder="Agrega una descripción..." className="w-full px-3 py-2 border border-slate-200 hover:border-slate-300 focus:border-slate-400 rounded-xl resize-none focus:outline-none text-xs transition-all" rows={3} maxLength={500} />
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex gap-1">
                    {['❤️', '🔥', '😍', '💋', '✨', '👑', '💎'].map(emoji => (
                      <button key={emoji} onClick={() => setDescripcionArchivos(prev => prev + emoji)} className="w-7 h-7 hover:bg-slate-100 rounded-lg flex items-center justify-center text-sm transition">{emoji}</button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{descripcionArchivos.length}/500</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button onClick={handleCancelarPreview} className="flex-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs border border-slate-200">Cancelar</button>
              <button onClick={handleConfirmarSubida} className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${visibilidad === 'publico' ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white' : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white'}`}>Subir {archivosSeleccionados.length} archivo(s)</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL TOMAR FOTO */}
      {showCameraModal && createPortal(
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">Tomar Foto</h3>
              </div>
              <button onClick={handleCerrarCamera} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 flex gap-3">
              <button onClick={handleCerrarCamera} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition text-sm">Cancelar</button>
              <button onClick={handleCapturarFoto} className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30">
                <Camera className="w-4 h-4" />Capturar Foto
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL GRABAR VIDEO */}
      {showVideoRecordModal && createPortal(
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <VideoIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">Grabar Video</h3>
              </div>
              <button onClick={handleCerrarVideoRecorder} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 flex gap-3">
              <button onClick={handleCerrarVideoRecorder} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition text-sm">Cancelar</button>
              <button onClick={handleGrabarVideo} className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30">
                <VideoIcon className="w-4 h-4" />Grabar Video
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL FULLSCREEN IMAGEN */}
      {showImageModal && createPortal(
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10 shadow-xl">
            <X className="w-5 h-5" />
          </button>

          {currentImageFiles.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10 shadow-xl">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10 shadow-xl">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {currentImageFiles[currentImageIndex].type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(currentImageFiles[currentImageIndex])}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoIcon className="w-20 h-20 text-white/50" />
              </div>
            )}
          </div>

          {currentImageFiles.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-xl">
              {currentImageIndex + 1} / {currentImageFiles.length}
            </div>
          )}
        </div>,
        document.body
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && createPortal(
        <ConfirmDeleteModalFotoPublicacion
          onConfirm={handleConfirmarEliminar}
          onCancel={handleCancelarEliminar}
          esEliminacionFoto={fotoIndexAEliminar !== null}
        />,
        document.body
      )}
    </div>
  );
};
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Image, Video as VideoIcon, Calendar as CalendarIcon, Clock,
  Edit2, Trash2, Play, Radio, Crown, X, Sparkles, Heart,
  Info, Lock, Globe, Camera, ChevronLeft, ChevronRight, Eye,
  MessageCircle, Send, ThumbsDown, ThumbsUp, TrendingUp, Target,
  Zap, Award, Gift, Upload, Users, Lightbulb, Circle, Square,
  MessageSquare, CheckCircle, Timer
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

interface MensajeFan {
  id: string;
  usuario: Usuario;
  mensaje: string;
  propina?: number;
  fechaEnvio: Date;
  estado: 'nuevo' | 'respondido' | 'expirado';
  tiempoRestante: number; // en segundos
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
  onNavigateToContenido?: () => void;
}

export const MiActividadTab = ({ 
  onProgramarEvento,
  onNavigateToContenido 
}: MiActividadTabProps = {}) => {
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

  // Estados para eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publicacionAEliminar, setPublicacionAEliminar] = useState<string | null>(null);
  const [fotoIndexAEliminar, setFotoIndexAEliminar] = useState<number | null>(null);

  // Estados para modal de crear momento
  const [showCrearMomentoModal, setShowCrearMomentoModal] = useState(false);
  const [showCapturarMomentoModal, setShowCapturarMomentoModal] = useState(false);
  const [showConfigMomentoModal, setShowConfigMomentoModal] = useState(false);
  const [momentoFile, setMomentoFile] = useState<File | null>(null);
  const [momentoVisibilidad, setMomentoVisibilidad] = useState<'publico' | 'suscriptores'>('publico');
  const [momentoPrecio, setMomentoPrecio] = useState(15);

  // NUEVO: Estados para grabar video de momento
  const [showMomentoVideoRecordModal, setShowMomentoVideoRecordModal] = useState(false);
  const [isRecordingMomentoVideo, setIsRecordingMomentoVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // NUEVO: Estados para Mensajes de Fans
  const [mensajesFans, setMensajesFans] = useState<MensajeFan[]>([
    {
      id: '1',
      usuario: { id: '1', nombre: 'Juan Pérez', username: 'juan-perez-x7m3', avatar: 'https://i.pravatar.cc/150?img=12' },
      mensaje: 'Hola hermosa! 💕',
      fechaEnvio: new Date(),
      estado: 'nuevo',
      tiempoRestante: 105
    },
    {
      id: '2',
      usuario: { id: '2', nombre: 'Ana García', username: 'ana-garcia-k9p2', avatar: 'https://i.pravatar.cc/150?img=5' },
      mensaje: 'Gracias por tu contenido!',
      propina: 25,
      fechaEnvio: new Date(),
      estado: 'nuevo',
      tiempoRestante: 270
    },
    {
      id: '3',
      usuario: { id: '3', nombre: 'Carlos Ruiz', username: 'carlos-ruiz-m4n8', avatar: 'https://i.pravatar.cc/150?img=33' },
      mensaje: 'Info sobre precios? 💬',
      fechaEnvio: new Date(),
      estado: 'nuevo',
      tiempoRestante: 45
    },
    {
      id: '4',
      usuario: { id: '4', nombre: 'Pedro López', username: 'pedro-lopez-h2j5', avatar: 'https://i.pravatar.cc/150?img=15' },
      mensaje: 'Hey! Me encanta tu perfil',
      fechaEnvio: new Date(Date.now() - 5 * 60 * 1000),
      estado: 'respondido',
      tiempoRestante: 0
    },
    {
      id: '5',
      usuario: { id: '5', nombre: 'María Torres', username: 'maria-torres-q9w2', avatar: 'https://i.pravatar.cc/150?img=9' },
      mensaje: 'Precio del video exclusivo?',
      fechaEnvio: new Date(Date.now() - 12 * 60 * 1000),
      estado: 'respondido',
      tiempoRestante: 0
    },
    {
      id: '6',
      usuario: { id: '6', nombre: 'Diego Martín', username: 'diego-martin-p3k7', avatar: 'https://i.pravatar.cc/150?img=53' },
      mensaje: 'Info?',
      fechaEnvio: new Date(Date.now() - 30 * 60 * 1000),
      estado: 'expirado',
      tiempoRestante: 0
    }
  ]);
  const [burbujaExpandida, setBurbujaExpandida] = useState<string | null>(null);
  const [respuestaRapida, setRespuestaRapida] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const momentoVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const momentoMediaStreamRef = useRef<MediaStream | null>(null);
  const momentoFileInputRef = useRef<HTMLInputElement>(null);

  // Usuarios de ejemplo
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

  // Handler para crear momento desde galería (FOTOS Y VIDEOS)
  const handleMomentoDesdeGaleria = () => {
    momentoFileInputRef.current?.click();
    setShowCrearMomentoModal(false);
  };

  // Handler para capturar momento (abre modal de foto/video)
  const handleAbrirCapturarMomento = () => {
    setShowCrearMomentoModal(false);
    setShowCapturarMomentoModal(true);
  };

  // Handler para tomar FOTO para momento
  const handleMomentoTomarFoto = async () => {
    setShowCapturarMomentoModal(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `momento-foto-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setMomentoFile(file);
            setShowConfigMomentoModal(true);
            
            stream.getTracks().forEach(track => track.stop());
          }
        }, 'image/jpeg');
      }, 500);
    } catch (error) {
      alert('No se pudo acceder a la cámara');
    }
  };

  // NUEVO: Handler para abrir modal de grabar video para momento
  const handleAbrirMomentoVideoRecorder = async () => {
    setShowCapturarMomentoModal(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      momentoMediaStreamRef.current = stream;
      setShowMomentoVideoRecordModal(true);
      setRecordingTime(0);
      setIsRecordingMomentoVideo(false);
      recordedChunksRef.current = [];

      setTimeout(() => {
        if (momentoVideoRef.current) {
          momentoVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      alert('No se pudo acceder a la cámara/micrófono');
    }
  };

  // NUEVO: Handler para iniciar grabación de video momento
  const handleIniciarGrabacionMomento = () => {
    if (!momentoMediaStreamRef.current) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(momentoMediaStreamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `momento-video-${Date.now()}.webm`, { type: 'video/webm' });
      setMomentoFile(file);
      handleCerrarMomentoVideoRecorder();
      setShowConfigMomentoModal(true);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecordingMomentoVideo(true);

    // Iniciar contador de tiempo
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // NUEVO: Handler para detener grabación de video momento
  const handleDetenerGrabacionMomento = () => {
    if (mediaRecorderRef.current && isRecordingMomentoVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingMomentoVideo(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  // NUEVO: Handler para cerrar modal de video momento
  const handleCerrarMomentoVideoRecorder = () => {
    if (momentoMediaStreamRef.current) {
      momentoMediaStreamRef.current.getTracks().forEach(track => track.stop());
      momentoMediaStreamRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setShowMomentoVideoRecordModal(false);
    setIsRecordingMomentoVideo(false);
    setRecordingTime(0);
  };

  // Formatear tiempo de grabación
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // NUEVO: Formatear tiempo restante de burbuja
  const formatTiempoRestante = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // NUEVO: Color del timer según tiempo restante
  const getTimerColor = (segundos: number) => {
    if (segundos > 60) return 'text-emerald-600';
    if (segundos > 30) return 'text-amber-600';
    return 'text-red-500';
  };

  // NUEVO: Cerrar burbuja expandida (solo cierra, no marca visto)
  const handleCerrarBurbuja = () => {
    setBurbujaExpandida(null);
    setRespuestaRapida('');
  };

  // NUEVO: Responder mensaje de fan
  const handleResponderMensajeFan = (mensajeId: string) => {
    if (!respuestaRapida.trim()) return;
    
    setMensajesFans(prev => prev.map(m => 
      m.id === mensajeId ? { ...m, estado: 'respondido' as const, tiempoRestante: 0 } : m
    ));
    
    alert(`💬 Respuesta enviada al chat privado: "${respuestaRapida}"`);
    setBurbujaExpandida(null);
    setRespuestaRapida('');
  };

  // NUEVO: Ir al chat privado
  const handleIrAlChatPrivado = (mensajeId: string, username: string) => {
    setMensajesFans(prev => prev.map(m => 
      m.id === mensajeId ? { ...m, estado: 'respondido' as const, tiempoRestante: 0 } : m
    ));
    setBurbujaExpandida(null);
    navigate(`/chat/${username}`);
  };

  // NUEVO: Limpiar mensajes expirados
  const handleLimpiarExpirados = () => {
    setMensajesFans(prev => prev.filter(m => m.estado !== 'expirado'));
  };

  // NUEVO: useEffect para timer de burbujas
  useEffect(() => {
    const interval = setInterval(() => {
      setMensajesFans(prev => prev.map(m => {
        if (m.estado === 'nuevo' && m.tiempoRestante > 0) {
          const nuevoTiempo = m.tiempoRestante - 1;
          if (nuevoTiempo <= 0) {
            return { ...m, tiempoRestante: 0, estado: 'expirado' as const };
          }
          return { ...m, tiempoRestante: nuevoTiempo };
        }
        return m;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handler para archivos de momento desde galería
  const handleMomentoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMomentoFile(files[0]);
      setShowConfigMomentoModal(true);
    }
  };

  // Handler publicar momento (SIN PRECIO - solo 24h)
  const handlePublicarMomento = () => {
    if (!momentoFile) return;
    
    const tipo = momentoFile.type.startsWith('video/') ? 'video' : 'foto';
    alert(`✨ Momento ${tipo} ${momentoVisibilidad === 'publico' ? 'público' : 'para suscriptores'} creado!`);
    
    setShowConfigMomentoModal(false);
    setMomentoFile(null);
    setMomentoVisibilidad('publico');
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

  // Handler eliminación
  const handleAbrirModalEliminar = (pubId: string, fotoIndex: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setPublicacionAEliminar(pubId);
    setFotoIndexAEliminar(fotoIndex);
    setShowDeleteModal(true);
  };

  const handleConfirmarEliminar = () => {
    if (publicacionAEliminar) {
      if (fotoIndexAEliminar !== null) {
        setPublicaciones(prev => prev.map(pub => {
          if (pub.id === publicacionAEliminar && pub.archivos) {
            const nuevosArchivos = pub.archivos.filter((_, idx) => idx !== fotoIndexAEliminar);
            if (nuevosArchivos.length === 0) return null;
            return { ...pub, archivos: nuevosArchivos };
          }
          return pub;
        }).filter(pub => pub !== null) as Publicacion[]);
      } else {
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

  // Modal crear momento (Paso 1: Elegir fuente)
  const modalCrearMomento = showCrearMomentoModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Crear Momento</h3>
          </div>
          <button onClick={() => setShowCrearMomentoModal(false)} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-amber-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <button 
            onClick={handleMomentoDesdeGaleria}
            className="w-full p-4 rounded-xl border-2 border-pink-200 hover:border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-0.5">Subir desde Galería</p>
                <p className="text-xs text-slate-600">Foto o video</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleAbrirCapturarMomento}
            className="w-full p-4 rounded-xl border-2 border-pink-200 hover:border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-0.5">Capturar Ahora</p>
                <p className="text-xs text-slate-600">Tomar foto o grabar video</p>
              </div>
            </div>
          </button>
        </div>

        <div className="p-5 border-t border-pink-100 bg-pink-50/50">
          <button onClick={() => setShowCrearMomentoModal(false)} className="w-full px-4 py-2.5 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Modal capturar momento (Paso 1.5: Elegir foto o video)
  const modalCapturarMomento = showCapturarMomentoModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Capturar Momento</h3>
          </div>
          <button onClick={() => setShowCapturarMomentoModal(false)} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-amber-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <button 
            onClick={handleMomentoTomarFoto}
            className="w-full p-4 rounded-xl border-2 border-pink-200 hover:border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-0.5">Tomar Foto</p>
                <p className="text-xs text-slate-600">Captura una imagen</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleAbrirMomentoVideoRecorder}
            className="w-full p-4 rounded-xl border-2 border-pink-200 hover:border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-0.5">Grabar Video</p>
                <p className="text-xs text-slate-600">Graba un clip corto</p>
              </div>
            </div>
          </button>
        </div>

        <div className="p-5 border-t border-pink-100 bg-pink-50/50">
          <button onClick={() => setShowCapturarMomentoModal(false)} className="w-full px-4 py-2.5 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // NUEVO: Modal grabar video para momento
  const modalMomentoVideoRecord = showMomentoVideoRecordModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 border-b border-pink-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Grabar Video</h3>
              <p className="text-xs text-slate-600">Para tu momento</p>
            </div>
          </div>
          <button 
            onClick={handleCerrarMomentoVideoRecorder} 
            className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-pink-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-[4/3] bg-black">
          <video 
            ref={momentoVideoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover" 
          />
          
          {/* Indicador de grabación */}
          {isRecordingMomentoVideo && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              <span className="text-white text-sm font-bold">{formatRecordingTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-fuchsia-50 flex gap-3">
          <button 
            onClick={handleCerrarMomentoVideoRecorder} 
            className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition text-xs"
          >
            Cancelar
          </button>
          
          {!isRecordingMomentoVideo ? (
            <button 
              onClick={handleIniciarGrabacionMomento}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-lg transition text-xs flex items-center justify-center gap-2"
            >
              <Circle className="w-3.5 h-3.5 fill-current" />
              Grabar
            </button>
          ) : (
            <button 
              onClick={handleDetenerGrabacionMomento}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-xs flex items-center justify-center gap-2"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Detener
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Modal configurar momento (Paso 2: Solo visibilidad, SIN PRECIO)
  const modalConfigMomento = showConfigMomentoModal ? createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Configurar Momento</h3>
              <p className="text-[10px] text-slate-600">Disponible 24 horas</p>
            </div>
          </div>
          <button onClick={() => { setShowConfigMomentoModal(false); setMomentoFile(null); }} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-amber-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Preview */}
          {momentoFile && (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-pink-200 bg-slate-50">
              {momentoFile.type.startsWith('video/') ? (
                <video 
                  src={URL.createObjectURL(momentoFile)} 
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img 
                  src={URL.createObjectURL(momentoFile)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Opciones de visibilidad (SIN PRECIO) */}
          <div className="space-y-2.5">
            <button 
              onClick={() => setMomentoVisibilidad('publico')}
              className={`w-full p-3.5 rounded-xl border-2 transition-all text-left ${momentoVisibilidad === 'publico' ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${momentoVisibilidad === 'publico' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                  {momentoVisibilidad === 'publico' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-bold text-slate-900">Público</p>
                  </div>
                  <p className="text-xs text-slate-600">Todos pueden ver gratis (24h)</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setMomentoVisibilidad('suscriptores')}
              className={`w-full p-3.5 rounded-xl border-2 transition-all text-left ${momentoVisibilidad === 'suscriptores' ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-fuchsia-50 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${momentoVisibilidad === 'suscriptores' ? 'border-pink-500 bg-pink-500' : 'border-slate-300'}`}>
                  {momentoVisibilidad === 'suscriptores' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Crown className="w-4 h-4 text-pink-600" />
                    <p className="text-sm font-bold text-slate-900">Solo Suscriptores</p>
                  </div>
                  <p className="text-xs text-slate-600">Solo tus suscriptores (24h)</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-pink-100 bg-pink-50/50 flex gap-3">
          <button 
            onClick={() => { setShowConfigMomentoModal(false); setMomentoFile(null); }} 
            className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition text-xs"
          >
            Cancelar
          </button>
          <button 
            onClick={handlePublicarMomento}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-xs"
          >
            Publicar
          </button>
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/10 to-purple-50/10">

      {/* Input oculto para momentos desde galería */}
      <input 
        ref={momentoFileInputRef} 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleMomentoFileSelect} 
        className="hidden" 
      />

      {/* LAYOUT PRINCIPAL - 3 COLUMNAS */}
      <div className="max-w-[1600px] mx-auto px-4 pt-1 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========== COLUMNA IZQUIERDA ========== */}
        <div className="lg:col-span-3 space-y-5">

          {/* ✨ MOMENTOS - CON SCROLL VISIBLE */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-100/50 hover:shadow-xl hover:border-pink-200/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Momentos</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">24h</span>
            </div>

            {/* SCROLL VISIBLE - overflow-x-auto con scrollbar personalizado */}
            <div className="flex gap-3 overflow-x-auto pb-3 momentos-scroll">
              <style>{`
                .momentos-scroll::-webkit-scrollbar {
                  height: 6px;
                }
                .momentos-scroll::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 10px;
                }
                .momentos-scroll::-webkit-scrollbar-thumb {
                  background: linear-gradient(to right, #ec4899, #a855f7);
                  border-radius: 10px;
                }
                .momentos-scroll::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(to right, #db2777, #9333ea);
                }
              `}</style>
              
              <button 
                onClick={() => setShowCrearMomentoModal(true)}
                className="flex-shrink-0 relative group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-100 border-2 border-dashed border-pink-300 flex items-center justify-center hover:border-pink-400 hover:scale-105 hover:shadow-lg transition-all duration-300">
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>
                <p className="text-[10px] text-center mt-1.5 font-semibold text-slate-700">Crear</p>
              </button>

              {/* Momentos públicos - borde verde */}
              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-emerald-400/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=41" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">22h</p>
                </div>
              </button>

              {/* Momentos suscriptores - borde rosa */}
              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-fuchsia-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-pink-500/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=42" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">21h</p>
                </div>
              </button>

              {/* Más momentos con scroll... */}
              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-emerald-400/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=43" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">19h</p>
                </div>
              </button>

              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-fuchsia-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-pink-500/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=44" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">18h</p>
                </div>
              </button>

              {/* Más momentos para demostrar scroll */}
              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-emerald-400/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=45" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">15h</p>
                </div>
              </button>

              <button className="flex-shrink-0 relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-fuchsia-500 p-[2.5px] hover:scale-105 transition-all duration-300 shadow-md shadow-pink-500/30">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=46" className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-0.5 rounded-full shadow-lg">
                  <p className="text-[9px] text-white font-bold">12h</p>
                </div>
              </button>
            </div>
          </div>

          {/* 💬 MENSAJES DE FANS */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-100/50 hover:shadow-xl hover:border-pink-200/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Mensajes de Fans</h3>
              </div>
              <span className="px-2.5 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-xs rounded-full font-bold border border-pink-200">
                {mensajesFans.length}
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {/* Nuevos */}
              {mensajesFans.filter(m => m.estado === 'nuevo').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-700">Nuevos ({mensajesFans.filter(m => m.estado === 'nuevo').length})</span>
                  </div>
                  <div className="space-y-2">
                    {mensajesFans.filter(m => m.estado === 'nuevo').map(msg => (
                      <div 
                        key={msg.id}
                        className={`p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                          msg.propina 
                            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300' 
                            : 'bg-white border-emerald-200 hover:border-emerald-300'
                        }`}
                        onClick={() => setBurbujaExpandida(msg.id)}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`relative ${msg.propina ? 'ring-2 ring-amber-400 ring-offset-1' : ''} rounded-full`}>
                            <img src={msg.usuario.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                            {msg.propina && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                <Gift className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate">{msg.usuario.nombre}</p>
                              {msg.propina && (
                                <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                                  S/.{msg.propina}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 truncate mt-0.5">{msg.mensaje}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Timer className={`w-3 h-3 ${getTimerColor(msg.tiempoRestante)}`} />
                              <span className={`text-[10px] font-semibold ${getTimerColor(msg.tiempoRestante)}`}>
                                {formatTiempoRestante(msg.tiempoRestante)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Respondidos */}
              {mensajesFans.filter(m => m.estado === 'respondido').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 mt-3">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">Respondidos ({mensajesFans.filter(m => m.estado === 'respondido').length})</span>
                  </div>
                  <div className="space-y-2">
                    {mensajesFans.filter(m => m.estado === 'respondido').slice(0, 3).map(msg => (
                      <div 
                        key={msg.id}
                        className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 transition-all"
                      >
                        <div className="flex items-start gap-2.5">
                          <img src={msg.usuario.avatar} alt="" className="w-8 h-8 rounded-full object-cover opacity-80" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{msg.usuario.nombre}</p>
                            <p className="text-[11px] text-slate-500 truncate">{msg.mensaje}</p>
                            <button 
                              onClick={() => navigate(`/chat/${msg.usuario.username}`)}
                              className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold mt-1 flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Ver conversación
                            </button>
                          </div>
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expirados */}
              {mensajesFans.filter(m => m.estado === 'expirado').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 mt-3">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Expirados ({mensajesFans.filter(m => m.estado === 'expirado').length})</span>
                  </div>
                  <div className="space-y-2">
                    {mensajesFans.filter(m => m.estado === 'expirado').slice(0, 2).map(msg => (
                      <div 
                        key={msg.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 opacity-60"
                      >
                        <div className="flex items-start gap-2.5">
                          <img src={msg.usuario.avatar} alt="" className="w-8 h-8 rounded-full object-cover grayscale" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-500 truncate">{msg.usuario.nombre}</p>
                            <p className="text-[11px] text-slate-400 truncate">{msg.mensaje}</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Expiró hace {Math.floor((Date.now() - msg.fechaEnvio.getTime()) / 60000)} min
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleLimpiarExpirados}
                    className="w-full mt-2 text-[11px] text-slate-500 hover:text-red-600 font-medium flex items-center justify-center gap-1 py-2 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar expirados
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ⏰ CONTENIDO PROGRAMADO */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-100/50 hover:shadow-xl hover:border-pink-200/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Programados</h3>
              </div>
              <button 
                onClick={() => onNavigateToContenido?.()}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
              >
                <span className="text-white text-xl font-bold leading-none">+</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              <div className="p-3 rounded-xl border border-pink-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Image className="w-4.5 h-4.5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Foto entrenamiento</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Hoy 21:00</span>
                      <span>•</span>
                      <Crown className="w-3 h-3 text-pink-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-pink-200 hover:border-pink-300 hover:bg-pink-50/50 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <VideoIcon className="w-4.5 h-4.5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Video rutina</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Mañana 18:00</span>
                      <span>•</span>
                      <Globe className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== COLUMNA CENTRO ========== */}
        <div className="lg:col-span-6 space-y-5">

          {/* ✨ COMPOSER PREMIUM */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-100/50 hover:shadow-lg hover:border-pink-200/70 transition-all duration-300">

            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-1 shadow-sm">
                <button onClick={() => setVisibilidad('publico')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${visibilidad === 'publico' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Globe className="w-3.5 h-3.5" />Público
                </button>
                <button onClick={() => setVisibilidad('suscriptores')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${visibilidad === 'suscriptores' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Crown className="w-3.5 h-3.5" />Premium
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Avatar"
                className="w-10 h-10 rounded-full shadow-md flex-shrink-0 object-cover border-2 border-white ring-2 ring-pink-100"
              />

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={nuevoPost}
                  onChange={(e) => setNuevoPost(e.target.value)}
                  placeholder={visibilidad === 'publico'
                    ? '¿Qué quieres compartir con todos?'
                    : '✨ Contenido VIP exclusivo para tus suscriptores...'}
                  className={`w-full pl-4 pr-28 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 transition-all ${visibilidad === 'publico'
                      ? 'bg-emerald-50/50 border-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200'
                      : 'bg-pink-50/50 border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-200'
                    }`}
                  maxLength={500}
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <label className="cursor-pointer">
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
                    <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-pink-100 text-slate-600 hover:text-pink-600 transition-all" title="Subir foto/video">
                      <Image className="w-4.5 h-4.5" />
                    </div>
                  </label>

                  <button onClick={handleAbrirCamera} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-pink-100 text-slate-600 hover:text-pink-600 transition-all" title="Tomar foto">
                    <Camera className="w-4.5 h-4.5" />
                  </button>

                  <button onClick={handleAbrirVideoRecorder} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-pink-100 text-slate-600 hover:text-pink-600 transition-all" title="Grabar video">
                    <VideoIcon className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handlePublicar}
                disabled={!nuevoPost.trim()}
                className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-md flex-shrink-0 hover:scale-105 ${!nuevoPost.trim() 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : visibilidad === 'publico' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white shadow-pink-500/30'
                }`}
              >
                Publicar
              </button>
            </div>

            {nuevoPost.length > 0 && (
              <div className="mt-3 text-right"><span className="text-[11px] text-slate-400">{nuevoPost.length}/500</span></div>
            )}
          </div>

          {/* ✨ PUBLICACIONES */}
          <div className="space-y-5">
            {publicaciones.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-dashed border-pink-200 p-20 text-center hover:border-pink-300 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Sparkles className="w-10 h-10 text-pink-500" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">¡Tu comunidad te espera!</h3>
                <p className="text-sm text-slate-600">Comparte tu primer contenido</p>
              </div>
            ) : (
              publicaciones.map(pub => (
                <div key={pub.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative border border-pink-100/50 hover:border-pink-200/70">

                  <div className="absolute top-4 right-4 z-10">
                    {pub.visibilidad === 'publico' ? (
                      <span className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-200">
                        <Globe className="w-3.5 h-3.5" />
                        PÚBLICO
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 bg-gradient-to-r from-pink-100 to-fuchsia-100 text-pink-700 text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-sm border border-pink-200">
                        <Crown className="w-3.5 h-3.5" />
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Avatar"
                        className="w-11 h-11 rounded-full shadow-md flex-shrink-0 object-cover border-2 border-white ring-2 ring-pink-100"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Tú</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Hace {Math.floor((Date.now() - pub.fechaPublicacion.getTime()) / 60000)} min</p>
                      </div>

                      {pub.meGusta.length === 0 && (
                        <button
                          onClick={() => simularInteracciones(pub.id)}
                          className="text-[11px] px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 rounded-lg transition-all shadow-sm font-semibold"
                        >
                          Simular
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">{pub.contenido}</p>

                    {/* Galería */}
                    {pub.archivos && pub.archivos.length > 0 && (
                      <div className={`mb-4 ${pub.archivos.length === 1 ? '' : 'grid grid-cols-2 gap-3'}`}>
                        {pub.archivos.map((file, i) => (
                          <div
                            key={i}
                            className={`group/img relative rounded-xl overflow-hidden cursor-pointer 
                    transition-all duration-300
                    border border-slate-200 hover:border-slate-300 hover:shadow-md
                    ${pub.archivos!.length === 1
                                ? 'max-h-[600px] flex items-center justify-center bg-slate-50'
                                : 'aspect-square'
                              }`}
                            onClick={() => handleOpenImageModal(pub.archivos!, i)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                        opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10" />

                            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 
                        transition-all duration-300 z-30">
                              <div className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-full 
                          flex items-center justify-center shadow-lg">
                                <Eye className="w-3.5 h-3.5 text-slate-700" />
                              </div>

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
                                  } transition-transform duration-300 group-hover/img:scale-[1.02]`}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 
                          flex items-center justify-center">
                                <div className="text-center">
                                  <Play className="w-16 h-16 text-white/80 mx-auto mb-3" />
                                  <p className="text-sm text-white/60 font-semibold">Video</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MÉTRICAS */}
                    <div className="flex items-center gap-3 pt-4 border-t border-pink-100">
                      <button
                        onClick={() => handleAbrirMeGusta(pub)}
                        className="group/btn flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-emerald-50 transition-all duration-300"
                      >
                        <div className="relative">
                          <ThumbsUp className="w-4 h-4 text-slate-500 group-hover/btn:text-emerald-600 transition-all" />
                          {pub.meGusta.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-600 group-hover/btn:text-emerald-700">{pub.meGusta.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirNoMeGusta(pub)}
                        className="group/btn flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-red-50 transition-all duration-300"
                      >
                        <ThumbsDown className="w-4 h-4 text-slate-500 group-hover/btn:text-red-600 transition-all" />
                        <span className="text-xs font-semibold text-slate-600 group-hover/btn:text-red-700">{pub.noMeGusta.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirVistos(pub)}
                        className="group/btn flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-blue-50 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4 text-slate-500 group-hover/btn:text-blue-600 transition-all" />
                        <span className="text-xs font-semibold text-slate-600 group-hover/btn:text-blue-700">{pub.vistas.length}</span>
                      </button>

                      <button
                        onClick={() => handleAbrirComentarios(pub)}
                        className="group/btn flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-pink-50 transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-500 group-hover/btn:text-pink-600 transition-all" />
                        <span className="text-xs font-semibold text-slate-600 group-hover/btn:text-pink-700">{pub.comentarios.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ========== COLUMNA DERECHA ========== */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* BOTONES */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleAbrirModalTransmision}
              disabled={isTransmisionActive}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${isTransmisionActive ? 'bg-slate-300 text-slate-500' : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-lg hover:scale-105'}`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Radio className="w-4 h-4" />
                <span>En Vivo</span>
              </div>
            </button>

            <button
              onClick={() => setShowCalendarioModal(true)}
              className="px-3 py-2.5 bg-white border-2 border-pink-200 hover:border-pink-300 rounded-xl font-bold text-xs transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center justify-center gap-1.5 text-slate-700">
                <CalendarIcon className="w-4 h-4" />
                <span>Programar</span>
              </div>
            </button>
          </div>

          {/* 💡 SUGERENCIAS - MÁS ANCHO */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-pink-100/50 hover:shadow-xl transition-all">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Lightbulb className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sugerencias</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-pink-700">💡 </span>
                  Sube 3 posts esta semana para alcanzar tu meta
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-fuchsia-700">⏰ </span>
                  Tu mejor horario: 21:00-23:00
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-purple-700">📝 </span>
                  Agrega descripciones para más engagement
                </p>
              </div>
            </div>
          </div>

          {/* 📅 PRÓXIMOS EVENTOS - MÁS ANCHO */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-pink-100/50 shadow-sm overflow-hidden hover:shadow-xl transition-all">
            <div className="px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50/50 to-purple-50/50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                Próximos Eventos
                <span className="ml-auto px-2.5 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-xs rounded-full font-bold border border-pink-200">
                  {eventos.length}
                </span>
              </h3>
            </div>

            <div className="p-4">
              {eventos.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-7 h-7 text-pink-500" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Sin eventos</p>
                  <p className="text-xs text-slate-400 mt-1">Programa tu primer evento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventos.map(evento => (
                    <div key={evento.id} className="border-2 border-pink-100 rounded-xl p-3.5 hover:border-pink-300 hover:shadow-md transition-all">
                      <h4 className="font-bold text-sm text-slate-900 mb-2">{evento.titulo}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-2.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{new Date(evento.fecha).toLocaleDateString()}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{evento.hora}</span>
                      </div>
                      <div>{getBadgeEvento(evento)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <CalendarioModal isOpen={showCalendarioModal} onClose={() => setShowCalendarioModal(false)} eventos={eventos} onGuardarEvento={handleGuardarEvento} onEliminarEvento={handleEliminarEvento} />

      {/* 💬 BURBUJAS FLOTANTES HORIZONTALES */}
      {mensajesFans.filter(m => m.estado === 'nuevo').length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
          <div className="max-w-[1600px] mx-auto px-4 pb-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200/50 p-4 pointer-events-auto">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 burbujas-scroll">
                <style>{`
                  .burbujas-scroll::-webkit-scrollbar {
                    height: 4px;
                  }
                  .burbujas-scroll::-webkit-scrollbar-track {
                    background: #fce7f3;
                    border-radius: 10px;
                  }
                  .burbujas-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(to right, #f472b6, #c084fc);
                    border-radius: 10px;
                  }
                `}</style>

                {mensajesFans.filter(m => m.estado === 'nuevo').slice(0, 5).map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => setBurbujaExpandida(msg.id)}
                    className={`flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      msg.propina 
                        ? 'hover:shadow-lg hover:shadow-amber-200' 
                        : 'hover:shadow-lg hover:shadow-pink-200'
                    }`}
                  >
                    <div className={`relative p-3 rounded-2xl min-w-[180px] max-w-[220px] ${
                      msg.propina 
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300' 
                        : 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200'
                    }`}>
                      {/* Header con avatar y nombre */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`relative ${msg.propina ? 'ring-2 ring-amber-400' : ''} rounded-full`}>
                          <img src={msg.usuario.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          {msg.propina && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                              <Gift className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{msg.usuario.nombre}</p>
                          {msg.propina && (
                            <span className="text-[10px] font-bold text-amber-600">🎁 S/.{msg.propina}</span>
                          )}
                        </div>
                      </div>

                      {/* Mensaje */}
                      <p className="text-xs text-slate-700 line-clamp-2 mb-2">"{msg.mensaje}"</p>

                      {/* Timer */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                          msg.tiempoRestante > 60 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : msg.tiempoRestante > 30 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-red-100 text-red-600 animate-pulse'
                        }`}>
                          <Timer className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{formatTiempoRestante(msg.tiempoRestante)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Click para ver</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Badge si hay más de 5 */}
                {mensajesFans.filter(m => m.estado === 'nuevo').length > 5 && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    +{mensajesFans.filter(m => m.estado === 'nuevo').length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BURBUJA EXPANDIDA */}
      {burbujaExpandida && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={handleCerrarBurbuja}>
          {(() => {
            const msg = mensajesFans.find(m => m.id === burbujaExpandida);
            if (!msg) return null;
            
            return (
              <div 
                className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
                  msg.propina 
                    ? 'border-2 border-amber-300' 
                    : 'border border-pink-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className={`px-5 py-4 flex items-center justify-between ${
                  msg.propina 
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200' 
                    : 'bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`relative ${msg.propina ? 'ring-2 ring-amber-400 ring-offset-2' : ''} rounded-full`}>
                      <img src={msg.usuario.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                      {msg.propina && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                          <Gift className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{msg.usuario.nombre}</p>
                      <p className="text-xs text-slate-500">@{msg.usuario.username} • Suscriptor ⭐</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCerrarBurbuja}
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Propina destacada */}
                {msg.propina && (
                  <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-5 py-3 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-700 font-medium">¡Te envió una propina!</p>
                        <p className="text-lg font-bold text-amber-600">S/.{msg.propina}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensaje */}
                <div className="bg-white px-5 py-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed">"{msg.mensaje}"</p>
                  </div>
                </div>

                {/* Campo de respuesta */}
                <div className="bg-white px-5 pb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={respuestaRapida}
                      onChange={(e) => setRespuestaRapida(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleResponderMensajeFan(msg.id)}
                      placeholder="Escribe tu respuesta..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                      maxLength={200}
                    />
                    <button
                      onClick={() => handleResponderMensajeFan(msg.id)}
                      disabled={!respuestaRapida.trim()}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        respuestaRapida.trim() 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer con botón ir al chat */}
                <div className="bg-slate-50 px-5 py-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                      msg.tiempoRestante > 60 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : msg.tiempoRestante > 30 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-red-100 text-red-600 animate-pulse'
                    }`}>
                      <Timer className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{formatTiempoRestante(msg.tiempoRestante)}</span>
                    </div>

                    <button
                      onClick={() => handleIrAlChatPrivado(msg.id, msg.usuario.username)}
                      className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Ir al chat privado
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>,
        document.body
      )}
      
      {modalTransmision}
      {modalCrearMomento}
      {modalCapturarMomento}
      {modalMomentoVideoRecord}
      {modalConfigMomento}

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

      {showDeleteModal && createPortal(
        <ConfirmDeleteModalFotoPublicacion
          onConfirm={handleConfirmarEliminar}
          onCancel={handleCancelarEliminar}
          esEliminacionFoto={fotoIndexAEliminar !== null}
        />,
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

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button onClick={handleCancelarPreview} className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition text-xs">Cancelar</button>
              <button onClick={handleConfirmarSubida} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${visibilidad === 'publico' ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white' : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white'}`}>Subir {archivosSeleccionados.length} archivo(s)</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL TOMAR FOTO */}
      {showCameraModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 border-b border-pink-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tomar Foto</h3>
              </div>
              <button onClick={handleCerrarCamera} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-pink-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-50 to-fuchsia-50 flex gap-3">
              <button onClick={handleCerrarCamera} className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition text-xs">Cancelar</button>
              <button onClick={handleCapturarFoto} className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-xs flex items-center justify-center gap-2">
                <Camera className="w-3.5 h-3.5" />Capturar Foto
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL GRABAR VIDEO */}
      {showVideoRecordModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 border-b border-pink-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <VideoIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Grabar Video</h3>
              </div>
              <button onClick={handleCerrarVideoRecorder} className="text-slate-400 hover:text-slate-700 transition p-1 hover:bg-pink-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-50 to-fuchsia-50 flex gap-3">
              <button onClick={handleCerrarVideoRecorder} className="flex-1 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition text-xs">Cancelar</button>
              <button onClick={handleGrabarVideo} className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition text-xs flex items-center justify-center gap-2">
                <VideoIcon className="w-3.5 h-3.5" />Grabar Video
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
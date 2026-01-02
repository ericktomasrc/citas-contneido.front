import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Video, Trash2, DollarSign, X, Eye, Edit2, Package, Plus, Flame, Lock, Crown, Heart, Pause } from 'lucide-react';
import { Modal } from '../../../components/Modals/Modal';

interface PackMedia {
  id: string;
  url: string;
  type: 'photo' | 'video';
  name: string;
  size: number;
}

interface Pack {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  fotos: PackMedia[];
  videos: PackMedia[];
  enVenta: boolean;
  fechaCreacion: Date;
  nivelContenido: 'suave' | 'moderado' | 'explicito' | 'extremo';
}

export const PacksPage = () => {
  const [galeriaFotos, setGaleriaFotos] = useState<PackMedia[]>([]);
  const [galeriaVideos, setGaleriaVideos] = useState<PackMedia[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [activeTab, setActiveTab] = useState<'fotos' | 'videos'>('fotos');
  
  // Modales
  const [showCreatePackModal, setShowCreatePackModal] = useState(false);
  const [showViewPackModal, setShowViewPackModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [previewMedia, setPreviewMedia] = useState<PackMedia | null>(null);
  
  // Edición en modal
  const [editingPrecio, setEditingPrecio] = useState(false);
  const [tempPrecio, setTempPrecio] = useState('');
  
  // Form crear pack
  const [packTitulo, setPackTitulo] = useState('');
  const [packDescripcion, setPackDescripcion] = useState('');
  const [packPrecio, setPackPrecio] = useState('');
  const [packNivel, setPackNivel] = useState<'suave' | 'moderado' | 'explicito' | 'extremo'>('explicito');
  
  // Drag & drop
  const [dragOverGallery, setDragOverGallery] = useState(false);
  const [dragOverPack, setDragOverPack] = useState<string | null>(null);
  const [dragOverPackCreados, setDragOverPackCreados] = useState(false);
  const [dragOverPackVenta, setDragOverPackVenta] = useState(false);
  
  // Animaciones
  const [animatingMedia, setAnimatingMedia] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([]);

  // Sincronizar selectedPack cuando packs cambia
  useEffect(() => {
    if (selectedPack) {
      const updatedPack = packs.find(p => p.id === selectedPack.id);
      if (updatedPack) {
        setSelectedPack(updatedPack);
      }
    }
  }, [packs]);
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'error' | 'warning' | 'success' | 'confirm';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  const MAX_FOTOS_GALERIA = 200;
  const MAX_VIDEOS_GALERIA = 100;
  const MAX_FOTOS_POR_PACK = 50;
  const MAX_VIDEOS_POR_PACK = 30;
  const MAX_PACKS = 50;
  const MAX_PACKS_EN_VENTA = 20;

  const currentGaleriaItems = activeTab === 'fotos' ? galeriaFotos : galeriaVideos;
  const setCurrentGaleriaItems = activeTab === 'fotos' ? setGaleriaFotos : setGaleriaVideos;
  const maxGaleriaItems = activeTab === 'fotos' ? MAX_FOTOS_GALERIA : MAX_VIDEOS_GALERIA;

  const packsCreados = packs.filter(p => !p.enVenta);
  const packsEnVenta = packs.filter(p => p.enVenta);

  const tabs = [
    { 
      id: 'fotos' as const, 
      label: 'Fotos',
      icon: ImageIcon,
      gradient: 'from-pink-500 to-rose-600',
      bgActive: 'bg-pink-50',
      borderActive: 'border-pink-500'
    },
    { 
      id: 'videos' as const, 
      label: 'Videos',
      icon: Video,
      gradient: 'from-blue-500 to-cyan-600',
      bgActive: 'bg-blue-50',
      borderActive: 'border-blue-500'
    },
  ];

  const nivelesContenido = [
    { id: 'suave' as const, label: 'Suave', color: 'bg-green-100 text-green-700', icon: '😊' },
    { id: 'moderado' as const, label: 'Moderado', color: 'bg-yellow-100 text-yellow-700', icon: '🔥' },
    { id: 'explicito' as const, label: 'Explícito', color: 'bg-orange-100 text-orange-700', icon: '🔞' },
    { id: 'extremo' as const, label: 'Extremo', color: 'bg-red-100 text-red-700', icon: '💀' },
  ];

  // Upload files a galería
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const filesArray = Array.from(files);
    const cantidadASubir = filesArray.length;
    const cantidadActual = currentGaleriaItems.length;
    const totalDespuesDeSubir = cantidadActual + cantidadASubir;
    
    if (totalDespuesDeSubir > maxGaleriaItems) {
      const disponibles = maxGaleriaItems - cantidadActual;
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: '¡Límite Superado!',
        message: `Estás intentando subir ${cantidadASubir} ${activeTab}, pero solo puedes agregar ${disponibles} más.\n\nActualmente tienes: ${cantidadActual}/${maxGaleriaItems} en galería\nLímite máximo: ${maxGaleriaItems} ${activeTab}`,
      });
      return;
    }
    
    const newItems: PackMedia[] = [];
    
    filesArray.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}-${index}-${Math.random()}`,
        url,
        type: activeTab === 'fotos' ? 'photo' : 'video',
        name: file.name,
        size: file.size,
      });
    });

    if (newItems.length > 0) {
      setCurrentGaleriaItems([...currentGaleriaItems, ...newItems]);
      
      if (totalDespuesDeSubir === maxGaleriaItems) {
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: '¡Límite Alcanzado!',
          message: `Has alcanzado el límite de ${maxGaleriaItems} ${activeTab} en la galería.`,
        });
      }
    }
  };

  // Crear pack
  const handleCrearPack = () => {
    if (!packTitulo.trim()) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Título Requerido',
        message: 'Debes ingresar un título para el pack.',
      });
      return;
    }

    const precio = parseFloat(packPrecio);
    if (!precio || precio < 50) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Precio Inválido',
        message: 'El precio mínimo es S/. 50',
      });
      return;
    }

    if (packs.length >= MAX_PACKS) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Límite de Packs',
        message: `Has alcanzado el límite de ${MAX_PACKS} packs.`,
      });
      return;
    }

    const nuevoPack: Pack = {
      id: `pack-${Date.now()}`,
      titulo: packTitulo,
      descripcion: packDescripcion || undefined,
      precio: precio,
      fotos: [],
      videos: [],
      enVenta: false,
      fechaCreacion: new Date(),
      nivelContenido: packNivel,
    };

    setPacks([...packs, nuevoPack]);
    setShowCreatePackModal(false);
    
    // Reset form
    setPackTitulo('');
    setPackDescripcion('');
    setPackPrecio('');
    setPackNivel('explicito');

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: '¡Pack Creado!',
      message: `El pack "${packTitulo}" ha sido creado. Ahora puedes agregar contenido arrastrando desde la galería.`,
    });
  };

  // Agregar media a pack
  const agregarMediaAPack = (mediaId: string, packId: string) => {
    const media = [...galeriaFotos, ...galeriaVideos].find(m => m.id === mediaId);
    if (!media) return;

    const pack = packs.find(p => p.id === packId);
    if (!pack) return;

    const isPhoto = media.type === 'photo';
    const currentCount = isPhoto ? pack.fotos.length : pack.videos.length;
    const maxCount = isPhoto ? MAX_FOTOS_POR_PACK : MAX_VIDEOS_POR_PACK;

    if (currentCount >= maxCount) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Límite de Pack',
        message: `Este pack ya tiene ${maxCount} ${isPhoto ? 'fotos' : 'videos'}. No puedes agregar más.`,
      });
      return;
    }

    // Verificar si ya existe en el pack
    const yaExiste = isPhoto 
      ? pack.fotos.some(f => f.id === mediaId)
      : pack.videos.some(v => v.id === mediaId);

    if (yaExiste) {
      return; // Ya está en el pack, ignorar
    }

    setPacks(packs.map(p => {
      if (p.id === packId) {
        return {
          ...p,
          fotos: isPhoto ? [...p.fotos, media] : p.fotos,
          videos: !isPhoto ? [...p.videos, media] : p.videos,
        };
      }
      return p;
    }));
  };

  // Quitar media de pack
  const quitarMediaDePack = (mediaId: string, packId: string) => {
    setPacks(packs.map(p => {
      if (p.id === packId) {
        return {
          ...p,
          fotos: p.fotos.filter(f => f.id !== mediaId),
          videos: p.videos.filter(v => v.id !== mediaId),
        };
      }
      return p;
    }));
  };

  // Actualizar precio del pack
  const actualizarPrecioPack = (packId: string, nuevoPrecio: string) => {
    const precio = parseFloat(nuevoPrecio);
    
    if (!precio || precio < 50) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Precio Inválido',
        message: 'El precio mínimo es S/. 50',
      });
      return;
    }

    setPacks(packs.map(p => 
      p.id === packId ? { ...p, precio } : p
    ));
    
    setEditingPrecio(false);
    setTempPrecio('');
    
    // Actualizar selectedPack
    if (selectedPack && selectedPack.id === packId) {
      setSelectedPack({ ...selectedPack, precio });
    }
  };

  // Mover pack a venta
  const moverPackAVenta = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!pack) return;

    if (pack.fotos.length === 0 && pack.videos.length === 0) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Pack Vacío',
        message: 'No puedes poner en venta un pack sin contenido. Agrega al menos 1 foto o 1 video.',
      });
      return;
    }

    if (packsEnVenta.length >= MAX_PACKS_EN_VENTA) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Límite de Packs en Venta',
        message: `Solo puedes tener ${MAX_PACKS_EN_VENTA} packs en venta simultáneamente.`,
      });
      return;
    }

    setPacks(packs.map(p => 
      p.id === packId ? { ...p, enVenta: true } : p
    ));

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: '¡Publicado Exitoso!',
      message: `El pack "${pack.titulo}" ha sido publicado exitosamente.\n\nPrecio: S/. ${pack.precio}\nContenido: ${pack.fotos.length} fotos + ${pack.videos.length} videos`,
    });
  };

  // Quitar pack de venta
  const quitarPackDeVenta = (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!pack) return;

    setPacks(packs.map(p => 
      p.id === packId ? { ...p, enVenta: false } : p
    ));

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: 'Pack Pausado',
      message: `El pack "${pack.titulo}" ha sido pausado correctamente y ya no está visible en venta.`,
    });
  };

  // Eliminar pack
  const eliminarPack = (packId: string) => {
    setPacks(packs.filter(p => p.id !== packId));
  };

  // Eliminar de galería
  const eliminarDeGaleria = (mediaId: string) => {
    setGaleriaFotos(galeriaFotos.filter(f => f.id !== mediaId));
    setGaleriaVideos(galeriaVideos.filter(v => v.id !== mediaId));
  };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, mediaId: string) => {
    e.dataTransfer.setData('mediaId', mediaId);
  };

  const handleDragStartPack = (e: React.DragEvent, packId: string) => {
    e.dataTransfer.setData('packId', packId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropGaleria = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGallery(false);
    // No hacer nada, las fotos no se pueden devolver a galería desde packs
  };

  const handleDropPack = (e: React.DragEvent, packId: string) => {
    e.preventDefault();
    setDragOverPack(null);
    const mediaId = e.dataTransfer.getData('mediaId');
    if (mediaId) {
      // Validar que el pack existe
      const packExists = packs.find(p => p.id === packId);
      if (!packExists) {
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: '¡No hay Packs!',
          message: 'Primero debes crear un pack para poder agregar contenido.\n\nClick en el botón "Crear" para crear tu primer pack.',
        });
        return;
      }
      
      // Efecto de animación
      setAnimatingMedia(mediaId);
      
      // Crear partículas en la posición del drop
      const rect = e.currentTarget.getBoundingClientRect();
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: `particle-${Date.now()}-${i}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }));
      setParticles(newParticles);
      
      // Agregar media al pack después de un delay
      setTimeout(() => {
        agregarMediaAPack(mediaId, packId);
        setAnimatingMedia(null);
        setParticles([]);
      }, 600);
    }
  };

  const handleDropPackCreados = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverPackCreados(false);
    
    const packId = e.dataTransfer.getData('packId');
    const mediaId = e.dataTransfer.getData('mediaId');
    
    // Si es un pack (moviendo de Venta a Creados)
    if (packId) {
      quitarPackDeVenta(packId);
      return;
    }
    
    // Si es media pero no hay packs
    if (mediaId && packs.length === 0) {
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: '¡Crea tu Primer Pack!',
        message: 'No tienes ningún pack creado todavía.\n\nClick en el botón "Crear" para crear tu primer pack y luego podrás agregar contenido.',
      });
    }
  };

  const handleDropPackVenta = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverPackVenta(false);
    const packId = e.dataTransfer.getData('packId');
    if (packId) {
      moverPackAVenta(packId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
          <Package className="w-7 h-7 text-purple-500" />
          Gestionar Packs
        </h1>
        <p className="text-sm text-gray-600">Crea packs exclusivos de contenido premium</p>
      </div>

      {/* Notificación */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3.5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💰 Monetiza contenido premium!</span> Los packs son ideales para contenido muy exclusivo con compra única.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const count = tab.id === 'fotos' ? galeriaFotos.length : galeriaVideos.length;
          const max = tab.id === 'fotos' ? MAX_FOTOS_GALERIA : MAX_VIDEOS_GALERIA;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                ${isActive 
                  ? `${tab.bgActive} ring-1 ${tab.borderActive.replace('border-', 'ring-')}` 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-md transition-all
                ${isActive 
                  ? `bg-gradient-to-r ${tab.gradient}` 
                  : 'bg-gray-100'
                }
              `}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>

              <span className={`
                font-semibold text-sm transition-colors
                ${isActive 
                  ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent` 
                  : 'text-gray-700'
                }
              `}>
                {tab.label}
              </span>

              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive 
                  ? 'bg-white/30 text-gray-700' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {count}/{max}
              </span>

              {isActive && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r ${tab.gradient}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Layout principal: Galería + Packs */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
        {/* COLUMNA 1: GALERÍA */}
        <div className="space-y-4">
          {/* Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Subir {activeTab === 'fotos' ? 'Fotos' : 'Videos'}
            </h3>

            <div className="flex items-center gap-3">
              <label className="flex-1">
                <input
                  type="file"
                  multiple
                  accept={activeTab === 'fotos' ? 'image/*' : 'video/*'}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={currentGaleriaItems.length >= maxGaleriaItems}
                />
                <div className={`
                  w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2
                  ${currentGaleriaItems.length >= maxGaleriaItems
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : activeTab === 'fotos' 
                      ? 'border-pink-300 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
                      : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                  }
                `}>
                  <Upload className="w-5 h-5" />
                  <span>Seleccionar</span>
                </div>
              </label>

              <div className="text-xs text-gray-500 text-center">
                <p className="font-semibold">{currentGaleriaItems.length}/{maxGaleriaItems}</p>
                <p>galería</p>
              </div>
            </div>

            {currentGaleriaItems.length >= maxGaleriaItems && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs text-red-700 font-medium">
                  <span className="font-bold">Límite alcanzado.</span> Elimina algunas {activeTab} para subir más.
                </p>
              </div>
            )}
          </div>

          {/* Galería de contenido */}
          <div
            className={`bg-white rounded-xl shadow-sm border-2 p-5 transition-all ${
              dragOverGallery ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}
            onDragOver={(e) => { handleDragOver(e); setDragOverGallery(true); }}
            onDragLeave={() => setDragOverGallery(false)}
            onDrop={handleDropGaleria}
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Galería de Contenido ({currentGaleriaItems.length})
              </h3>
              <p className="text-xs text-gray-500">Arrastra contenido a los packs</p>
            </div>

            {currentGaleriaItems.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm">No hay {activeTab}</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
                {currentGaleriaItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-all cursor-move ${
                      animatingMedia === item.id ? 'animate-suck-in' : ''
                    }`}
                    style={{
                      opacity: animatingMedia === item.id ? 0 : 1,
                      transition: animatingMedia === item.id ? 'opacity 0.6s ease-out' : 'none',
                    }}
                  >
                    {item.type === 'photo' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminarDeGaleria(item.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 2: PACKS (Estilo Azure DevOps) */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Packs Creados */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Packs ({packsCreados.length})
                </h3>
                
                <button
                  onClick={() => setShowCreatePackModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear
                </button>
              </div>

              <div
                className={`space-y-3 max-h-[700px] overflow-y-auto p-2 rounded-lg transition-all ${
                  dragOverPackCreados ? 'bg-gray-100 border-2 border-dashed border-gray-400' : ''
                }`}
                onDragOver={(e) => { handleDragOver(e); setDragOverPackCreados(true); }}
                onDragLeave={() => setDragOverPackCreados(false)}
                onDrop={handleDropPackCreados}
              >
                {packsCreados.length === 0 ? (
                  <div 
                    className={`py-12 text-center border-2 border-dashed rounded-xl transition-all ${
                      dragOverPackCreados 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {dragOverPackCreados ? (
                      <>
                        <Package className="w-12 h-12 mx-auto mb-3 text-purple-500 animate-bounce" />
                        <p className="text-sm font-bold text-purple-600">¡Primero crea un pack!</p>
                        <p className="text-xs text-purple-500 mt-1">Click en "Crear" arriba →</p>
                      </>
                    ) : (
                      <>
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Sin packs creados</p>
                      </>
                    )}
                  </div>
                ) : (
                  packsCreados.map((pack) => (
                    <div
                      key={pack.id}
                      draggable
                      onDragStart={(e) => handleDragStartPack(e, pack.id)}
                      className={`bg-gradient-to-br from-gray-50 to-gray-100 border-2 rounded-xl p-3 transition-all cursor-move hover:shadow-md ${
                        dragOverPack === pack.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                      }`}
                      onDragOver={(e) => { handleDragOver(e); setDragOverPack(pack.id); }}
                      onDragLeave={() => setDragOverPack(null)}
                      onDrop={(e) => handleDropPack(e, pack.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-base text-gray-900 line-clamp-1 flex-1">{pack.titulo}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          nivelesContenido.find(n => n.id === pack.nivelContenido)?.color
                        }`}>
                          {nivelesContenido.find(n => n.id === pack.nivelContenido)?.icon}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                          pack.fotos.length > 0 ? 'text-pink-600' : 'text-gray-400'
                        }`}>
                          <ImageIcon className="w-4 h-4" />
                          <span>{pack.fotos.length} fotos</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                          pack.videos.length > 0 ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          <Video className="w-4 h-4" />
                          <span>{pack.videos.length} videos</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-purple-600">
                          <DollarSign className="w-4 h-4" />
                          <span>S/. {pack.precio}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPack(pack);
                            setShowViewPackModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          Ver/Editar
                        </button>
                        <button
                          onClick={() => moverPackAVenta(pack.id)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                          title="Mover a Packs en Venta"
                        >
                          <span>Publicar</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => eliminarPack(pack.id)}
                          className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg text-xs transition-all shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Packs en Venta */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Packs en Venta ({packsEnVenta.length})
                </h3>
              </div>

              <div
                className={`space-y-3 max-h-[700px] overflow-y-auto p-2 rounded-lg transition-all ${
                  dragOverPackVenta ? 'bg-green-100 border-2 border-dashed border-green-400' : ''
                }`}
                onDragOver={(e) => { handleDragOver(e); setDragOverPackVenta(true); }}
                onDragLeave={() => setDragOverPackVenta(false)}
                onDrop={handleDropPackVenta}
              >
                {packsEnVenta.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
                    <Crown className="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <p className="text-sm">Sin packs en venta</p>
                  </div>
                ) : (
                  packsEnVenta.map((pack) => (
                    <div
                      key={pack.id}
                      draggable
                      onDragStart={(e) => handleDragStartPack(e, pack.id)}
                      className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-3 hover:shadow-md transition-all cursor-move"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-base text-gray-900 line-clamp-1 flex-1">{pack.titulo}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          nivelesContenido.find(n => n.id === pack.nivelContenido)?.color
                        }`}>
                          {nivelesContenido.find(n => n.id === pack.nivelContenido)?.icon}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                          pack.fotos.length > 0 ? 'text-pink-600' : 'text-gray-400'
                        }`}>
                          <ImageIcon className="w-4 h-4" />
                          <span>{pack.fotos.length} fotos</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                          pack.videos.length > 0 ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          <Video className="w-4 h-4" />
                          <span>{pack.videos.length} videos</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>S/. {pack.precio}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-green-700 font-medium mb-2">
                        <Lock className="w-3 h-3" />
                        <span>En Venta</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPack(pack);
                            setShowViewPackModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          Ver/Editar
                        </button>
                        <button
                          onClick={() => quitarPackDeVenta(pack.id)}
                          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Pause className="w-4 h-4" />
                          Pausar
                        </button>
                        <button
                          onClick={() => eliminarPack(pack.id)}
                          className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg text-xs transition-all shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear Pack */}
      {showCreatePackModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreatePackModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Crear Nuevo Pack</h3>
              <button
                onClick={() => setShowCreatePackModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={packTitulo}
                  onChange={(e) => setPackTitulo(e.target.value)}
                  placeholder="Ej: Noche Loca VIP"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">{packTitulo.length}/50</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={packDescripcion}
                  onChange={(e) => setPackDescripcion(e.target.value)}
                  placeholder="Ej: Contenido XXX exclusivo con mi novio. 25 fotos + 12 videos muy explícitos."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{packDescripcion.length}/200</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio (S/.) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">S/.</span>
                  <input
                    type="number"
                    value={packPrecio}
                    onChange={(e) => setPackPrecio(e.target.value)}
                    placeholder="250"
                    className="w-full pl-10 pr-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-bold text-gray-900"
                    min="50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo S/. 50</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nivel de Contenido
                </label>
                <div className="space-y-2">
                  {nivelesContenido.map((nivel) => (
                    <button
                      key={nivel.id}
                      onClick={() => setPackNivel(nivel.id)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        packNivel === nivel.id
                          ? `${nivel.color} ring-2 ring-offset-2 ${nivel.color.replace('bg-', 'ring-').replace('100', '500')}`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{nivel.icon}</span>
                      <span>{nivel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreatePackModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearPack}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition shadow-md text-sm"
                >
                  Crear Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Pack */}
      {showViewPackModal && selectedPack && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowViewPackModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">{selectedPack.titulo}</h3>
              <button
                onClick={() => setShowViewPackModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedPack.descripcion && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-1">Descripción:</h4>
                  <p className="text-sm text-gray-600">{selectedPack.descripcion}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  {editingPrecio ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-bold">S/.</span>
                      <input
                        type="number"
                        value={tempPrecio}
                        onChange={(e) => setTempPrecio(e.target.value)}
                        className="w-24 px-2 py-1 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-bold"
                        placeholder="Precio"
                        min="50"
                        autoFocus
                      />
                      <button
                        onClick={() => actualizarPrecioPack(selectedPack.id, tempPrecio)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrecio(false);
                          setTempPrecio('');
                        }}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 font-bold text-purple-600">
                        <DollarSign className="w-4 h-4" />
                        <span>S/. {selectedPack.precio}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPrecio(true);
                          setTempPrecio(selectedPack.precio.toString());
                        }}
                        className="p-1 hover:bg-purple-100 rounded transition"
                        title="Editar precio"
                      >
                        <Edit2 className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  nivelesContenido.find(n => n.id === selectedPack.nivelContenido)?.color
                }`}>
                  {nivelesContenido.find(n => n.id === selectedPack.nivelContenido)?.icon}
                  {' '}
                  {nivelesContenido.find(n => n.id === selectedPack.nivelContenido)?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedPack.enVenta ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedPack.enVenta ? '✅ En Venta' : '📝 Borrador'}
                </span>
                <p className="text-xs text-gray-500 w-full mt-1">Precio mínimo: S/. 50</p>
              </div>

              {/* Fotos del pack */}
              {selectedPack.fotos.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Fotos ({selectedPack.fotos.length})
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedPack.fotos.map((foto) => (
                      <div key={foto.id} className="relative aspect-square group">
                        <img
                          src={foto.url}
                          alt={foto.name}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                          <button
                            onClick={() => setPreviewMedia(foto)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => quitarMediaDePack(foto.id, selectedPack.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos del pack */}
              {selectedPack.videos.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos ({selectedPack.videos.length})
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedPack.videos.map((video) => (
                      <div key={video.id} className="relative aspect-square group">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                          <button
                            onClick={() => setPreviewMedia(video)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => quitarMediaDePack(video.id, selectedPack.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPack.fotos.length === 0 && selectedPack.videos.length === 0 && (
                <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Pack vacío</p>
                  <p className="text-xs text-gray-500 mt-1">Arrastra contenido desde la galería</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Media */}
      {previewMedia && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <button
            onClick={() => setPreviewMedia(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-full flex items-center justify-center p-16">
            {previewMedia.type === 'photo' ? (
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={previewMedia.url}
                controls
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal de Validaciones */}
      <Modal
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      {/* CSS para animaciones */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes suck-in {
          0% {
            transform: scale(1);
            filter: blur(0px);
          }
          50% {
            transform: scale(0.6) rotate(5deg);
            filter: blur(2px);
          }
          100% {
            transform: scale(0.1) rotate(10deg);
            filter: blur(4px);
            opacity: 0;
          }
        }

        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        .animate-suck-in {
          animation: suck-in 0.6s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .particle {
          position: fixed;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 50%;
          pointer-events: none;
          animation: particle-burst 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}} />

      {/* Partículas */}
      {particles.map((particle, index) => {
        const angle = (index / 20) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        return (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animationDelay: `${index * 0.02}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

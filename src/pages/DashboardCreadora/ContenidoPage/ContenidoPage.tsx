import { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Trash2, DollarSign, Gift, X, Crown, ArrowLeftRight, Eye, Lock, Edit2, Heart, Pause, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/Modals/Modal';

interface Media {
  id: string;
  url: string;
  type: 'photo' | 'video';
  name: string;
  size: number;
  enSuscripcion: boolean;
  titulo?: string;
  descripcion?: string;
  likes?: number;
}

export const ContenidoPage = () => {
  const [activeTab, setActiveTab] = useState<'fotos' | 'videos'>('fotos');
  const [fotos, setFotos] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);
  const [precioFotos, setPrecioFotos] = useState<string>('140');
  const [precioVideos, setPrecioVideos] = useState<string>('200');
  const [descripcionSuscripcion, setDescripcionSuscripcion] = useState<string>('');
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);
  const [dragOverGallery, setDragOverGallery] = useState(false);
  const [dragOverSuscripcion, setDragOverSuscripcion] = useState(false);
  
  // Estados de publicación
  const [fotosPublicadas, setFotosPublicadas] = useState(false);
  const [videosPublicados, setVideosPublicados] = useState(false);
  
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [tempTitulo, setTempTitulo] = useState('');
  const [tempDescripcion, setTempDescripcion] = useState('');
  
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

  const MAX_FOTOS = 100;
  const MAX_VIDEOS = 100;

  const currentItems = activeTab === 'fotos' ? fotos : videos;
  const setCurrentItems = activeTab === 'fotos' ? setFotos : setVideos;
  const maxItems = activeTab === 'fotos' ? MAX_FOTOS : MAX_VIDEOS;

  const itemsGaleria = currentItems.filter(item => !item.enSuscripcion);
  const itemsSuscripcion = currentItems.filter(item => item.enSuscripcion);

  // Estado de publicación actual
  const isPublicado = activeTab === 'fotos' ? fotosPublicadas : videosPublicados;

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

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const filesArray = Array.from(files);
    const cantidadASubir = filesArray.length;
    const cantidadEnGaleria = itemsGaleria.length;
    const totalDespuesDeSubir = cantidadEnGaleria + cantidadASubir;
    
    if (totalDespuesDeSubir > maxItems) {
      const disponibles = maxItems - cantidadEnGaleria;
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: '¡Límite Superado!',
        message: `Estás intentando subir ${cantidadASubir} ${activeTab}, pero solo puedes agregar ${disponibles} más.\n\nActualmente tienes: ${cantidadEnGaleria}/${maxItems} en galería\nLímite máximo: ${maxItems} ${activeTab}\n\nPor favor, selecciona menos archivos o elimina algunos existentes.`,
      });
      return;
    }
    
    const newItems: Media[] = [];
    
    filesArray.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}-${index}-${Math.random()}`,
        url,
        type: activeTab === 'fotos' ? 'photo' : 'video',
        name: file.name,
        size: file.size,
        enSuscripcion: false,
        likes: 0,
      });
    });

    if (newItems.length > 0) {
      setCurrentItems([...currentItems, ...newItems]);
      
      const nuevaCantidadGaleria = itemsGaleria.length + newItems.length;
      if (nuevaCantidadGaleria === maxItems) {
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: '¡Límite Alcanzado!',
          message: `Has alcanzado el límite de ${maxItems} ${activeTab} en la galería.\n\nSi deseas subir más contenido, deberás eliminar algunas ${activeTab} de la galería primero.`,
        });
      }
    }
  };

  const handleDelete = (id: string) => {
    setCurrentItems(currentItems.filter(item => item.id !== id));
  };

  const moverASuscripcion = (id: string) => {
    setCurrentItems(currentItems.map(item =>
      item.id === id ? { ...item, enSuscripcion: true } : item
    ));
  };

  const moverAGaleria = (id: string) => {
    if (itemsGaleria.length >= maxItems) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: '¡Galería Llena!',
        message: `No puedes mover esta ${activeTab === 'fotos' ? 'foto' : 'video'} a la galería porque ya está llena (${maxItems}/${maxItems}).\n\nPrimero elimina algunas ${activeTab} de la galería para liberar espacio.`,
      });
      return;
    }
    
    setCurrentItems(currentItems.map(item =>
      item.id === id ? { ...item, enSuscripcion: false } : item
    ));
  };

  const handleEditMedia = (media: Media) => {
    setEditingMedia(media);
    setTempTitulo(media.titulo || '');
    setTempDescripcion(media.descripcion || '');
  };

  const handleSaveMediaInfo = () => {
    if (!editingMedia) return;
    
    setCurrentItems(currentItems.map(item =>
      item.id === editingMedia.id 
        ? { ...item, titulo: tempTitulo, descripcion: tempDescripcion }
        : item
    ));
    
    setEditingMedia(null);
    setTempTitulo('');
    setTempDescripcion('');
  };

  const handleGuardar = () => {
    const errores: string[] = [];

    if (activeTab === 'fotos') {
      const precioFotosNum = parseFloat(precioFotos) || 0;
      const fotosSuscripcion = fotos.filter(f => f.enSuscripcion);
      
      if (precioFotosNum > 0 && fotosSuscripcion.length < 3) {
        errores.push(
          `FOTOS:\nEl campo "Precio Fotos" tiene un valor de S/. ${precioFotos}, sin embargo ${
            fotosSuscripcion.length === 0 
              ? 'no tienes fotos subidas' 
              : `solo tienes ${fotosSuscripcion.length} foto(s) en suscripción`
          }. Debes subir y asignar al menos 3 fotos a la sección de Suscripción.`
        );
      }
    } else {
      const precioVideosNum = parseFloat(precioVideos) || 0;
      const videosSuscripcion = videos.filter(v => v.enSuscripcion);
      
      if (precioVideosNum > 0 && videosSuscripcion.length < 2) {
        errores.push(
          `VIDEOS:\nEl campo "Precio Videos" tiene un valor de S/. ${precioVideos}, sin embargo ${
            videosSuscripcion.length === 0 
              ? 'no tienes videos subidos' 
              : `solo tienes ${videosSuscripcion.length} video(s) en suscripción`
          }. Debes subir y asignar al menos 2 videos a la sección de Suscripción.`
        );
      }
    }

    if (errores.length > 0) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error de Validación',
        message: errores.join('\n\n'),
      });
      return;
    }

    // Publicar suscripción
    if (activeTab === 'fotos') {
      setFotosPublicadas(true);
    } else {
      setVideosPublicados(true);
    }

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: '¡Publicado Exitoso!',
      message: `Tu suscripción de ${activeTab} ha sido publicada correctamente.\n\nPrecio: S/. ${activeTab === 'fotos' ? precioFotos : precioVideos}\nContenido: ${activeTab === 'fotos' ? fotos.filter(f => f.enSuscripcion).length : videos.filter(v => v.enSuscripcion).length} ${activeTab}`,
    });
  };

  const handlePausar = () => {
    if (activeTab === 'fotos') {
      setFotosPublicadas(false);
    } else {
      setVideosPublicados(false);
    }

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: 'Suscripción Pausada',
      message: `La suscripción de ${activeTab} ha sido pausada correctamente.`,
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('mediaId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropGaleria = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGallery(false);
    const id = e.dataTransfer.getData('mediaId');
    if (!id) return;
    
    const item = currentItems.find(i => i.id === id);
    if (!item) return;
    
    if (!item.enSuscripcion) {
      return;
    }
    
    if (itemsGaleria.length >= maxItems) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: '¡Galería Llena!',
        message: `No puedes mover esta ${activeTab === 'fotos' ? 'foto' : 'video'} a la galería porque ya está llena (${maxItems}/${maxItems}).\n\nPrimero elimina algunas ${activeTab} de la galería para liberar espacio.`,
      });
      return;
    }
    
    moverAGaleria(id);
  };

  const handleDropSuscripcion = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSuscripcion(false);
    const id = e.dataTransfer.getData('mediaId');
    if (!id) return;
    
    const item = currentItems.find(i => i.id === id);
    if (!item) return;
    
    if (item.enSuscripcion) {
      return;
    }
    
    moverASuscripcion(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
          <ImageIcon className="w-7 h-7 text-pink-500" />
          Gestionar Contenido
        </h1>
        <p className="text-sm text-gray-600">Sube y organiza tu contenido para suscriptores</p>
      </div>

      {/* Notificación */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3.5">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">¡Gana recompensas!</span> Actualiza mensualmente para acumular puntos y recibir bonificaciones.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const count = tab.id === 'fotos' ? itemsGaleria.length : videos.filter(v => !v.enSuscripcion).length;
          const max = tab.id === 'fotos' ? MAX_FOTOS : MAX_VIDEOS;
          
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

      {/* Grid alineado con columnas de abajo */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
        {/* Card Subir archivos - alineado con Galería */}
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
                disabled={itemsGaleria.length >= maxItems}
              />
              <div className={`
                w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2
                ${itemsGaleria.length >= maxItems
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : activeTab === 'fotos' 
                    ? 'border-pink-300 hover:border-pink-500 hover:bg-pink-50 text-gray-700'
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                }
              `}>
                <Upload className="w-5 h-5" />
                <span>Seleccionar archivos</span>
              </div>
            </label>

            <div className="text-xs text-gray-500 text-center">
              <p className="font-semibold">{itemsGaleria.length}/{maxItems}</p>
              <p>galería</p>
            </div>
          </div>
          
          {/* Mensaje de límite alcanzado */}
          {itemsGaleria.length >= maxItems && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-red-700 font-medium">
                <span className="font-bold">Límite alcanzado en galería.</span> Elimina algunas {activeTab} o muévelas a suscripción para subir más.
              </p>
            </div>
          )}
        </div>

        {/* Espaciador vacío */}
        <div></div>

        {/* Card Precio y Publicar - alineado con Suscripción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            {activeTab === 'fotos' ? (
              <>
                <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-600 rounded flex items-center justify-center">
                  <ImageIcon className="w-3 h-3 text-white" />
                </div>
                <span>Precio Mensual</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded flex items-center justify-center">
                  <Video className="w-3 h-3 text-white" />
                </div>
                <span>Precio Mensual</span>
              </>
            )}
          </h3>
          
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-[180px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">S/.</span>
                <input
                  type="number"
                  value={activeTab === 'fotos' ? precioFotos : precioVideos}
                  onChange={(e) => activeTab === 'fotos' ? setPrecioFotos(e.target.value) : setPrecioVideos(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 text-base font-bold text-gray-900 ${
                    activeTab === 'fotos' 
                      ? 'border-pink-300 focus:ring-pink-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                  placeholder={activeTab === 'fotos' ? '140' : '200'}
                />
              </div>
            </div>

            <div className="flex gap-3 flex-1">
              <button 
                onClick={handleGuardar}
                disabled={isPublicado}
                className={`flex-1 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap ${
                  isPublicado
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Publicar {activeTab === 'fotos' ? 'Fotos' : 'Videos'}
              </button>

              <button
                onClick={handlePausar}
                disabled={!isPublicado}
                className={`flex-1 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  !isPublicado
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
                }`}
              >
                <Pause className="w-4 h-4" />
                Pausar {activeTab === 'fotos' ? 'Fotos' : 'Videos'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOS COLUMNAS MÁS GRANDES */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Galería General */}
        <div
          className={`bg-white rounded-xl shadow-sm border-2 p-5 transition-all ${
            dragOverGallery ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
          }`}
          onDragOver={(e) => { handleDragOver(e); setDragOverGallery(true); }}
          onDragLeave={() => setDragOverGallery(false)}
          onDrop={handleDropGaleria}
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Galería General ({itemsGaleria.length})
            </h3>
            <p className="text-xs text-gray-500">Arrastra o haz clic en la corona</p>
          </div>

          {itemsGaleria.length === 0 ? (
            <div className="py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm">No hay {activeTab}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[700px] overflow-y-auto">
              {itemsGaleria.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-pink-500 transition-all cursor-move"
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
                      title="Ver completa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moverASuscripcion(item.id)}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                      title="Mover a Suscripción"
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

        {/* Flechas */}
        <div className="flex items-center justify-center pt-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-gray-500 font-semibold text-center max-w-[80px]">
              Arrastra aquí
            </p>
          </div>
        </div>

        {/* Suscripción */}
        <div
          className={`rounded-xl shadow-sm border-2 p-5 transition-all ${
            dragOverSuscripcion 
              ? 'border-yellow-500 bg-yellow-50' 
              : isPublicado
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-300'
          }`}
          onDragOver={(e) => { handleDragOver(e); setDragOverSuscripcion(true); }}
          onDragLeave={() => setDragOverSuscripcion(false)}
          onDrop={handleDropSuscripcion}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${isPublicado ? 'text-green-600' : 'text-gray-400'}`} />
                <h3 className={`text-base font-bold ${isPublicado ? 'text-green-900' : 'text-gray-700'}`}>
                  Suscripción ({itemsSuscripcion.length})
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                {isPublicado ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">Publicada</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500">No publicada</span>
                  </>
                )}
              </div>
            </div>
            
            <input
              type="text"
              value={descripcionSuscripcion}
              onChange={(e) => setDescripcionSuscripcion(e.target.value)}
              placeholder="Descripción corta (opcional)"
              disabled={isPublicado}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 mb-2 ${
                isPublicado
                  ? 'border-green-300 bg-green-50 text-green-700 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-gray-400 bg-white'
              }`}
              maxLength={70}
            />
            
            <p className={`text-xs font-medium ${isPublicado ? 'text-green-600' : 'text-gray-500'}`}>
              {isPublicado ? 'Suscripción activa y visible' : 'Arrastra aquí o usa la corona'}
            </p>
          </div>

          {itemsSuscripcion.length === 0 ? (
            <div className={`py-16 text-center border-2 border-dashed rounded-xl ${
              isPublicado
                ? 'border-green-200 bg-green-100 text-green-400'
                : 'border-gray-200 bg-gray-100 text-gray-400'
            }`}>
              <Crown className={`w-8 h-8 mx-auto mb-2 ${isPublicado ? 'text-green-300' : 'text-gray-300'}`} />
              <p className="text-sm">Sin contenido exclusivo</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[700px] overflow-y-auto">
              {itemsSuscripcion.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="group relative rounded-xl overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition-all cursor-move bg-gradient-to-br from-purple-500 to-pink-600"
                >
                  <div className="relative aspect-[3/4]">
                    {item.type === 'photo' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="text-xs font-normal opacity-90 line-clamp-3 mb-2">
                        {item.descripcion || 'Contenido exclusivo premium. Suscríbete para ver más.'}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs">
                        <Heart className="w-3 h-3 fill-white" />
                        <span>{item.likes || 0}</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditMedia(item)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moverAGaleria(item.id)}
                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                      >
                        <Crown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Preview */}
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

      {/* Modal Editar */}
      {editingMedia && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditingMedia(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Editar Contenido</h3>
              <button
                onClick={() => setEditingMedia(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={tempDescripcion}
                  onChange={(e) => setTempDescripcion(e.target.value)}
                  placeholder="Ej: Sesión exclusiva en bikini dorado durante el atardecer. Fotografía profesional en alta resolución."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                  rows={5}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{tempDescripcion.length}/200</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingMedia(null)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveMediaInfo}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition shadow-md text-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
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
    </div>
  );
};

import { useState } from 'react';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, MapPin, 
  Users, CheckCircle, Star, Calendar, Shield, 
  Camera, Gift, Globe, ThumbsDown, Image, Video,
  Crown, ShoppingBag, Play, Lock, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface MediaItem {
  id: number;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail: string;
  isPremium: boolean;
  likes: number;
  createdAt: string;
  duracion?: number;
  titulo?: string;
  descripcion?: string;
}

interface ContenidoComprable {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'pack' | 'video' | 'foto';
  thumbnail: string;
  precio: number;
  cantidadItems: number;
  cantidadFotos?: number;
  cantidadVideos?: number;
  isPurchased: boolean;
  createdAt: string;
}

type ContentTabType = 'informacion' | 'fotos' | 'videos' | 'premium-fotos' | 'premium-videos' | 'contenido-comprable';

export const CreatorProfilePageFullscreen = () => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'public' | 'premium' | 'shop'>('public');
  const [activeTab, setActiveTab] = useState<ContentTabType>('informacion');
  const [isSubscribedToPhotos, setIsSubscribedToPhotos] = useState(false);
  const [isSubscribedToVideos, setIsSubscribedToVideos] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  // Estados para el modal de visualización
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Mock data
  const creadora = {
    nombre: 'María',
    apellido: 'Rodriguez',
    username: '@maria_lima3',
    edad: 24,
    avatar: 'https://i.pravatar.cc/400?img=1',
    ubicacion: 'Miraflores, Lima',
    bio: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida 💪✨',
    verificada: true,
    enVivo: false,
    isOnline: true,
    seguidores: 12400,
    meGusta: 472,
    noMeGusta: 0,
    contenidoSubido: 156,
    altura: 160,
    tipoCuerpo: 'Delgado',
    apariencia: 'Muy atractivo',
    idiomas: ['Inglés', 'Español'],
    nivelIngles: 'Medio',
    etnia: 'Latino/Hispano',
    fumas: 'No',
    hijos: '0',
    buscando: ['Ligue', 'Amistad'],
    ingresos: '50k-249k',
    ultimaConexion: 'Conectada ahora',
    miembroDesde: 'Enero 2024',
    precioSuscripcion: 140,
    precioSuscripcionFotos: 80,
    precioSuscripcionVideos: 100,
  };

  // Contenido PÚBLICO
  const fotosPublicas: MediaItem[] = [
    { id: 1, tipo: 'foto', url: 'https://picsum.photos/800/600?random=1', thumbnail: 'https://picsum.photos/400/400?random=1', isPremium: false, likes: 234, createdAt: '2024-01-15' },
    { id: 2, tipo: 'foto', url: 'https://picsum.photos/800/600?random=2', thumbnail: 'https://picsum.photos/400/400?random=2', isPremium: false, likes: 189, createdAt: '2024-01-14' },
    { id: 3, tipo: 'foto', url: 'https://picsum.photos/800/600?random=3', thumbnail: 'https://picsum.photos/400/400?random=3', isPremium: false, likes: 156, createdAt: '2024-01-13' },
    { id: 4, tipo: 'foto', url: 'https://picsum.photos/800/600?random=4', thumbnail: 'https://picsum.photos/400/400?random=4', isPremium: false, likes: 201, createdAt: '2024-01-12' },
    { id: 5, tipo: 'foto', url: 'https://picsum.photos/800/600?random=5', thumbnail: 'https://picsum.photos/400/400?random=5', isPremium: false, likes: 178, createdAt: '2024-01-11' },
  ];

  const videosPublicos: MediaItem[] = [
    { id: 10, tipo: 'video', url: 'video.mp4', thumbnail: 'https://picsum.photos/800/600?random=10', isPremium: false, likes: 567, createdAt: '2024-01-13', duracion: 125 },
    { id: 11, tipo: 'video', url: 'video2.mp4', thumbnail: 'https://picsum.photos/800/600?random=11', isPremium: false, likes: 432, createdAt: '2024-01-12', duracion: 95 },
  ];

  // Contenido PREMIUM
  const contenidoPremiumFotos: MediaItem[] = [
    { id: 30, tipo: 'foto', url: 'https://picsum.photos/800/600?random=30', thumbnail: 'https://picsum.photos/400/400?random=30', isPremium: true, likes: 456, createdAt: '2024-01-10', titulo: 'Atardecer en la Playa' },
    { id: 31, tipo: 'foto', url: 'https://picsum.photos/800/600?random=31', thumbnail: 'https://picsum.photos/400/400?random=31', isPremium: true, likes: 389, createdAt: '2024-01-09', titulo: 'Fitness en el Gym' },
    { id: 32, tipo: 'foto', url: 'https://picsum.photos/800/600?random=32', thumbnail: 'https://picsum.photos/400/400?random=32', isPremium: true, likes: 512, createdAt: '2024-01-08', titulo: 'Sesión Exclusiva' },
    { id: 33, tipo: 'foto', url: 'https://picsum.photos/800/600?random=33', thumbnail: 'https://picsum.photos/400/400?random=33', isPremium: true, likes: 423, createdAt: '2024-01-07', titulo: 'Playa Privada' },
  ];

  const contenidoPremiumVideos: MediaItem[] = [
    { id: 40, tipo: 'video', url: 'video.mp4', thumbnail: 'https://picsum.photos/800/600?random=40', isPremium: true, likes: 789, createdAt: '2024-01-08', duracion: 180, titulo: 'Yoga Matutina' },
    { id: 41, tipo: 'video', url: 'video2.mp4', thumbnail: 'https://picsum.photos/800/600?random=41', isPremium: true, likes: 654, createdAt: '2024-01-07', duracion: 240, titulo: 'Rutina Completa' },
    { id: 42, tipo: 'video', url: 'video3.mp4', thumbnail: 'https://picsum.photos/800/600?random=42', isPremium: true, likes: 521, createdAt: '2024-01-06', duracion: 156, titulo: 'Sesión Premium' },
  ];

  const contenidoComprable: ContenidoComprable[] = [
    {
      id: 1,
      titulo: 'Pack Playa Verano 2024',
      descripcion: 'Sesión fotográfica exclusiva en la playa. 15 fotos en alta resolución.',
      tipo: 'pack',
      thumbnail: 'https://picsum.photos/400/400?random=50',
      precio: 45,
      cantidadItems: 15,
      cantidadFotos: 12,
      cantidadVideos: 3,
      isPurchased: false,
      createdAt: '2024-01-12',
    },
    {
      id: 2,
      titulo: 'Video Fitness Completo',
      descripcion: 'Rutina completa de gimnasio en 4K.',
      tipo: 'video',
      thumbnail: 'https://picsum.photos/400/400?random=51',
      precio: 25,
      cantidadItems: 1,
      isPurchased: true,
      createdAt: '2024-01-11',
    },
  ];

  const tabs = [
    { id: 'informacion' as ContentTabType, label: 'Sobre mí', icon: Users, count: 0, isPublic: true, category: 'public' },
    { id: 'fotos' as ContentTabType, label: 'Fotos', icon: Image, count: fotosPublicas.length, isPublic: true, category: 'public' },
    { id: 'videos' as ContentTabType, label: 'Videos', icon: Video, count: videosPublicos.length, isPublic: true, category: 'public' },
    { id: 'premium-fotos' as ContentTabType, label: 'Fotos', icon: Image, count: contenidoPremiumFotos.length, isPublic: false, category: 'premium' },
    { id: 'premium-videos' as ContentTabType, label: 'Videos', icon: Video, count: contenidoPremiumVideos.length, isPublic: false, category: 'premium' },
    { id: 'contenido-comprable' as ContentTabType, label: 'Packs Premium', icon: ShoppingBag, count: contenidoComprable.length, isPublic: false, category: 'shop' },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'informacion': return null; // Muestra información estática
      case 'fotos': return fotosPublicas;
      case 'videos': return videosPublicos;
      case 'premium-fotos': return contenidoPremiumFotos;
      case 'premium-videos': return contenidoPremiumVideos;
      case 'contenido-comprable': return null;
      default: return [];
    }
  };

  const currentContent = getContent();
  const isPremiumTab = activeTab === 'premium-fotos' || activeTab === 'premium-videos';
  const isSubscribed = activeTab === 'premium-fotos' ? isSubscribedToPhotos : activeTab === 'premium-videos' ? isSubscribedToVideos : false;
  const isPublicTab = activeTab === 'fotos' || activeTab === 'videos';

  const handleMediaClick = (index: number) => {
    if (isPremiumTab && isSubscribed) {
      setSelectedMediaIndex(index);
      setShowMediaModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Volver</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRecommend(!recommend);
                  setNotRecommend(false);
                }}
                className={`p-2 rounded-lg transition ${
                  recommend ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${recommend ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setNotRecommend(!notRecommend);
                  setRecommend(false);
                }}
                className={`p-2 rounded-lg transition ${
                  notRecommend ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${notRecommend ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition ${
                  isFavorite ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={creadora.avatar}
                  alt={creadora.nombre}
                  className="w-full h-full rounded-full object-cover ring-2 ring-gray-200"
                />
                {creadora.verificada && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                )}
                {creadora.isOnline && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {creadora.nombre}, {creadora.edad}
                </h1>
                <p className="text-sm text-gray-600 mb-2">{creadora.username}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{creadora.ubicacion}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 py-4 mb-4 border-y border-gray-100">
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">
                    {creadora.seguidores >= 1000 
                      ? `${(creadora.seguidores / 1000).toFixed(1)}K` 
                      : creadora.seguidores}
                  </div>
                  <div className="text-xs text-gray-500">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">{creadora.meGusta}</div>
                  <div className="text-xs text-gray-500">Me Gusta</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-900">{creadora.contenidoSubido}</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{creadora.bio}</p>
              </div>

              {/* Botones */}
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Mensaje
                  </button>
                  <button className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    Regalo
                  </button>
                </div>
              </div>

              {/* Premium */}
              <div className="bg-gray-900 rounded-lg p-4 text-center mb-6">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Premium</span>
                </div>
                <p className="text-lg font-bold text-white mb-2">S/. {creadora.precioSuscripcion}/mes</p>
                <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-semibold text-xs hover:bg-gray-100 transition">
                  Suscribirse
                </button>
              </div>

              {/* Info Adicional */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Características</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Altura</span>
                      <span className="text-gray-900 font-medium">{creadora.altura} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo</span>
                      <span className="text-gray-900 font-medium">{creadora.tipoCuerpo}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Idiomas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {creadora.idiomas.map((idioma) => (
                      <span key={idioma} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {idioma}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Miembro desde {creadora.miembroDesde}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Perfil verificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Selector de Categoría */}
            <div className="bg-white rounded-lg border border-gray-200 mb-4 p-2">
              <div className="flex gap-2">
                {/* Público - Prominente */}
                <button
                  onClick={() => {
                    setActiveCategory('public');
                    setActiveTab('informacion');
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                    activeCategory === 'public'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Contenido Público</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                    Gratis
                  </span>
                </button>

                {/* Premium y Tienda - Discretos (solo íconos + texto pequeño) */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveCategory('premium');
                      setActiveTab('premium-fotos');
                    }}
                    className={`px-3 py-3 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1 ${
                      activeCategory === 'premium'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>Exclusivo</span>
                    <Lock className="w-2.5 h-2.5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveCategory('shop');
                      setActiveTab('contenido-comprable');
                    }}
                    className={`px-3 py-3 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1 ${
                      activeCategory === 'shop'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Packs</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Específicos por Categoría */}
            {activeCategory !== 'shop' && (
              <div className="bg-white rounded-lg border border-gray-200 mb-4">
                <div className="flex border-b border-gray-200">
                  {tabs.filter(t => t.category === activeCategory).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition relative ${
                          isActive 
                            ? activeCategory === 'public'
                              ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                              : 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            isActive 
                              ? activeCategory === 'public'
                                ? 'bg-gray-900 text-white'
                                : 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              {activeTab === 'informacion' ? (
                /* Información Personal Completa */
                <div className="space-y-4">
                  {/* Biografía */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Sobre mí
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{creadora.bio}</p>
                  </div>

                  {/* Características Físicas */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Características</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Altura</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.altura} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tipo de cuerpo</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.tipoCuerpo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Apariencia</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.apariencia}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Etnia</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.etnia}</p>
                      </div>
                    </div>
                  </div>

                  {/* Idiomas */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Idiomas</h3>
                    <div className="flex flex-wrap gap-2">
                      {creadora.idiomas.map((idioma) => (
                        <span key={idioma} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          {idioma}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Nivel de inglés</p>
                      <p className="text-sm font-medium text-gray-900">{creadora.nivelIngles}</p>
                    </div>
                  </div>

                  {/* Estilo de Vida */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Estilo de vida</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">¿Fumas?</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.fumas}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hijos</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.hijos}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Buscando</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {creadora.buscando.map((item) => (
                            <span key={item} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ingresos anuales (USD)</p>
                        <p className="text-sm font-medium text-gray-900">{creadora.ingresos}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de Cuenta */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Información de cuenta</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Miembro desde</span>
                        <span className="font-medium text-gray-900">{creadora.miembroDesde}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Estado:</span>
                        <span className="font-medium text-green-600">{creadora.ultimaConexion}</span>
                      </div>
                      {creadora.verificada && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-blue-600">Perfil verificado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'contenido-comprable' ? (
                /* Contenido Comprable */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contenidoComprable.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition">
                      <div className="aspect-video relative bg-gray-100">
                        {/* Imagen con blur si NO está comprado */}
                        <img 
                          src={item.thumbnail} 
                          alt={item.titulo} 
                          className={`w-full h-full object-cover transition ${
                            !item.isPurchased ? 'blur-xl scale-105' : ''
                          }`}
                        />
                        
                        {/* Badge de precio */}
                        <div className={`absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded ${
                          !item.isPurchased ? 'blur-sm' : ''
                        }`}>
                          S/. {item.precio}
                        </div>
                        
                        {/* Badge de comprado */}
                        {item.isPurchased && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                            ✓ Comprado
                          </div>
                        )}
                        
                        {/* Icono de candado si NO está comprado */}
                        {!item.isPurchased && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-900/70 rounded-full flex items-center justify-center">
                              <Lock className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Contador de fotos y videos - NO borroso */}
                        <div className="absolute bottom-2 left-2 flex gap-1.5">
                          {item.cantidadFotos && item.cantidadFotos > 0 && (
                            <div className="px-2 py-1 bg-black/70 rounded flex items-center gap-1">
                              <Image className="w-3 h-3 text-white" />
                              <span className="text-xs font-semibold text-white">{item.cantidadFotos}</span>
                            </div>
                          )}
                          {item.cantidadVideos && item.cantidadVideos > 0 && (
                            <div className="px-2 py-1 bg-black/70 rounded flex items-center gap-1">
                              <Video className="w-3 h-3 text-white" />
                              <span className="text-xs font-semibold text-white">{item.cantidadVideos}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.titulo}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.descripcion}</p>
                        
                        {/* Botones */}
                        <div className="flex items-center gap-2">
                          {/* Botón Comprar/Comprado */}
                          <button 
                            disabled={item.isPurchased}
                            className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                              item.isPurchased
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                          >
                            {item.isPurchased ? 'Comprado' : `Comprar S/. ${item.precio}`}
                          </button>
                          
                          {/* Botón Descargar - Solo si está comprado */}
                          {item.isPurchased && (
                            <button 
                              onClick={() => {
                                // Aquí iría la lógica de descarga
                                console.log('Descargando pack:', item.titulo);
                                alert(`Descargando: ${item.titulo}`);
                              }}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-1.5"
                              title="Descargar contenido"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span className="text-xs font-semibold">Descargar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isPublicTab ? (
                /* GALERÍA PÚBLICA */
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Galería
                  </h2>

                  {currentContent && currentContent.length > 0 && (
                    <>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={currentContent[activeMediaIndex].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        
                        {currentContent[activeMediaIndex].tipo === 'video' && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                              </div>
                            </div>
                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                              {Math.floor(currentContent[activeMediaIndex].duracion! / 60)}:{(currentContent[activeMediaIndex].duracion! % 60).toString().padStart(2, '0')}
                            </div>
                          </>
                        )}

                        {activeMediaIndex > 0 && (
                          <button
                            onClick={() => setActiveMediaIndex(activeMediaIndex - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-900" />
                          </button>
                        )}
                        {activeMediaIndex < currentContent.length - 1 && (
                          <button
                            onClick={() => setActiveMediaIndex(activeMediaIndex + 1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-900" />
                          </button>
                        )}

                        <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-medium">
                          {activeMediaIndex + 1} / {currentContent.length}
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {currentContent.map((item, index) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveMediaIndex(index)}
                            className={`aspect-square rounded overflow-hidden transition relative ${
                              activeMediaIndex === index
                                ? 'ring-2 ring-gray-900'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                            {item.tipo === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white fill-current" />
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* CONTENIDO PREMIUM */
                <div>
                  {/* Candado STICKY (SIEMPRE VISIBLE - Aparece primero) */}
                  {!isSubscribed && (
                    <div className="sticky top-24 z-20 flex justify-center mb-6 pointer-events-none">
                      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8 text-center max-w-md pointer-events-auto">
                        <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido Premium</h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Suscríbete para desbloquear {currentContent?.length} {activeTab === 'premium-fotos' ? 'fotos' : 'videos'} exclusivos
                        </p>
                        <button 
                          onClick={() => activeTab === 'premium-fotos' ? setIsSubscribedToPhotos(true) : setIsSubscribedToVideos(true)}
                          className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm shadow-lg"
                        >
                          Suscribirse por S/. {activeTab === 'premium-fotos' ? creadora.precioSuscripcionFotos : creadora.precioSuscripcionVideos}/mes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grid con Blur (SIEMPRE VISIBLE) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentContent?.map((item: MediaItem, index: number) => (
                      <button
                        key={item.id}
                        onClick={() => handleMediaClick(index)}
                        disabled={!isSubscribed}
                        className={`aspect-square relative group bg-gray-100 rounded-lg overflow-hidden ${
                          !isSubscribed ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <img
                          src={item.thumbnail}
                          alt=""
                          className={`w-full h-full object-cover transition ${
                            !isSubscribed ? 'blur-2xl scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                        {item.tipo === 'video' && (
                          <>
                            <div className={`absolute inset-0 flex items-center justify-center ${!isSubscribed ? 'blur-sm' : ''}`}>
                              <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                              </div>
                            </div>
                            <div className={`absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded ${!isSubscribed ? 'blur-sm' : ''}`}>
                              {Math.floor(item.duracion! / 60)}:{(item.duracion! % 60).toString().padStart(2, '0')}
                            </div>
                          </>
                        )}
                        {isSubscribed && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white">
                              <Heart className="w-4 h-4" />
                              <span className="font-semibold text-sm">{item.likes}</span>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Visualización (Solo Premium Suscrito) */}
      {showMediaModal && currentContent && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowMediaModal(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl w-full">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
              <img
                src={currentContent[selectedMediaIndex].url}
                alt=""
                className="w-full h-full object-contain"
              />
              
              {currentContent[selectedMediaIndex].tipo === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                </div>
              )}

              {selectedMediaIndex > 0 && (
                <button
                  onClick={() => setSelectedMediaIndex(selectedMediaIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {selectedMediaIndex < currentContent.length - 1 && (
                <button
                  onClick={() => setSelectedMediaIndex(selectedMediaIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-medium">
                {selectedMediaIndex + 1} / {currentContent.length}
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 hover:text-gray-300 transition">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{currentContent[selectedMediaIndex].likes}</span>
                </button>
              </div>
              {currentContent[selectedMediaIndex].titulo && (
                <p className="text-sm font-medium">{currentContent[selectedMediaIndex].titulo}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

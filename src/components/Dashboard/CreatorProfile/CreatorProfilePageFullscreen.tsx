import { useState } from 'react';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, MapPin, 
  Users, CheckCircle, Star, Calendar, Shield, 
  UserPlus, DollarSign, ThumbsDown, Image, Video, 
  Crown, ShoppingBag, Gift, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Interfaces
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

type ContentTabType = 'fotos' | 'videos' | 'premium-fotos' | 'premium-videos' | 'contenido-comprable';

export const CreatorProfilePageFullscreen = () => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTabType>('fotos');
  const [isSubscribedToPhotos, setIsSubscribedToPhotos] = useState(false);
  const [isSubscribedToVideos, setIsSubscribedToVideos] = useState(false);

  // Mock data
  const creadora = {
    nombre: 'María',
    apellido: 'Rodriguez',
    username: '@maria_lima3',
    edad: 24,
    avatar: 'https://i.pravatar.cc/400?img=1',
    ubicacion: 'Miraflores, Lima',
    distancia: 5,
    bio: 'Modelo y creadora de contenido. Amante del fitness, viajes y la buena vida 💪✨',
    verificada: true,
    enVivo: false,
    isOnline: true,
    
    // Stats
    seguidores: 12400,
    meGusta: 472,
    noMeGusta: 0,
    contenidoSubido: 156,
    
    // Información detallada
    altura: 160,
    tipoCuerpo: 'Delgado',
    apariencia: 'Muy atractivo',
    idiomas: ['Inglés', 'Español'],
    nivelIngles: 'Medio',
    etnia: 'Latino/Hispano',
    educacion: 'Universidad',
    fumas: 'No',
    hijos: '0',
    buscando: ['Ligue', 'Amistad'],
    ingresos: '50k-249k',
    intereses: ['Relación seria', 'Salir', 'Amistad', 'Cenas'],
    
    // Extras
    ultimaConexion: 'Conectada ahora',
    miembroDesde: 'Enero 2024',
    cumpleanos: '15 de marzo',
    precioSuscripcion: 140,
    precioSuscripcionFotos: 80,
    precioSuscripcionVideos: 100,
  };

  const fotosPublicas: MediaItem[] = [
    { id: 1, tipo: 'foto', url: 'https://picsum.photos/400/400?random=1', thumbnail: 'https://picsum.photos/400/400?random=1', isPremium: false, likes: 234, createdAt: '2024-01-15' },
    { id: 2, tipo: 'foto', url: 'https://picsum.photos/400/400?random=2', thumbnail: 'https://picsum.photos/400/400?random=2', isPremium: false, likes: 189, createdAt: '2024-01-14' },
    { id: 3, tipo: 'foto', url: 'https://picsum.photos/400/400?random=3', thumbnail: 'https://picsum.photos/400/400?random=3', isPremium: false, likes: 156, createdAt: '2024-01-13' },
  ];

  const videosPublicos: MediaItem[] = [
    { id: 10, tipo: 'video', url: 'video.mp4', thumbnail: 'https://picsum.photos/400/400?random=10', isPremium: false, likes: 567, createdAt: '2024-01-13', duracion: 125 },
  ];

  const contenidoPremiumFotos: MediaItem[] = [
    { id: 30, tipo: 'foto', url: 'https://picsum.photos/400/400?random=30', thumbnail: 'https://picsum.photos/400/400?random=30', isPremium: true, likes: 456, createdAt: '2024-01-10', titulo: 'Atardecer en la Playa' },
    { id: 31, tipo: 'foto', url: 'https://picsum.photos/400/400?random=31', thumbnail: 'https://picsum.photos/400/400?random=31', isPremium: true, likes: 389, createdAt: '2024-01-09', titulo: 'Fitness en el Gym' },
  ];

  const contenidoPremiumVideos: MediaItem[] = [
    { id: 40, tipo: 'video', url: 'video.mp4', thumbnail: 'https://picsum.photos/400/400?random=40', isPremium: true, likes: 789, createdAt: '2024-01-08', duracion: 180, titulo: 'Yoga Matutina' },
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
  ];

  const tabs = [
    { id: 'fotos' as ContentTabType, label: 'Fotos', icon: Image, count: fotosPublicas.length },
    { id: 'videos' as ContentTabType, label: 'Videos', icon: Video, count: videosPublicos.length },
    { id: 'premium-fotos' as ContentTabType, label: 'Premium Fotos', icon: Crown, count: contenidoPremiumFotos.length },
    { id: 'premium-videos' as ContentTabType, label: 'Premium Videos', icon: Crown, count: contenidoPremiumVideos.length },
    { id: 'contenido-comprable' as ContentTabType, label: 'Contenido ($)', icon: ShoppingBag, count: contenidoComprable.length },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'fotos': return fotosPublicas;
      case 'videos': return videosPublicos;
      case 'premium-fotos': return contenidoPremiumFotos;
      case 'premium-videos': return contenidoPremiumVideos;
      case 'contenido-comprable': return null;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left - Volver */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Atrás</span>
          </button>
          
          {/* Right - Acciones */}
          <div className="flex items-center gap-2">
            {/* Me gusta */}
            <button
              onClick={() => {
                setRecommend(!recommend);
                setNotRecommend(false);
              }}
              className={`p-2 rounded-lg transition-all ${
                recommend 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
              title="Me gusta"
            >
              <Heart className={`w-4 h-4 ${recommend ? 'fill-current' : ''}`} />
            </button>

            {/* No me gusta */}
            <button
              onClick={() => {
                setNotRecommend(!notRecommend);
                setRecommend(false);
              }}
              className={`p-2 rounded-lg transition-all ${
                notRecommend 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
              title="No me gusta"
            >
              <ThumbsDown className={`w-4 h-4 ${notRecommend ? 'fill-current' : ''}`} />
            </button>
            
            {/* Favorito */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-all ${
                isFavorite 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
              title="Favorito"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            {/* Compartir */}
            <button 
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              title="Compartir perfil"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Izquierdo - Perfil */}
        <div className="w-80 h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-6">
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              {creadora.enVivo && (
                <>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-500 to-pink-500 animate-spin-slow"></div>
                  <div className="absolute -inset-0.5 rounded-full bg-white"></div>
                </>
              )}
              
              <div className={`relative w-full h-full rounded-full overflow-hidden ${
                creadora.enVivo ? '' : 'ring-2 ring-gray-200'
              }`}>
                <img
                  src={creadora.avatar}
                  alt={creadora.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {creadora.enVivo && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  EN VIVO
                </div>
              )}
              
              {!creadora.enVivo && creadora.isOnline && (
                <div className="absolute bottom-0 right-1/2 translate-x-9 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Nombre */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{creadora.nombre}, {creadora.edad}</h2>
                {creadora.verificada && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{creadora.username}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 py-4 mb-4 border-y border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{creadora.meGusta}</div>
                <div className="text-xs text-gray-500">Me gusta</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {creadora.seguidores >= 1000 
                    ? `${(creadora.seguidores / 1000).toFixed(1)}K` 
                    : creadora.seguidores}
                </div>
                <div className="text-xs text-gray-500">seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{creadora.noMeGusta}</div>
                <div className="text-xs text-gray-500">No me gusta</div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{creadora.ubicacion}</span>
              <span className="text-xs text-gray-400">• {creadora.distancia} km</span>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">{creadora.bio}</p>
            </div>

            {/* Intereses */}
            {creadora.intereses && creadora.intereses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Intereses</h4>
                <div className="flex flex-wrap gap-2">
                  {creadora.intereses.map((interes, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {interes}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`w-full rounded-lg transition-all flex items-center justify-center gap-2 py-2.5 font-medium text-sm ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>

              <button 
                className="w-full bg-white hover:bg-blue-500 border-2 border-blue-500 hover:border-blue-600 rounded-lg transition-all flex items-center justify-center gap-2 py-2.5 group"
              >
                <MessageCircle className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-blue-600 group-hover:text-white transition-colors">Mensaje</span>
              </button>

              <button 
                className="w-full bg-white hover:bg-green-500 border-2 border-green-500 hover:border-green-600 rounded-lg transition-all flex items-center justify-center gap-2 py-2.5 group"
              >
                <DollarSign className="w-4 h-4 text-green-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-green-600 group-hover:text-white transition-colors">Donar</span>
              </button>

              <button 
                className="w-full bg-white hover:bg-orange-500 border-2 border-orange-500 hover:border-orange-600 rounded-lg transition-all flex items-center justify-center gap-2 py-2.5 group"
              >
                <Gift className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-orange-600 group-hover:text-white transition-colors">Regalo</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">Información</h4>
              
              {/* Características físicas */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Características Físicas</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Altura</span>
                    <span className="font-medium text-gray-900">{creadora.altura} cm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo de cuerpo</span>
                    <span className="font-medium text-gray-900">{creadora.tipoCuerpo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Apariencia</span>
                    <span className="font-medium text-gray-900">{creadora.apariencia}</span>
                  </div>
                </div>
              </div>

              {/* Idiomas */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Idiomas</p>
                <div className="flex flex-wrap gap-1.5">
                  {creadora.idiomas.map((idioma) => (
                    <span key={idioma} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {idioma}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estilo de vida */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Estilo de Vida</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Educación</span>
                    <span className="font-medium text-gray-900">{creadora.educacion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fuma</span>
                    <span className="font-medium text-gray-900">{creadora.fumas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hijos</span>
                    <span className="font-medium text-gray-900">{creadora.hijos}</span>
                  </div>
                </div>
              </div>

              {/* Info del perfil */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Miembro desde {creadora.miembroDesde}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Perfil verificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{creadora.ultimaConexion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal - Tabs */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="sticky top-14 bg-white border-b border-gray-200 z-20">
            <div className="overflow-x-auto">
              <div className="flex gap-1 px-4 min-w-max">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition relative whitespace-nowrap ${
                        isActive 
                          ? 'text-gray-900' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition ${
                        isActive ? 'bg-gray-900' : 'bg-gray-100'
                      }`}>
                        <tab.icon className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>

                      <span>{tab.label}</span>

                      {tab.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}

                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contenido de las tabs */}
          <div className="p-4">
            {activeTab === 'contenido-comprable' ? (
              /* Contenido Comprable */
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contenidoComprable.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                      <div className="aspect-video relative">
                        <img src={item.thumbnail} alt={item.titulo} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                          S/. {item.precio}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.titulo}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.descripcion}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{item.cantidadItems} items</span>
                          <button 
                            disabled={item.isPurchased}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                              item.isPurchased
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                          >
                            {item.isPurchased ? 'Comprado' : 'Comprar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Grid de Fotos/Videos */
              <div className="max-w-6xl mx-auto">
                {(activeTab === 'premium-fotos' || activeTab === 'premium-videos') && 
                 !(activeTab === 'premium-fotos' ? isSubscribedToPhotos : isSubscribedToVideos) && (
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center mb-6">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido Premium</h3>
                    <p className="text-gray-600 mb-6">
                      Suscríbete para acceder a {activeTab === 'premium-fotos' ? 'fotos' : 'videos'} exclusivos
                    </p>
                    <button 
                      onClick={() => activeTab === 'premium-fotos' ? setIsSubscribedToPhotos(true) : setIsSubscribedToVideos(true)}
                      className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      Suscribirse por S/. {activeTab === 'premium-fotos' ? creadora.precioSuscripcionFotos : creadora.precioSuscripcionVideos}/mes
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getContent()?.map((item: MediaItem) => (
                    <div key={item.id} className="aspect-square relative group">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {item.tipo === 'video' && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                          {Math.floor(item.duracion! / 60)}:{(item.duracion! % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white mr-2" />
                        <span className="text-white font-semibold text-sm">{item.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

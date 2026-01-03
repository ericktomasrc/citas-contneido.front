import { useState } from 'react';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, MapPin, 
  Users, CheckCircle, Star, Calendar, Shield, 
  Camera, Gift, Globe, ThumbsDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PerfilPublicoCreadoraPage = () => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommend, setRecommend] = useState(false);
  const [notRecommend, setNotRecommend] = useState(false);

  // Mock data
  const creadora = {
    nombre: 'María',
    apellido: 'Rodriguez',
    username: '@maria_lima3',
    edad: 24,
    avatar: 'https://i.pravatar.cc/400?img=1',
    fotos: [
      'https://i.pravatar.cc/600?img=1',
      'https://i.pravatar.cc/600?img=2',
      'https://i.pravatar.cc/600?img=3',
      'https://i.pravatar.cc/600?img=4',
      'https://i.pravatar.cc/600?img=5',
    ],
    ubicacion: 'Miraflores, Lima',
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
    fumas: 'No',
    hijos: '0',
    buscando: ['Ligue', 'Amistad'],
    ingresos: '50k-249k',
    
    // Extras
    ultimaConexion: 'Conectada ahora',
    miembroDesde: 'Enero 2024',
    precioSuscripcion: 140,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar Simple y Profesional */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Volver */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm">Volver</span>
            </button>
            
            {/* Acciones */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRecommend(!recommend);
                  setNotRecommend(false);
                }}
                className={`p-2 rounded-lg transition ${
                  recommend 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  notRecommend 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${notRecommend ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition ${
                  isFavorite 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Izquierdo */}
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
                {creadora.isOnline && !creadora.enVivo && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Nombre */}
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

              {/* Suscripción - Minimalista */}
              <div className="bg-gray-900 rounded-lg p-4 text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Suscripción Premium</span>
                </div>
                <p className="text-2xl font-bold text-white mb-3">S/. {creadora.precioSuscripcion}/mes</p>
                <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-100 transition">
                  Suscribirse
                </button>
              </div>

              {/* Información Adicional */}
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Miembro desde {creadora.miembroDesde}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>Perfil verificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{creadora.ultimaConexion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Derecho */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de Fotos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-700" />
                Galería
              </h2>
              
              {/* Foto Principal */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img
                  src={creadora.fotos[activePhotoIndex]}
                  alt="Foto"
                  className="w-full h-full object-cover"
                />
                
                {/* Navegación */}
                {activePhotoIndex > 0 && (
                  <button
                    onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-900" />
                  </button>
                )}
                {activePhotoIndex < creadora.fotos.length - 1 && (
                  <button
                    onClick={() => setActivePhotoIndex(activePhotoIndex + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition rotate-180"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-900" />
                  </button>
                )}

                {/* Contador */}
                <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded text-white text-xs font-medium">
                  {activePhotoIndex + 1} / {creadora.fotos.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {creadora.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`aspect-square rounded overflow-hidden transition ${
                      activePhotoIndex === index
                        ? 'ring-2 ring-gray-900'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sobre mí */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Sobre mí</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{creadora.bio}</p>
            </div>

            {/* Características Físicas */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Características Físicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Altura</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.altura} cm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tipo de cuerpo</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.tipoCuerpo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Apariencia</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.apariencia}</p>
                </div>
              </div>
            </div>

            {/* Idiomas */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-700" />
                Idiomas
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Idiomas que hablo</p>
                  <div className="flex flex-wrap gap-2">
                    {creadora.idiomas.map((idioma) => (
                      <span
                        key={idioma}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                      >
                        {idioma}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nivel de inglés</p>
                    <p className="text-sm font-semibold text-gray-900">{creadora.nivelIngles}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Etnia</p>
                    <p className="text-sm font-semibold text-gray-900">{creadora.etnia}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estilo de Vida */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Estilo de Vida</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">¿Fumas?</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.fumas}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hijos</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.hijos}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Buscando</p>
                  <div className="flex flex-wrap gap-2">
                    {creadora.buscando.map((tipo) => (
                      <span
                        key={tipo}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                      >
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ingresos (USD)</p>
                  <p className="text-sm font-semibold text-gray-900">{creadora.ingresos}</p>
                </div>
              </div>
            </div>

            {/* CTA Final - Minimalista */}
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="text-xl font-bold text-white mb-2">¿Te interesa este perfil?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Suscríbete para acceder a contenido exclusivo
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Suscribirse por S/. {creadora.precioSuscripcion}/mes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

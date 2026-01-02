import { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Cake, Globe, Users, CheckCircle, Star, Calendar, Shield, Camera, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PerfilPublicoCreadoraPage = () => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Mock data basado en MyProfilePage
  const creadora = {
    nombre: 'Mar铆a',
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
    bio: 'Soy Ing. Software... y me gusta viajar 鉁堬笍 Amante del fitness y la vida saludable 馃挭 Aqu铆 comparto mi d铆a a d铆a y contenido exclusivo 馃専',
    verificada: true,
    enVivo: false,
    
    // Stats
    seguidores: 12400,
    meGusta: 472,
    contenidoSubido: 156,
    
    // Informaci贸n detallada
    altura: 160,
    tipoCuerpo: 'Delgado',
    apariencia: 'Muy atractivo',
    idiomas: ['Ingl茅s', 'Espa帽ol'],
    nivelIngles: 'Medio',
    etnia: 'Latino/Hispano',
    fumas: 'No',
    hijos: '0',
    buscando: ['Ligue'],
    ingresos: '50k-249k',
    
    // Extras
    ultimaConexion: 'Conectada ahora',
    miembroDesde: 'Enero 2024',
    tipoSuscripcion: 'Premium',
    precioSuscripcion: 140,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30">
      {/* Header con imagen de fondo */}
      <div className="relative h-80 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        {/* Patr贸n decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Bot贸n volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Botones de acci贸n */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button className="w-12 h-12 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-12 h-12 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105">
            <Heart className="w-5 h-5 text-pink-500" />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              {/* Avatar con badge verificado */}
              <div className="relative w-40 h-40 mx-auto mb-6">
                <img
                  src={creadora.avatar}
                  alt={creadora.nombre}
                  className="w-full h-full rounded-full object-cover ring-8 ring-white shadow-2xl"
                />
                {creadora.verificada && (
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" fill="currentColor" />
                  </div>
                )}
                {creadora.enVivo && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    EN VIVO
                  </div>
                )}
              </div>

              {/* Nombre y username */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {creadora.nombre}, {creadora.edad}
                </h1>
                <p className="text-pink-600 font-medium mb-3">{creadora.username}</p>
                
                {/* Ubicaci贸n y 煤ltima conexi贸n */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{creadora.ubicacion}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 text-sm font-medium">{creadora.ultimaConexion}</span>
                  </div>
                </div>
              </div>

              {/* Stats en cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center">
                  <Users className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {creadora.seguidores >= 1000 
                      ? `${(creadora.seguidores / 1000).toFixed(1)}K` 
                      : creadora.seguidores}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">Seguidores</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 text-center">
                  <Heart className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{creadora.meGusta}</p>
                  <p className="text-xs text-gray-600 font-medium">Me Gusta</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center">
                  <Camera className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{creadora.contenidoSubido}</p>
                  <p className="text-xs text-gray-600 font-medium">Contenido</p>
                </div>
              </div>

              {/* Botones de acci贸n */}
              <div className="space-y-3 mb-6">
               <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                  }`}
                >
                  {isFollowing ? 'Siguiendo ✓' : '+ Seguir'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Mensaje
                  </button>
                  <button className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5" />
                    Regalo
                  </button>
                </div>
              </div>

              {/* Badge de suscripci贸n */}
              <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-2xl p-4 text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-900" fill="currentColor" />
                  <span className="font-bold text-amber-900">SUSCRIPCI脫N {creadora.tipoSuscripcion.toUpperCase()}</span>
                  <Star className="w-5 h-5 text-amber-900" fill="currentColor" />
                </div>
                <p className="text-3xl font-bold text-amber-900 mb-1">S/. {creadora.precioSuscripcion}/mes</p>
                <button className="w-full mt-3 py-3 bg-amber-900 text-white rounded-xl font-bold hover:bg-amber-800 transition">
                  Suscribirme Ahora
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Miembro desde {creadora.miembroDesde}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Perfil verificado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Informaci贸n detallada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galer铆a de fotos */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Camera className="w-7 h-7 text-pink-500" />
                Galer铆a de Fotos
              </h2>
              
              {/* Foto principal */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-2xl group">
                <img
                  src={creadora.fotos[activePhotoIndex]}
                  alt="Foto principal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Navegaci贸n */}
                {activePhotoIndex > 0 && (
                  <button
                    onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                  </button>
                )}
                {activePhotoIndex < creadora.fotos.length - 1 && (
                  <button
                    onClick={() => setActivePhotoIndex(activePhotoIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition rotate-180"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                  </button>
                )}

                {/* Contador */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold">
                  {activePhotoIndex + 1} / {creadora.fotos.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-3">
                {creadora.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden transition-all ${
                      activePhotoIndex === index
                        ? 'ring-4 ring-pink-500 scale-105 shadow-lg'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sobre m铆 */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre m铆</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {creadora.bio}
              </p>
            </div>

            {/* Caracter铆sticas f铆sicas */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Caracter铆sticas F铆sicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Altura</p>
                  <p className="text-xl font-bold text-gray-900">{creadora.altura} cm</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Tipo de cuerpo</p>
                  <p className="text-xl font-bold text-gray-900">{creadora.tipoCuerpo}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Apariencia</p>
                  <p className="text-xl font-bold text-gray-900">{creadora.apariencia}</p>
                </div>
              </div>
            </div>

            {/* Idiomas y cultura */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-7 h-7 text-pink-500" />
                Idiomas y Cultura
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Idiomas que hablo</p>
                  <div className="flex flex-wrap gap-2">
                    {creadora.idiomas.map((idioma) => (
                      <span
                        key={idioma}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                      >
                        {idioma}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Nivel de ingl茅s</p>
                    <p className="text-xl font-bold text-gray-900">{creadora.nivelIngles}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Etnia</p>
                    <p className="text-xl font-bold text-gray-900">{creadora.etnia}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estilo de vida */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estilo de Vida</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">驴Fumas?</p>
                  <p className="text-lg font-medium text-gray-900">{creadora.fumas}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Hijos</p>
                  <p className="text-lg font-medium text-gray-900">{creadora.hijos}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Buscando</p>
                  <div className="flex flex-wrap gap-2">
                    {creadora.buscando.map((tipo) => (
                      <span
                        key={tipo}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                      >
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tenencias (USD)</p>
                  <p className="text-lg font-medium text-gray-900">{creadora.ingresos}</p>
                </div>
              </div>
            </div>

            {/* Call to action final */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl shadow-2xl p-8 text-center text-white">
              <Star className="w-16 h-16 mx-auto mb-4" fill="currentColor" />
              <h3 className="text-3xl font-bold mb-3">驴Te gusta lo que ves?</h3>
              <p className="text-lg mb-6 opacity-90">
                Suscr铆bete para acceder a contenido exclusivo y mucho m谩s
              </p>
              <button className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                Suscribirme por S/. {creadora.precioSuscripcion}/mes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

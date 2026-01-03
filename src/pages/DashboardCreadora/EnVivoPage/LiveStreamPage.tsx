import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Crown, Lock, ArrowLeft, Loader2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface LiveInfo {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  tipo: 'gratis' | 'premium';
  precioEntrada: number;
  creatorName: string;
  creatorUsername: string;
  creatorPhoto: string;
  viewers: number;
  isActive: boolean;
}

export const LiveStreamPage = () => { 
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [liveInfo, setLiveInfo] = useState<LiveInfo | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar acceso al live
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        
        // TODO: Obtener información real del live desde tu API
        // const liveResponse = await fetch(`${BACKEND_URL}/api/live/${slug}`);
        // const liveData = await liveResponse.json();
        
        // TEMPORAL: Mock data para testing
        const liveData: LiveInfo = {
          id: '1',
          slug: slug || '',
          titulo: 'Sesión de Yoga Matutina 🧘',
          descripcion: 'Rutina completa de yoga para comenzar el día con energía',
          tipo: 'premium', // Cambiar a 'gratis' para testing
          precioEntrada: 25,
          creatorName: 'María Rodriguez',
          creatorUsername: 'Maria Rodriguez',
          creatorPhoto: 'https://i.pravatar.cc/150?img=1',
          viewers: 234,
          isActive: true
        };
        
        setLiveInfo(liveData);

        // Si es gratis, acceso automático
        if (liveData.tipo === 'gratis') {
          setHasAccess(true);
          // Redirigir directamente a ver el live
          setTimeout(() => {
            navigate(`/live-creadora/live/${slug}`);
          }, 500);
          return;
        }

        // Si es premium, verificar si el usuario ya pagó
        // TODO: Descomentar cuando tengas autenticación
        // const userId = getCurrentUserId();
        // const accessResponse = await fetch(`${BACKEND_URL}/api/live/${slug}/access?userId=${userId}`);
        // const { hasAccess: userHasAccess } = await accessResponse.json();
        
        // TEMPORAL: simular que no tiene acceso
        const userHasAccess = false;
        
        setHasAccess(userHasAccess);

        if (userHasAccess) {
          setTimeout(() => {
            navigate(`/live-creadora/live/${slug}`);
          }, 500);
        }

      } catch (err: any) {
        console.error('Error verificando acceso:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      checkAccess();
    }
  }, [slug, navigate]);

  const handlePayment = async () => {
    try {
      setLoadingPayment(true);
      
      // TODO: Integrar con tu sistema de pagos (Stripe, MercadoPago, etc.)
      // 1. Abrir modal de pago
      // 2. Procesar el pago
      // 3. Guardar el registro en la BD
      
      // TEMPORAL: Simular pago exitoso después de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        userId: 'user123', // TODO: Obtener del contexto
        liveId: liveInfo?.id,
        slug: slug,
        amount: liveInfo?.precioEntrada,
        paymentMethod: 'card',
      };

      // const response = await fetch(`${BACKEND_URL}/api/live/purchase`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData)
      // });

      // Simular éxito
      console.log('Pago procesado:', paymentData);
      
      // Redirigir al live
      setHasAccess(true);
      navigate(`/live-creadora/live/${slug}`);
      
    } catch (err: any) {
      console.error('Error en el pago:', err);
      alert('Error procesando el pago. Por favor intenta nuevamente.');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando información del live...</p>
        </div>
      </div>
    );
  }

  if (error || !liveInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Live no disponible
          </h2>
          <p className="text-gray-400 mb-6">
            {error || 'No se pudo encontrar la información del live'}
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Modal de Live Premium (requiere pago)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Header con foto de perfil */}
          <div className="relative pt-8 pb-6 px-6 text-center">
            {/* Foto de perfil con borde animado */}
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-spin-slow"></div>
              <div className="absolute inset-1 rounded-full bg-gray-900"></div>
              <img
                src={liveInfo.creatorPhoto}
                alt={liveInfo.creatorName}
                className="absolute inset-2 w-24 h-24 rounded-full object-cover"
              />
            </div>

            {/* Badge Premium */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-bold text-white">Live Premium</h2>
            </div>

            {/* Username */}
            <p className="text-gray-400 text-sm">@{liveInfo.creatorUsername}</p>
          </div>

          {/* Información del Live */}
          <div className="px-6 pb-6">
            {/* Título */}
            <h3 className="text-xl font-bold text-white mb-2">
              {liveInfo.titulo}
            </h3>

            {/* Descripción */}
            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
              {liveInfo.descripcion}
            </p>

            {/* Espectadores */}
            <div className="flex items-center justify-between mb-6 py-3 px-4 bg-gray-800/50 rounded-xl">
              <span className="text-gray-400 text-sm">Espectadores</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                <span className="text-white font-bold">{liveInfo.viewers}</span>
              </div>
            </div>

            {/* Precio */}
            <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 rounded-2xl p-6 mb-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 font-medium">Precio de entrada</span>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-white">S/.</span>
                  <span className="text-4xl font-bold text-white">{liveInfo.precioEntrada}</span>
                </div>
              </div>
              <p className="text-purple-200/80 text-sm">
                Pago único para acceder a este live exclusivo
              </p>
            </div>

            {/* Botón de Pago */}
            <button
              onClick={handlePayment}
              disabled={loadingPayment}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
            >
              {loadingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Pagar y Entrar
                </>
              )}
            </button>

            {/* Botón Volver */}
            <button
              onClick={handleGoBack}
              className="w-full py-3 px-6 bg-transparent text-gray-400 hover:text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            🔒 Pago seguro • 💎 Acceso inmediato • ✨ Contenido exclusivo
          </p>
        </div>
      </div>
    </div>
  );
};
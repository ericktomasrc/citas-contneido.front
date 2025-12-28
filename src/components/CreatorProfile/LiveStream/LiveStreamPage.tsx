import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Gift, 
  Users, 
  DollarSign,
  Send,
  Lock,
  ArrowLeft,
  Flame,
  Sparkles
} from 'lucide-react';
import { LiveStream, LiveMessage } from '../../../shared/types/creator-profile.types';

export const LiveStreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado
  const [hasAccess, setHasAccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Mock data - TODO: Obtener de API
  const liveStream: LiveStream = {
    id: 1,
    creatorId: 1,
    creatorName: 'María Rodriguez',
    creatorPhoto: 'https://i.pravatar.cc/400?img=1',
    titulo: 'Sesión de Yoga Matutina 🧘‍♀️',
    descripcion: 'Rutina completa de yoga para comenzar el día con energía',
    tipo: 'premium', // ✅ Cambiar a 'publico' para live gratis
    precioEntrada: 25,
    thumbnailUrl: 'https://picsum.photos/1920/1080?random=1',
    streamUrl: 'stream-url',
    isLive: true,
    viewers: 234,
    likes: 456,
    totalEarnings: 890,
    startedAt: new Date(),
  };

  // Verificar acceso al entrar
  useEffect(() => {
    if (liveStream.tipo === 'publico') {
      setHasAccess(true);
    } else {
      // TODO: Verificar si el usuario ya pagó la entrada
      const hasPaid = false; // Cambiar por verificación real
      if (hasPaid) {
        setHasAccess(true);
      } else {
        setShowPaymentModal(true);
      }
    }
  }, []);

  // Cooldown del chat
  useEffect(() => {
    if (cooldownSeconds > 0 && liveStream.tipo === 'publico') {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
        if (cooldownSeconds === 1) setCanSendMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds, liveStream.tipo]);

  const handlePayEntrance = () => {
    // TODO: Integrar Stripe para pago de entrada
    console.log('Pagar entrada:', liveStream.precioEntrada);
    setShowPaymentModal(false);
    setHasAccess(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !canSendMessage) return;
    
    const msg: LiveMessage = {
      id: Date.now(),
      username: 'Tú',
      message: newMessage,
      isPremium: liveStream.tipo === 'premium',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, msg].slice(-50));
    setNewMessage('');

    // Cooldown solo para lives públicos
    if (liveStream.tipo === 'publico') {
      setCanSendMessage(false);
      setCooldownSeconds(30);
    }
  };

  const handleSendGift = (amount: number) => {
    // TODO: Abrir modal de pago con Stripe
    const giftMsg = prompt(`Enviar regalo de S/. ${amount}. Escribe un mensaje (opcional):`);
    
    const msg: LiveMessage = {
      id: Date.now(),
      username: 'Tú',
      message: giftMsg || `Envió S/. ${amount} 🎁`,
      isPremium: true,
      isGift: true,
      giftAmount: amount,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, msg]);
    console.log('Enviar regalo:', amount);
  };

  const handleReaction = (reaction: string) => {
    console.log('Reacción:', reaction);
    // TODO: Enviar reacción al servidor
  };

  // Modal de pago de entrada
  if (showPaymentModal) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-pink-500">
              <img src={liveStream.creatorPhoto} alt={liveStream.creatorName} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-bold text-white">Live Premium</h2>
            </div>
            <p className="text-gray-400 text-sm">@{liveStream.creatorName}</p>
          </div>

          {/* Contenido */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-white font-bold mb-2">{liveStream.titulo}</h3>
              <p className="text-gray-300 text-sm">{liveStream.descripcion}</p>
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
              <span className="text-gray-400 text-sm">Espectadores</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-white font-bold">{liveStream.viewers}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Precio de entrada</span>
                <span className="text-3xl font-bold text-white">S/. {liveStream.precioEntrada}</span>
              </div>
              <p className="text-gray-300 text-xs mt-2">Pago único para acceder a este live exclusivo</p>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handlePayEntrance}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition shadow-lg hover:shadow-pink-500/50"
            >
              💎 Pagar y Entrar
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal del live
  if (!hasAccess) return null;

  return (
    <div className="flex h-screen bg-black">
      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Video Player */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold">{liveStream.titulo}</p>
            <p className="text-sm text-gray-400 mt-2">@{liveStream.creatorName}</p>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm">EN VIVO</span>
            </div>

            {liveStream.tipo === 'premium' && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-full shadow-lg">
                <Lock className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">Premium</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">{liveStream.viewers}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6">
          {/* Reacciones */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleReaction('❤️')}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-full transition"
            >
              <span className="text-2xl">❤️</span>
            </button>
            <button
              onClick={() => handleReaction('👏')}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-full transition"
            >
              <span className="text-2xl">👏</span>
            </button>
            <button
              onClick={() => handleReaction('🔥')}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-full transition"
            >
              <span className="text-2xl">🔥</span>
            </button>

            <div className="flex-1"></div>

            {/* Total Earnings */}
            <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-md px-4 py-2 rounded-full">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="text-white font-bold">S/. {liveStream.totalEarnings}</span>
            </div>
          </div>

          {/* Botones de Regalos */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendGift(5)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              S/. 5
            </button>
            <button
              onClick={() => handleSendGift(20)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              S/. 20
            </button>
            <button
              onClick={() => handleSendGift(50)}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              S/. 50
            </button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-96 bg-gray-900 flex flex-col border-l border-gray-800">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold text-lg">Chat en vivo</h3>
            {liveStream.tipo === 'premium' && (
              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Premium</span>
            )}
          </div>
          <p className="text-gray-400 text-xs">
            {liveStream.tipo === 'publico' 
              ? 'Cooldown: 30 seg entre mensajes' 
              : 'Sin límites de mensajes'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${msg.isGift ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 rounded-lg border border-pink-500/30' : ''}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${msg.isGift ? 'text-pink-400' : 'text-gray-300'}`}>
                      {msg.username}
                    </span>
                    {msg.isGift && (
                      <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                        S/. {msg.giftAmount} 🎁
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm mt-0.5">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!canSendMessage}
              placeholder={canSendMessage ? "Escribe un mensaje..." : `Espera ${cooldownSeconds}s...`}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!canSendMessage || !newMessage.trim()}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-full transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
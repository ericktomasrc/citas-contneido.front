// src/features/chat/components/FloatingChat/MessageCard.tsx
// ✅ ACTUALIZADO PARA ACEPTAR userRole

import { Message } from '../../types/message.types';
import { Check, CheckCheck, Image as ImageIcon, Video, Mic, Gift as GiftIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageCardProps {
  message: Message;
  isOwn: boolean;
  userRole?: 'creadora' | 'espectador'; // ⭐ NUEVO - OPCIONAL
}

export const MessageCard = ({ message, isOwn, userRole = 'espectador' }: MessageCardProps) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <TextMessage message={message} isOwn={isOwn} />;
      case 'image':
        return <ImageMessage message={message} isOwn={isOwn} />;
      case 'video':
        return <VideoMessage message={message} isOwn={isOwn} />;
      case 'audio':
        return <AudioMessage message={message} isOwn={isOwn} />;
      case 'gift':
        return <GiftMessage message={message} isOwn={isOwn} />;
      case 'tip':
        return <TipMessage message={message} isOwn={isOwn} />;
      case 'premium':
        return <PremiumMessage message={message} isOwn={isOwn} />;
      case 'system':
        return <SystemMessage message={message} />;
      default:
        return <TextMessage message={message} isOwn={isOwn} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar (solo para mensajes del otro usuario) */}
      {!isOwn && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}

      <div className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {renderMessageContent()}
        
        {/* Timestamp y estado */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-400">
            {formatTime(message.createdAt)}
          </span>
          
          {isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
};

// Mensaje de texto
const TextMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div
    className={`px-4 py-2 rounded-2xl ${
      isOwn
        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
        : 'bg-white border border-slate-200 text-slate-800'
    }`}
  >
    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
  </div>
);

// Mensaje con imagen
const ImageMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div className="rounded-2xl overflow-hidden max-w-sm">
    <img
      src={message.mediaUrl}
      alt="Imagen"
      className="w-full cursor-pointer hover:opacity-90 transition"
      onClick={() => {
        // TODO: Abrir lightbox
        console.log('Abrir imagen en grande');
      }}
    />
    {message.content && (
      <div className={`px-3 py-2 ${isOwn ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' : 'bg-white'}`}>
        <p className="text-xs">{message.content}</p>
      </div>
    )}
  </div>
);

// Mensaje con video
const VideoMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div className="rounded-2xl overflow-hidden max-w-sm bg-slate-900">
    <video
      src={message.mediaUrl}
      controls
      poster={message.thumbnailUrl}
      className="w-full"
    />
  </div>
);

// Mensaje con audio
const AudioMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div
    className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${
      isOwn
        ? 'bg-gradient-to-r from-pink-500 to-rose-500'
        : 'bg-white border border-slate-200'
    }`}
  >
    <button className={`w-8 h-8 rounded-full flex items-center justify-center ${
      isOwn ? 'bg-white/20' : 'bg-slate-100'
    }`}>
      <Mic className={`w-4 h-4 ${isOwn ? 'text-white' : 'text-slate-600'}`} />
    </button>
    
    <div className="flex-1">
      <div className={`h-1 rounded-full ${isOwn ? 'bg-white/30' : 'bg-slate-200'}`}>
        <div className={`h-full w-1/3 rounded-full ${isOwn ? 'bg-white' : 'bg-pink-500'}`} />
      </div>
    </div>
    
    <span className={`text-xs ${isOwn ? 'text-white' : 'text-slate-600'}`}>
      {message.metadata?.duration || '0:00'}
    </span>
  </div>
);

// Mensaje de regalo
const GiftMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <motion.div
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    className="px-5 py-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200"
  >
    <div className="flex items-center gap-3">
      <div className="text-4xl">{message.gift?.emoji}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">
          {isOwn ? 'Enviaste' : `${message.senderName} envió`}
        </p>
        <p className="text-xs text-slate-600">{message.gift?.name}</p>
        <p className="text-sm font-bold text-violet-600 mt-1">
          S/. {message.gift?.amount}
        </p>
      </div>
    </div>
  </motion.div>
);

// Mensaje de propina
const TipMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <motion.div
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    className="px-5 py-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
        <span className="text-xl">💰</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">
          {isOwn ? 'Enviaste una propina' : `${message.senderName} te envió una propina`}
        </p>
        <p className="text-lg font-bold text-emerald-600 mt-1">
          S/. {message.gift?.amount}
        </p>
        {message.content && message.content !== `Envió una propina de S/. ${message.gift?.amount}` && (
          <p className="text-xs text-slate-600 mt-1">{message.content}</p>
        )}
      </div>
    </div>
  </motion.div>
);

// Mensaje premium bloqueado
const PremiumMessage = ({ message, isOwn }: { message: Message; isOwn: boolean }) => {
  if (message.isPurchased || isOwn) {
    return <ImageMessage message={message} isOwn={isOwn} />;
  }

  return (
    <div className="rounded-2xl overflow-hidden max-w-sm relative">
      {/* Contenido bloqueado */}
      <div className="blur-xl">
        <img src={message.thumbnailUrl} alt="Bloqueado" className="w-full h-48 object-cover" />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-transparent flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <p className="text-white text-sm font-medium px-4 text-center">
          {message.previewText || 'Contenido exclusivo'}
        </p>
        <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition">
          Desbloquear S/. {message.price}
        </button>
      </div>
    </div>
  );
};

// Mensaje del sistema
const SystemMessage = ({ message }: { message: Message }) => (
  <div className="w-full flex justify-center my-2">
    <div className="px-4 py-1.5 bg-slate-100 rounded-full">
      <p className="text-xs text-slate-500">{message.content}</p>
    </div>
  </div>
);

// Indicador de estado
const MessageStatus = ({ status }: { status: Message['status'] }) => {
  switch (status) {
    case 'sending':
      return <div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />;
    case 'sent':
      return <Check className="w-3 h-3 text-slate-400" />;
    case 'delivered':
      return <CheckCheck className="w-3 h-3 text-slate-400" />;
    case 'read':
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    case 'failed':
      return <span className="text-[10px] text-red-500">✕</span>;
    default:
      return null;
  }
};

// Helper para formatear tiempo
const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

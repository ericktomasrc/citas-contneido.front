# 💬 Sistema de Chat Premium - CitasContenido
## Arquitectura Completa y Plan de Implementación

---

## 📊 **STACK TECNOLÓGICO (Ya instalado)**

### **Backend:**
- ✅ Socket.IO (Chat en tiempo real)
- ✅ Express (API REST)
- ✅ Agora (Videollamadas)
- ✅ Stripe (Pagos/Propinas)

### **Frontend:**
- ✅ React 19
- ✅ Socket.IO Client
- ✅ Agora React SDK
- ✅ Zustand (State Management)
- ✅ React Query (Data Fetching)
- ✅ Framer Motion (Animaciones)

---

## 🎨 **FEATURES DEL CHAT - COMPLETAS**

### **1. CHAT BÁSICO (Incluido en suscripción $140)**

#### **Mensajería de Texto:**
```typescript
interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'creator' | 'subscriber';
  type: 'text' | 'image' | 'video' | 'audio' | 'gift' | 'tip';
  content: string;
  mediaUrl?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number; // Para audio/video
    thumbnailUrl?: string;
  };
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  isBlocked?: boolean; // Si contiene palabras prohibidas
}
```

#### **Características:**
- ✅ Mensajes de texto en tiempo real
- ✅ Indicador "escribiendo..."
- ✅ Estado: enviado, entregado, leído
- ✅ Timestamp de mensajes
- ✅ Scroll infinito de historial
- ✅ Búsqueda en conversación
- ✅ Notificaciones push

---

### **2. CONFIGURACIÓN DE LA CREADORA**

#### **Panel de Control:**
```typescript
interface CreatorChatSettings {
  id: string;
  creatorId: string;
  
  // Filtros de Contenido
  blockedWords: string[]; // Palabras prohibidas
  autoModeration: boolean; // Filtro automático
  
  // Permisos de Media
  allowSubscriberImages: boolean;
  allowSubscriberVideos: boolean;
  allowSubscriberAudio: boolean;
  maxFileSize: number; // En MB
  
  // Videollamadas
  videocallsEnabled: boolean;
  videocallPrice: number; // Precio por minuto
  videocallWithAudio: boolean;
  videocallWithVideo: boolean;
  videocallMaxDuration: number; // Minutos
  
  // Mensajes Premium
  premiumMessagesEnabled: boolean;
  premiumMessagePrice: number; // Precio por desbloquear
  
  // Disponibilidad
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  onlineStatus: 'online' | 'away' | 'busy' | 'offline';
  
  // Precios
  tipMinAmount: number;
  giftPrices: {
    rose: number;
    heart: number;
    diamond: number;
    crown: number;
  };
}
```

#### **UI de Configuración Rápida:**
```tsx
// Componente: CreatorChatSettingsPanel.tsx
const CreatorChatSettingsPanel = () => {
  return (
    <div className="bg-white rounded-2xl p-6">
      {/* Toggle rápido para permisos */}
      <div className="space-y-4">
        <Toggle 
          label="Permitir fotos del suscriptor"
          enabled={settings.allowSubscriberImages}
          onChange={handleToggle}
        />
        <Toggle 
          label="Permitir videos del suscriptor"
          enabled={settings.allowSubscriberVideos}
        />
        <Toggle 
          label="Permitir audio del suscriptor"
          enabled={settings.allowSubscriberAudio}
        />
      </div>

      {/* Palabras bloqueadas */}
      <div className="mt-6">
        <label>Palabras prohibidas</label>
        <TagInput
          tags={settings.blockedWords}
          onAddTag={addBlockedWord}
          onRemoveTag={removeBlockedWord}
          placeholder="Agregar palabra..."
        />
      </div>

      {/* Configuración de videollamadas */}
      <div className="mt-6">
        <Toggle 
          label="Habilitar videollamadas"
          enabled={settings.videocallsEnabled}
        />
        {settings.videocallsEnabled && (
          <>
            <PriceInput
              label="Precio por minuto"
              value={settings.videocallPrice}
              onChange={handlePriceChange}
            />
            <Toggle label="Con audio" enabled={settings.videocallWithAudio} />
            <Toggle label="Con video" enabled={settings.videocallWithVideo} />
          </>
        )}
      </div>
    </div>
  );
};
```

---

### **3. MULTIMEDIA (Fotos, Videos, Audio)**

#### **Envío de Media:**
```typescript
// Hook: useMediaUpload.ts
const useMediaUpload = () => {
  const uploadMedia = async (file: File, type: 'image' | 'video' | 'audio') => {
    // 1. Validar tipo y tamaño
    if (!validateFile(file, type)) {
      throw new Error('Archivo no válido');
    }

    // 2. Comprimir si es necesario
    const compressed = await compressFile(file);

    // 3. Subir a Azure Blob Storage (ya tienes configurado)
    const mediaUrl = await uploadToAzure(compressed);

    // 4. Crear thumbnail para videos
    let thumbnailUrl;
    if (type === 'video') {
      thumbnailUrl = await generateThumbnail(file);
    }

    // 5. Enviar mensaje con media
    return {
      mediaUrl,
      thumbnailUrl,
      fileName: file.name,
      fileSize: file.size,
      duration: type === 'video' || type === 'audio' ? await getDuration(file) : undefined
    };
  };

  return { uploadMedia };
};
```

#### **Componente de Media:**
```tsx
// ChatMediaMessage.tsx
const ChatMediaMessage = ({ message }: { message: Message }) => {
  if (message.type === 'image') {
    return (
      <div className="relative rounded-xl overflow-hidden max-w-sm cursor-pointer"
           onClick={() => openLightbox(message.mediaUrl)}>
        <img src={message.mediaUrl} alt="Imagen" className="w-full" />
      </div>
    );
  }

  if (message.type === 'video') {
    return (
      <video 
        src={message.mediaUrl}
        poster={message.metadata?.thumbnailUrl}
        controls
        className="rounded-xl max-w-sm"
      />
    );
  }

  if (message.type === 'audio') {
    return (
      <AudioPlayer 
        src={message.mediaUrl}
        duration={message.metadata?.duration}
      />
    );
  }

  return null;
};
```

---

### **4. VIDEOLLAMADAS (Agora)**

#### **Implementación con Agora:**
```typescript
// Hook: useVideocall.ts
import AgoraRTC from 'agora-rtc-sdk-ng';

const useVideocall = () => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localTracks, setLocalTracks] = useState<{
    audioTrack?: IAgoraRTCRemoteUser['audioTrack'];
    videoTrack?: IAgoraRTCRemoteUser['videoTrack'];
  }>({});

  const startCall = async (channelName: string, settings: CreatorChatSettings) => {
    // 1. Obtener token de Agora desde backend
    const token = await fetchAgoraToken(channelName);

    // 2. Unirse al canal
    await client.join(APP_ID, channelName, token);

    // 3. Crear tracks según configuración de la creadora
    const tracks = [];
    
    if (settings.videocallWithAudio) {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      tracks.push(audioTrack);
    }

    if (settings.videocallWithVideo) {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      tracks.push(videoTrack);
    }

    // 4. Publicar tracks
    await client.publish(tracks);

    setLocalTracks({
      audioTrack: tracks[0],
      videoTrack: tracks[1]
    });

    // 5. Iniciar cobro por minuto
    startBilling(settings.videocallPrice);
  };

  const endCall = async () => {
    localTracks.audioTrack?.close();
    localTracks.videoTrack?.close();
    await client.leave();
    stopBilling();
  };

  return { startCall, endCall, localTracks };
};
```

#### **UI de Videollamada:**
```tsx
// VideocallWindow.tsx
const VideocallWindow = () => {
  const { startCall, endCall, localTracks } = useVideocall();
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Video remoto (creadora) */}
      <div className="flex-1 relative">
        <AgoraVideoPlayer
          videoTrack={remoteVideoTrack}
          className="w-full h-full object-cover"
        />

        {/* Video local (espectador) - Picture in Picture */}
        <div className="absolute bottom-4 right-4 w-32 h-48 rounded-xl overflow-hidden shadow-2xl">
          <AgoraVideoPlayer
            videoTrack={localTracks.videoTrack}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Timer y costo */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl">
          <p className="text-white text-sm font-semibold">
            {formatDuration(duration)} • S/. {cost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-slate-800 p-4 flex items-center justify-center gap-4">
        <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full">
          <Mic className="w-5 h-5 text-white mx-auto" />
        </button>
        <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full">
          <Video className="w-5 h-5 text-white mx-auto" />
        </button>
        <button 
          onClick={endCall}
          className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full"
        >
          <PhoneOff className="w-6 h-6 text-white mx-auto" />
        </button>
      </div>
    </div>
  );
};
```

---

### **5. PROPINAS Y REGALOS**

#### **Sistema de Monetización:**
```typescript
interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  animation?: string; // Lottie animation
}

const GIFTS: Gift[] = [
  { id: 'rose', name: 'Rosa', emoji: '🌹', price: 5 },
  { id: 'heart', name: 'Corazón', emoji: '❤️', price: 10 },
  { id: 'kiss', name: 'Beso', emoji: '💋', price: 15 },
  { id: 'diamond', name: 'Diamante', emoji: '💎', price: 25 },
  { id: 'crown', name: 'Corona', emoji: '👑', price: 50 },
  { id: 'rocket', name: 'Cohete', emoji: '🚀', price: 100 },
];

interface Tip {
  id: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
}
```

#### **UI de Propinas:**
```tsx
// GiftPanel.tsx
const GiftPanel = ({ onSendGift }: { onSendGift: (gift: Gift) => void }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl">
      <h3 className="font-bold text-slate-800 mb-4">Enviar Regalo</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {GIFTS.map(gift => (
          <button
            key={gift.id}
            onClick={() => onSendGift(gift)}
            className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition group"
          >
            <span className="text-3xl mb-1 group-hover:scale-125 transition">
              {gift.emoji}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {gift.name}
            </span>
            <span className="text-xs font-bold text-pink-600">
              S/. {gift.price}
            </span>
          </button>
        ))}
      </div>

      {/* Propina personalizada */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <label className="text-sm font-semibold text-slate-700 mb-2 block">
          Propina Personalizada
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="S/. 0.00"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
          />
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### **Animación de Regalo:**
```tsx
// Cuando se recibe un regalo
const showGiftAnimation = (gift: Gift) => {
  // Mostrar animación en pantalla completa
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 1 }}
        className="text-9xl"
      >
        {gift.emoji}
      </motion.div>
    </motion.div>
  );
};
```

---

### **6. MENSAJES PREMIUM (PPV - Pay Per View)**

#### **Sistema de Bloqueo:**
```typescript
interface PremiumMessage extends Message {
  type: 'premium';
  isPurchased: boolean;
  price: number;
  previewText: string; // Texto de vista previa
  blurredThumbnail?: string; // Para imágenes/videos
}
```

#### **UI de Mensaje Premium:**
```tsx
// PremiumMessageCard.tsx
const PremiumMessageCard = ({ message }: { message: PremiumMessage }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleUnlock = async () => {
    setIsPurchasing(true);
    await unlockPremiumMessage(message.id);
    setIsPurchasing(false);
  };

  if (message.isPurchased) {
    return <ChatMediaMessage message={message} />;
  }

  return (
    <div className="relative rounded-xl overflow-hidden max-w-sm">
      {/* Contenido bloqueado (blur) */}
      <div className="blur-xl">
        {message.blurredThumbnail && (
          <img src={message.blurredThumbnail} alt="Bloqueado" />
        )}
      </div>

      {/* Overlay de desbloqueo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 bg-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <p className="text-white text-sm font-medium">{message.previewText}</p>
        <button
          onClick={handleUnlock}
          disabled={isPurchasing}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          {isPurchasing ? 'Desbloqueando...' : `Desbloquear S/. ${message.price}`}
        </button>
      </div>
    </div>
  );
};
```

---

## 💰 **IDEAS ADICIONALES DE MONETIZACIÓN**

### **1. Sistema de Niveles VIP:**
```typescript
enum SubscriberTier {
  BASIC = 'basic',      // $140/mes - Chat básico
  SILVER = 'silver',    // $250/mes - Chat + algunos contenidos premium
  GOLD = 'gold',        // $400/mes - Todo ilimitado + badges especiales
  PLATINUM = 'platinum' // $600/mes - Acceso prioritario + videollamadas incluidas
}
```

### **2. Solicitudes Personalizadas:**
```typescript
interface CustomRequest {
  id: string;
  type: 'photo' | 'video' | 'audio';
  description: string;
  budget: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  deliveryDate?: Date;
}
```

### **3. Paquetes de Mensajes:**
```
- 10 mensajes premium: $50 (ahorro 15%)
- 25 mensajes premium: $110 (ahorro 20%)
- 50 mensajes premium: $200 (ahorro 30%)
```

### **4. Acceso Temporal Premium:**
```
- 24 horas acceso total: $40
- 7 días acceso total: $100
- 30 días acceso total: $300
```

### **5. Badges y Destacados:**
```typescript
- Badge "Top Fan": Apareces destacado en el perfil de la creadora ($20/mes)
- Priority Messages: Tus mensajes aparecen primero ($15/mes)
- Custom Badge: Badge personalizado con tu texto ($50 único)
```

---

## 📱 **ESTRUCTURA DE COMPONENTES**

```
src/
├── features/
│   └── chat/
│       ├── components/
│       │   ├── ChatWindow/
│       │   │   ├── ChatWindow.tsx
│       │   │   ├── ChatHeader.tsx
│       │   │   ├── ChatMessages.tsx
│       │   │   ├── ChatInput.tsx
│       │   │   └── ChatActions.tsx
│       │   ├── Messages/
│       │   │   ├── TextMessage.tsx
│       │   │   ├── MediaMessage.tsx
│       │   │   ├── PremiumMessage.tsx
│       │   │   ├── GiftMessage.tsx
│       │   │   └── TipMessage.tsx
│       │   ├── Videocall/
│       │   │   ├── VideocallWindow.tsx
│       │   │   ├── VideocallControls.tsx
│       │   │   └── VideocallTimer.tsx
│       │   ├── Settings/
│       │   │   ├── CreatorChatSettings.tsx
│       │   │   ├── BlockedWordsManager.tsx
│       │   │   └── MediaPermissions.tsx
│       │   └── Monetization/
│       │       ├── GiftPanel.tsx
│       │       ├── TipModal.tsx
│       │       └── PremiumContentModal.tsx
│       ├── hooks/
│       │   ├── useChat.ts
│       │   ├── useVideocall.ts
│       │   ├── useMediaUpload.ts
│       │   └── useGifts.ts
│       ├── services/
│       │   ├── chatService.ts
│       │   ├── socketService.ts
│       │   └── agoraService.ts
│       └── types/
│           ├── message.types.ts
│           ├── chat.types.ts
│           └── gift.types.ts
```

---

## 🔥 **RESPUESTA FINAL: ¿SE PUEDE?**

### ✅ **SÍ, 100% POSIBLE** con tu stack actual:

1. ✅ **Chat en Tiempo Real** → Socket.IO (ya instalado)
2. ✅ **Videollamadas** → Agora SDK (ya instalado)
3. ✅ **Pagos/Propinas** → Stripe (ya instalado)
4. ✅ **Upload de Media** → Azure Blob (ya configurado)
5. ✅ **UI Premium** → Framer Motion + Tailwind (ya instalado)

### 🚀 **NO NECESITAS INSTALAR NADA NUEVO**

Todo lo que necesitas ya está en tu proyecto. Solo falta implementar:

1. Backend de Socket.IO para mensajería
2. Componentes de UI del chat
3. Integración con Agora para videollamadas
4. Sistema de pagos para propinas/regalos
5. Panel de configuración para creadoras

---

## 💡 **RECOMENDACIÓN FINAL**

Implementa el sistema en este orden:

**FASE 1 (MVP):**
1. Chat básico con texto
2. Indicadores de estado (escribiendo, leído)
3. Historial de mensajes

**FASE 2:**
4. Upload de imágenes
5. Sistema de propinas básico
6. Palabras bloqueadas

**FASE 3:**
7. Videos y audios
8. Mensajes premium (PPV)
9. Videollamadas

**FASE 4:**
10. Regalos animados
11. Solicitudes personalizadas
12. Niveles VIP

¿Quieres que te ayude a implementar la **FASE 1** primero? 🚀

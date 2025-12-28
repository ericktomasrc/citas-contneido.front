export interface LiveStream {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorPhoto: string;
  titulo: string;
  descripcion: string;
  tipo: 'publico' | 'premium'; //  CLAVE
  precioEntrada?: number; // Solo para premium
  thumbnailUrl: string;
  streamUrl: string;
  isLive: boolean;
  viewers: number;
  likes: number;
  totalEarnings: number; // Total ganado
  startedAt: Date;
}

export interface LiveMessage {
  id: number;
  username: string;
  message: string;
  isPremium: boolean;
  isGift?: boolean;
  giftAmount?: number;
  timestamp: Date;
}

export interface CreatorProfile {
  id: number;
  username: string;
  nombre: string;
  apellidos?: string;
  edad: number;
  ubicacion: string;
  distancia: number;
  bio: string;
  fotoPerfil: string;
  fotoBanner?: string;
  isOnline: boolean;
  isLive: boolean;
  isVerified: boolean;
  isPremium: boolean;
  precioSuscripcion: number; 
 
  contenidoPremiumFotos: MediaItem[]; // NUEVO
  contenidoPremiumVideos: MediaItem[]; // NUEVO
  contenidoComprable: PurchasableContent[]; // NUEVO
 
  precioSuscripcionFotos: number; // NUEVO
  precioSuscripcionVideos: number; // NUEVO
  
  // Stats
  recomendaciones: number;
  suscriptores: number;
  likes: number;
  
  // Detalles
  intereses: string[];
  altura?: number;
  educacion?: string;
  cumpleanos?: string;
  
  // Contenido
  fotosPublicas: MediaItem[];
  videosPublicos: MediaItem[];
  //contenidoPremium: MediaItem[];
  
  // Estado
  estaEnVivo: boolean;
  urlLiveStream?: string;
  liveStreamActual?: LiveStream; 
}

export interface MediaItem {
  id: number;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail?: string;
  isPremium: boolean;
  likes: number;
  createdAt: string;
  duracion?: number; // Para videos en segundos
  descripcion?: string; //  
  titulo?: string; //  
}

// ... tipos existentes

export interface PurchasableContent {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'foto' | 'video' | 'pack'; // pack = conjunto de fotos/videos
  thumbnail: string;
  precio: number; // en soles
  cantidadItems: number; // cuántas fotos/videos incluye
  isPurchased: boolean; // si el usuario ya lo compró
  items: MediaItem[]; // las fotos/videos incluidos
  createdAt: string;
  cantidadFotos?: number;   
  cantidadVideos?: number;  
}
 

export type ContentTabType = 
  | 'fotos' 
  | 'videos' 
  | 'premium-fotos'
  | 'premium-videos'
  | 'contenido-comprable'
  | 'envivo';
 
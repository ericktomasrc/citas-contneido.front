export interface Creator {
  id: number;
  username: string;
  nombre: string;
  edad: number;
  ubicacion: string;

   avatar: string;
      coverPhoto: string;
       fotos: number;
  seguidores: number;
precioSuscripcion: number;
intereses: string[];

  distancia: number;
  fotoUrl: string;
  isLive: boolean;
  isOnline: boolean;
  isPremium: boolean;
  isVerified: boolean;
  bio?: string;
  precio: number;
  likes: number;
  generoId: number;
  fechaRegistro?: string; 
  suscriptores?: number;  
  rating?: number;       
  isFavorite: boolean; 
    slug: string;
}

export interface DashboardFilters {
  searchQuery: string;
  ciudad?: string;
  edadMin?: number;
  edadMax?: number;
  distancia?: number;
  soloEnVivo?: boolean;
  soloVerificadas?: boolean;
}

export interface OnlineCreator {
  id: number;
  nombre: string;
  slug?: string;
  avatar: string;
  isLive: boolean;
  isFavorite: boolean;  
}

export type TabType = 'descubrir' | 'en-vivo';
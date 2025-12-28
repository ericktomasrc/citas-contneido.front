export interface Creator {
  id: number;
  username: string;
  nombre: string;
  edad: number;
  ubicacion: string;
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

export type TabType = 'descubrir' | 'en-vivo';
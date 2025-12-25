export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  edad: number;
  genero: 'M' | 'F';
  tipoDocumentoId: number;
  numeroDocumento: string;
  nacionalidad: string;
  
  // Verificaciones
  emailVerificado: boolean;
  identidadVerificada: boolean;
  
  // Ubicación
  latitud?: number;
  longitud?: number;
  rangoDistanciaKm: number;
  
  // Fotos
  fotoPerfil?: string;
  fotoDocumento?: string;
  
  isPremium: boolean;
  ultimaActividad: string;
}

export interface UserProfile extends User {
  biografia?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  fotos: string[];
  intereses: string[];
}
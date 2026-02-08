// src/components/DashboardCreadora/Tabs/Contenido/types.ts 
export interface ArchivoContenido {
  id: string;
  tipo: 'foto' | 'video';
  url: string;
  thumbnail?: string;
  nombre: string;
  tamano: number;
  fechaSubida: Date;
  descripcion?: string;
}

export interface GrupoContenido {
  fecha: Date;
  archivos: ArchivoContenido[];
}

export interface ArchivoPreview {
  id: string;
  file: File;
  preview: string;
  tipo: 'foto' | 'video';
  seleccionado: boolean;
}

// Tipos para Packs
export interface Pack {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  archivos: ArchivoContenido[];
  activo: boolean;
  compradores: number;
  fechaCreacion: Date;
  thumbnail: string;
}

export interface PackFormData {
  titulo: string;
  descripcion: string;
  precio: number;
}

// ═══════════════════════════════════════════════════════
// ✅ NUEVOS TIPOS PARA PROGRAMACIÓN DE VIDEOS
// ═══════════════════════════════════════════════════════

export interface SugerenciaContenido {
  id: string;
  texto: string;
  nombreSuscriptor: string;
  usernameSuscriptor: string;
  avatarUrl?: string;
  likes: number;
  fechaCreacion: Date;
}

export interface VideoProgramado {
  id: string;
  titulo: string;
  descripcion?: string;
  archivo: ArchivoContenido;
  fechaProgramada: Date;
  horaProgramada: string;
  sugerenciaAsociada?: SugerenciaContenido | null;
  estado: 'pendiente' | 'publicado';
  fechaCreacion: Date;
}

// Mock de sugerencias ordenadas por likes
export const MOCK_SUGERENCIAS: SugerenciaContenido[] = [
  {
    id: 'sug-1',
    texto: 'Más rutinas de yoga por la mañana',
    nombreSuscriptor: 'María Fernández',
    usernameSuscriptor: 'maria_fit',
    likes: 234,
    fechaCreacion: new Date('2025-01-28'),
  },
  {
    id: 'sug-2',
    texto: 'Tutorial de maquillaje natural para el día',
    nombreSuscriptor: 'Lucia Beauty',
    usernameSuscriptor: 'beauty_pe',
    likes: 189,
    fechaCreacion: new Date('2025-01-25'),
  },
  {
    id: 'sug-3',
    texto: 'Recetas saludables y fáciles de preparar',
    nombreSuscriptor: 'Carlos Healthy',
    usernameSuscriptor: 'healthy01',
    likes: 156,
    fechaCreacion: new Date('2025-01-22'),
  },
  {
    id: 'sug-4',
    texto: 'Consejos de skincare para piel grasa',
    nombreSuscriptor: 'Ana Skin',
    usernameSuscriptor: 'skin_lover',
    likes: 134,
    fechaCreacion: new Date('2025-01-20'),
  },
  {
    id: 'sug-5',
    texto: 'Outfit ideas para el verano limeño',
    nombreSuscriptor: 'Fashion Lima',
    usernameSuscriptor: 'fashionlim',
    likes: 98,
    fechaCreacion: new Date('2025-01-18'),
  },
  {
    id: 'sug-6',
    texto: 'Ejercicios para hacer en casa sin equipos',
    nombreSuscriptor: 'Pedro Gym',
    usernameSuscriptor: 'pedro_gym',
    likes: 87,
    fechaCreacion: new Date('2025-01-15'),
  },
];

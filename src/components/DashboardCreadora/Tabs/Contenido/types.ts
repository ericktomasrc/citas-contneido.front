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

// Nuevos tipos para Packs
export interface Pack {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  archivos: ArchivoContenido[];
  activo: boolean;
  compradores: number;
  fechaCreacion: Date;
  thumbnail: string; // URL del thumbnail del pack
}

export interface PackFormData {
  titulo: string;
  descripcion: string;
  precio: number;
}

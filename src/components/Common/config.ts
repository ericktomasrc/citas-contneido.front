// src/config/contenido.config.ts

/**
 * Configuración de contenido para creadoras
 */
export const CONTENIDO_CONFIG = {
  // Mínimo de archivos requeridos para activar suscripción
  MINIMO_FOTOS: 5,
  MINIMO_VIDEOS: 3,
  
  // Mínimo de archivos para crear un pack
  MINIMO_ARCHIVOS_PACK: 5,
  
  // Precios
  PRECIO_MIN: 20,
  PRECIO_MAX: 150,
  PRECIO_DEFAULT: 50,
  
  // Límites de archivos
  MAX_FILE_SIZE_MB: 100,
  MAX_FILES_PER_UPLOAD: 20,
} as const;

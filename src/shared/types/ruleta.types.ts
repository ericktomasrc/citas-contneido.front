/**
 * RULETA DE PREMIOS - TIPOS TYPESCRIPT
 * Sistema de gamificación para lives
 */

export type TipoPremio = 
  | 'foto_exclusiva'
  | 'video_exclusivo'
  | 'videollamada'
  | 'mensaje_personalizado'
  | 'contenido_premium'
  | 'descuento_suscripcion'
  | 'pack_contenido'
  | 'regalo';

export interface PremioRuleta {
  id: string;
  tipo: TipoPremio;
  nombre: string;
  descripcion: string;
  valor: number; // Valor estimado en soles
  probabilidad: number; // 0-100 (peso relativo)
  icono: string; // Emoji
  color: string; // Color hex para la ruleta
  cantidad?: number; // Ej: 5 fotos, 10 minutos videollamada
}

export interface ConfiguracionRuleta {
  activa: boolean;
  costoGiro: number; // Precio por giro en soles
  premios: PremioRuleta[];
  girosMaximos?: number; // Límite de giros por usuario (opcional)
  channelName: string;
}

export interface ResultadoRuleta {
  giroId: string;
  usuarioId: string;
  usuarioNombre: string;
  premio: PremioRuleta;
  timestamp: Date;
  entregado: boolean;
}

export interface GiroRuletaRequest {
  channelName: string;
  usuarioId: string;
  usuarioNombre: string;
  costoGiro: number;
}

// Premios por defecto (creadora puede personalizar)
export const PREMIOS_DEFAULT: PremioRuleta[] = [
  {
    id: '1',
    tipo: 'foto_exclusiva',
    nombre: '3 Fotos Exclusivas',
    descripcion: 'Acceso a 3 fotos premium',
    valor: 5,
    probabilidad: 30,
    icono: '📸',
    color: '#FF6B9D',
    cantidad: 3
  },
  {
    id: '2',
    tipo: 'video_exclusivo',
    nombre: '1 Video Exclusivo',
    descripcion: 'Video premium personalizado',
    valor: 15,
    probabilidad: 20,
    icono: '🎬',
    color: '#C44569',
    cantidad: 1
  },
  {
    id: '3',
    tipo: 'mensaje_personalizado',
    nombre: 'Mensaje Personalizado',
    descripcion: 'Mensaje de voz o texto',
    valor: 8,
    probabilidad: 25,
    icono: '💌',
    color: '#FFA07A',
    cantidad: 1
  },
  {
    id: '4',
    tipo: 'videollamada',
    nombre: '5 min Videollamada',
    descripcion: 'Llamada privada 1 a 1',
    valor: 30,
    probabilidad: 10,
    icono: '📞',
    color: '#6C5CE7',
    cantidad: 5
  },
  {
    id: '5',
    tipo: 'pack_contenido',
    nombre: 'Pack Premium',
    descripcion: '10 fotos + 2 videos',
    valor: 50,
    probabilidad: 8,
    icono: '🎁',
    color: '#00B894',
    cantidad: 12
  },
  {
    id: '6',
    tipo: 'descuento_suscripcion',
    nombre: '50% OFF Suscripción',
    descripcion: 'Descuento primer mes',
    valor: 10,
    probabilidad: 15,
    icono: '🎟️',
    color: '#FDCB6E',
    cantidad: 50
  },
  {
    id: '7',
    tipo: 'videollamada',
    nombre: '15 min Videollamada VIP',
    descripcion: 'Llamada extendida premium',
    valor: 80,
    probabilidad: 2,
    icono: '👑',
    color: '#FFD700',
    cantidad: 15
  }
];

/**
 * TODO: BACKEND C# - ENDPOINTS NECESARIOS
 * 
 * 1. POST /api/ruleta/configurar
 *    Body: ConfiguracionRuleta
 *    Respuesta: { success: boolean, configuracion: ConfiguracionRuleta }
 * 
 * 2. GET /api/ruleta/configuracion/:channelName
 *    Respuesta: ConfiguracionRuleta
 * 
 * 3. POST /api/ruleta/girar
 *    Body: GiroRuletaRequest
 *    Respuesta: { success: boolean, resultado: ResultadoRuleta, saldoRestante: number }
 *    - Valida que usuario tenga saldo suficiente
 *    - Cobra el monto del giro
 *    - Selecciona premio según probabilidades
 *    - Guarda resultado en BD
 *    - Emite evento Socket.io
 * 
 * 4. GET /api/ruleta/historial/:channelName
 *    Respuesta: ResultadoRuleta[]
 * 
 * 5. GET /api/ruleta/mis-premios/:usuarioId
 *    Respuesta: ResultadoRuleta[]
 *    - Premios ganados pendientes de entrega
 */

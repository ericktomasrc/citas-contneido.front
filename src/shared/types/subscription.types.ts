// ============================================
// TIPOS PARA SISTEMA DE SUSCRIPCIONES
// ============================================
// TODO: BACKEND C# - Estos tipos deben coincidir con tus DTOs

export type TipoSuscripcion = 'basico' | 'vip' | 'elite';
export type TipoTransmision = 'gratis' | 'suscriptores' | 'ppv';

export interface PlanSuscripcion {
  id: string;
  tipo: TipoSuscripcion;
  nombre: string;
  precio: number; // En soles
  beneficios: string[];
  color: string;
  icono: string;
}

export interface UsuarioSuscripcion {
  userId: string;
  creadoraId: string;
  tipoSuscripcion: TipoSuscripcion;
  activa: boolean;
  fechaInicio: Date;
  fechaExpiracion: Date;
  renovacionAutomatica: boolean;
}

export interface TransmisionConfig {
  channelName: string;
  tipoTransmision: TipoTransmision;
  precioPPV?: number;
  descripcionPPV?: string;
  creadoraId: string;
  fechaInicio: Date;
}

export interface AccesoPPV {
  userId: string;
  channelName: string;
  montoPagado: number;
  fechaPago: Date;
  transaccionId: string;
}

// ============================================
// ENDPOINTS QUE EL BACKEND C# DEBE IMPLEMENTAR
// ============================================

/**
 * POST /api/suscripciones/crear
 * Body: { userId: string, creadoraId: string, tipoSuscripcion: TipoSuscripcion, metodoPago: string }
 * Response: { success: boolean, suscripcion: UsuarioSuscripcion, transaccionId: string }
 */

/**
 * GET /api/suscripciones/verificar/:userId/:creadoraId
 * Response: { esSuscriptor: boolean, tipoSuscripcion?: TipoSuscripcion, expiraEn?: Date }
 */

/**
 * POST /api/suscripciones/cancelar
 * Body: { userId: string, creadoraId: string }
 * Response: { success: boolean }
 */

/**
 * POST /api/ppv/pagar
 * Body: { userId: string, channelName: string, monto: number, metodoPago: string }
 * Response: { success: boolean, accesoId: string, transaccionId: string }
 */

/**
 * GET /api/ppv/verificar/:userId/:channelName
 * Response: { tienePago: boolean, expiraEn?: Date }
 */

export const PLANES_SUSCRIPCION: PlanSuscripcion[] = [
  {
    id: 'basico',
    tipo: 'basico',
    nombre: 'Plan Básico',
    precio: 20,
    beneficios: [
      'Lives exclusivos para suscriptores',
      'Chat prioritario',
      'Badge de suscriptor',
      'Sin anuncios'
    ],
    color: 'purple',
    icono: '⭐'
  },
  {
    id: 'vip',
    tipo: 'vip',
    nombre: 'Plan VIP',
    precio: 50,
    beneficios: [
      'Todo lo de Básico',
      'Contenido premium adicional',
      '10% descuento en regalos',
      'Chat personalizado',
      'Acceso anticipado a contenido'
    ],
    color: 'pink',
    icono: '💎'
  },
  {
    id: 'elite',
    tipo: 'elite',
    nombre: 'Plan Elite',
    precio: 150,
    beneficios: [
      'Todo lo de VIP',
      'Lives 1-on-1 mensuales',
      '20% descuento en regalos',
      'Mensajes directos ilimitados',
      'Contenido exclusivo Elite',
      'Prioridad máxima en eventos'
    ],
    color: 'yellow',
    icono: '👑'
  }
];

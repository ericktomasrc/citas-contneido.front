// src/pages/DashboardCreadora/tabs/InvitacionesTab/utils/invitaciones.adapter.ts

import { Invitacion } from '../../../types/invitaciones.types';
import { InvitacionDetalle } from '../types/invitaciones.types';

/**
 * Convierte InvitacionDetalle a Invitacion (tipo base)
 */
export const toInvitacionBase = (detalle: InvitacionDetalle): Invitacion => {
  return {
    id: detalle.id,
    slug: detalle.slug,
    nombre: detalle.nombre,
    edad: detalle.edad,
    ubicacion: detalle.ubicacion,
    distancia: detalle.distancia,
    avatar: detalle.avatar,
    isLive: detalle.isLive,
    isFavorite: detalle.isFavorite,
    fechaInvitacion: detalle.fechaInvitacion,
  };
};

/**
 * Convierte array de InvitacionDetalle a Invitacion[]
 */
export const toInvitacionBaseArray = (detalles: InvitacionDetalle[]): Invitacion[] => {
  return detalles.map(toInvitacionBase);
};

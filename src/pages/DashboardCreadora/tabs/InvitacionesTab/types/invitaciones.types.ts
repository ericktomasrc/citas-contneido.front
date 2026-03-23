// src/pages/DashboardCreadora/tabs/InvitacionesTab/types/invitaciones.types.ts

// Tipo base que ya tienes
export interface InvitacionBase {
  id: number;
  slug: string;
  nombre: string;
  edad: number;
  ubicacion: string;
  distancia: number;
  avatar: string;
  isLive: boolean;
  isFavorite: boolean;
  fechaInvitacion: string;
}

// Tipo extendido con información adicional para el detalle
export interface InformacionBasica {
  profesion: string;
  educacion: string;
  estadoCivil: string;
  hijos: string;
}

export interface InvitacionDetalle extends InvitacionBase {
  verificado: boolean;
  biografia: string;
  fotos: string[];
  informacionBasica: InformacionBasica;
  intereses: string[];
}

// Exportar el tipo original también
export type Invitacion = InvitacionBase;

export type InvitacionAction = 'aceptar' | 'rechazar' | 'ver-perfil';

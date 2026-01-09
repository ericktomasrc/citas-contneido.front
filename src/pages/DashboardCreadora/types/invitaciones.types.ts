export interface Invitacion {
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

export type InvitacionAction = 'aceptar' | 'rechazar' | 'ver-perfil';

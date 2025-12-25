export interface RegistroEmailDto {
  email: string;
}

export interface VerificarEmailDto {
  token: string;
}

export interface CompletarRegistroDto {
  nombre: string;
  apellidos: string;
  edad: number;
  genero: 'M' | 'F';
  tipoDocumentoId: number;
  numeroDocumento: string;
  nacionalidad: string;
  password: string;
  confirmPassword: string;
}

export interface VerificacionIdentidadDto {
  fotoEnVivo?: File;
  fotoDocumento: File;
  latitud: number;
  longitud: number;
}

export interface LoginDto {
  email: string;
  password: string;
}
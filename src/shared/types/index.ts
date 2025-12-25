export * from './common';
export * from './enums';
export * from './user';
// Tipos base para respuestas del API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Result pattern (como tu backend)
export interface Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value?: T;
  error?: string;
}

// Usuario base
export interface User {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  genero: 'M' | 'F';
  isPremium: boolean;
  fotoPerfil?: string;
}

// Perfil completo
export interface UserProfile extends User {
  biografia?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  fotos: string[];
  intereses: string[];
}

// Auth
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nombre: string;
  email: string;
  password: string;
  edad: number;
  genero: 'M' | 'F';
}

export interface AuthResponse {
  token: string;
  user: User;
}
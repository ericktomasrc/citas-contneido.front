import { apiClient } from '@shared/api';
import { User } from '@shared/types';
import {
  RegistroEmailDto,
  VerificarEmailDto,
  CompletarRegistroDto,
  VerificacionIdentidadDto,
  LoginDto,
  AuthResponse,
} from '../types';

export const authApi = {
  // Paso 1: Registrar email (envía correo de confirmación)
  registrarEmail: async (data: RegistroEmailDto) => {
    const response = await apiClient.post('/auth/registrar-email', data);
    return response.data;
  },

  // Paso 2: Verificar email (click en link del correo)
  verificarEmail: async (data: VerificarEmailDto) => {
    const response = await apiClient.post('/auth/verificar-email', data);
    return response.data;
  },

  // Paso 3: Completar registro (datos personales + password)
  completarRegistro: async (data: CompletarRegistroDto) => {
    const response = await apiClient.post<AuthResponse>('/auth/completar-registro', data);
    return response.data;
  },

  // Paso 4: Subir fotos y ubicación (verificación de identidad)
  verificarIdentidad: async (data: VerificacionIdentidadDto) => {
    const formData = new FormData();
    
    if (data.fotoEnVivo) {
      formData.append('fotoEnVivo', data.fotoEnVivo);
    }
    formData.append('fotoDocumento', data.fotoDocumento);
    formData.append('latitud', data.latitud.toString());
    formData.append('longitud', data.longitud.toString());

    const response = await apiClient.post('/auth/verificar-identidad', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Login
  login: async (data: LoginDto) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Obtener perfil actual
  getPerfil: async () => {
    const response = await apiClient.get<User>('/auth/perfil');
    return response.data;
  },

  loginConGoogle: async (googleToken: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login/google', {
      googleToken
    }); 
    return response.data;
  },

  // Login con Facebook
  loginConFacebook: async (facebookToken: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login/facebook', {
      facebookToken
    });
    return response.data;
  },
};
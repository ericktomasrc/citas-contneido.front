import { User } from '@shared/types/user';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
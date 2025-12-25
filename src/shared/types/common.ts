export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value?: T;
  error?: string;
}
import client from './client';
import type { ApiResponse, AuthResponse } from '../types';

export const authApi = {
  signup: (email: string, password: string, nickname: string) =>
    client.post<ApiResponse<AuthResponse>>('/api/auth/signup', { email, password, nickname }),
  
  login: (email: string, password: string) =>
    client.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password }),

  me: () =>
    client.get<ApiResponse<AuthResponse['user']>>('/api/auth/me'),

  refresh: () =>
    client.post<ApiResponse<AuthResponse>>('/api/auth/refresh'),
};

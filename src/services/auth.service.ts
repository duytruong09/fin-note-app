import { apiClient, tokenManager } from './api-client';
import { ApiResponse, User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    const { accessToken, refreshToken, user } = response.data.data;

    await tokenManager.setAccessToken(accessToken);
    await tokenManager.setRefreshToken(refreshToken);

    return response.data.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );

    const { accessToken, refreshToken, user } = response.data.data;

    await tokenManager.setAccessToken(accessToken);
    await tokenManager.setRefreshToken(refreshToken);

    return response.data.data;
  },

  async logout(): Promise<void> {
    await tokenManager.clearTokens();
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    await tokenManager.setAccessToken(accessToken);
    await tokenManager.setRefreshToken(newRefreshToken);

    return response.data.data;
  },
};

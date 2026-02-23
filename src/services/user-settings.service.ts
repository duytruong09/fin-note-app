import { apiClient } from './api-client';
import { ApiResponse, UserSettings, PaymentMethod } from '@/types';

interface UpdateUserSettingsDto {
  theme?: string;
  notificationEnabled?: boolean;
  budgetAlertEnabled?: boolean;
  voiceAutoSubmit?: boolean;
  voiceDefaultLang?: 'vi' | 'en';
  defaultPaymentMethod?: PaymentMethod;
  timezone?: string;
}

interface ThemesResponse {
  themes: string[];
  default: string;
}

export const userSettingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<ApiResponse<UserSettings>>('/user-settings');
    return response.data.data;
  },

  async updateSettings(data: UpdateUserSettingsDto): Promise<UserSettings> {
    const response = await apiClient.patch<ApiResponse<UserSettings>>(
      '/user-settings',
      data
    );
    return response.data.data;
  },

  async getThemes(): Promise<ThemesResponse> {
    const response = await apiClient.get<ApiResponse<ThemesResponse>>(
      '/user-settings/themes'
    );
    return response.data.data;
  },
};

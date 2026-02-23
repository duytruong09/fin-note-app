export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
};

export const APP_CONFIG = {
  MAX_AUDIO_DURATION: 15, // seconds
  DEFAULT_CURRENCY: 'VND',
  DEFAULT_LANGUAGE: 'vi' as 'vi' | 'en',
};

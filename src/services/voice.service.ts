import { apiClient } from './api-client';
import { ApiResponse, ParsedExpense, Transaction } from '@/types';

interface ProcessVoiceResponse {
  transcript: string;
  parsedData: ParsedExpense;
  confidence: number;
}

export const voiceService = {
  async processVoice(
    audioUri: string,
    language: 'vi' | 'en' = 'vi'
  ): Promise<ProcessVoiceResponse> {
    const formData = new FormData();

    // @ts-ignore - FormData in React Native supports file objects differently
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    formData.append('language', language);

    const response = await apiClient.post<ApiResponse<ProcessVoiceResponse>>(
      '/voice/process',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  async createTransactionFromVoice(
    parsedData: ParsedExpense,
    audioUri?: string,
    transcript?: string
  ): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/voice/create-transaction',
      {
        ...parsedData,
        audioUri,
        transcript,
      }
    );

    return response.data.data;
  },
};

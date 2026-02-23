import { StateCreator } from 'zustand';
import { ParsedExpense } from '@/types';
import { voiceService } from '@/services/voice.service';

export interface VoiceSlice {
  isProcessing: boolean;
  transcript: string | null;
  parsedExpense: ParsedExpense | null;
  audioUri: string | null;
  error: string | null;

  // Actions
  processVoice: (audioUri: string, language?: 'vi' | 'en') => Promise<void>;
  clearVoiceData: () => void;
  updateParsedExpense: (data: Partial<ParsedExpense>) => void;
}

export const createVoiceSlice: StateCreator<VoiceSlice> = (set, get) => ({
  isProcessing: false,
  transcript: null,
  parsedExpense: null,
  audioUri: null,
  error: null,

  processVoice: async (audioUri: string, language: 'vi' | 'en' = 'vi') => {
    set({ isProcessing: true, error: null, audioUri });
    try {
      const result = await voiceService.processVoice(audioUri, language);
      set({
        transcript: result.transcript,
        parsedExpense: result.parsedData,
        isProcessing: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Voice processing failed',
        isProcessing: false,
      });
      throw error;
    }
  },

  clearVoiceData: () =>
    set({
      transcript: null,
      parsedExpense: null,
      audioUri: null,
      error: null,
    }),

  updateParsedExpense: (data: Partial<ParsedExpense>) =>
    set((state) => ({
      parsedExpense: state.parsedExpense
        ? { ...state.parsedExpense, ...data }
        : null,
    })),
});

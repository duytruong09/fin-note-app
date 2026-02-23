import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { VoiceSlice, createVoiceSlice } from './voice-slice';

type StoreState = AuthSlice & VoiceSlice;

export const useStore = create<StoreState>((...a) => ({
  ...createAuthSlice(...a),
  ...createVoiceSlice(...a),
}));

// Export the main store - components should use selectors directly
export const useAuthStore = useStore;
export const useVoiceStore = useStore;

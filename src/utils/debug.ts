import { tokenManager } from '@/services/api-client';
import { credentialsService } from '@/services/credentials.service';

/**
 * Debug utilities for development
 */
export const debugUtils = {
  /**
   * Check if user has saved tokens and credentials in SecureStore
   */
  async checkTokenStatus(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    hasValidSession: boolean;
    hasCredentials: boolean;
    savedEmail: string | null;
  }> {
    const accessToken = await tokenManager.getAccessToken();
    const refreshToken = await tokenManager.getRefreshToken();
    const hasValidSession = !!(accessToken && refreshToken);
    const hasCredentials = await credentialsService.hasCredentials();
    const savedEmail = await credentialsService.getSavedEmail();

    console.log('[Debug] Token Status:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasValidSession,
      hasCredentials,
      savedEmail: savedEmail || 'NOT_FOUND',
    });

    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasValidSession,
      hasCredentials,
      savedEmail,
    };
  },

  /**
   * Clear all tokens (for testing logout)
   */
  async clearAllTokens(): Promise<void> {
    console.log('[Debug] Manually clearing all tokens...');
    await tokenManager.clearTokens();
    console.log('[Debug] All tokens cleared');
  },

  /**
   * Clear all saved credentials
   */
  async clearAllCredentials(): Promise<void> {
    console.log('[Debug] Manually clearing all credentials...');
    await credentialsService.clearCredentials();
    console.log('[Debug] All credentials cleared');
  },

  /**
   * Clear everything (tokens + credentials)
   */
  async clearEverything(): Promise<void> {
    console.log('[Debug] Clearing everything...');
    await tokenManager.clearTokens();
    await credentialsService.clearCredentials();
    console.log('[Debug] Everything cleared');
  },

  /**
   * Log current auth state
   */
  logAuthState(authState: {
    isAuthenticated: boolean;
    user: any;
    isLoading: boolean;
  }): void {
    console.log('[Debug] Current Auth State:', {
      isAuthenticated: authState.isAuthenticated,
      userEmail: authState.user?.email || 'N/A',
      isLoading: authState.isLoading,
    });
  },
};

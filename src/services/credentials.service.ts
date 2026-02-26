import * as SecureStore from 'expo-secure-store';

/**
 * Service for securely storing user credentials
 *
 * ⚠️ SECURITY WARNING:
 * Storing passwords is generally NOT recommended even in SecureStore.
 * This is only for convenience features like "Remember Me".
 *
 * Better alternatives:
 * - Use biometric authentication with token-based auto-login
 * - Only store tokens, not credentials
 *
 * If you use this service:
 * - Only enable when user explicitly opts in ("Remember Me")
 * - Passwords are stored in SecureStore (encrypted by OS)
 * - Always clear credentials on logout
 */

const SAVED_EMAIL_KEY = 'saved_email';
const SAVED_PASSWORD_KEY = 'saved_password';
const REMEMBER_ME_KEY = 'remember_me';

export const credentialsService = {
  /**
   * Save user credentials securely
   * Only call this when user checks "Remember Me"
   */
  async saveCredentials(email: string, password: string): Promise<void> {
    try {
      console.log('[Credentials] Saving credentials for:', email);
      await SecureStore.setItemAsync(SAVED_EMAIL_KEY, email);
      await SecureStore.setItemAsync(SAVED_PASSWORD_KEY, password);
      await SecureStore.setItemAsync(REMEMBER_ME_KEY, 'true');
      console.log('[Credentials] ✅ Credentials saved successfully');
    } catch (error) {
      console.error('[Credentials] Failed to save credentials:', error);
      throw error;
    }
  },

  /**
   * Get saved credentials
   * Returns null if no credentials saved or "Remember Me" is disabled
   */
  async getCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const rememberMe = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
      if (rememberMe !== 'true') {
        console.log('[Credentials] Remember Me is disabled');
        return null;
      }

      const email = await SecureStore.getItemAsync(SAVED_EMAIL_KEY);
      const password = await SecureStore.getItemAsync(SAVED_PASSWORD_KEY);

      if (email && password) {
        console.log('[Credentials] Found saved credentials for:', email);
        return { email, password };
      }

      console.log('[Credentials] No saved credentials found');
      return null;
    } catch (error) {
      console.error('[Credentials] Failed to get credentials:', error);
      return null;
    }
  },

  /**
   * Get saved email only (for auto-fill)
   */
  async getSavedEmail(): Promise<string | null> {
    try {
      const email = await SecureStore.getItemAsync(SAVED_EMAIL_KEY);
      console.log('[Credentials] Saved email:', email || 'NOT_FOUND');
      return email;
    } catch (error) {
      console.error('[Credentials] Failed to get saved email:', error);
      return null;
    }
  },

  /**
   * Check if "Remember Me" is enabled
   */
  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
      return value === 'true';
    } catch (error) {
      console.error('[Credentials] Failed to check remember me status:', error);
      return false;
    }
  },

  /**
   * Clear saved credentials
   * Call this on logout or when user disables "Remember Me"
   */
  async clearCredentials(): Promise<void> {
    try {
      console.log('[Credentials] Clearing saved credentials...');
      await SecureStore.deleteItemAsync(SAVED_EMAIL_KEY);
      await SecureStore.deleteItemAsync(SAVED_PASSWORD_KEY);
      await SecureStore.deleteItemAsync(REMEMBER_ME_KEY);
      console.log('[Credentials] ✅ Credentials cleared successfully');
    } catch (error) {
      console.error('[Credentials] Failed to clear credentials:', error);
      // Don't throw - clearing should always succeed
    }
  },

  /**
   * Update "Remember Me" preference without changing credentials
   */
  async setRememberMe(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await SecureStore.setItemAsync(REMEMBER_ME_KEY, 'true');
        console.log('[Credentials] Remember Me enabled');
      } else {
        await this.clearCredentials();
        console.log('[Credentials] Remember Me disabled, credentials cleared');
      }
    } catch (error) {
      console.error('[Credentials] Failed to set remember me:', error);
      throw error;
    }
  },

  /**
   * Check if user has any saved credentials
   */
  async hasCredentials(): Promise<boolean> {
    try {
      const email = await SecureStore.getItemAsync(SAVED_EMAIL_KEY);
      const password = await SecureStore.getItemAsync(SAVED_PASSWORD_KEY);
      const rememberMe = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
      return !!(email && password && rememberMe === 'true');
    } catch (error) {
      console.error('[Credentials] Failed to check credentials:', error);
      return false;
    }
  },
};

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store';
import { useBiometric } from '@/hooks/useBiometric';
import { tokenManager } from '@/services/api-client';
import { credentialsService } from '@/services/credentials.service';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError, loadUser } = useAuthStore();
  const { isAvailable: biometricAvailable, biometricType, authenticate } = useBiometric();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAutoLoginInfo, setShowAutoLoginInfo] = useState(false);

  useEffect(() => {
    // Load saved credentials on mount
    const loadSavedData = async () => {
      // Check for tokens
      const hasTokens = await tokenManager.hasTokens();
      if (hasTokens) {
        setShowAutoLoginInfo(true);
      }

      // Load saved credentials
      const savedCredentials = await credentialsService.getCredentials();
      if (savedCredentials) {
        setEmail(savedCredentials.email);
        setPassword(savedCredentials.password);
        setRememberMe(true);
        console.log('[Login] Auto-filled saved credentials');
      } else {
        // If no full credentials, try to load just the email
        const savedEmail = await credentialsService.getSavedEmail();
        if (savedEmail) {
          setEmail(savedEmail);
          console.log('[Login] Auto-filled saved email');
        }
      }
    };

    loadSavedData();
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Invalid email format');
      return false;
    }

    if (!password) {
      setValidationError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      const trimmedEmail = email.trim().toLowerCase();
      await login(trimmedEmail, password);

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await credentialsService.saveCredentials(trimmedEmail, password);
        console.log('[Login] Credentials saved (Remember Me enabled)');
      } else {
        // Clear credentials if "Remember Me" is unchecked
        await credentialsService.clearCredentials();
        console.log('[Login] Credentials cleared (Remember Me disabled)');
      }

      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authenticate('Login to Fin-Note');
    if (!success) return;

    try {
      // First, try auto-login with existing tokens
      const hasTokens = await tokenManager.hasTokens();
      if (hasTokens) {
        console.log('[Login] Biometric: Attempting auto-login with tokens');
        await loadUser();
        router.replace('/(tabs)');
        return;
      }

      // If no tokens, try saved credentials
      const savedCredentials = await credentialsService.getCredentials();
      if (savedCredentials) {
        console.log('[Login] Biometric: Using saved credentials to login');
        await login(savedCredentials.email, savedCredentials.password);
        router.replace('/(tabs)');
      } else {
        // No saved credentials or tokens
        setValidationError('No saved credentials found. Please login with email and password.');
      }
    } catch (err) {
      // If login fails, stay on login screen
      clearError();
      setValidationError('Biometric login failed. Please try again or use email/password.');
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mt-8 mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-base">
              Sign in to continue tracking your expenses
            </Text>
          </View>

          {/* Auto-Login Info Banner */}
          {showAutoLoginInfo && (
            <View className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <View className="flex-row items-start">
                <Text className="text-2xl mr-2">ℹ️</Text>
                <View className="flex-1">
                  <Text className="text-blue-900 font-semibold mb-1">
                    Session Found
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    You have a saved session. The app will automatically log you in next time.
                  </Text>
                  {biometricAvailable && (
                    <Text className="text-blue-600 text-xs mt-1">
                      💡 Tip: Use {biometricType} for quick login
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => setShowAutoLoginInfo(false)}>
                  <Text className="text-blue-400 text-lg">✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Form */}
          <View className="gap-4 mb-6">
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationError(null);
                clearError();
              }}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Text>📧</Text>}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setValidationError(null);
                clearError();
              }}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              leftIcon={<Text>🔒</Text>}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-2xl">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              }
            />

            {(validationError || error) && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3">
                <Text className="text-red-600 text-sm">
                  {validationError || error}
                </Text>
              </View>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
            >
              <View
                className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${
                  rememberMe
                    ? 'bg-primary-blue border-primary-blue'
                    : 'border-gray-300'
                }`}
              >
                {rememberMe && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-gray-700">Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primary-blue font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
            size="lg"
            className="mb-4"
          />

          {/* Biometric Login */}
          {biometricAvailable && (
            <Button
              title={`Sign in with ${biometricType}`}
              onPress={handleBiometricLogin}
              variant="outline"
              fullWidth
              size="lg"
              icon={<Text className="text-xl">🔐</Text>}
              className="mb-6"
            />
          )}

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary-blue font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

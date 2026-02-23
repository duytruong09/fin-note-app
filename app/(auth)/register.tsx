import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = () => {
    if (!fullName.trim()) {
      setValidationError('Full name is required');
      return false;
    }

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

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      await register(email.trim().toLowerCase(), password, fullName.trim());
      router.replace('/(tabs)');
    } catch (err) {
      // Error is handled by the store
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
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4"
          >
            <Text className="text-primary-blue text-lg">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="mt-4 mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-base">
              Join Fin-Note and start tracking your expenses
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4 mb-6">
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setValidationError(null);
                clearError();
              }}
              placeholder="John Doe"
              autoCapitalize="words"
              leftIcon={<Text>👤</Text>}
            />

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
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              leftIcon={<Text>🔒</Text>}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-2xl">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              }
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setValidationError(null);
                clearError();
              }}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              leftIcon={<Text>🔒</Text>}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text className="text-2xl">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
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

          {/* Terms */}
          <Text className="text-gray-500 text-xs text-center mb-6">
            By signing up, you agree to our{' '}
            <Text className="text-primary-blue">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-primary-blue">Privacy Policy</Text>
          </Text>

          {/* Register Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            fullWidth
            size="lg"
            className="mb-6"
          />

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary-blue font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

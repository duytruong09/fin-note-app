import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { useAuthStore } from '@/store';
import { userSettingsService } from '@/services/user-settings.service';
import { THEME_COLORS, ThemeColor } from '@/constants/themes';
import { debugUtils } from '@/utils/debug';
import { credentialsService } from '@/services/credentials.service';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [tokenStatus, setTokenStatus] = useState<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    hasValidSession: boolean;
  } | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);

  const isDevelopment = __DEV__;

  useEffect(() => {
    // Check if user has saved credentials
    credentialsService.hasCredentials().then(setHasCredentials);
  }, []);

  // Fetch user settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => userSettingsService.getSettings(),
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: userSettingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });

  const handleThemeChange = async (theme: string) => {
    await updateMutation.mutateAsync({ theme });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleCheckTokens = async () => {
    const status = await debugUtils.checkTokenStatus();
    setTokenStatus(status);
    setHasCredentials(status.hasCredentials);
    debugUtils.logAuthState({ isAuthenticated, user, isLoading: authLoading });

    Alert.alert(
      'Debug Status',
      `🔑 TOKENS:\n` +
        `Access Token: ${status.hasAccessToken ? '✅ EXISTS' : '❌ NOT FOUND'}\n` +
        `Refresh Token: ${status.hasRefreshToken ? '✅ EXISTS' : '❌ NOT FOUND'}\n` +
        `Valid Session: ${status.hasValidSession ? '✅ YES' : '❌ NO'}\n\n` +
        `👤 CREDENTIALS:\n` +
        `Saved Email: ${status.savedEmail || '❌ NOT FOUND'}\n` +
        `Saved Password: ${status.hasCredentials ? '✅ EXISTS' : '❌ NOT FOUND'}\n` +
        `Remember Me: ${status.hasCredentials ? '✅ ENABLED' : '❌ DISABLED'}\n\n` +
        `🔐 AUTH STATE:\n` +
        `- Authenticated: ${isAuthenticated ? 'YES' : 'NO'}\n` +
        `- User: ${user?.email || 'N/A'}\n\n` +
        `Check console for detailed logs.`,
      [{ text: 'OK' }]
    );
  };

  const handleClearTokens = () => {
    Alert.alert(
      'Clear Tokens',
      'This will clear all saved tokens. You will need to login again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await debugUtils.clearAllTokens();
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleClearCredentials = () => {
    Alert.alert(
      'Clear Saved Credentials',
      'This will remove your saved email and password. You will need to enter them again next time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await credentialsService.clearCredentials();
            setHasCredentials(false);
            Alert.alert('Success', 'Saved credentials have been cleared.');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Loading fullScreen message="Loading settings..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Settings
          </Text>
          <Text className="text-gray-600">
            Customize your experience
          </Text>
        </View>

        {/* Account */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Account
          </Text>
          <Card>
            <View className="items-center py-4">
              <View className="w-20 h-20 bg-primary-blue rounded-full items-center justify-center mb-3">
                <Text className="text-4xl">
                  {user?.fullName?.charAt(0).toUpperCase() || '👤'}
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {user?.fullName || 'User'}
              </Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
          </Card>
        </View>

        {/* Theme Colors */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Theme Color
          </Text>
          <Card>
            <View className="flex-row flex-wrap gap-3">
              {Object.entries(THEME_COLORS).map(([key, colors]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleThemeChange(key)}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    settings?.theme === key ? 'border-4 border-gray-900' : ''
                  }`}
                  style={{ backgroundColor: colors.primary }}
                >
                  {settings?.theme === key && (
                    <Text className="text-white text-xl">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>

        {/* Security */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Security
          </Text>
          <Card className="gap-3">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Saved Credentials
                </Text>
                <Text className="text-sm text-gray-600">
                  {hasCredentials
                    ? '✅ Email & password saved'
                    : '❌ No saved credentials'}
                </Text>
              </View>
              {hasCredentials && (
                <TouchableOpacity
                  onPress={handleClearCredentials}
                  className="px-3 py-1 bg-red-50 rounded-lg"
                >
                  <Text className="text-red-600 text-sm font-medium">Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {hasCredentials && (
              <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <Text className="text-yellow-800 text-xs">
                  ⚠️ Your credentials are encrypted and stored securely. Clear them if you're on a shared device.
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Preferences */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Preferences
          </Text>
          <Card className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Notifications
                </Text>
                <Text className="text-sm text-gray-600">
                  Receive app notifications
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  updateMutation.mutate({
                    notificationEnabled: !settings?.notificationEnabled,
                  })
                }
                className={`w-12 h-7 rounded-full ${
                  settings?.notificationEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${
                    settings?.notificationEnabled ? 'ml-6' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Budget Alerts
                </Text>
                <Text className="text-sm text-gray-600">
                  Alert when budget threshold reached
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  updateMutation.mutate({
                    budgetAlertEnabled: !settings?.budgetAlertEnabled,
                  })
                }
                className={`w-12 h-7 rounded-full ${
                  settings?.budgetAlertEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${
                    settings?.budgetAlertEnabled ? 'ml-6' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Voice Auto-Submit
                </Text>
                <Text className="text-sm text-gray-600">
                  Save without review after voice input
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  updateMutation.mutate({
                    voiceAutoSubmit: !settings?.voiceAutoSubmit,
                  })
                }
                className={`w-12 h-7 rounded-full ${
                  settings?.voiceAutoSubmit ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${
                    settings?.voiceAutoSubmit ? 'ml-6' : 'ml-1'
                  }`}
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Debug Tools (Development Only) */}
        {isDevelopment && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              🔧 Debug Tools
            </Text>
            <Card className="gap-3">
              <TouchableOpacity
                onPress={handleCheckTokens}
                className="flex-row items-center py-2"
              >
                <Text className="text-2xl mr-3">🔍</Text>
                <View className="flex-1">
                  <Text className="text-base text-gray-900 font-medium">
                    Check Token Status
                  </Text>
                  {tokenStatus && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {tokenStatus.hasValidSession
                        ? '✅ Valid session exists'
                        : '❌ No valid session'}
                    </Text>
                  )}
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearTokens}
                className="flex-row items-center py-2"
              >
                <Text className="text-2xl mr-3">🗑️</Text>
                <View className="flex-1">
                  <Text className="text-base text-orange-600 font-medium">
                    Clear All Tokens
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Force logout and clear cache
                  </Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </TouchableOpacity>
            </Card>

            <View className="mt-2 px-3">
              <Text className="text-xs text-gray-500">
                💡 Tip: Check console logs for detailed debug info
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Actions
          </Text>
          <Card className="gap-3">
            <TouchableOpacity
              onPress={() => router.push('/(modals)/add-budget')}
              className="flex-row items-center py-2"
            >
              <Text className="text-2xl mr-3">💳</Text>
              <Text className="flex-1 text-base text-gray-900">
                Manage Budgets
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-2">
              <Text className="text-2xl mr-3">📊</Text>
              <Text className="flex-1 text-base text-gray-900">
                Export Data
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center py-2"
            >
              <Text className="text-2xl mr-3">🚪</Text>
              <Text className="flex-1 text-base text-red-600 font-medium">
                Logout
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* About */}
        <View className="px-6 mb-8">
          <Text className="text-center text-gray-500 text-sm">
            Fin-Note v1.0.0
          </Text>
          <Text className="text-center text-gray-400 text-xs mt-1">
            Made with 💙 by Claude Code
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

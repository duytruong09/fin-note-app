import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { useAuthStore } from '@/store';
import { userSettingsService } from '@/services/user-settings.service';
import { THEME_COLORS, ThemeColor } from '@/constants/themes';

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

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

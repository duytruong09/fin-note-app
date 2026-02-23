import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Loading({
  message,
  size = 'large',
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <View className="items-center justify-center gap-3">
      <ActivityIndicator size={size} color="#4C6EF5" />
      {message && (
        <Text className="text-gray-600 text-sm">{message}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {content}
      </View>
    );
  }

  return content;
}

import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-2xl font-bold mb-4">Screen not found</Text>
      <Link href="/" className="text-primary-blue underline">
        Go to home screen
      </Link>
    </View>
  );
}

import { TouchableOpacity, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CategoryButtonProps {
  icon: string;
  name: string;
  color?: string;
  isSelected?: boolean;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function CategoryButton({
  icon,
  name,
  color = '#4C6EF5',
  isSelected = false,
  onPress,
}: CategoryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={`
        h-20 rounded-2xl items-center justify-center
        ${isSelected ? 'bg-primary-blue' : 'bg-gray-100'}
      `}
      activeOpacity={0.9}
    >
      <View className="items-center gap-1">
        <Text className="text-2xl">{icon}</Text>
        <Text
          className={`
            text-sm font-medium
            ${isSelected ? 'text-white' : 'text-gray-700'}
          `}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </AnimatedTouchable>
  );
}

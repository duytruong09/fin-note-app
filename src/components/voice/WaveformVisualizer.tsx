import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  barCount?: number;
}

export function WaveformVisualizer({
  isActive,
  barCount = 20,
}: WaveformVisualizerProps) {
  const bars = Array.from({ length: barCount });

  return (
    <View className="flex-row items-center justify-center gap-1 h-24">
      {bars.map((_, index) => (
        <AnimatedBar key={index} isActive={isActive} index={index} />
      ))}
    </View>
  );
}

function AnimatedBar({ isActive, index }: { isActive: boolean; index: number }) {
  const height = useSharedValue(8);

  useEffect(() => {
    if (isActive) {
      // Random height between 8 and 48
      const minHeight = 8;
      const maxHeight = 48;
      const randomHeight = Math.random() * (maxHeight - minHeight) + minHeight;

      height.value = withRepeat(
        withSequence(
          withTiming(randomHeight, { duration: 300 + Math.random() * 400 }),
          withTiming(minHeight, { duration: 300 + Math.random() * 400 })
        ),
        -1,
        true
      );
    } else {
      height.value = withTiming(8, { duration: 300 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      className="w-1 bg-primary-blue rounded-full"
      style={animatedStyle}
    />
  );
}

import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { formatCurrency, formatCompactNumber } from '@/utils/format';

interface BudgetProgressBarProps {
  spent: number;
  budget: number;
  currency?: string;
  showDetails?: boolean;
}

export function BudgetProgressBar({
  spent,
  budget,
  currency = 'VND',
  showDetails = true,
}: BudgetProgressBarProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = Math.max(budget - spent, 0);
  const isExceeded = spent > budget;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 1000 });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  // Color coding
  const getColor = () => {
    if (isExceeded) return 'bg-red-500';
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (isExceeded) return 'text-red-600';
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <View className="w-full">
      {/* Progress bar */}
      <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <Animated.View
          className={`h-full ${getColor()}`}
          style={animatedStyle}
        />
      </View>

      {/* Details */}
      {showDetails && (
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500">Spent</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatCompactNumber(spent)}
            </Text>
          </View>

          <View className="items-center">
            <Text className={`text-lg font-bold ${getTextColor()}`}>
              {percentage.toFixed(0)}%
            </Text>
            {isExceeded && (
              <Text className="text-xs text-red-500 font-medium">
                Exceeded
              </Text>
            )}
          </View>

          <View className="items-end">
            <Text className="text-xs text-gray-500">Budget</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatCompactNumber(budget)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

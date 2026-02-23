import { View, Text } from 'react-native';

interface PieChartData {
  name: string;
  amount: number;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  colors?: string[];
}

export function PieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500">No data available</Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      <View className="bg-gray-50 rounded-2xl p-4 mb-4">
        <Text className="text-center text-gray-600 mb-2">
          Spending Breakdown
        </Text>
        <Text className="text-center text-sm text-gray-500">
          (Chart visualization coming soon)
        </Text>
      </View>

      {/* List View */}
      <View className="w-full">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center mb-3 pb-3 border-b border-gray-100">
            <View className="w-2 h-2 rounded-full bg-primary-blue mr-3" />
            <Text className="flex-1 text-sm text-gray-700">{item.name}</Text>
            <Text className="text-sm font-semibold text-gray-900 mr-2">
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

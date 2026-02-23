import { View, Text } from 'react-native';

interface BarChartData {
  month: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  data: BarChartData[];
}

export function BarChart({ data }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500">No data available</Text>
      </View>
    );
  }

  return (
    <View>
      <View className="bg-gray-50 rounded-2xl p-4 mb-4">
        <Text className="text-center text-gray-600 mb-2">
          Monthly Trends
        </Text>
        <Text className="text-center text-sm text-gray-500">
          (Chart visualization coming soon)
        </Text>
      </View>

      {/* List View */}
      <View className="gap-3">
        {data.map((item, index) => (
          <View key={index} className="bg-white rounded-xl p-3 border border-gray-100">
            <Text className="font-semibold text-gray-900 mb-2">{item.month}</Text>
            <View className="flex-row justify-between mb-1">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded mr-2" />
                <Text className="text-sm text-gray-600">Income</Text>
              </View>
              <Text className="text-sm font-semibold text-green-600">
                {item.income.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-500 rounded mr-2" />
                <Text className="text-sm text-gray-600">Expense</Text>
              </View>
              <Text className="text-sm font-semibold text-red-600">
                {item.expense.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

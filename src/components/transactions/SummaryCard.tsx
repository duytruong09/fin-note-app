import { View, Text } from 'react-native';
import { formatCurrency, formatCompactNumber } from '@/utils/format';

interface SummaryCardProps {
  title: string;
  amount: number;
  currency?: string;
  icon: string;
  variant: 'income' | 'expense' | 'balance';
  count?: number;
}

export function SummaryCard({
  title,
  amount,
  currency = 'VND',
  icon,
  variant,
  count,
}: SummaryCardProps) {
  const variantStyles = {
    income: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      text: 'text-green-600',
    },
    expense: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      text: 'text-red-600',
    },
    balance: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      text: 'text-blue-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <View className={`${styles.bg} rounded-2xl p-4 flex-1`}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-600 text-sm font-medium">{title}</Text>
        <View className={`${styles.iconBg} w-8 h-8 rounded-full items-center justify-center`}>
          <Text className="text-lg">{icon}</Text>
        </View>
      </View>

      {/* Amount */}
      <Text className={`${styles.text} text-2xl font-bold mb-1`} numberOfLines={1}>
        {formatCompactNumber(amount)}
      </Text>

      {/* Count */}
      {count !== undefined && (
        <Text className="text-gray-500 text-xs">
          {count} transaction{count !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
}

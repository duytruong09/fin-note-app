import { View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import { Badge } from '@/components/common/Badge';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 flex-row items-center border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Category Icon */}
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        <Text className="text-2xl">{transaction.category?.icon || '💰'}</Text>
      </View>

      {/* Details */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {transaction.category?.name || 'Uncategorized'}
        </Text>
        {transaction.description && (
          <Text className="text-sm text-gray-500 mb-1" numberOfLines={1}>
            {transaction.description}
          </Text>
        )}
        <View className="flex-row items-center gap-2">
          {transaction.paymentMethod && (
            <Badge
              label={transaction.paymentMethod}
              variant="default"
              size="sm"
            />
          )}
          {transaction.isVoiceCreated && (
            <Badge
              label="🎤 Voice"
              variant="info"
              size="sm"
            />
          )}
        </View>
      </View>

      {/* Amount */}
      <View className="items-end">
        <Text
          className={`text-lg font-bold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(Number(transaction.amount), transaction.currency)}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          {formatDate(transaction.transactionDate, 'MMM dd')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

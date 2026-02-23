import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { CategoryButton } from '@/components/transactions/CategoryButton';
import { AmountInput } from '@/components/transactions/AmountInput';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { categoriesService } from '@/services/categories.service';
import { transactionsService } from '@/services/transactions.service';
import { TransactionType, PaymentMethod } from '@/types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [transactionDate, setTransactionDate] = useState(new Date());

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // Create transaction mutation
  const createMutation = useMutation({
    mutationFn: transactionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      router.back();
    },
  });

  const filteredCategories = categories?.filter((c) => c.type === type) || [];

  const handleSave = async () => {
    if (amount <= 0) {
      alert('Please enter an amount');
      return;
    }

    if (!selectedCategoryId) {
      alert('Please select a category');
      return;
    }

    await createMutation.mutateAsync({
      amount,
      type,
      categoryId: selectedCategoryId,
      description: description.trim() || undefined,
      paymentMethod,
      transactionDate: transactionDate.toISOString(),
    });
  };

  const paymentMethods: PaymentMethod[] = ['CASH', 'CARD', 'BANK_TRANSFER', 'EWALLET'];
  const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: '💵 Cash',
    CARD: '💳 Card',
    BANK_TRANSFER: '🏦 Transfer',
    EWALLET: '📱 E-Wallet',
  };

  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-blue text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Add Transaction
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={createMutation.isPending}
          >
            <Text className="text-primary-blue text-lg font-semibold">
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Type Selector */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => {
                setType('EXPENSE');
                setSelectedCategoryId(null);
              }}
              className={`flex-1 py-4 rounded-xl items-center ${
                type === 'EXPENSE' ? 'bg-red-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-semibold ${
                  type === 'EXPENSE' ? 'text-white' : 'text-gray-700'
                }`}
              >
                💸 Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setType('INCOME');
                setSelectedCategoryId(null);
              }}
              className={`flex-1 py-4 rounded-xl items-center ${
                type === 'INCOME' ? 'bg-green-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-semibold ${
                  type === 'INCOME' ? 'text-white' : 'text-gray-700'
                }`}
              >
                💰 Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Category
            </Text>
            {isLoading ? (
              <Text className="text-gray-500">Loading categories...</Text>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {filteredCategories.map((category) => (
                  <View key={category.id} className="w-[48%]">
                    <CategoryButton
                      icon={category.icon || '📦'}
                      name={category.name}
                      isSelected={selectedCategoryId === category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Amount
            </Text>
            <AmountInput value={amount} onChange={setAmount} />
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Payment Method
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-full ${
                    paymentMethod === method
                      ? 'bg-primary-blue'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      paymentMethod === method ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {paymentMethodLabels[method]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Date
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setTransactionDate(new Date())}
                className={`px-4 py-2 rounded-full ${
                  transactionDate.toDateString() === new Date().toDateString()
                    ? 'bg-primary-blue'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-medium ${
                    transactionDate.toDateString() === new Date().toDateString()
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setTransactionDate(yesterday);
                }}
                className={`px-4 py-2 rounded-full ${
                  transactionDate.toDateString() ===
                  new Date(Date.now() - 86400000).toDateString()
                    ? 'bg-primary-blue'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-medium ${
                    transactionDate.toDateString() ===
                    new Date(Date.now() - 86400000).toDateString()
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  Yesterday
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Input
              label="Notes (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note..."
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { CategoryButton } from '@/components/transactions/CategoryButton';
import { AmountInput } from '@/components/transactions/AmountInput';
import { Button } from '@/components/common/Button';
import { categoriesService } from '@/services/categories.service';
import { budgetsService } from '@/services/budgets.service';
import { BudgetPeriod } from '@/types';
import { startOfMonth, endOfMonth, addMonths } from 'date-fns';

export default function AddBudgetScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY');
  const [alertThreshold, setAlertThreshold] = useState(0.8);

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // Create budget mutation
  const createMutation = useMutation({
    mutationFn: budgetsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets-current'] });
      router.back();
    },
  });

  const handleSave = async () => {
    if (amount <= 0) {
      alert('Please enter an amount');
      return;
    }

    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(addMonths(now, period === 'MONTHLY' ? 1 : 0));

    await createMutation.mutateAsync({
      amount,
      period,
      categoryId: selectedCategoryId || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      alertThreshold,
      isActive: true,
    });
  };

  const expenseCategories = categories?.filter((c) => c.type === 'EXPENSE') || [];

  const periods: BudgetPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  const periodLabels: Record<BudgetPeriod, string> = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly',
  };

  const thresholds = [0.7, 0.8, 0.9];

  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-blue text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            New Budget
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
          {/* Category Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Category (Optional)
            </Text>
            <Text className="text-sm text-gray-600 mb-3">
              Leave empty for total budget
            </Text>
            {isLoading ? (
              <Text className="text-gray-500">Loading categories...</Text>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                <View className="w-[48%]">
                  <CategoryButton
                    icon="💰"
                    name="All Categories"
                    isSelected={selectedCategoryId === null}
                    onPress={() => setSelectedCategoryId(null)}
                  />
                </View>
                {expenseCategories.map((category) => (
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
              Budget Amount
            </Text>
            <AmountInput value={amount} onChange={setAmount} />
          </View>

          {/* Period */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Period
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {periods.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-full ${
                    period === p ? 'bg-primary-blue' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      period === p ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {periodLabels[p]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Alert Threshold */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Alert Threshold
            </Text>
            <Text className="text-sm text-gray-600 mb-3">
              Get notified when you reach this percentage
            </Text>
            <View className="flex-row gap-3">
              {thresholds.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setAlertThreshold(t)}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    alertThreshold === t ? 'bg-primary-blue' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      alertThreshold === t ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {(t * 100).toFixed(0)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

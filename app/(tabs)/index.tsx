import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SummaryCard } from '@/components/transactions/SummaryCard';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { transactionsService } from '@/services/transactions.service';
import { budgetsService } from '@/services/budgets.service';
import { formatDate } from '@/utils/format';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export default function DashboardScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);

  // Fetch summary
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['transaction-summary', startDate.toISOString(), endDate.toISOString()],
    queryFn: () =>
      transactionsService.getSummary({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
  });

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions', startDate.toISOString(), endDate.toISOString()],
    queryFn: () =>
      transactionsService.getAll({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        perPage: 5,
      }),
  });

  // Fetch current budgets
  const { data: budgets, isLoading: budgetsLoading, refetch: refetchBudgets } = useQuery({
    queryKey: ['budgets-current'],
    queryFn: () => budgetsService.getCurrentBudgets(),
  });

  const handleRefresh = async () => {
    await Promise.all([refetchSummary(), refetchTransactions(), refetchBudgets()]);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  };

  const isLoading = summaryLoading || transactionsLoading || budgetsLoading;

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Loading fullScreen message="Loading dashboard..." />
      </SafeAreaWrapper>
    );
  }

  const exceededBudgets = budgets?.filter((b) => b.shouldAlert) || [];

  return (
    <SafeAreaWrapper>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="p-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Dashboard
          </Text>
          <Text className="text-gray-600">
            Track your expenses and budget
          </Text>
        </View>

        {/* Month Selector */}
        <View className="flex-row items-center justify-between px-6 mb-6">
          <TouchableOpacity
            onPress={() => setSelectedDate(subMonths(selectedDate, 1))}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-gray-900">
            {formatDate(selectedDate, 'MMMM yyyy')}
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedDate(addMonths(selectedDate, 1))}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Text className="text-xl">→</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3 mb-3">
            <SummaryCard
              title="Income"
              amount={summary?.income.total || 0}
              icon="💰"
              variant="income"
              count={summary?.income.count}
            />
            <SummaryCard
              title="Expense"
              amount={summary?.expense.total || 0}
              icon="💸"
              variant="expense"
              count={summary?.expense.count}
            />
          </View>
          <SummaryCard
            title="Balance"
            amount={summary?.balance || 0}
            icon="📊"
            variant="balance"
          />
        </View>

        {/* Budget Alerts */}
        {exceededBudgets.length > 0 && (
          <View className="px-6 mb-6">
            <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-xl mr-2">⚠️</Text>
                <Text className="text-yellow-800 font-semibold flex-1">
                  Budget Alert
                </Text>
              </View>
              <Text className="text-yellow-700 text-sm">
                {exceededBudgets.length} budget{exceededBudgets.length > 1 ? 's' : ''} {exceededBudgets.length > 1 ? 'have' : 'has'} reached the alert threshold
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/reports')}
                className="mt-2"
              >
                <Text className="text-yellow-800 font-semibold text-sm">
                  View Budgets →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <Button
              title="Voice Input"
              onPress={() => router.push('/(tabs)/voice')}
              variant="primary"
              icon={<Text className="text-xl">🎤</Text>}
              className="flex-1"
            />
            <Button
              title="Manual Entry"
              onPress={() => router.push('/(modals)/add-transaction')}
              variant="outline"
              icon={<Text className="text-xl">➕</Text>}
              className="flex-1"
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text className="text-primary-blue font-semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {transactionsData?.data && transactionsData.data.length > 0 ? (
            <View className="gap-3">
              {transactionsData.data.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => {
                    // TODO: Navigate to transaction detail
                  }}
                />
              ))}
            </View>
          ) : (
            <View className="bg-gray-50 rounded-2xl p-8 items-center">
              <Text className="text-6xl mb-4">📝</Text>
              <Text className="text-gray-600 text-center mb-2">
                No transactions yet
              </Text>
              <Text className="text-gray-500 text-sm text-center">
                Start tracking by adding your first transaction
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

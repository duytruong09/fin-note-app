import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Card } from '@/components/common/Card';
import { PieChart } from '@/components/reports/PieChart';
import { BarChart } from '@/components/reports/BarChart';
import { Loading } from '@/components/common/Loading';
import { reportsService } from '@/services/reports.service';
import { budgetsService } from '@/services/budgets.service';
import { BudgetProgressBar } from '@/components/budgets/BudgetProgressBar';
import { formatCurrency } from '@/utils/format';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function ReportsScreen() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [groupBy, setGroupBy] = useState<'category' | 'paymentMethod'>('category');

  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  // Fetch spending breakdown
  const { data: breakdown, isLoading: breakdownLoading } = useQuery({
    queryKey: ['spending-breakdown', startDate.toISOString(), endDate.toISOString(), groupBy],
    queryFn: () =>
      reportsService.getSpendingBreakdown({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy,
      }),
  });

  // Fetch monthly summary
  const { data: monthlySummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['monthly-summary', selectedYear],
    queryFn: () => reportsService.getMonthlySummary(selectedYear),
  });

  // Fetch budgets
  const { data: budgets, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets-current'],
    queryFn: () => budgetsService.getCurrentBudgets(),
  });

  const isLoading = breakdownLoading || summaryLoading || budgetsLoading;

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Loading fullScreen message="Loading reports..." />
      </SafeAreaWrapper>
    );
  }

  const chartData = groupBy === 'category'
    ? breakdown?.byCategory || []
    : breakdown?.byPaymentMethod || [];

  const barChartData = monthlySummary?.slice(0, 6).map((item) => ({
    month: item.monthName.slice(0, 3),
    income: item.income,
    expense: item.expense,
  })) || [];

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Reports
          </Text>
          <Text className="text-gray-600">
            Analyze your spending patterns
          </Text>
        </View>

        {/* Spending Breakdown */}
        <View className="px-6 mb-6">
          <Card>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Spending Breakdown
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setGroupBy('category')}
                  className={`px-3 py-1.5 rounded-full ${
                    groupBy === 'category' ? 'bg-primary-blue' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      groupBy === 'category' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    Category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGroupBy('paymentMethod')}
                  className={`px-3 py-1.5 rounded-full ${
                    groupBy === 'paymentMethod' ? 'bg-primary-blue' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      groupBy === 'paymentMethod' ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {chartData.length > 0 ? (
              <PieChart data={chartData} />
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500">No spending data this month</Text>
              </View>
            )}

            <View className="mt-4 pt-4 border-t border-gray-200">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total</Text>
                <Text className="text-xl font-bold text-gray-900">
                  {formatCurrency(breakdown?.total || 0)}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm mt-1">
                {breakdown?.transactionCount || 0} transactions
              </Text>
            </View>
          </Card>
        </View>

        {/* Monthly Trend */}
        <View className="px-6 mb-6">
          <Card>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Monthly Trend
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedYear(selectedYear - 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Text className="text-gray-700">←</Text>
                </TouchableOpacity>
                <Text className="text-gray-900 font-semibold px-2">
                  {selectedYear}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedYear(selectedYear + 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Text className="text-gray-700">→</Text>
                </TouchableOpacity>
              </View>
            </View>

            <BarChart data={barChartData} />
          </Card>
        </View>

        {/* Budgets */}
        {budgets && budgets.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Current Budgets
            </Text>
            <View className="gap-3">
              {budgets.map((budget) => (
                <Card key={budget.budget.id}>
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {budget.budget.category?.name || 'Total Budget'}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {budget.budget.period}
                      </Text>
                    </View>
                  </View>
                  <BudgetProgressBar
                    spent={budget.spent}
                    budget={Number(budget.budget.amount)}
                    showDetails
                  />
                </Card>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

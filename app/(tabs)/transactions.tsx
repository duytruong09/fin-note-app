import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { Loading } from '@/components/common/Loading';
import { transactionsService } from '@/services/transactions.service';
import { formatRelativeDate } from '@/utils/format';
import { Transaction } from '@/types';

export default function TransactionsScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['transactions-list', filterType],
    queryFn: ({ pageParam = 1 }) =>
      transactionsService.getAll({
        page: pageParam,
        perPage: 20,
        type: filterType === 'ALL' ? undefined : filterType,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta.page && lastPage.meta.totalPages) {
        return lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1
          : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Group transactions by date
  const groupedTransactions: { date: string; transactions: Transaction[] }[] = [];

  data?.pages.forEach((page) => {
    page.data.forEach((transaction) => {
      const dateKey = formatRelativeDate(transaction.transactionDate);
      let group = groupedTransactions.find((g) => g.date === dateKey);

      if (!group) {
        group = { date: dateKey, transactions: [] };
        groupedTransactions.push(group);
      }

      group.transactions.push(transaction);
    });
  });

  const renderItem = ({ item }: { item: { date: string; transactions: Transaction[] } }) => (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-gray-500 mb-3 px-6">
        {item.date}
      </Text>
      <View className="gap-3 px-6">
        {item.transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onPress={() => {
              // TODO: Navigate to transaction detail
            }}
          />
        ))}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <Loading message="Loading more..." />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-6xl mb-4">📝</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          No Transactions
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          {filterType === 'ALL'
            ? 'Start tracking by adding your first transaction'
            : `No ${filterType.toLowerCase()} transactions found`}
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(modals)/add-transaction')}
          className="bg-primary-blue px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Add Transaction</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Loading fullScreen message="Loading transactions..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-gray-900">
              Transactions
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(modals)/add-transaction')}
              className="bg-primary-blue w-10 h-10 rounded-full items-center justify-center"
            >
              <Text className="text-white text-2xl">+</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          <View className="flex-row gap-2">
            {(['ALL', 'INCOME', 'EXPENSE'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full ${
                  filterType === type ? 'bg-primary-blue' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-medium ${
                    filterType === type ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type === 'INCOME' ? '💰 Income' : '💸 Expense'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <FlatList
          data={groupedTransactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={groupedTransactions.length === 0 ? { flex: 1 } : undefined}
        />
      </View>
    </SafeAreaWrapper>
  );
}

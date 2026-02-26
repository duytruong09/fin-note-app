import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { categoriesService } from '@/services/categories.service';
import { transactionsService } from '@/services/transactions.service';
import { TransactionType } from '@/types';

export default function AddTransactionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
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
    const amountNum = parseFloat(amount.replace(/[^0-9]/g, ''));

    if (amountNum <= 0) {
      alert('Vui lòng nhập số tiền');
      return;
    }

    if (!selectedCategoryId) {
      alert('Vui lòng chọn danh mục');
      return;
    }

    await createMutation.mutateAsync({
      amount: amountNum,
      type,
      categoryId: selectedCategoryId,
      description: description.trim() || undefined,
      paymentMethod: 'CASH',
      transactionDate: transactionDate.toISOString(),
    });
  };

  const handlePrevDay = () => {
    setTransactionDate(addDays(transactionDate, -1));
  };

  const handleNextDay = () => {
    setTransactionDate(addDays(transactionDate, 1));
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy '('EEE')'", { locale: vi });
  };

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except for the first character
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue || '0');
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return '0';
    return num.toLocaleString('vi-VN');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Type Toggle */}
      <View className="pt-12 pb-4 px-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row bg-gray-100 rounded-full p-1">
            <TouchableOpacity
              onPress={() => {
                setType('EXPENSE');
                setSelectedCategoryId(null);
              }}
              className={`px-6 py-2 rounded-full ${
                type === 'EXPENSE' ? 'bg-gray-900' : ''
              }`}
            >
              <Text
                className={`font-semibold ${
                  type === 'EXPENSE' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Tiền chi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setType('INCOME');
                setSelectedCategoryId(null);
              }}
              className={`px-6 py-2 rounded-full ${
                type === 'INCOME' ? 'bg-gray-900' : ''
              }`}
            >
              <Text
                className={`font-semibold ${
                  type === 'INCOME' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Tiền thu
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-gray-400 text-xl">✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Date Picker */}
        <View className="px-6 py-4 border-b border-gray-100">
          <Text className="text-gray-500 text-sm mb-2">Ngày</Text>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handlePrevDay} className="w-8 h-8 items-center justify-center">
              <Text className="text-gray-600 text-xl">←</Text>
            </TouchableOpacity>
            <Text className="text-gray-900 font-medium">{formatDate(transactionDate)}</Text>
            <TouchableOpacity onPress={handleNextDay} className="w-8 h-8 items-center justify-center">
              <Text className="text-gray-600 text-xl">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Note */}
        <View className="px-6 py-4 border-b border-gray-100">
          <Text className="text-gray-500 text-sm mb-2">Ghi chú</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Chưa nhập vào"
            placeholderTextColor="#9CA3AF"
            className="text-gray-900 text-base"
          />
        </View>

        {/* Amount */}
        <View className="px-6 py-6 border-b border-gray-100">
          <Text className="text-gray-500 text-sm mb-3">
            {type === 'EXPENSE' ? 'Tiền chi' : 'Tiền thu'}
          </Text>
          <View className="flex-row items-center justify-between">
            <TextInput
              value={formatAmount(amount)}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              className="text-5xl font-light text-gray-900 flex-1"
              placeholder="0"
            />
            <Text className="text-3xl font-light text-gray-400 ml-2">đ</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 py-6">
          <Text className="text-gray-500 text-sm mb-4">Danh mục</Text>
          {isLoading ? (
            <Text className="text-gray-400">Đang tải danh mục...</Text>
          ) : (
            <View className="flex-row flex-wrap">
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                  className={`w-[30%] items-center mb-6 ${
                    selectedCategoryId === category.id ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    marginRight: '3.33%',
                  }}
                >
                  <View
                    className={`w-14 h-14 rounded-2xl items-center justify-center mb-2 ${
                      selectedCategoryId === category.id
                        ? 'border-2 border-cyan-400'
                        : 'border border-gray-200'
                    }`}
                    style={{
                      backgroundColor: category.color || '#F3F4F6',
                    }}
                  >
                    <Text className="text-2xl">{category.icon || '📦'}</Text>
                  </View>
                  <Text
                    className={`text-xs text-center ${
                      selectedCategoryId === category.id
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-600'
                    }`}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Edit Categories Button */}
              <TouchableOpacity
                onPress={() => {/* TODO: Navigate to edit categories */}}
                className="w-[30%] items-center mb-6 opacity-60"
                style={{
                  marginRight: '3.33%',
                }}
              >
                <View className="w-14 h-14 rounded-2xl items-center justify-center mb-2 border border-gray-200 bg-gray-50">
                  <Text className="text-2xl">✏️</Text>
                </View>
                <Text className="text-xs text-center text-gray-600">
                  Chỉnh sửa {'>'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 py-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSave}
          disabled={createMutation.isPending}
          className={`py-4 rounded-2xl items-center ${
            createMutation.isPending ? 'bg-cyan-300' : 'bg-cyan-400'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {createMutation.isPending
              ? 'Đang lưu...'
              : type === 'EXPENSE'
              ? 'Nhập khoản chi'
              : 'Nhập khoản thu'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

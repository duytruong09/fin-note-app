import { apiClient } from './api-client';
import { ApiResponse, Transaction, TransactionType, PaymentMethod } from '@/types';

interface CreateTransactionDto {
  amount: number;
  currency?: string;
  type: TransactionType;
  categoryId?: string;
  description?: string;
  transactionDate?: string;
  paymentMethod?: PaymentMethod;
  location?: string;
  notes?: string;
}

interface TransactionFilters {
  page?: number;
  perPage?: number;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  isVoiceCreated?: boolean;
}

interface TransactionSummary {
  income: {
    total: number;
    count: number;
  };
  expense: {
    total: number;
    count: number;
  };
  balance: number;
}

export const transactionsService = {
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      '/transactions',
      data
    );
    return response.data.data;
  },

  async getAll(filters?: TransactionFilters): Promise<ApiResponse<Transaction[]>> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      '/transactions',
      { params: filters }
    );
    return response.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      `/transactions/${id}`
    );
    return response.data.data;
  },

  async getSummary(filters?: Pick<TransactionFilters, 'startDate' | 'endDate' | 'categoryId'>): Promise<TransactionSummary> {
    const response = await apiClient.get<ApiResponse<TransactionSummary>>(
      '/transactions/summary',
      { params: filters }
    );
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateTransactionDto>): Promise<Transaction> {
    const response = await apiClient.patch<ApiResponse<Transaction>>(
      `/transactions/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },
};

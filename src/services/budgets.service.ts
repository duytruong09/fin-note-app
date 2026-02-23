import { apiClient } from './api-client';
import { ApiResponse, Budget, BudgetStatus, BudgetPeriod } from '@/types';

interface CreateBudgetDto {
  amount: number;
  currency?: string;
  period: BudgetPeriod;
  categoryId?: string;
  startDate: string;
  endDate: string;
  alertThreshold?: number;
  isActive?: boolean;
}

interface BudgetFilters {
  categoryId?: string;
  period?: BudgetPeriod;
  isActive?: boolean;
}

export const budgetsService = {
  async create(data: CreateBudgetDto): Promise<Budget> {
    const response = await apiClient.post<ApiResponse<Budget>>(
      '/budgets',
      data
    );
    return response.data.data;
  },

  async getAll(filters?: BudgetFilters): Promise<Budget[]> {
    const response = await apiClient.get<ApiResponse<Budget[]>>(
      '/budgets',
      { params: filters }
    );
    return response.data.data;
  },

  async getById(id: string): Promise<Budget> {
    const response = await apiClient.get<ApiResponse<Budget>>(
      `/budgets/${id}`
    );
    return response.data.data;
  },

  async getStatus(id: string): Promise<BudgetStatus> {
    const response = await apiClient.get<ApiResponse<BudgetStatus>>(
      `/budgets/${id}/status`
    );
    return response.data.data;
  },

  async getCurrentBudgets(): Promise<BudgetStatus[]> {
    const response = await apiClient.get<ApiResponse<BudgetStatus[]>>(
      '/budgets/current/all'
    );
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateBudgetDto>): Promise<Budget> {
    const response = await apiClient.patch<ApiResponse<Budget>>(
      `/budgets/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/budgets/${id}`);
  },
};

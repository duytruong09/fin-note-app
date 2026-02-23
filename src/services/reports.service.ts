import { apiClient } from './api-client';
import { ApiResponse } from '@/types';

interface SpendingBreakdownItem {
  name: string;
  amount: number;
  percentage: number;
  count: number;
}

interface SpendingBreakdownResponse {
  byCategory?: SpendingBreakdownItem[];
  byPaymentMethod?: SpendingBreakdownItem[];
  total: number;
  transactionCount: number;
}

interface MonthlySummaryItem {
  month: number;
  monthName: string;
  year: number;
  income: number;
  expense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  groupBy?: 'category' | 'paymentMethod';
  year?: number;
}

export const reportsService = {
  async getSpendingBreakdown(filters?: ReportFilters): Promise<SpendingBreakdownResponse> {
    const response = await apiClient.get<ApiResponse<SpendingBreakdownResponse>>(
      '/reports/spending-breakdown',
      { params: filters }
    );
    return response.data.data;
  },

  async getMonthlySummary(year: number): Promise<MonthlySummaryItem[]> {
    const response = await apiClient.get<ApiResponse<MonthlySummaryItem[]>>(
      '/reports/monthly-summary',
      { params: { year } }
    );
    return response.data.data;
  },
};

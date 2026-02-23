import { apiClient } from './api-client';
import { ApiResponse, Category } from '@/types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },
};

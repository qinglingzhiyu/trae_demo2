import { apiClient } from './config';
import { ApiResponse, PaginatedResponse } from '@/types';

// 账号数据类型
export interface Account {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE';
  status: 'ACTIVE' | 'INACTIVE';
  department?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    name: string;
  };
}

export interface AccountFormData {
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE';
  department?: string;
}

export interface AccountStatistics {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    doctor: number;
    nurse: number;
  };
}

export interface AccountQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// 账号管理API
export const accountsApi = {
  // 获取账号列表
  getAccounts: async (params?: AccountQueryParams): Promise<PaginatedResponse<Account>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiClient.get(`/accounts?${queryParams.toString()}`);
  },

  // 获取账号统计
  getStatistics: async (): Promise<AccountStatistics> => {
    return apiClient.get('/accounts/statistics');
  },

  // 获取单个账号详情
  getAccount: async (id: number): Promise<Account> => {
    return apiClient.get(`/accounts/${id}`);
  },

  // 创建账号
  createAccount: async (data: AccountFormData): Promise<Account> => {
    return apiClient.post('/accounts', data);
  },

  // 更新账号
  updateAccount: async (id: number, data: Partial<AccountFormData>): Promise<Account> => {
    return apiClient.put(`/accounts/${id}`, data);
  },

  // 切换账号状态
  toggleStatus: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/accounts/${id}/toggle-status`);
  },

  // 重置密码
  resetPassword: async (id: number, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/accounts/${id}/reset-password`, { newPassword });
  },

  // 删除账号
  deleteAccount: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/accounts/${id}/delete`);
  },

  // 获取角色列表
  getRoles: async (): Promise<string[]> => {
    return apiClient.get('/accounts/roles');
  },
};

export default accountsApi;
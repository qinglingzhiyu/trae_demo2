import { apiClient } from './config';
import { User, LoginRequest, LoginResponse, ApiResponse, PaginatedResponse, QueryParams } from '@/types';

// 用户认证API
export const authApi = {
  // 登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', data);
  },

  // 获取当前用户信息
  getProfile: async (): Promise<User> => {
    return apiClient.get('/auth/profile');
  },

  // 登出
  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },
};

// 用户管理API
export const usersApi = {
  // 获取用户列表
  getUsers: async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    return apiClient.get('/users', { params });
  },

  // 获取用户详情
  getUser: async (id: number): Promise<User> => {
    return apiClient.get(`/users/${id}`);
  },

  // 创建用户
  createUser: async (data: Partial<User>): Promise<User> => {
    return apiClient.post('/users', data);
  },

  // 更新用户
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    return apiClient.post(`/users/${id}/update`, data);
  },

  // 删除用户
  deleteUser: async (id: number): Promise<void> => {
    return apiClient.post(`/users/${id}/delete`);
  },

  // 获取用户统计信息
  getUserStats: async (): Promise<any> => {
    return apiClient.get('/users/statistics');
  },
};
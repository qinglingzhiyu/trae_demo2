import axios from 'axios';
import type { User, Patient, Order } from '@/types';
import { storage } from '@/utils';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      storage.remove('token');
      storage.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (data: { phone: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { phone: string; password: string; name: string }) => 
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// 用户管理API
export const userAPI = {
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/users', { params }),
  getUserById: (id: number) => api.get(`/users/${id}`),
  createUser: (data: Partial<User>) => api.post('/users', data),
  updateUser: (id: number, data: Partial<User>) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/statistics'),
};

// 患者管理API
export const patientAPI = {
  getPatients: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/patients', { params }),
  getPatientById: (id: number) => api.get(`/patients/${id}`),
  createPatient: (data: Partial<Patient>) => api.post('/patients', data),
  updatePatient: (id: number, data: Partial<Patient>) => api.put(`/patients/${id}`, data),
  deletePatient: (id: number) => api.delete(`/patients/${id}`),
  getPatientStats: () => api.get('/patients/statistics'),
};

// 订单管理API
export const orderAPI = {
  getOrders: (params?: { page?: number; limit?: number; search?: string; status?: string }) => 
    api.get('/orders', { params }),
  getOrderById: (id: number) => api.get(`/orders/${id}`),
  createOrder: (data: Partial<Order>) => api.post('/orders', data),
  updateOrder: (id: number, data: Partial<Order>) => api.put(`/orders/${id}`, data),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
  getOrderStats: () => api.get('/orders/statistics'),
  getRecentOrders: (limit?: number) => api.get('/orders/recent', { params: { limit } }),
};

// Dashboard统计API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: (limit: number = 10) => api.get('/dashboard/recent-orders', { params: { limit } }),
};

export default api;
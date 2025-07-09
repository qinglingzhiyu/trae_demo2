import { apiClient } from './config';
import { Order, PaginatedResponse, QueryParams } from '@/types';

// 订单管理API
export const ordersApi = {
  // 获取订单列表
  getOrders: async (params?: QueryParams): Promise<PaginatedResponse<Order>> => {
    return apiClient.get('/orders', { params });
  },

  // 获取订单详情
  getOrder: async (id: number): Promise<Order> => {
    return apiClient.get(`/orders/${id}`);
  },

  // 创建订单
  createOrder: async (data: Partial<Order>): Promise<Order> => {
    return apiClient.post('/orders', data);
  },

  // 更新订单
  updateOrder: async (id: number, data: Partial<Order>): Promise<Order> => {
    return apiClient.post(`/orders/${id}/update`, data);
  },

  // 删除订单
  deleteOrder: async (id: number): Promise<void> => {
    return apiClient.delete(`/orders/${id}`);
  },

  // 获取订单统计信息
  getOrderStats: async (): Promise<any> => {
    return apiClient.get('/orders/stats');
  },
};
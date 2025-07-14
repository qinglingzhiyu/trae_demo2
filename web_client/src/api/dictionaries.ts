import { apiClient } from './config';
import { ApiResponse, PaginatedResponse, QueryParams } from '@/types';

// 字典类型接口
export interface DictionaryType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  sort?: number;
  createdAt: Date;
  updatedAt: Date;
  items?: DictionaryItem[];
}

// 字典项接口
export interface DictionaryItem {
  id: number;
  typeId: number;
  label: string;
  value: string;
  description?: string;
  sort?: number;
  extra?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  type?: DictionaryType;
}

// 创建字典类型请求
export interface CreateDictionaryTypeRequest {
  type: string; // 字典类型代码
  name: string; // 字典类型名称
  description?: string; // 字典类型描述
}

// 更新字典类型请求
export interface UpdateDictionaryTypeRequest {
  name?: string;
  description?: string;
}

// 创建字典项请求
export interface CreateDictionaryItemRequest {
  typeId: number; // 字典类型ID
  label: string; // 字典项标签
  value: string; // 字典项值
  description?: string; // 字典项描述
  sort?: number; // 排序
  extra?: Record<string, unknown>; // 扩展属性
}

// 更新字典项请求
export interface UpdateDictionaryItemRequest {
  label?: string;
  value?: string;
  description?: string;
  sort?: number;
  extra?: Record<string, unknown>;
}

// 字典管理API
export const dictionariesApi = {
  // 字典类型管理
  
  // 创建字典类型
  createDictionaryType: async (data: CreateDictionaryTypeRequest): Promise<DictionaryType> => {
    return apiClient.post('/dictionaries', data);
  },

  // 获取字典类型列表
  getDictionaryTypes: async (params?: QueryParams): Promise<PaginatedResponse<DictionaryType>> => {
    return apiClient.get('/dictionaries', { params });
  },

  // 获取所有字典类型（不分页）
  getAllDictionaryTypes: async (): Promise<DictionaryType[]> => {
    return apiClient.get('/dictionaries/types/all');
  },

  // 获取字典类型详情
  getDictionaryType: async (id: number): Promise<DictionaryType> => {
    return apiClient.get(`/dictionaries/${id}`);
  },

  // 更新字典类型
  updateDictionaryType: async (id: number, data: UpdateDictionaryTypeRequest): Promise<DictionaryType> => {
    return apiClient.post(`/dictionaries/${id}/update`, data);
  },

  // 删除字典类型
  deleteDictionaryType: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/dictionaries/${id}/delete`);
  },

  // 字典项管理
  
  // 创建字典项
  createDictionaryItem: async (data: CreateDictionaryItemRequest): Promise<DictionaryItem> => {
    return apiClient.post('/dictionaries/items', data);
  },

  // 获取字典项列表
  getDictionaryItems: async (params?: QueryParams): Promise<PaginatedResponse<DictionaryItem>> => {
    return apiClient.get('/dictionaries/items', { params });
  },

  // 根据字典类型获取字典项
  getDictionaryItemsByType: async (type: string): Promise<DictionaryItem[]> => {
    return apiClient.get(`/dictionaries/items/by-type/${type}`);
  },

  // 获取字典项详情
  getDictionaryItem: async (id: number): Promise<DictionaryItem> => {
    return apiClient.get(`/dictionaries/items/${id}`);
  },

  // 更新字典项
  updateDictionaryItem: async (id: number, data: UpdateDictionaryItemRequest): Promise<DictionaryItem> => {
    return apiClient.post(`/dictionaries/items/${id}/update`, data);
  },

  // 删除字典项
  deleteDictionaryItem: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/dictionaries/items/${id}/delete`);
  },

  // 批量创建字典项
  batchCreateDictionaryItems: async (items: CreateDictionaryItemRequest[]): Promise<ApiResponse<void>> => {
    return apiClient.post('/dictionaries/items/batch', items);
  },

  // 导出字典数据
  exportDictionary: async (type: string): Promise<Blob> => {
    return apiClient.get(`/dictionaries/export/${type}`);
  },
};
import { apiClient } from './config';
import { Patient, PaginatedResponse, QueryParams } from '@/types';

// 就诊人管理API
export const patientsApi = {
  // 获取就诊人列表
  getPatients: async (params?: QueryParams): Promise<PaginatedResponse<Patient>> => {
    return apiClient.get('/patients', { params });
  },

  // 获取就诊人详情
  getPatient: async (id: number): Promise<Patient> => {
    return apiClient.get(`/patients/${id}`);
  },

  // 创建就诊人
  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    return apiClient.post('/patients', data);
  },

  // 更新就诊人
  updatePatient: async (id: number, data: Partial<Patient>): Promise<Patient> => {
    return apiClient.post(`/patients/${id}/update`, data);
  },

  // 删除就诊人
  deletePatient: async (id: number): Promise<void> => {
    return apiClient.delete(`/patients/${id}`);
  },
};
import { permissionAPI as originalPermissionAPI } from '@/services/api';
import type { Role, Permission } from '@/types';

// 重新导出权限管理API
export const permissionAPI = originalPermissionAPI;

// 导出相关类型
export type { Role, Permission };

// 默认导出
export default permissionAPI;
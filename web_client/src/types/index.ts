// 用户相关类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: UserRoleEnum;
  status: UserStatus;
  avatar?: string;
  realName?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// 就诊人相关类型定义
export interface Patient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  gender: Gender;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

// 订单相关类型定义
export interface Order {
  id: number;
  orderNo: string;
  patientId: number;
  patient?: Patient;
  orderType: OrderType;
  status: OrderStatus;
  totalAmount: number;
  description?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  itemName: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export enum OrderType {
  MEDICAL = 'MEDICAL',
  EXAMINATION = 'EXAMINATION',
  MEDICINE = 'MEDICINE',
  OTHER = 'OTHER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 登录相关类型
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// 表格查询参数
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

// 权限管理相关类型定义
export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  isSystem: boolean;
  sort: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  path?: string;
  icon?: string;
  sort: number;
  enabled: boolean;
  children?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'locked';
  roles: Role[];
  lastLoginAt: string;
  createdAt: string;
}

// 权限管理API请求类型
export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  isEnabled?: boolean;
  sortOrder?: number;
}

export interface UpdateRoleRequest {
  name: string;
  code: string;
  description?: string;
  isEnabled?: boolean;
  sortOrder?: number;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}
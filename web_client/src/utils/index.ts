// 格式化金额
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

export const formatDateOnly = (date: string | Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone: string): string => {
  // 简单的手机号格式化：138****1234
  if (phone.length === 11) {
    return `${phone.slice(0, 3)}****${phone.slice(7)}`;
  }
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 获取订单类型显示名称
export const getOrderTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    MEDICAL: '医疗服务',
    EXAMINATION: '检查',
    MEDICINE: '药品',
    OTHER: '其他',
  };
  return typeMap[type] || type;
};

// 获取订单状态显示名称
export const getOrderStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: '待处理',
    CONFIRMED: '已确认',
    PROCESSING: '处理中',
    PAID: '已支付',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
    REFUNDED: '已退款',
  };
  return statusMap[status] || status;
};

// 获取订单状态颜色
export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    PROCESSING: 'processing',
    PAID: 'cyan',
    COMPLETED: 'success',
    CANCELLED: 'error',
    REFUNDED: 'purple',
  };
  return colorMap[status] || 'default';
};

export const getUserRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    ADMIN: '管理员',
    DOCTOR: '医生',
    NURSE: '护士',
    USER: '用户',
  };
  return roleMap[role] || role;
};

export const getUserStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: '活跃',
    INACTIVE: '非活跃',
    SUSPENDED: '暂停',
  };
  return statusMap[status] || status;
};

export const getUserStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    ACTIVE: 'success',
    INACTIVE: 'default',
    SUSPENDED: 'error',
  };
  return colorMap[status] || 'default';
};

// 本地存储工具
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
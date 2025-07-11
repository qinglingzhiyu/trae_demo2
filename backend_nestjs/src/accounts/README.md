# 后台账号管理模块

## 模块概述

后台账号管理模块专门用于管理系统的后台管理账号，包括管理员、医生、护士等角色的账号。该模块提供了完整的账号生命周期管理功能，包括创建、查询、更新、删除、状态管理、角色分配等。

## 功能特性

### 核心功能
- **账号创建**：支持创建后台管理账号（管理员、医生、护士）
- **账号查询**：支持分页查询、条件筛选、关键词搜索
- **账号更新**：支持更新账号基本信息
- **密码管理**：支持管理员重置账号密码
- **状态管理**：支持启用/禁用账号
- **角色分配**：支持为账号分配多个角色
- **软删除**：支持软删除账号，保留历史数据

### 扩展功能
- **统计信息**：提供账号数量统计、角色分布等
- **登录日志**：查看账号登录历史记录
- **操作日志**：查看账号操作历史记录
- **角色管理**：获取可用角色列表

## API 接口

### 基础路径
```
/accounts
```

### 接口列表

#### 1. 创建后台账号
```http
POST /accounts
```

**请求体：**
```json
{
  "name": "张医生",
  "phone": "13800138000",
  "email": "doctor@hospital.com",
  "password": "password123",
  "role": "DOCTOR",
  "department": "内科",
  "position": "主治医师",
  "employeeId": "D001",
  "roleIds": [1, 2]
}
```

#### 2. 获取账号列表
```http
GET /accounts?page=1&limit=10&search=张医生&role=DOCTOR&status=ACTIVE&department=内科
```

#### 3. 获取账号详情
```http
GET /accounts/:id
```

#### 4. 更新账号信息
```http
POST /accounts/:id/update
```

#### 5. 重置账号密码
```http
POST /accounts/:id/reset-password
```

**请求体：**
```json
{
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123",
  "reason": "用户忘记密码"
}
```

#### 6. 切换账号状态
```http
POST /accounts/:id/toggle-status
```

#### 7. 分配账号角色
```http
POST /accounts/:id/assign-roles
```

**请求体：**
```json
{
  "roleIds": [1, 2, 3]
}
```

#### 8. 删除账号
```http
POST /accounts/:id/delete
```

#### 9. 获取统计信息
```http
GET /accounts/statistics
```

#### 10. 获取可用角色
```http
GET /accounts/roles
```

#### 11. 获取登录日志
```http
GET /accounts/:id/login-logs?page=1&limit=10
```

#### 12. 获取操作日志
```http
GET /accounts/:id/operation-logs?page=1&limit=10
```

## 数据模型

### 账号实体 (AccountEntity)

```typescript
{
  id: number;                    // 账号ID
  name: string;                  // 姓名
  phone: string;                 // 手机号
  email: string | null;          // 邮箱
  idCard: string | null;         // 身份证号
  role: UserRole;                // 角色
  status: UserStatus;            // 状态
  department: string | null;     // 部门
  position: string | null;       // 职位
  employeeId: string | null;     // 工号
  address: string | null;        // 地址
  remark: string | null;         // 备注
  createdBy: number | null;      // 创建者ID
  updatedBy: number | null;      // 更新者ID
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
  lastLoginAt: Date | null;      // 最后登录时间
  lastLoginIp: string | null;    // 最后登录IP
  assignedRoles: Role[];         // 分配的角色
  creatorInfo: object | null;    // 创建者信息
  updaterInfo: object | null;    // 更新者信息
}
```

### 角色枚举 (UserRole)

```typescript
enum UserRole {
  ADMIN = 'ADMIN',     // 管理员
  DOCTOR = 'DOCTOR',   // 医生
  NURSE = 'NURSE',     // 护士
  USER = 'USER'        // 普通用户（不在账号管理范围内）
}
```

### 状态枚举 (UserStatus)

```typescript
enum UserStatus {
  ACTIVE = 'ACTIVE',     // 激活
  INACTIVE = 'INACTIVE', // 禁用
  LOCKED = 'LOCKED'      // 锁定
}
```

## 权限控制

### 访问权限
- 所有接口都需要JWT认证
- 只有管理员角色可以访问账号管理功能
- 操作会记录到审计日志中

### 数据权限
- 只能管理后台账号（ADMIN、DOCTOR、NURSE）
- 不能管理普通用户账号（USER）
- 软删除保护，不会真正删除数据

## 安全特性

### 密码安全
- 密码使用bcrypt加密存储
- 密码重置需要管理员权限
- 密码复杂度验证

### 操作审计
- 所有操作都会记录操作者
- 支持查看操作历史
- 登录日志跟踪

### 数据保护
- 软删除机制
- 唯一性约束（手机号、邮箱）
- 输入验证和清理

## 使用示例

### 创建医生账号

```typescript
const createDoctor = async () => {
  const response = await fetch('/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      name: '李医生',
      phone: '13900139000',
      email: 'li.doctor@hospital.com',
      password: 'doctor123',
      role: 'DOCTOR',
      department: '心内科',
      position: '副主任医师',
      employeeId: 'D002'
    })
  });
  
  const doctor = await response.json();
  console.log('创建医生账号成功:', doctor);
};
```

### 查询账号列表

```typescript
const getAccounts = async () => {
  const response = await fetch('/accounts?page=1&limit=10&role=DOCTOR&status=ACTIVE', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  
  const result = await response.json();
  console.log('账号列表:', result.data);
  console.log('分页信息:', result.pagination);
};
```

### 重置密码

```typescript
const resetPassword = async (accountId: number) => {
  const response = await fetch(`/accounts/${accountId}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
      reason: '用户忘记密码'
    })
  });
  
  const result = await response.json();
  console.log('密码重置成功:', result.message);
};
```

## 注意事项

1. **角色限制**：只能创建和管理后台角色账号（ADMIN、DOCTOR、NURSE）
2. **唯一性**：手机号和邮箱在系统中必须唯一
3. **软删除**：删除操作为软删除，数据不会真正删除
4. **权限控制**：需要管理员权限才能访问
5. **密码安全**：密码会自动加密，重置时需要验证确认密码
6. **审计日志**：所有操作都会记录到审计日志中
7. **数据一致性**：更新操作会验证数据的唯一性和完整性
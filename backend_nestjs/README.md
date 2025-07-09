# 医疗系统后端服务

基于 NestJS 框架开发的医疗系统后端服务，提供用户管理、就诊人管理、订单管理等核心功能。

## 技术栈

- **框架**: NestJS (Node.js)
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: JWT + Passport
- **API文档**: Swagger/OpenAPI
- **验证**: class-validator
- **密码加密**: bcryptjs

## 功能特性

- 🔐 JWT 身份认证和授权
- 👥 用户管理（注册、登录、权限控制）
- 🏥 就诊人管理
- 📋 订单管理（创建、查询、更新、统计）
- 📚 完整的 API 文档
- 🛡️ 请求频率限制
- ✅ 数据验证和错误处理
- 📊 统计分析功能

## 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- npm 或 yarn

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env` 文件并配置数据库连接：

```bash
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/medical_system?schema=public"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# 应用配置
PORT=3000
NODE_ENV="development"
API_PREFIX="api/v1"

# 限流配置
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 或者使用迁移（推荐生产环境）
npm run db:migrate

# 查看数据库（可选）
npm run db:studio
```

### 4. 启动应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

应用将在 `http://localhost:3000` 启动。

### 5. 查看 API 文档

启动应用后，访问 `http://localhost:3000/api` 查看 Swagger API 文档。

## API 接口

### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/profile` - 获取用户信息

### 用户管理
- `GET /api/v1/users` - 获取用户列表
- `GET /api/v1/users/:id` - 获取用户详情
- `POST /api/v1/users` - 创建用户
- `PATCH /api/v1/users/:id` - 更新用户
- `DELETE /api/v1/users/:id` - 删除用户
- `GET /api/v1/users/statistics` - 用户统计

### 就诊人管理
- `GET /api/v1/patients` - 获取就诊人列表
- `GET /api/v1/patients/:id` - 获取就诊人详情
- `POST /api/v1/patients` - 创建就诊人
- `PATCH /api/v1/patients/:id` - 更新就诊人
- `DELETE /api/v1/patients/:id` - 删除就诊人
- `GET /api/v1/patients/statistics` - 就诊人统计

### 订单管理
- `GET /api/v1/orders` - 获取订单列表
- `GET /api/v1/orders/:id` - 获取订单详情
- `POST /api/v1/orders` - 创建订单
- `PATCH /api/v1/orders/:id` - 更新订单
- `DELETE /api/v1/orders/:id` - 删除订单
- `GET /api/v1/orders/statistics` - 订单统计

## 数据库模型

### 用户 (User)
- 基本信息：姓名、手机、邮箱、身份证
- 认证信息：密码（加密存储）
- 权限：角色（管理员/普通用户）
- 状态：激活/禁用

### 就诊人 (Patient)
- 基本信息：姓名、性别、生日、手机、身份证
- 医疗信息：医保信息、过敏史、病史
- 关系信息：与用户关系、紧急联系人

### 订单 (Order)
- 订单信息：订单号、类型、状态、总金额
- 关联信息：用户、就诊人
- 订单项目：服务项目、价格、数量

## 开发指南

### 代码规范

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 测试

```bash
# 单元测试
npm run test

# 测试覆盖率
npm run test:cov

# E2E 测试
npm run test:e2e
```

### 数据库操作

```bash
# 生成迁移文件
npx prisma migrate dev --name migration_name

# 重置数据库
npx prisma migrate reset

# 查看数据库
npm run db:studio
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t medical-system-backend .

# 运行容器
docker run -p 3000:3000 --env-file .env medical-system-backend
```

### 生产环境

1. 设置环境变量
2. 构建应用：`npm run build`
3. 运行迁移：`npm run db:migrate`
4. 启动应用：`npm run start:prod`

## 安全考虑

- JWT 密钥使用强随机字符串
- 密码使用 bcrypt 加密存储
- API 请求频率限制
- 输入数据验证和清理
- CORS 配置
- 敏感信息不记录日志

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。
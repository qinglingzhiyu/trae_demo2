# 医疗CRM管理系统 - 前端项目

这是一个基于 Next.js 构建的医疗CRM管理系统前端项目，提供用户管理、就诊人管理、订单管理等功能的Web界面。

## 技术栈

- **框架**: Next.js 15 (React 19)
- **开发语言**: TypeScript
- **UI组件库**: Ant Design (antd)
- **样式**: Tailwind CSS + Ant Design
- **HTTP客户端**: Axios
- **日期处理**: dayjs
- **包管理器**: npm

## 功能特性

- 🔐 用户认证与授权
- 👥 用户管理（增删改查）
- 🏥 就诊人管理
- 📋 订单管理
- 📊 数据统计仪表盘
- 📱 响应式设计
- 🎨 现代化UI界面
- 🔍 高级搜索与筛选
- 📄 分页与排序

## 项目结构

```
web_client/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── dashboard/       # 仪表盘页面
│   │   ├── login/          # 登录页面
│   │   ├── users/          # 用户管理页面
│   │   ├── patients/       # 就诊人管理页面
│   │   ├── orders/         # 订单管理页面
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   └── globals.css     # 全局样式
│   ├── api/                # API 接口封装
│   │   ├── config.ts       # API 配置
│   │   ├── users.ts        # 用户相关接口
│   │   ├── patients.ts     # 就诊人相关接口
│   │   └── orders.ts       # 订单相关接口
│   ├── components/         # 可复用组件
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.tsx  # 主布局
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 通用类型
│   ├── utils/              # 工具函数
│   │   └── index.ts        # 通用工具
│   ├── hooks/              # 自定义 Hooks
│   └── constants/          # 常量定义
├── public/                 # 静态资源
├── package.json            # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.ts     # Tailwind CSS 配置
└── next.config.js         # Next.js 配置
```

## 本地开发环境设置

### 前置要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本

### 安装步骤

1. **进入项目目录**
   ```bash
   cd trae_demo2/web_client
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   创建 `.env.local` 文件（可选）：
   ```bash
   # API 基础地址
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题

## 构建生产版本

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm run start
   ```

## API 接口说明

项目默认连接到 `http://localhost:3001/api` 的后端服务。主要接口包括：

- **认证接口**
  - `POST /auth/login` - 用户登录
  - `GET /auth/profile` - 获取用户信息
  - `POST /auth/logout` - 用户登出

- **用户管理**
  - `GET /users` - 获取用户列表
  - `POST /users` - 创建用户
  - `GET /users/:id` - 获取用户详情
  - `PUT /users/:id` - 更新用户
  - `DELETE /users/:id` - 删除用户

- **就诊人管理**
  - `GET /patients` - 获取就诊人列表
  - `POST /patients` - 创建就诊人
  - `GET /patients/:id` - 获取就诊人详情
  - `PUT /patients/:id` - 更新就诊人
  - `DELETE /patients/:id` - 删除就诊人

- **订单管理**
  - `GET /orders` - 获取订单列表
  - `POST /orders` - 创建订单
  - `GET /orders/:id` - 获取订单详情
  - `PUT /orders/:id` - 更新订单
  - `DELETE /orders/:id` - 删除订单

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用 Prettier 进行代码格式化
- 组件采用函数式组件 + Hooks
- 使用 Ant Design 组件库保持UI一致性

## 部署说明

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

### Docker 部署

```dockerfile
# Dockerfile 示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 更改端口
   npm run dev -- -p 3001
   ```

2. **依赖安装失败**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript 错误**
   ```bash
   # 检查类型错误
   npx tsc --noEmit
   ```

## 联系方式

如有问题或建议，请联系开发团队。

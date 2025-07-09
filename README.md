# 医疗管理系统演示项目 (Trae Demo 2)

这是一个完整的医疗管理系统演示项目，包含前端React应用和后端NestJS API。

## 项目结构

```
trae_demo2/
├── backend_nestjs/     # 后端NestJS应用
├── web_client/         # 前端React应用
├── design/            # 设计文档和原型
├── docs/              # 项目文档
└── test/              # 测试相关文件
```

## 功能特性

### 前端功能
- 🏥 **仪表板** - 系统概览和数据统计
- 👥 **用户管理** - 用户增删改查、权限管理
- 🏥 **患者管理** - 患者信息管理
- 📋 **订单管理** - 医疗订单创建、查看、编辑
- ⚙️ **系统设置** - 个人设置、参数配置、权限管理
- 🔐 **身份认证** - 登录、注册、权限控制

### 后端功能
- 🔐 **JWT身份认证**
- 👥 **用户管理API**
- 🏥 **患者管理API**
- 📋 **订单管理API**
- 🗄️ **数据库集成** (SQLite + Prisma)
- 📝 **API文档** (Swagger)

## 技术栈

### 前端
- **框架**: Next.js 15 (React 19)
- **UI库**: Ant Design
- **样式**: CSS Modules + Tailwind CSS
- **状态管理**: React Hooks
- **HTTP客户端**: Axios
- **类型检查**: TypeScript

### 后端
- **框架**: NestJS
- **数据库**: SQLite
- **ORM**: Prisma
- **身份认证**: JWT + Passport
- **API文档**: Swagger
- **类型检查**: TypeScript

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 8

### 安装依赖

```bash
# 安装后端依赖
cd backend_nestjs
npm install

# 安装前端依赖
cd ../web_client
npm install
```

### 数据库设置

```bash
cd backend_nestjs

# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 填充示例数据
npm run seed
```

### 启动开发服务器

```bash
# 启动后端服务 (端口: 3000)
cd backend_nestjs
npm run start:dev

# 启动前端服务 (端口: 4001)
cd ../web_client
npm run dev
```

### 访问应用

- 前端应用: http://localhost:4001
- 后端API: http://localhost:3000
- API文档: http://localhost:3000/api

## 项目文档

- [产品需求文档](./docs/PRD.md)
- [用户故事地图](./docs/User_Story_Map.md)
- [技术路线图](./docs/Roadmap.md)
- [设计规范](./design/specs/Design_Spec.md)
- [API规范](./backend_nestjs/API_Spec.md)
- [数据库设计](./backend_nestjs/DB_Schema.md)

## 测试

- [测试计划](./test/Test_Plan.md)
- [测试用例](./test/Test_Cases.md)
- [测试报告](./test/Test_Report.md)

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License
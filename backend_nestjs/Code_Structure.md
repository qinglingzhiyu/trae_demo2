# 后端代码结构方案

## 概述

本文档详细描述了系统管理模块的代码组织结构、文件命名规范、模块划分原则和开发规范，旨在确保代码的可读性、可维护性和可扩展性。

## 项目目录结构

```
backend_nestjs/
├── src/                          # 源代码目录
│   ├── app.module.ts            # 应用根模块
│   ├── main.ts                  # 应用入口文件
│   ├── system/                  # 系统管理模块
│   │   ├── system.module.ts     # 系统管理主模块
│   │   ├── permissions/         # 权限管理子模块
│   │   │   ├── permissions.module.ts
│   │   │   ├── permissions.controller.ts
│   │   │   ├── permissions.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-role.dto.ts
│   │   │   │   ├── update-role.dto.ts
│   │   │   │   ├── query-role.dto.ts
│   │   │   │   ├── create-permission.dto.ts
│   │   │   │   ├── update-permission.dto.ts
│   │   │   │   └── query-permission.dto.ts
│   │   │   └── entities/
│   │   │       ├── role.entity.ts
│   │   │       └── permission.entity.ts
│   │   ├── params/              # 系统参数子模块
│   │   │   ├── params.module.ts
│   │   │   ├── params.controller.ts
│   │   │   ├── params.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-param.dto.ts
│   │   │   │   ├── update-param.dto.ts
│   │   │   │   └── query-param.dto.ts
│   │   │   └── entities/
│   │   │       └── param.entity.ts
│   │   ├── dictionaries/        # 字典管理子模块
│   │   │   ├── dictionaries.module.ts
│   │   │   ├── dictionaries.controller.ts
│   │   │   ├── dictionaries.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-dictionary.dto.ts
│   │   │   │   ├── update-dictionary.dto.ts
│   │   │   │   ├── query-dictionary.dto.ts
│   │   │   │   ├── create-dictionary-item.dto.ts
│   │   │   │   ├── update-dictionary-item.dto.ts
│   │   │   │   └── query-dictionary-item.dto.ts
│   │   │   └── entities/
│   │   │       ├── dictionary.entity.ts
│   │   │       └── dictionary-item.entity.ts
│   │   ├── audit-logs/          # 操作日志子模块
│   │   │   ├── audit-logs.module.ts
│   │   │   ├── audit-logs.controller.ts
│   │   │   ├── audit-logs.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-audit-log.dto.ts
│   │   │   │   └── query-audit-log.dto.ts
│   │   │   └── entities/
│   │   │       └── audit-log.entity.ts
│   │   ├── notifications/        # 消息通知子模块
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-notification.dto.ts
│   │   │   │   ├── send-notification.dto.ts
│   │   │   │   ├── batch-send-notification.dto.ts
│   │   │   │   └── query-notification.dto.ts
│   │   │   └── entities/
│   │   │       ├── notification.entity.ts
│   │   │       ├── notification-receiver.entity.ts
│   │   │       └── notification-stats.entity.ts
│   │   └── backup/              # 数据备份子模块
│   │       ├── backup.module.ts
│   │       ├── backup.controller.ts
│   │       ├── backup.service.ts
│   │       ├── dto/
│   │       │   ├── create-backup.dto.ts
│   │       │   ├── restore-backup.dto.ts
│   │       │   └── query-backup.dto.ts
│   │       └── entities/
│   │           ├── backup.entity.ts
│   │           ├── restore.entity.ts
│   │           └── backup-stats.entity.ts
│   ├── common/                  # 公共模块
│   │   ├── decorators/          # 装饰器
│   │   │   ├── api-paginated-response.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── permissions.decorator.ts
│   │   ├── dto/                 # 公共 DTO
│   │   │   ├── pagination.dto.ts
│   │   │   ├── base-response.dto.ts
│   │   │   └── paginated-response.dto.ts
│   │   ├── entities/            # 基础实体
│   │   │   └── base.entity.ts
│   │   ├── enums/               # 枚举定义
│   │   │   ├── user-status.enum.ts
│   │   │   ├── notification-type.enum.ts
│   │   │   ├── notification-level.enum.ts
│   │   │   ├── backup-type.enum.ts
│   │   │   ├── backup-status.enum.ts
│   │   │   └── audit-action.enum.ts
│   │   ├── filters/             # 异常过滤器
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── guards/              # 守卫
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── permissions.guard.ts
│   │   ├── interceptors/        # 拦截器
│   │   │   ├── response.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── pipes/               # 管道
│   │   │   ├── validation.pipe.ts
│   │   │   └── parse-int.pipe.ts
│   │   ├── utils/               # 工具函数
│   │   │   ├── crypto.util.ts
│   │   │   ├── date.util.ts
│   │   │   ├── file.util.ts
│   │   │   └── pagination.util.ts
│   │   └── constants/           # 常量定义
│   │       ├── error-codes.ts
│   │       ├── cache-keys.ts
│   │       └── default-values.ts
│   ├── auth/                    # 认证授权模块
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   ├── refresh-token.dto.ts
│   │   │   └── change-password.dto.ts
│   │   ├── guards/
│   │   │   ├── local-auth.guard.ts
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       ├── local.strategy.ts
│   │       └── jwt.strategy.ts
│   ├── database/                # 数据库模块
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts
│   │   └── migrations/          # 数据库迁移文件
│   ├── config/                  # 配置模块
│   │   ├── config.module.ts
│   │   ├── configuration.ts
│   │   └── validation.ts
│   └── health/                  # 健康检查模块
│       ├── health.module.ts
│       └── health.controller.ts
├── test/                        # 测试文件
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── fixtures/
├── prisma/                      # Prisma 配置
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docs/                        # 文档目录
│   ├── API_Spec.md
│   ├── DB_Schema.md
│   ├── Tech_Stack.md
│   └── Code_Structure.md
├── .env                         # 环境变量文件
├── .env.example                 # 环境变量示例
├── .gitignore                   # Git 忽略文件
├── .eslintrc.js                 # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── nest-cli.json                # NestJS CLI 配置
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript 配置
├── tsconfig.build.json          # 构建配置
├── docker-compose.yml           # Docker Compose 配置
├── Dockerfile                   # Docker 镜像配置
└── README.md                    # 项目说明
```

## 文件命名规范

### 基本原则

1. **小写字母 + 连字符**: 使用小写字母和连字符分隔单词
2. **语义化命名**: 文件名应清晰表达其功能和用途
3. **统一后缀**: 相同类型的文件使用统一的后缀

### 具体规范

#### 模块文件
- **格式**: `{module-name}.module.ts`
- **示例**: `permissions.module.ts`, `system.module.ts`

#### 控制器文件
- **格式**: `{module-name}.controller.ts`
- **示例**: `permissions.controller.ts`, `notifications.controller.ts`

#### 服务文件
- **格式**: `{module-name}.service.ts`
- **示例**: `permissions.service.ts`, `backup.service.ts`

#### DTO 文件
- **格式**: `{action}-{entity}.dto.ts`
- **示例**: `create-role.dto.ts`, `update-permission.dto.ts`, `query-notification.dto.ts`

#### 实体文件
- **格式**: `{entity-name}.entity.ts`
- **示例**: `role.entity.ts`, `notification.entity.ts`

#### 枚举文件
- **格式**: `{enum-name}.enum.ts`
- **示例**: `user-status.enum.ts`, `notification-type.enum.ts`

#### 工具文件
- **格式**: `{utility-name}.util.ts`
- **示例**: `crypto.util.ts`, `date.util.ts`

#### 常量文件
- **格式**: `{constant-group}.ts`
- **示例**: `error-codes.ts`, `cache-keys.ts`

## 代码组织原则

### 模块化设计

#### 1. 功能模块划分
- **按业务功能**: 每个业务功能独立成模块
- **职责单一**: 每个模块只负责特定的业务领域
- **低耦合**: 模块间依赖关系清晰，避免循环依赖
- **高内聚**: 模块内部功能紧密相关

#### 2. 分层架构
```
┌─────────────────┐
│   Controller    │  ← HTTP 请求处理层
└─────────────────┘
         │
┌─────────────────┐
│    Service      │  ← 业务逻辑层
└─────────────────┘
         │
┌─────────────────┐
│   Repository    │  ← 数据访问层
└─────────────────┘
         │
┌─────────────────┐
│    Database     │  ← 数据存储层
└─────────────────┘
```

#### 3. 依赖注入
- **构造函数注入**: 优先使用构造函数注入依赖
- **接口抽象**: 依赖接口而非具体实现
- **生命周期管理**: 合理设置服务的生命周期

### 代码结构模式

#### 1. 控制器 (Controller)
```typescript
@Controller('api/v1/permissions')
@ApiTags('权限管理')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('roles')
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.permissionsService.createRole(createRoleDto);
  }

  // 其他方法...
}
```

#### 2. 服务 (Service)
```typescript
@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    try {
      // 业务逻辑实现
      const role = await this.prisma.role.create({
        data: createRoleDto,
      });
      
      this.logger.log(`Role created: ${role.id}`);
      return new RoleEntity(role);
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`);
      throw new BadRequestException('创建角色失败');
    }
  }

  // 其他方法...
}
```

#### 3. DTO (Data Transfer Object)
```typescript
export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: '角色描述', example: '系统管理员' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  description?: string;

  @ApiProperty({ description: '是否启用', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3] })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  permissionIds?: number[];
}
```

#### 4. 实体 (Entity)
```typescript
export class RoleEntity {
  @ApiProperty({ description: '角色ID' })
  id: number;

  @ApiProperty({ description: '角色名称' })
  name: string;

  @ApiProperty({ description: '角色描述' })
  description: string;

  @ApiProperty({ description: '是否启用' })
  isActive: boolean;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '权限列表', type: [PermissionEntity] })
  permissions?: PermissionEntity[];

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
```

## 编码规范

### TypeScript 规范

#### 1. 类型定义
```typescript
// 优先使用接口定义对象类型
interface UserInfo {
  id: number;
  name: string;
  email: string;
}

// 使用类型别名定义联合类型
type Status = 'active' | 'inactive' | 'pending';

// 使用泛型提高代码复用性
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

#### 2. 函数定义
```typescript
// 明确指定参数和返回值类型
async function getUserById(id: number): Promise<UserEntity | null> {
  // 实现逻辑
}

// 使用箭头函数处理简单逻辑
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
```

#### 3. 类定义
```typescript
// 使用访问修饰符
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  
  public async findById(id: number): Promise<UserEntity> {
    // 实现逻辑
  }
  
  private validateUser(user: any): boolean {
    // 验证逻辑
  }
}
```

### 注释规范

#### 1. 类注释
```typescript
/**
 * 权限管理服务
 * 负责角色和权限的 CRUD 操作
 * @author 开发者姓名
 * @since 2024-01-01
 */
@Injectable()
export class PermissionsService {
  // 类实现
}
```

#### 2. 方法注释
```typescript
/**
 * 创建新角色
 * @param createRoleDto 角色创建数据
 * @returns 创建的角色实体
 * @throws BadRequestException 当角色名称已存在时
 */
async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
  // 方法实现
}
```

#### 3. 复杂逻辑注释
```typescript
// 检查用户是否有权限访问资源
if (user.roles.some(role => 
  role.permissions.some(permission => 
    permission.resource === resource && 
    permission.action === action
  )
)) {
  // 允许访问
}
```

### 错误处理规范

#### 1. 异常分类
```typescript
// 业务异常
throw new BadRequestException('用户名已存在');
throw new NotFoundException('用户不存在');
throw new ForbiddenException('权限不足');

// 系统异常
throw new InternalServerErrorException('系统内部错误');
```

#### 2. 错误日志
```typescript
try {
  // 业务逻辑
} catch (error) {
  this.logger.error(
    `Failed to create user: ${error.message}`,
    error.stack,
    'UserService.createUser'
  );
  throw new BadRequestException('创建用户失败');
}
```

### 测试规范

#### 1. 单元测试
```typescript
describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createRole', () => {
    it('should create a role successfully', async () => {
      // 测试实现
    });

    it('should throw error when role name exists', async () => {
      // 测试实现
    });
  });
});
```

#### 2. 集成测试
```typescript
describe('PermissionsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/permissions/roles (POST)', () => {
    return request(app.getHttpServer())
      .post('/permissions/roles')
      .send({ name: 'test-role' })
      .expect(201);
  });
});
```

## 性能优化指南

### 1. 数据库查询优化
```typescript
// 使用 select 减少数据传输
const users = await this.prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// 使用 include 预加载关联数据
const userWithRoles = await this.prisma.user.findUnique({
  where: { id },
  include: {
    roles: {
      include: {
        permissions: true,
      },
    },
  },
});

// 使用分页避免大量数据加载
const users = await this.prisma.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 2. 缓存策略
```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheManager: Cache,
  ) {}

  async getUserById(id: number): Promise<UserEntity> {
    const cacheKey = `user:${id}`;
    
    // 尝试从缓存获取
    let user = await this.cacheManager.get<UserEntity>(cacheKey);
    
    if (!user) {
      // 从数据库查询
      user = await this.prisma.user.findUnique({ where: { id } });
      
      // 存入缓存
      await this.cacheManager.set(cacheKey, user, 300); // 5分钟
    }
    
    return user;
  }
}
```

### 3. 异步处理
```typescript
// 使用队列处理耗时任务
@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async sendBulkNotifications(notifications: CreateNotificationDto[]) {
    // 添加到队列异步处理
    await this.notificationQueue.add('bulk-send', {
      notifications,
    });
    
    return { message: '批量发送任务已提交' };
  }
}
```

## 安全最佳实践

### 1. 输入验证
```typescript
// 使用 DTO 进行严格的输入验证
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;
}
```

### 2. 权限控制
```typescript
// 使用守卫进行权限检查
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('users')
  @Permissions('user:read')
  async getUsers() {
    // 只有管理员且有用户读取权限才能访问
  }
}
```

### 3. 敏感数据处理
```typescript
// 密码加密
const hashedPassword = await bcrypt.hash(password, 10);

// 敏感信息脱敏
export class UserEntity {
  @Exclude() // 序列化时排除密码字段
  password: string;
  
  @Transform(({ value }) => value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'))
  phone: string; // 手机号脱敏
}
```

## 部署配置

### 1. 环境变量配置
```bash
# .env.example
NODE_ENV=development
PORT=3000

# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 日志配置
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

### 2. Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production

# 生成 Prisma 客户端
RUN npx prisma generate

# 复制源代码
COPY dist ./dist

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]
```

### 3. Docker Compose 配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 总结

本代码结构方案遵循以下核心原则：

1. **模块化**: 按功能划分模块，职责清晰
2. **分层架构**: 控制器、服务、数据访问层分离
3. **类型安全**: 充分利用 TypeScript 的类型系统
4. **可测试性**: 依赖注入，便于单元测试
5. **可维护性**: 统一的命名规范和代码风格
6. **可扩展性**: 松耦合设计，便于功能扩展
7. **安全性**: 输入验证、权限控制、敏感数据保护
8. **性能优化**: 缓存策略、查询优化、异步处理

通过遵循这些规范和最佳实践，我们可以构建出高质量、易维护、可扩展的后端服务代码。
# 后端代码结构方案

## 概述

本文档详细说明了医疗系统后端服务的代码组织结构、模块划分、文件命名规范和开发规范。

## 项目目录结构

```
backend_nestjs/
├── src/                          # 源代码目录
│   ├── main.ts                   # 应用程序入口文件
│   ├── app.module.ts             # 根模块
│   ├── app.controller.ts         # 根控制器
│   ├── app.service.ts            # 根服务
│   │
│   ├── auth/                     # 认证模块
│   │   ├── auth.module.ts        # 认证模块定义
│   │   ├── auth.service.ts       # 认证服务
│   │   ├── auth.controller.ts    # 认证控制器
│   │   ├── dto/                  # 数据传输对象
│   │   │   ├── login.dto.ts      # 登录 DTO
│   │   │   └── register.dto.ts   # 注册 DTO
│   │   ├── guards/               # 守卫
│   │   │   └── jwt-auth.guard.ts # JWT 认证守卫
│   │   └── strategies/           # 认证策略
│   │       ├── jwt.strategy.ts   # JWT 策略
│   │       └── local.strategy.ts # 本地策略
│   │
│   ├── users/                    # 用户管理模块
│   │   ├── users.module.ts       # 用户模块定义
│   │   ├── users.service.ts      # 用户服务
│   │   ├── users.controller.ts   # 用户控制器
│   │   ├── dto/                  # 数据传输对象
│   │   │   ├── create-user.dto.ts # 创建用户 DTO
│   │   │   ├── update-user.dto.ts # 更新用户 DTO
│   │   │   └── query-user.dto.ts  # 查询用户 DTO
│   │   └── entities/             # 实体定义
│   │       └── user.entity.ts    # 用户实体
│   │
│   ├── patients/                 # 就诊人管理模块
│   │   ├── patients.module.ts    # 就诊人模块定义
│   │   ├── patients.service.ts   # 就诊人服务
│   │   ├── patients.controller.ts # 就诊人控制器
│   │   ├── dto/                  # 数据传输对象
│   │   │   ├── create-patient.dto.ts # 创建就诊人 DTO
│   │   │   └── update-patient.dto.ts # 更新就诊人 DTO
│   │   └── entities/             # 实体定义
│   │       └── patient.entity.ts # 就诊人实体
│   │
│   ├── orders/                   # 订单管理模块
│   │   ├── orders.module.ts      # 订单模块定义
│   │   ├── orders.service.ts     # 订单服务
│   │   ├── orders.controller.ts  # 订单控制器
│   │   ├── dto/                  # 数据传输对象
│   │   │   ├── create-order.dto.ts # 创建订单 DTO
│   │   │   ├── update-order.dto.ts # 更新订单 DTO
│   │   │   └── query-order.dto.ts  # 查询订单 DTO
│   │   └── entities/             # 实体定义
│   │       └── order.entity.ts   # 订单实体
│   │
│   ├── prisma/                   # 数据库模块
│   │   ├── prisma.module.ts      # Prisma 模块定义
│   │   └── prisma.service.ts     # Prisma 服务
│   │
│   ├── common/                   # 公共模块
│   │   ├── decorators/           # 装饰器
│   │   │   ├── user.decorator.ts # 用户装饰器
│   │   │   └── roles.decorator.ts # 角色装饰器
│   │   ├── filters/              # 异常过滤器
│   │   │   ├── http-exception.filter.ts # HTTP 异常过滤器
│   │   │   └── prisma-exception.filter.ts # Prisma 异常过滤器
│   │   ├── guards/               # 守卫
│   │   │   └── roles.guard.ts    # 角色守卫
│   │   ├── interceptors/         # 拦截器
│   │   │   ├── logging.interceptor.ts # 日志拦截器
│   │   │   └── transform.interceptor.ts # 响应转换拦截器
│   │   ├── pipes/                # 管道
│   │   │   └── validation.pipe.ts # 验证管道
│   │   ├── constants/            # 常量定义
│   │   │   ├── roles.constant.ts # 角色常量
│   │   │   └── status.constant.ts # 状态常量
│   │   └── types/                # 类型定义
│   │       ├── user.types.ts     # 用户类型
│   │       └── response.types.ts # 响应类型
│   │
│   └── config/                   # 配置模块
│       ├── configuration.ts      # 配置定义
│       └── validation.ts         # 配置验证
│
├── prisma/                       # Prisma 配置
│   ├── schema.prisma             # 数据库模式定义
│   ├── migrations/               # 数据库迁移文件
│   └── seed.ts                   # 数据库种子文件
│
├── test/                         # 测试文件
│   ├── app.e2e-spec.ts          # E2E 测试
│   ├── auth/                     # 认证模块测试
│   ├── users/                    # 用户模块测试
│   ├── patients/                 # 就诊人模块测试
│   └── orders/                   # 订单模块测试
│
├── docs/                         # 文档目录
│   ├── API_Spec.md               # API 规范文档
│   ├── DB_Schema.md              # 数据库设计文档
│   ├── Tech_Stack.md             # 技术选型文档
│   └── Code_Structure.md         # 代码结构文档
│
├── .env                          # 环境变量文件
├── .env.example                  # 环境变量示例文件
├── .gitignore                    # Git 忽略文件
├── .eslintrc.js                  # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── nest-cli.json                 # NestJS CLI 配置
├── package.json                  # 项目依赖配置
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.build.json           # 构建 TypeScript 配置
└── README.md                     # 项目说明文档
```

## 模块结构设计

### 1. 模块组织原则

#### 按功能域划分
- 每个业务功能作为独立模块
- 模块间低耦合，高内聚
- 清晰的模块边界和职责

#### 分层架构
```
┌─────────────────┐
│   Controller    │  # 控制器层：处理 HTTP 请求
├─────────────────┤
│    Service      │  # 服务层：业务逻辑处理
├─────────────────┤
│   Repository    │  # 数据访问层：数据库操作
├─────────────────┤
│    Entity       │  # 实体层：数据模型定义
└─────────────────┘
```

### 2. 标准模块结构

每个功能模块应包含以下文件：

```
module-name/
├── module-name.module.ts      # 模块定义文件
├── module-name.service.ts     # 服务文件
├── module-name.controller.ts  # 控制器文件
├── dto/                       # 数据传输对象
│   ├── create-module.dto.ts   # 创建 DTO
│   ├── update-module.dto.ts   # 更新 DTO
│   └── query-module.dto.ts    # 查询 DTO
└── entities/                  # 实体定义
    └── module.entity.ts       # 实体文件
```

## 文件命名规范

### 1. 文件命名约定

| 文件类型 | 命名格式 | 示例 |
|---------|---------|------|
| 模块文件 | `{name}.module.ts` | `users.module.ts` |
| 控制器文件 | `{name}.controller.ts` | `users.controller.ts` |
| 服务文件 | `{name}.service.ts` | `users.service.ts` |
| DTO 文件 | `{action}-{name}.dto.ts` | `create-user.dto.ts` |
| 实体文件 | `{name}.entity.ts` | `user.entity.ts` |
| 守卫文件 | `{name}.guard.ts` | `jwt-auth.guard.ts` |
| 策略文件 | `{name}.strategy.ts` | `jwt.strategy.ts` |
| 装饰器文件 | `{name}.decorator.ts` | `user.decorator.ts` |
| 过滤器文件 | `{name}.filter.ts` | `http-exception.filter.ts` |
| 拦截器文件 | `{name}.interceptor.ts` | `logging.interceptor.ts` |
| 管道文件 | `{name}.pipe.ts` | `validation.pipe.ts` |
| 测试文件 | `{name}.spec.ts` | `users.service.spec.ts` |
| E2E 测试 | `{name}.e2e-spec.ts` | `app.e2e-spec.ts` |

### 2. 类命名约定

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 模块类 | `{Name}Module` | `UsersModule` |
| 控制器类 | `{Name}Controller` | `UsersController` |
| 服务类 | `{Name}Service` | `UsersService` |
| DTO 类 | `{Action}{Name}Dto` | `CreateUserDto` |
| 实体类 | `{Name}Entity` | `UserEntity` |
| 守卫类 | `{Name}Guard` | `JwtAuthGuard` |
| 策略类 | `{Name}Strategy` | `JwtStrategy` |
| 装饰器 | `{Name}` | `User`, `Roles` |
| 过滤器类 | `{Name}Filter` | `HttpExceptionFilter` |
| 拦截器类 | `{Name}Interceptor` | `LoggingInterceptor` |
| 管道类 | `{Name}Pipe` | `ValidationPipe` |

## 代码组织规范

### 1. 导入顺序

```typescript
// 1. Node.js 内置模块
import { readFileSync } from 'fs';

// 2. 第三方库
import { Injectable, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// 3. 项目内部模块（按路径深度排序）
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
```

### 2. 类结构顺序

```typescript
@Injectable()
export class UsersService {
  // 1. 私有属性
  private readonly logger = new Logger(UsersService.name);
  
  // 2. 构造函数
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  
  // 3. 公共方法（按业务逻辑顺序）
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // 实现逻辑
  }
  
  async findAll(): Promise<UserEntity[]> {
    // 实现逻辑
  }
  
  async findOne(id: string): Promise<UserEntity> {
    // 实现逻辑
  }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // 实现逻辑
  }
  
  async remove(id: string): Promise<void> {
    // 实现逻辑
  }
  
  // 4. 私有方法
  private async validateUser(userData: any): Promise<boolean> {
    // 实现逻辑
  }
}
```

### 3. 控制器结构

```typescript
@Controller('users')
@ApiTags('用户管理')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功', type: UserEntity })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [UserEntity] })
  async findAll(@Query() queryDto: QueryUserDto): Promise<UserEntity[]> {
    return this.usersService.findAll(queryDto);
  }
  
  // 其他方法...
}
```

## DTO 设计规范

### 1. 创建 DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: '用户姓名', example: '张三' })
  @IsString()
  @Length(2, 50)
  name: string;
  
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @Length(11, 11)
  phone: string;
  
  @ApiProperty({ description: '邮箱', example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @ApiProperty({ description: '用户角色', enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;
  
  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @Length(6, 20)
  password: string;
}
```

### 2. 更新 DTO

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // 继承 CreateUserDto 的所有属性，但都是可选的
}
```

### 3. 查询 DTO

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '页码', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
  
  @ApiPropertyOptional({ description: '每页数量', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
  
  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;
  
  @ApiPropertyOptional({ description: '用户角色', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

## 实体设计规范

```typescript
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class UserEntity {
  @ApiProperty({ description: '用户ID', example: 'uuid-string' })
  id: string;
  
  @ApiProperty({ description: '用户姓名', example: '张三' })
  name: string;
  
  @ApiProperty({ description: '手机号', example: '13800138000' })
  phone: string;
  
  @ApiProperty({ description: '邮箱', example: 'user@example.com', required: false })
  email?: string;
  
  @ApiProperty({ description: '用户角色', enum: UserRole, example: UserRole.USER })
  role: UserRole;
  
  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;
  
  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
  
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

## 错误处理规范

### 1. 异常过滤器

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 2. 业务异常处理

```typescript
@Injectable()
export class UsersService {
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    
    return new UserEntity(user);
  }
  
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return new UserEntity(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('手机号已存在');
      }
      throw new InternalServerErrorException('创建用户失败');
    }
  }
}
```

## 测试规范

### 1. 单元测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();
    
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  
  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: '张三',
        phone: '13800138000',
        role: UserRole.USER,
        password: 'password123',
      };
      
      const expectedUser = {
        id: 'uuid-string',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(prisma.user, 'create').mockResolvedValue(expectedUser);
      
      const result = await service.create(createUserDto);
      
      expect(result).toEqual(new UserEntity(expectedUser));
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });
});
```

### 2. E2E 测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: '张三',
        phone: '13800138000',
        role: 'user',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('张三');
        expect(res.body.phone).toBe('13800138000');
      });
  });
});
```

## 配置管理

### 1. 环境配置

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});
```

### 2. 配置验证

```typescript
// src/config/validation.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
```

## 日志规范

### 1. 日志配置

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(`Creating user with phone: ${createUserDto.phone}`);
    
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      
      this.logger.log(`User created successfully with ID: ${user.id}`);
      return new UserEntity(user);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 2. 日志拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    
    this.logger.log(`${method} ${url} - Start`);
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(`${method} ${url} - End (${duration}ms)`);
      }),
    );
  }
}
```

## 性能优化

### 1. 数据库查询优化

```typescript
@Injectable()
export class UsersService {
  // 使用 select 只查询需要的字段
  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // 排除敏感字段如 password
      },
    });
    
    return users.map(user => new UserEntity(user));
  }
  
  // 使用 include 预加载关联数据
  async findOneWithPatients(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        patients: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    
    return new UserEntity(user);
  }
}
```

### 2. 缓存策略

```typescript
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  
  async findOne(id: string): Promise<UserEntity> {
    const cacheKey = `user:${id}`;
    
    // 尝试从缓存获取
    let user = await this.cacheManager.get<any>(cacheKey);
    
    if (!user) {
      // 缓存未命中，从数据库查询
      user = await this.prisma.user.findUnique({ where: { id } });
      
      if (!user) {
        throw new NotFoundException(`用户 ID ${id} 不存在`);
      }
      
      // 存入缓存，TTL 5分钟
      await this.cacheManager.set(cacheKey, user, 300);
    }
    
    return new UserEntity(user);
  }
}
```

## 安全规范

### 1. 输入验证

```typescript
import { IsString, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, { message: '姓名只能包含中文、英文和空格' })
  name: string;
  
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号' })
  phone: string;
  
  @IsString()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, {
    message: '密码必须包含大小写字母和数字，长度至少6位',
  })
  password: string;
}
```

### 2. 权限控制

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

## 总结

本代码结构方案遵循以下设计原则：

1. **模块化**: 按业务功能划分模块，职责清晰
2. **分层架构**: 控制器、服务、数据访问层分离
3. **命名规范**: 统一的文件和类命名约定
4. **类型安全**: 充分利用 TypeScript 类型系统
5. **可测试性**: 便于单元测试和集成测试
6. **可维护性**: 代码结构清晰，易于理解和修改
7. **可扩展性**: 支持功能扩展和模块添加
8. **安全性**: 输入验证、权限控制、错误处理
9. **性能优化**: 数据库查询优化、缓存策略
10. **最佳实践**: 遵循 NestJS 和 TypeScript 最佳实践

该结构方案为医疗系统后端提供了坚实的代码基础，支持团队协作开发和长期维护。
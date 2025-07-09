import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole, UserStatus } from '../common/constants/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // 检查手机号是否已存在（排除已删除的用户）
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        phone: createUserDto.phone,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('手机号已存在');
    }

    // 检查邮箱是否已存在（排除已删除的用户）
    if (createUserDto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { 
          email: createUserDto.email,
          deletedAt: null,
        },
      });

      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    });
  }

  async findAll(queryDto: QueryUserDto) {
    const { page = 1, limit = 10, search, role, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null, // 排除已删除的用户
    };

    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 角色筛选
    if (role) {
      where.role = role;
    }

    // 状态筛选
    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const userEntities = users.map(user => new UserEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    }));

    return {
      data: userEntities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null, // 排除已删除的用户
      },
      include: {
        patients: {
          where: { deletedAt: null }, // 排除已删除的就诊人
        },
        orders: {
          where: { deletedAt: null }, // 排除已删除的订单
          include: {
            patient: true,
            items: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return new UserEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { 
        phone,
        deletedAt: null, // 排除已删除的用户
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedBy?: number): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        id,
        deletedAt: null, // 排除已删除的用户
      },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查手机号是否已被其他用户使用（排除已删除的用户）
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: { 
          phone: updateUserDto.phone,
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new ConflictException('手机号已存在');
      }
    }

    // 检查邮箱是否已被其他用户使用（排除已删除的用户）
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { 
          email: updateUserDto.email,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        updatedBy, // 记录更新者
      },
    });

    return new UserEntity({
      ...updatedUser,
      role: updatedUser.role as UserRole,
      status: updatedUser.status as UserStatus,
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        id,
        deletedAt: null, // 排除已删除的用户
      },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 软删除：设置deletedAt时间戳
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatistics() {
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ 
        where: { 
          status: 'ACTIVE',
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          deletedAt: null,
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      inactiveUsers: totalUsers - activeUsers,
    };
  }
}
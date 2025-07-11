import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AccountEntity } from './entities/account.entity';
import { UserRole, UserStatus } from '../common/constants/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto, createdBy: number): Promise<AccountEntity> {
    // 检查手机号是否已存在（排除已删除的用户）
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        phone: createAccountDto.phone,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('手机号已存在');
    }

    // 检查邮箱是否已存在（排除已删除的用户）
    if (createAccountDto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { 
          email: createAccountDto.email,
          deletedAt: null,
        },
      });

      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 验证角色是否为后台角色
    const backendRoles = ['ADMIN', 'DOCTOR', 'NURSE'] as const;
    if (!backendRoles.includes(createAccountDto.role as any)) {
      throw new BadRequestException('只能创建后台管理账号');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createAccountDto,
        password: hashedPassword,
        createdBy,
      },
    });

    // 如果指定了角色，创建用户角色关联
    if (createAccountDto.roleIds && createAccountDto.roleIds.length > 0) {
      await this.assignRoles(user.id, createAccountDto.roleIds, createdBy);
    }

    return new AccountEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    });
  }

  async findAll(queryDto: QueryAccountDto) {
    const { page = 1, limit = 10, search, role, status, department } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null, // 排除已删除的用户
      role: {
        in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE], // 只查询后台账号
      },
    };

    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
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

    // 部门筛选
    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          updater: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const accountEntities = users.map(user => new AccountEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    }));

    return {
      data: accountEntities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<AccountEntity> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null, // 排除已删除的用户
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE], // 只查询后台账号
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    return new AccountEntity({
      ...user,
      role: user.role as UserRole,
      status: user.status as UserStatus,
    });
  }

  async update(id: number, updateAccountDto: UpdateAccountDto, updatedBy: number): Promise<AccountEntity> {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        id,
        deletedAt: null, // 排除已删除的用户
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE], // 只能更新后台账号
        },
      },
    });
    
    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    // 检查手机号是否已被其他用户使用（排除已删除的用户）
    if (updateAccountDto.phone && updateAccountDto.phone !== user.phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: { 
          phone: updateAccountDto.phone,
          deletedAt: null,
          id: { not: id },
        },
      });

      if (existingUser) {
        throw new ConflictException('手机号已存在');
      }
    }

    // 检查邮箱是否已被其他用户使用（排除已删除的用户）
    if (updateAccountDto.email && updateAccountDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { 
          email: updateAccountDto.email,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 验证角色是否为后台角色
    if (updateAccountDto.role) {
      const backendRoles = ['ADMIN', 'DOCTOR', 'NURSE'] as const;
      if (!backendRoles.includes(updateAccountDto.role as any)) {
        throw new BadRequestException('只能设置为后台管理角色');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateAccountDto,
        updatedBy,
      },
    });

    return new AccountEntity({
      ...updatedUser,
      role: updatedUser.role as UserRole,
      status: updatedUser.status as UserStatus,
    });
  }

  async resetPassword(id: number, resetPasswordDto: ResetPasswordDto, updatedBy: number): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE],
        },
      },
    });

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedBy,
      },
    });
  }

  async toggleStatus(id: number, updatedBy: number): Promise<{ status: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE],
        },
      },
    });

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        status: newStatus,
        updatedBy,
      },
    });

    return { status: updatedUser.status };
  }

  async assignRoles(userId: number, roleIds: number[], updatedBy: number): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE],
        },
      },
    });

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    // 删除现有角色关联
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // 创建新的角色关联
    if (roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: roleIds.map(roleId => ({
          userId,
          roleId,
        })),
      });
    }
  }

  async remove(id: number, deletedBy: number): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
        role: {
          in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE],
        },
      },
    });

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    // 软删除用户
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: deletedBy,
      },
    });
  }

  async getStatistics() {
    const [total, active, inactive, adminCount, doctorCount, nurseCount] = await Promise.all([
      this.prisma.user.count({
        where: {
          deletedAt: null,
          role: { in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE] },
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          status: UserStatus.ACTIVE,
          role: { in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE] },
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          status: UserStatus.INACTIVE,
          role: { in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE] },
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          role: UserRole.ADMIN,
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          role: UserRole.DOCTOR,
        },
      }),
      this.prisma.user.count({
        where: {
          deletedAt: null,
          role: UserRole.NURSE,
        },
      }),
    ]);

    return {
      total,
      active,
      inactive,
      byRole: {
        admin: adminCount,
        doctor: doctorCount,
        nurse: nurseCount,
      },
    };
  }

  async getAvailableRoles() {
    const roles = await this.prisma.role.findMany({
      where: {
        deletedAt: null,
        enabled: true,
      },
      orderBy: { sort: 'asc' },
    });

    return roles;
  }

  async getLoginLogs(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          userId: userId.toString(),
          action: 'LOGIN',
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({
        where: {
          userId: userId.toString(),
          action: 'LOGIN',
        },
      }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOperationLogs(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          userId: userId.toString(),
          action: { not: 'LOGIN' },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({
        where: {
          userId: userId.toString(),
          action: { not: 'LOGIN' },
        },
      }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
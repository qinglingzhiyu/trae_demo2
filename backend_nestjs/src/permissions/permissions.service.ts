import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { RoleEntity, PermissionEntity } from './entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  // 角色管理
  async createRole(createRoleDto: CreateRoleDto) {
    const { permissionIds, ...roleData } = createRoleDto;

    // 检查角色代码是否已存在
    const existingRole = await this.prisma.role.findUnique({
      where: { code: roleData.code },
    });

    if (existingRole) {
      throw new BadRequestException('角色代码已存在');
    }

    // 创建角色
    const role = await this.prisma.role.create({
      data: {
        ...roleData,
      },
    });

    // 如果有权限ID，创建权限关联
    if (permissionIds && permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });
    }

    return new RoleEntity(role);
  }

  async findAllRoles(query: QueryRoleDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      data: roles.map((role) => new RoleEntity(role)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneRole(id: number) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return new RoleEntity(role);
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const { permissionIds, ...roleData } = updateRoleDto;

    // 检查角色是否存在
    const existingRole = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingRole) {
      throw new NotFoundException('角色不存在');
    }

    // 如果更新代码，检查是否重复
    if (roleData.code && roleData.code !== existingRole.code) {
      const duplicateRole = await this.prisma.role.findUnique({
        where: { code: roleData.code },
      });

      if (duplicateRole) {
        throw new BadRequestException('角色代码已存在');
      }
    }

    // 更新角色
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
      },
    });

    // 如果有权限ID，更新权限关联
    if (permissionIds) {
      // 删除现有权限关联
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });

      // 创建新的权限关联
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        })),
      });
    }

    return new RoleEntity(role);
  }

  async removeRole(id: number, userId?: number) {
    // 检查角色是否存在
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 检查是否有用户使用该角色
    const userCount = await this.prisma.userRole.count({
      where: { roleId: id },
    });

    if (userCount > 0) {
      throw new BadRequestException('该角色下还有用户，无法删除');
    }

    // 软删除角色
    await this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // 记录审计日志
    if (userId) {
      await this.auditLogsService.log(
        userId,
        '权限管理',
        '删除角色',
        `删除角色: ${role.name} (${role.code})`,
        {
          targetType: 'role',
          targetId: id.toString(),
          oldData: { roleId: id, roleName: role.name, roleCode: role.code },
        },
      );
    }

    return { message: '删除成功' };
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    // 检查角色是否存在
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 删除现有权限关联
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // 创建新的权限关联
    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
    });

    return { message: '权限分配成功' };
  }

  // 权限管理
  async findAllPermissions() {
    const permissions = await this.prisma.permission.findMany({
      where: { deletedAt: null },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });

    return permissions.map((permission) => new PermissionEntity(permission));
  }

  async getPermissionTree() {
    const permissions = await this.findAllPermissions();
    return this.buildPermissionTree(permissions);
  }

  private buildPermissionTree(permissions: PermissionEntity[]): PermissionEntity[] {
    const permissionMap = new Map<number, PermissionEntity>();
    const rootPermissions: PermissionEntity[] = [];

    // 创建权限映射
    permissions.forEach((permission) => {
      permission.children = [];
      permissionMap.set(permission.id, permission);
    });

    // 构建树结构
    permissions.forEach((permission) => {
      if (permission.parentId) {
        const parent = permissionMap.get(permission.parentId);
        if (parent) {
          parent.children.push(permission);
        }
      } else {
        rootPermissions.push(permission);
      }
    });

    return rootPermissions;
  }

  async createPermission(createPermissionDto: any) {
    const permission = await this.prisma.permission.create({
      data: {
        ...createPermissionDto,
      },
    });

    return new PermissionEntity(permission);
  }

  async updatePermission(id: number, updatePermissionDto: any) {
    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });

    return new PermissionEntity(updatedPermission);
  }

  async removePermission(id: number, userId?: number) {
    const permission = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    // 检查是否有子权限
    const childrenCount = await this.prisma.permission.count({
      where: { parentId: id, deletedAt: null },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('该权限下还有子权限，无法删除');
    }

    await this.prisma.permission.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // 记录审计日志
    if (userId) {
      await this.auditLogsService.log(
        userId,
        '权限管理',
        '删除权限',
        `删除权限: ${permission.name} (${permission.code})`,
        {
          targetType: 'permission',
          targetId: id.toString(),
          oldData: { permissionId: id, permissionName: permission.name, permissionCode: permission.code },
        },
      );
    }

    return { message: '删除成功' };
  }
}
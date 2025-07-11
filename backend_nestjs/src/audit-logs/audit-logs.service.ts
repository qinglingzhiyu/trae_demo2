import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditLogEntity, AuditLogStatsEntity } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
    const auditLog = await this.prisma.auditLog.create({
      data: {
        userId: createAuditLogDto.userId.toString(),
        username: '',
        userRealName: '',
        action: createAuditLogDto.action,
        resource: createAuditLogDto.module,
        resourceId: createAuditLogDto.targetId,
        method: 'POST',
        path: '',
        ip: createAuditLogDto.ipAddress || '',
        userAgent: createAuditLogDto.userAgent || '',
        requestData: createAuditLogDto.oldData ? JSON.stringify(createAuditLogDto.oldData) : null,
        responseData: createAuditLogDto.newData ? JSON.stringify(createAuditLogDto.newData) : null,
        status: createAuditLogDto.result?.toLowerCase() || 'success',
        errorMessage: createAuditLogDto.errorMessage,
        duration: 0,
      },
    });

    return new AuditLogEntity(auditLog);
  }

  async findAll(query: QueryAuditLogDto) {
    const {
      page = 1,
      limit = 10,
      search,
      userId,
      module,
      action,
      resource,
      resourceId,
      startTime,
      endTime,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' as const } },
          { userRealName: { contains: search, mode: 'insensitive' as const } },
          { resource: { contains: search, mode: 'insensitive' as const } },
          { action: { contains: search, mode: 'insensitive' as const } },
          { resourceId: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(userId && { userId }),
      ...(module && { resource: module }),
      ...(resource && { resource }),
      ...(resourceId && { resourceId }),
      ...(action && { action }),
      ...(startTime || endTime
        ? {
            createdAt: {
              ...(startTime && { gte: new Date(startTime) }),
              ...(endTime && { lte: new Date(endTime) }),
            },
          }
        : {}),
    };

    const [auditLogs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: auditLogs.map((log) => new AuditLogEntity(log)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const auditLog = await this.prisma.auditLog.findFirst({
      where: { id, deletedAt: null },

    });

    if (!auditLog) {
      throw new NotFoundException('操作日志不存在');
    }

    return new AuditLogEntity(auditLog);
  }

  async findByUser(userId: number, query: QueryAuditLogDto) {
    return this.findAll({ ...query, userId: userId.toString() });
  }

  async findByTarget(targetType: string, targetId: string, query: QueryAuditLogDto) {
    return this.findAll({ ...query, resourceId: targetId });
  }

  async getStats(startTime?: string, endTime?: string) {
    // 构建简单的where条件
    const where: any = { deletedAt: null };
    if (startTime || endTime) {
      where.createdAt = {};
      if (startTime) {
        where.createdAt.gte = new Date(startTime);
      }
      if (endTime) {
        where.createdAt.lte = new Date(endTime);
      }
    }

    // 获取基础统计
    const [totalOperations, successOperations, failureOperations] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.count({ where: { ...where, result: 'SUCCESS' } }),
      this.prisma.auditLog.count({ where: { ...where, result: 'FAILURE' } }),
    ]);

    // 获取时间范围统计
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOperations, weekOperations, monthOperations] = await Promise.all([
      this.prisma.auditLog.count({
        where: { createdAt: { gte: todayStart }, deletedAt: null },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: weekStart }, deletedAt: null },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: monthStart }, deletedAt: null },
      }),
    ]);

    // 获取模块统计
    const moduleStats = await this.prisma.auditLog.groupBy({
      by: ['resource'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取动作统计
    const actionStats = await this.prisma.auditLog.groupBy({
      by: ['action'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取用户统计
    const userStatsRaw = await this.prisma.auditLog.groupBy({
      by: ['userId'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取用户信息
    const userIds = userStatsRaw.map((stat) => Number(stat.userId));
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    const userStats = userStatsRaw.map((stat) => {
      const user = userMap.get(Number(stat.userId));
      return {
        userId: Number(stat.userId),
        username: user?.name || '未知用户',
        count: stat._count.id,
        percentage: totalOperations > 0 ? (stat._count.id / totalOperations) * 100 : 0,
      };
    });

    return new AuditLogStatsEntity({
      totalOperations,
      successOperations,
      failureOperations,
      todayOperations,
      weekOperations,
      monthOperations,
      moduleStats: moduleStats.map((stat) => ({
        module: stat.resource,
        count: stat._count.id,
        percentage: totalOperations > 0 ? (stat._count.id / totalOperations) * 100 : 0,
      })),
      actionStats: actionStats.map((stat) => ({
        action: stat.action,
        count: stat._count.id,
        percentage: totalOperations > 0 ? (stat._count.id / totalOperations) * 100 : 0,
      })),
      userStats: userStats.map(stat => ({
        ...stat,
        userId: stat.userId.toString()
      })),
    });
  }

  async getModules() {
    const modules = await this.prisma.auditLog.groupBy({
      by: ['resource'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { resource: 'asc' },
    });

    return modules.map((module) => ({
      name: module.resource,
      count: module._count.id,
    }));
  }

  async getActions() {
    const actions = await this.prisma.auditLog.groupBy({
      by: ['action'],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { action: 'asc' },
    });

    return actions.map((action) => ({
      name: action.action,
      count: action._count.id,
    }));
  }

  async export(query: QueryAuditLogDto) {
    // 导出时不分页，获取所有符合条件的数据
    const { data } = await this.findAll({ ...query, page: 1, limit: 10000 });
    
    return {
      data,
      filename: `audit_logs_${new Date().toISOString().split('T')[0]}.json`,
      total: data.length,
    };
  }

  async remove(id: number) {
    const auditLog = await this.prisma.auditLog.findUnique({
      where: { id, deletedAt: null },
    });

    if (!auditLog) {
      throw new NotFoundException('操作日志不存在');
    }

    await this.prisma.auditLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '软删除成功' };
  }

  async batchRemove(ids: number[]) {
    const result = await this.prisma.auditLog.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return {
      message: `批量软删除成功，共删除 ${result.count} 条记录`,
      deletedCount: result.count,
    };
  }

  async cleanup(days: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.auditLog.updateMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    return {
      message: `清理完成，软删除了 ${days} 天前的 ${result.count} 条日志记录`,
      deletedCount: result.count,
      cutoffDate,
    };
  }

  // 便捷方法：记录操作日志
  async log(
    userId: number,
    module: string,
    action: string,
    description: string,
    options?: {
      targetType?: string;
      targetId?: string;
      oldData?: any;
      newData?: any;
      result?: 'SUCCESS' | 'FAILURE';
      errorMessage?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    return this.create({
      userId,
      module,
      action,
      description,
      targetId: options?.targetId,
      oldData: options?.oldData,
      newData: options?.newData,
      result: options?.result || 'SUCCESS',
      errorMessage: options?.errorMessage,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });
  }
}
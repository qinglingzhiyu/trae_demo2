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
        ...createAuditLogDto,
        result: createAuditLogDto.result || 'SUCCESS',
        oldData: createAuditLogDto.oldData || {},
        newData: createAuditLogDto.newData || {},
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
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
      targetType,
      result,
      startTime,
      endTime,
      ipAddress,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' as const } },
          { module: { contains: search, mode: 'insensitive' as const } },
          { action: { contains: search, mode: 'insensitive' as const } },
          { targetType: { contains: search, mode: 'insensitive' as const } },
          { targetId: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(userId && { userId }),
      ...(module && { module }),
      ...(action && { action }),
      ...(targetType && { targetType }),
      ...(result && { result }),
      ...(ipAddress && { ipAddress }),
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
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
            },
          },
        },
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
    const auditLog = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!auditLog) {
      throw new NotFoundException('操作日志不存在');
    }

    return new AuditLogEntity(auditLog);
  }

  async findByUser(userId: number, query: QueryAuditLogDto) {
    return this.findAll({ ...query, userId });
  }

  async findByTarget(targetType: string, targetId: string, query: QueryAuditLogDto) {
    return this.findAll({ ...query, targetType });
  }

  async getStats(startTime?: string, endTime?: string) {
    const where = {
      ...(startTime || endTime
        ? {
            createdAt: {
              ...(startTime && { gte: new Date(startTime) }),
              ...(endTime && { lte: new Date(endTime) }),
            },
          }
        : {}),
    };

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
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: weekStart } },
      }),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: monthStart } },
      }),
    ]);

    // 获取模块统计
    const moduleStats = await this.prisma.auditLog.groupBy({
      by: ['module'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取动作统计
    const actionStats = await this.prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取用户统计
    const userStatsRaw = await this.prisma.auditLog.groupBy({
      by: ['userId'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 获取用户信息
    const userIds = userStatsRaw.map((stat) => stat.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, name: true },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    const userStats = userStatsRaw.map((stat) => {
      const user = userMap.get(stat.userId);
      return {
        userId: stat.userId,
        username: user?.username || '未知用户',
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
        module: stat.module,
        count: stat._count.id,
        percentage: totalOperations > 0 ? (stat._count.id / totalOperations) * 100 : 0,
      })),
      actionStats: actionStats.map((stat) => ({
        action: stat.action,
        count: stat._count.id,
        percentage: totalOperations > 0 ? (stat._count.id / totalOperations) * 100 : 0,
      })),
      userStats,
    });
  }

  async getModules() {
    const modules = await this.prisma.auditLog.groupBy({
      by: ['module'],
      _count: { id: true },
      orderBy: { module: 'asc' },
    });

    return modules.map((module) => ({
      name: module.module,
      count: module._count.id,
    }));
  }

  async getActions() {
    const actions = await this.prisma.auditLog.groupBy({
      by: ['action'],
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
      where: { id },
    });

    if (!auditLog) {
      throw new NotFoundException('操作日志不存在');
    }

    await this.prisma.auditLog.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  async batchRemove(ids: number[]) {
    const result = await this.prisma.auditLog.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      message: `批量删除成功，共删除 ${result.count} 条记录`,
      deletedCount: result.count,
    };
  }

  async cleanup(days: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      message: `清理完成，删除了 ${days} 天前的 ${result.count} 条日志记录`,
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
      targetType: options?.targetType,
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
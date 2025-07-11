import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { RestoreBackupDto } from './dto/restore-backup.dto';
import { QueryBackupDto } from './dto/query-backup.dto';
import {
  BackupEntity,
  RestoreEntity,
  BackupStatsEntity,
} from './entities/backup.entity';

@Injectable()
export class BackupService {
  // 模拟数据存储
  private backups: BackupEntity[] = [];
  private restores: RestoreEntity[] = [];
  private autoConfigs: BackupEntity[] = [];
  private nextId = 1;
  private nextRestoreId = 1;

  constructor(private auditLogsService: AuditLogsService) {
    // 初始化一些示例数据
    this.initSampleData();
  }

  // 备份类型常量
  private readonly BACKUP_TYPES = ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'];

  // 备份状态常量
  private readonly BACKUP_STATUSES = ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED'];

  // 可备份范围常量
  private readonly BACKUP_SCOPES = [
    'users',
    'roles',
    'permissions',
    'orders',
    'patients',
    'system_params',
    'dictionaries',
    'audit_logs',
    'notifications',
  ];



  /**
   * 创建备份
   */
  async create(createBackupDto: CreateBackupDto): Promise<BackupEntity> {
    // 验证备份范围
    if (createBackupDto.scope?.length) {
      const invalidScopes = createBackupDto.scope.filter(
        (scope) => !this.BACKUP_SCOPES.includes(scope),
      );
      if (invalidScopes.length > 0) {
        throw new BadRequestException(`无效的备份范围: ${invalidScopes.join(', ')}`);
      }
    }

    // 验证加密配置
    if (createBackupDto.isEncrypted && !createBackupDto.password) {
      throw new BadRequestException('启用加密时必须提供密码');
    }

    const backup = new BackupEntity({
      id: this.nextId++,
      name: createBackupDto.name,
      description: createBackupDto.description || '',
      type: createBackupDto.type,
      status: 'PENDING',
      scope: createBackupDto.scope || this.BACKUP_SCOPES,
      filePath: '',
      fileSize: 0,
      fileSizeFormatted: '0 B',
      compression: createBackupDto.compression || 'ZIP',
      isEncrypted: createBackupDto.isEncrypted || false,
      isAutomatic: !!createBackupDto.cronExpression,
      cronExpression: createBackupDto.cronExpression,
      startedAt: new Date(),
      recordCount: 0,
      createdBy: 1, // 实际应用中应该从认证信息获取
      createdByName: '系统管理员',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.backups.push(backup);

    // 如果是定时备份，添加到自动配置中
    if (createBackupDto.cronExpression) {
      this.autoConfigs.push(backup);
    }

    // 模拟异步备份过程
    this.simulateBackupProcess(backup);

    return backup;
  }

  /**
   * 获取备份列表
   */
  async findAll(query: QueryBackupDto) {
    let filteredBackups = [...this.backups];

    // 搜索过滤
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredBackups = filteredBackups.filter(
        (backup) =>
          backup.name.toLowerCase().includes(searchLower) ||
          backup.description.toLowerCase().includes(searchLower),
      );
    }

    // 类型过滤
    if (query.type) {
      filteredBackups = filteredBackups.filter((backup) => backup.type === query.type);
    }

    // 状态过滤
    if (query.status) {
      filteredBackups = filteredBackups.filter((backup) => backup.status === query.status);
    }

    // 加密过滤
    if (query.isEncrypted !== undefined) {
      filteredBackups = filteredBackups.filter(
        (backup) => backup.isEncrypted === query.isEncrypted,
      );
    }

    // 自动备份过滤
    if (query.isAutomatic !== undefined) {
      filteredBackups = filteredBackups.filter(
        (backup) => backup.isAutomatic === query.isAutomatic,
      );
    }

    // 创建者过滤
    if (query.createdBy) {
      filteredBackups = filteredBackups.filter(
        (backup) => backup.createdBy === query.createdBy,
      );
    }

    // 时间范围过滤
    if (query.startTime) {
      const startTime = new Date(query.startTime);
      filteredBackups = filteredBackups.filter((backup) => backup.createdAt >= startTime);
    }

    if (query.endTime) {
      const endTime = new Date(query.endTime);
      filteredBackups = filteredBackups.filter((backup) => backup.createdAt <= endTime);
    }

    // 排序（按创建时间倒序）
    filteredBackups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 分页
    const total = filteredBackups.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const data = filteredBackups.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取备份详情
   */
  async findOne(id: number): Promise<BackupEntity> {
    const backup = this.backups.find((b) => b.id === id);
    if (!backup) {
      throw new NotFoundException(`备份 ID ${id} 不存在`);
    }
    return backup;
  }

  /**
   * 删除备份
   */
  async remove(id: number, userId?: number): Promise<void> {
    const backup = await this.findOne(id);

    // 如果备份正在进行中，不允许删除
    if (backup.status === 'RUNNING') {
      throw new BadRequestException('正在进行的备份不能删除');
    }

    const index = this.backups.findIndex((b) => b.id === id);
    this.backups.splice(index, 1);

    // 如果是自动配置，也要从自动配置中删除
    const autoIndex = this.autoConfigs.findIndex((c) => c.id === id);
    if (autoIndex !== -1) {
      this.autoConfigs.splice(autoIndex, 1);
    }

    // 记录审计日志
    if (userId) {
      await this.auditLogsService.log(
        userId,
        '数据备份恢复',
        '删除备份',
        `删除备份: ${backup.name}`,
        {
          targetType: 'backup',
          targetId: id.toString(),
          oldData: { backupId: id, backupName: backup.name, backupType: backup.type },
        },
      );
    }

    // 这里应该删除实际的备份文件
    console.log(`删除备份文件: ${backup.filePath}`);
  }

  /**
   * 批量删除备份
   */
  async removeBatch(ids: number[], userId?: number): Promise<void> {
    const deletedBackups = [];
    for (const id of ids) {
      try {
        const backup = await this.findOne(id);
        deletedBackups.push(backup.name);
        await this.remove(id, userId);
      } catch (error) {
        console.error(`删除备份 ${id} 失败:`, error.message);
      }
    }

    // 记录批量删除的审计日志
    if (userId && deletedBackups.length > 0) {
      await this.auditLogsService.log(
        userId,
        '数据备份恢复',
        '批量删除备份',
        `批量删除 ${deletedBackups.length} 个备份`,
        {
          targetType: 'backup',
          oldData: { deletedCount: deletedBackups.length, backupNames: deletedBackups },
        },
      );
    }
  }

  /**
   * 获取备份状态
   */
  async getStatus(id: number): Promise<BackupEntity> {
    return this.findOne(id);
  }

  /**
   * 停止备份任务
   */
  async stop(id: number): Promise<void> {
    const backup = await this.findOne(id);

    if (backup.status !== 'RUNNING') {
      throw new BadRequestException('只能停止正在运行的备份任务');
    }

    backup.status = 'CANCELLED';
    backup.completedAt = new Date();
    backup.duration = Math.floor(
      (backup.completedAt.getTime() - backup.startedAt.getTime()) / 1000,
    );
    backup.durationFormatted = this.formatDuration(backup.duration);
    backup.updatedAt = new Date();
  }

  /**
   * 重试备份任务
   */
  async retry(id: number): Promise<BackupEntity> {
    const backup = await this.findOne(id);

    if (backup.status === 'RUNNING') {
      throw new BadRequestException('正在运行的备份任务不能重试');
    }

    // 重置备份状态
    backup.status = 'PENDING';
    backup.startedAt = new Date();
    backup.completedAt = undefined;
    backup.duration = undefined;
    backup.durationFormatted = undefined;
    backup.errorMessage = undefined;
    backup.updatedAt = new Date();

    // 重新开始备份过程
    this.simulateBackupProcess(backup);

    return backup;
  }

  /**
   * 配置自动备份
   */
  async configAutoBackup(createBackupDto: CreateBackupDto): Promise<void> {
    if (!createBackupDto.cronExpression) {
      throw new BadRequestException('自动备份必须提供Cron表达式');
    }

    await this.create(createBackupDto);
  }

  /**
   * 获取自动备份配置
   */
  async getAutoBackupConfig() {
    return {
      data: this.autoConfigs,
      total: this.autoConfigs.length,
    };
  }

  /**
   * 删除自动备份配置
   */
  async removeAutoBackupConfig(id: number, userId?: number): Promise<void> {
    const config = this.autoConfigs.find((c) => c.id === id);
    if (!config) {
      throw new NotFoundException(`自动备份配置 ID ${id} 不存在`);
    }

    const index = this.autoConfigs.findIndex((c) => c.id === id);
    this.autoConfigs.splice(index, 1);

    // 记录审计日志
    if (userId) {
      await this.auditLogsService.log(
        userId,
        '数据备份恢复',
        '删除自动备份配置',
        `删除自动备份配置: ${config.name}`,
        {
          targetType: 'backup_config',
          targetId: id.toString(),
          oldData: { configId: id, configName: config.name, cronExpression: config.cronExpression },
        },
      );
    }
  }

  /**
   * 恢复数据
   */
  async restore(restoreBackupDto: RestoreBackupDto): Promise<RestoreEntity> {
    const backupId = parseInt(restoreBackupDto.backupId);
    const backup = await this.findOne(backupId);

    if (backup.status !== 'SUCCESS') {
      throw new BadRequestException('只能从成功的备份中恢复数据');
    }

    // 验证密码（如果备份加密）
    if (backup.isEncrypted && !restoreBackupDto.password) {
      throw new BadRequestException('加密的备份需要提供密码');
    }

    // 验证恢复范围
    if (restoreBackupDto.scope?.length) {
      const invalidScopes = restoreBackupDto.scope.filter(
        (scope) => !backup.scope.includes(scope),
      );
      if (invalidScopes.length > 0) {
        throw new BadRequestException(`备份中不包含以下范围: ${invalidScopes.join(', ')}`);
      }
    }

    const restore = new RestoreEntity({
      id: this.nextRestoreId++,
      backupId: backup.id,
      backupName: backup.name,
      status: 'PENDING',
      scope: restoreBackupDto.scope || backup.scope,
      overwrite: restoreBackupDto.overwrite || false,
      backupCurrent: restoreBackupDto.backupCurrent !== false,
      startedAt: new Date(),
      recordCount: 0,
      createdBy: 1, // 实际应用中应该从认证信息获取
      createdByName: '系统管理员',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.restores.push(restore);

    // 如果需要备份当前数据
    if (restore.backupCurrent) {
      const preRestoreBackup = await this.create({
        name: restoreBackupDto.preRestoreBackupName || `恢复前备份_${new Date().toISOString().slice(0, 10)}`,
        description: `恢复操作前的数据备份 (恢复记录ID: ${restore.id})`,
        type: 'FULL',
        scope: restore.scope,
      });
      restore.preRestoreBackupId = preRestoreBackup.id;
    }

    // 模拟异步恢复过程
    this.simulateRestoreProcess(restore);

    return restore;
  }

  /**
   * 获取恢复记录列表
   */
  async getRestoreHistory(query: QueryBackupDto) {
    let filteredRestores = [...this.restores];

    // 搜索过滤
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredRestores = filteredRestores.filter((restore) =>
        restore.backupName.toLowerCase().includes(searchLower),
      );
    }

    // 状态过滤
    if (query.status) {
      filteredRestores = filteredRestores.filter((restore) => restore.status === query.status);
    }

    // 创建者过滤
    if (query.createdBy) {
      filteredRestores = filteredRestores.filter(
        (restore) => restore.createdBy === query.createdBy,
      );
    }

    // 时间范围过滤
    if (query.startTime) {
      const startTime = new Date(query.startTime);
      filteredRestores = filteredRestores.filter((restore) => restore.createdAt >= startTime);
    }

    if (query.endTime) {
      const endTime = new Date(query.endTime);
      filteredRestores = filteredRestores.filter((restore) => restore.createdAt <= endTime);
    }

    // 排序（按创建时间倒序）
    filteredRestores.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 分页
    const total = filteredRestores.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const data = filteredRestores.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取恢复状态
   */
  async getRestoreStatus(id: number): Promise<RestoreEntity> {
    const restore = this.restores.find((r) => r.id === id);
    if (!restore) {
      throw new NotFoundException(`恢复记录 ID ${id} 不存在`);
    }
    return restore;
  }

  /**
   * 验证备份文件
   */
  async validate(id: number): Promise<{ valid: boolean; message?: string }> {
    const backup = await this.findOne(id);

    if (backup.status !== 'SUCCESS') {
      return {
        valid: false,
        message: '只能验证成功的备份文件',
      };
    }

    // 模拟验证过程
    const isValid = Math.random() > 0.1; // 90% 概率验证成功

    if (isValid) {
      return {
        valid: true,
        message: '备份文件验证成功，数据完整性良好',
      };
    } else {
      return {
        valid: false,
        message: '备份文件验证失败，可能存在数据损坏',
      };
    }
  }

  /**
   * 下载备份文件
   */
  async download(id: number, res: Response): Promise<StreamableFile> {
    const backup = await this.findOne(id);

    if (backup.status !== 'SUCCESS') {
      throw new BadRequestException('只能下载成功的备份文件');
    }

    // 实际应用中应该检查文件是否存在
    const filePath = backup.filePath || `/tmp/backup_${id}.zip`;
    const fileName = `${backup.name}.${backup.compression.toLowerCase()}`;

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    // 模拟文件流（实际应用中应该返回真实的文件流）
    const mockFilePath = join(process.cwd(), 'README.md'); // 使用项目根目录的 README.md 作为示例
    const file = createReadStream(mockFilePath);
    return new StreamableFile(file);
  }

  /**
   * 清理过期备份
   */
  async cleanup(
    days: number = 30,
    keepCount: number = 10,
  ): Promise<{ deletedCount: number; freedSpace: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // 获取需要清理的备份（排除自动配置和最近的备份）
    const backupsToDelete = this.backups
      .filter((backup) => {
        // 不删除自动配置
        if (backup.isAutomatic) return false;
        // 不删除最近的备份
        if (backup.createdAt > cutoffDate) return false;
        return true;
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) // 按时间升序排序
      .slice(0, -keepCount); // 保留最近的 keepCount 个备份

    let deletedCount = 0;
    let freedSpace = 0;

    for (const backup of backupsToDelete) {
      try {
        freedSpace += backup.fileSize;
        await this.remove(backup.id);
        deletedCount++;
      } catch (error) {
        console.error(`清理备份 ${backup.id} 失败:`, error.message);
      }
    }

    return { deletedCount, freedSpace };
  }

  /**
   * 获取备份统计
   */
  async getStats(): Promise<BackupStatsEntity> {
    const total = this.backups.length;
    const success = this.backups.filter((b) => b.status === 'SUCCESS').length;
    const failed = this.backups.filter((b) => b.status === 'FAILED').length;
    const running = this.backups.filter((b) => b.status === 'RUNNING').length;

    // 计算总大小
    const totalSize = this.backups.reduce((sum, backup) => sum + backup.fileSize, 0);
    const averageSize = total > 0 ? Math.floor(totalSize / total) : 0;

    // 按类型统计
    const byType: Record<string, number> = {};
    this.backups.forEach((backup) => {
      byType[backup.type] = (byType[backup.type] || 0) + 1;
    });

    // 按状态统计
    const byStatus: Record<string, number> = {};
    this.backups.forEach((backup) => {
      byStatus[backup.status] = (byStatus[backup.status] || 0) + 1;
    });

    // 时间统计
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = this.backups.filter((b) => b.createdAt >= today).length;
    const weekCount = this.backups.filter((b) => b.createdAt >= weekAgo).length;
    const monthCount = this.backups.filter((b) => b.createdAt >= monthAgo).length;

    // 最近备份时间
    const lastBackup = this.backups
      .filter((b) => b.status === 'SUCCESS')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    // 下次自动备份时间（模拟）
    const nextAutoBackup = this.autoConfigs.length > 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined;

    return new BackupStatsEntity({
      totalBackups: total,
      successCount: success,
      failedCount: failed,
      runningCount: running,
      totalSize,
      totalSizeFormatted: this.formatFileSize(totalSize),
      averageSize,
      averageSizeFormatted: this.formatFileSize(averageSize),
      byType,
      byStatus,
      lastBackupTime: lastBackup?.createdAt || new Date(),
      nextBackupTime: nextAutoBackup,
      todayCount,
      weekCount,
      monthCount,
    });
  }

  /**
   * 获取备份类型列表
   */
  async getTypes(): Promise<string[]> {
    return this.BACKUP_TYPES;
  }

  /**
   * 获取可备份范围列表
   */
  async getScopes(): Promise<string[]> {
    return this.BACKUP_SCOPES;
  }

  /**
   * 模拟备份过程
   */
  private async simulateBackupProcess(backup: BackupEntity): Promise<void> {
    // 延迟开始
    setTimeout(() => {
      backup.status = 'RUNNING';
      backup.updatedAt = new Date();

      // 模拟备份过程（3-8秒）
      const duration = Math.floor(Math.random() * 5000) + 3000;
      setTimeout(() => {
        // 90% 概率成功
        const success = Math.random() > 0.1;
        
        if (success) {
          backup.status = 'SUCCESS';
          backup.completedAt = new Date();
          backup.duration = Math.floor(
            (backup.completedAt.getTime() - backup.startedAt.getTime()) / 1000,
          );
          backup.durationFormatted = this.formatDuration(backup.duration);
          backup.filePath = `/backups/backup_${backup.id}_${Date.now()}.${backup.compression.toLowerCase()}`;
          backup.fileSize = Math.floor(Math.random() * 100000000) + 1000000; // 1MB - 100MB
          backup.fileSizeFormatted = this.formatFileSize(backup.fileSize);
          backup.recordCount = Math.floor(Math.random() * 50000) + 1000;
          backup.checksum = `sha256:${Math.random().toString(36).substring(2, 15)}`;
        } else {
          backup.status = 'FAILED';
          backup.completedAt = new Date();
          backup.duration = Math.floor(
            (backup.completedAt.getTime() - backup.startedAt.getTime()) / 1000,
          );
          backup.durationFormatted = this.formatDuration(backup.duration);
          backup.errorMessage = '备份过程中发生错误：磁盘空间不足';
        }
        
        backup.updatedAt = new Date();
      }, duration);
    }, 1000);
  }

  /**
   * 模拟恢复过程
   */
  private async simulateRestoreProcess(restore: RestoreEntity): Promise<void> {
    // 延迟开始
    setTimeout(() => {
      restore.status = 'RUNNING';
      restore.updatedAt = new Date();

      // 模拟恢复过程（2-6秒）
      const duration = Math.floor(Math.random() * 4000) + 2000;
      setTimeout(() => {
        // 95% 概率成功
        const success = Math.random() > 0.05;
        
        if (success) {
          restore.status = 'SUCCESS';
          restore.completedAt = new Date();
          restore.duration = Math.floor(
            (restore.completedAt.getTime() - restore.startedAt.getTime()) / 1000,
          );
          restore.durationFormatted = this.formatDuration(restore.duration);
          restore.recordCount = Math.floor(Math.random() * 40000) + 500;
        } else {
          restore.status = 'FAILED';
          restore.completedAt = new Date();
          restore.duration = Math.floor(
            (restore.completedAt.getTime() - restore.startedAt.getTime()) / 1000,
          );
          restore.durationFormatted = this.formatDuration(restore.duration);
          restore.errorMessage = '恢复过程中发生错误：数据格式不兼容';
        }
        
        restore.updatedAt = new Date();
      }, duration);
    }, 1000);
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 格式化持续时间
   */
  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}小时${minutes}分` : `${hours}小时`;
    }
  }

  /**
   * 初始化示例数据
   */
  private initSampleData(): void {
    // 创建一些示例备份
    const sampleBackups = [
      {
        name: '系统完整备份_20231201',
        description: '每日定时完整备份',
        type: 'FULL',
        status: 'SUCCESS',
        scope: this.BACKUP_SCOPES,
        compression: 'ZIP',
        isEncrypted: false,
        isAutomatic: true,
        cronExpression: '0 2 * * *',
      },
      {
        name: '用户数据备份_20231130',
        description: '用户数据专项备份',
        type: 'INCREMENTAL',
        status: 'SUCCESS',
        scope: ['users', 'roles', 'permissions'],
        compression: 'GZIP',
        isEncrypted: true,
        isAutomatic: false,
      },
      {
        name: '订单数据备份_20231129',
        description: '订单数据备份',
        type: 'DIFFERENTIAL',
        status: 'FAILED',
        scope: ['orders'],
        compression: 'ZIP',
        isEncrypted: false,
        isAutomatic: false,
      },
    ];

    sampleBackups.forEach((backup, index) => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - (2 - index));
      startTime.setHours(2, 0, 0, 0);
      
      const completedTime = new Date(startTime);
      completedTime.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 10) + 2);
      
      const duration = Math.floor((completedTime.getTime() - startTime.getTime()) / 1000);
      const fileSize = backup.status === 'SUCCESS' ? Math.floor(Math.random() * 50000000) + 5000000 : 0;
      
      const entity = new BackupEntity({
        id: this.nextId++,
        ...backup,
        filePath: backup.status === 'SUCCESS' ? `/backups/backup_${this.nextId - 1}_${startTime.getTime()}.${backup.compression.toLowerCase()}` : '',
        fileSize,
        fileSizeFormatted: this.formatFileSize(fileSize),
        startedAt: startTime,
        completedAt: backup.status !== 'PENDING' ? completedTime : undefined,
        duration: backup.status !== 'PENDING' ? duration : undefined,
        durationFormatted: backup.status !== 'PENDING' ? this.formatDuration(duration) : undefined,
        errorMessage: backup.status === 'FAILED' ? '备份过程中发生错误：磁盘空间不足' : undefined,
        recordCount: backup.status === 'SUCCESS' ? Math.floor(Math.random() * 30000) + 5000 : 0,
        checksum: backup.status === 'SUCCESS' ? `sha256:${Math.random().toString(36).substring(2, 15)}` : undefined,
        createdBy: 1,
        createdByName: '系统管理员',
        createdAt: startTime,
        updatedAt: completedTime,
      });
      
      this.backups.push(entity);
      
      // 如果是自动备份，添加到自动配置中
      if (entity.isAutomatic) {
        this.autoConfigs.push(entity);
      }
    });

    // 创建一些示例恢复记录
    const sampleRestores = [
      {
        backupId: 1,
        backupName: '系统完整备份_20231201',
        status: 'SUCCESS',
        scope: ['users', 'orders'],
        overwrite: false,
        backupCurrent: true,
      },
      {
        backupId: 2,
        backupName: '用户数据备份_20231130',
        status: 'FAILED',
        scope: ['users'],
        overwrite: true,
        backupCurrent: false,
      },
    ];

    sampleRestores.forEach((restore, index) => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - (1 - index));
      startTime.setHours(10, 0, 0, 0);
      
      const completedTime = new Date(startTime);
      completedTime.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 5) + 1);
      
      const duration = Math.floor((completedTime.getTime() - startTime.getTime()) / 1000);
      
      const entity = new RestoreEntity({
        id: this.nextRestoreId++,
        ...restore,
        preRestoreBackupId: restore.backupCurrent ? 3 : undefined,
        startedAt: startTime,
        completedAt: completedTime,
        duration,
        durationFormatted: this.formatDuration(duration),
        errorMessage: restore.status === 'FAILED' ? '恢复过程中发生错误：数据格式不兼容' : undefined,
        recordCount: restore.status === 'SUCCESS' ? Math.floor(Math.random() * 20000) + 2000 : 0,
        createdBy: 1,
        createdByName: '系统管理员',
        createdAt: startTime,
        updatedAt: completedTime,
      });
      
      this.restores.push(entity);
    });
  }
}
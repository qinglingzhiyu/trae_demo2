import { ApiProperty } from '@nestjs/swagger';

export class BackupEntity {
  @ApiProperty({ description: '备份ID', example: 1 })
  id: number;

  @ApiProperty({ description: '备份名称', example: '系统数据备份_20231201' })
  name: string;

  @ApiProperty({ description: '备份描述', example: '定期系统数据备份' })
  description: string;

  @ApiProperty({ description: '备份类型', example: 'FULL' })
  type: string;

  @ApiProperty({ description: '备份状态', example: 'SUCCESS' })
  status: string;

  @ApiProperty({ description: '备份范围', example: ['users', 'orders', 'system_params'] })
  scope: string[];

  @ApiProperty({ description: '文件路径', example: '/backups/backup_20231201_123456.zip' })
  filePath: string;

  @ApiProperty({ description: '文件大小（字节）', example: 1048576 })
  fileSize: number;

  @ApiProperty({ description: '文件大小（可读格式）', example: '1.0 MB' })
  fileSizeFormatted: string;

  @ApiProperty({ description: '压缩格式', example: 'ZIP' })
  compression: string;

  @ApiProperty({ description: '是否加密', example: false })
  isEncrypted: boolean;

  @ApiProperty({ description: '是否自动备份', example: false })
  isAutomatic: boolean;

  @ApiProperty({ description: 'Cron表达式', example: '0 2 * * *', required: false })
  cronExpression?: string;

  @ApiProperty({ description: '备份开始时间', example: '2023-12-01T02:00:00.000Z' })
  startedAt: Date;

  @ApiProperty({ description: '备份完成时间', example: '2023-12-01T02:05:30.000Z', required: false })
  completedAt?: Date;

  @ApiProperty({ description: '备份耗时（秒）', example: 330, required: false })
  duration?: number;

  @ApiProperty({ description: '备份耗时（可读格式）', example: '5分30秒', required: false })
  durationFormatted?: string;

  @ApiProperty({ description: '错误信息', example: null, required: false })
  errorMessage?: string;

  @ApiProperty({ description: '备份记录数', example: 10000 })
  recordCount: number;

  @ApiProperty({ description: '校验和', example: 'sha256:abc123...', required: false })
  checksum?: string;

  @ApiProperty({ description: '创建者ID', example: 1 })
  createdBy: number;

  @ApiProperty({ description: '创建者姓名', example: '系统管理员' })
  createdByName: string;

  @ApiProperty({ description: '创建时间', example: '2023-12-01T02:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-12-01T02:05:30.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<BackupEntity>) {
    Object.assign(this, partial);
  }
}

export class RestoreEntity {
  @ApiProperty({ description: '恢复记录ID', example: 1 })
  id: number;

  @ApiProperty({ description: '备份ID', example: 1 })
  backupId: number;

  @ApiProperty({ description: '备份名称', example: '系统数据备份_20231201' })
  backupName: string;

  @ApiProperty({ description: '恢复状态', example: 'SUCCESS' })
  status: string;

  @ApiProperty({ description: '恢复范围', example: ['users', 'orders'] })
  scope: string[];

  @ApiProperty({ description: '是否覆盖现有数据', example: false })
  overwrite: boolean;

  @ApiProperty({ description: '是否备份当前数据', example: true })
  backupCurrent: boolean;

  @ApiProperty({ description: '恢复前备份ID', example: 2, required: false })
  preRestoreBackupId?: number;

  @ApiProperty({ description: '恢复开始时间', example: '2023-12-01T10:00:00.000Z' })
  startedAt: Date;

  @ApiProperty({ description: '恢复完成时间', example: '2023-12-01T10:03:45.000Z', required: false })
  completedAt?: Date;

  @ApiProperty({ description: '恢复耗时（秒）', example: 225, required: false })
  duration?: number;

  @ApiProperty({ description: '恢复耗时（可读格式）', example: '3分45秒', required: false })
  durationFormatted?: string;

  @ApiProperty({ description: '错误信息', example: null, required: false })
  errorMessage?: string;

  @ApiProperty({ description: '恢复记录数', example: 8500 })
  recordCount: number;

  @ApiProperty({ description: '创建者ID', example: 1 })
  createdBy: number;

  @ApiProperty({ description: '创建者姓名', example: '系统管理员' })
  createdByName: string;

  @ApiProperty({ description: '创建时间', example: '2023-12-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-12-01T10:03:45.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<RestoreEntity>) {
    Object.assign(this, partial);
  }
}

export class BackupStatsEntity {
  @ApiProperty({ description: '总备份数', example: 50 })
  totalBackups: number;

  @ApiProperty({ description: '成功备份数', example: 48 })
  successCount: number;

  @ApiProperty({ description: '失败备份数', example: 2 })
  failedCount: number;

  @ApiProperty({ description: '进行中备份数', example: 0 })
  runningCount: number;

  @ApiProperty({ description: '总备份大小（字节）', example: 52428800 })
  totalSize: number;

  @ApiProperty({ description: '总备份大小（可读格式）', example: '50.0 MB' })
  totalSizeFormatted: string;

  @ApiProperty({ description: '平均备份大小（字节）', example: 1048576 })
  averageSize: number;

  @ApiProperty({ description: '平均备份大小（可读格式）', example: '1.0 MB' })
  averageSizeFormatted: string;

  @ApiProperty({ description: '按类型统计', example: { FULL: 30, INCREMENTAL: 15, DIFFERENTIAL: 5 } })
  byType: Record<string, number>;

  @ApiProperty({ description: '按状态统计', example: { SUCCESS: 48, FAILED: 2 } })
  byStatus: Record<string, number>;

  @ApiProperty({ description: '最近备份时间', example: '2023-12-01T02:00:00.000Z' })
  lastBackupTime: Date;

  @ApiProperty({ description: '下次自动备份时间', example: '2023-12-02T02:00:00.000Z', required: false })
  nextBackupTime?: Date;

  @ApiProperty({ description: '今日备份数', example: 1 })
  todayCount: number;

  @ApiProperty({ description: '本周备份数', example: 7 })
  weekCount: number;

  @ApiProperty({ description: '本月备份数', example: 30 })
  monthCount: number;

  constructor(partial: Partial<BackupStatsEntity>) {
    Object.assign(this, partial);
  }
}
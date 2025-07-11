import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Res,
  StreamableFile,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { RestoreBackupDto } from './dto/restore-backup.dto';
import { QueryBackupDto } from './dto/query-backup.dto';
import {
  BackupEntity,
  RestoreEntity,
  BackupStatsEntity,
} from './entities/backup.entity';

@ApiTags('数据备份恢复')
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  @ApiOperation({ summary: '创建备份' })
  @ApiResponse({ status: 201, description: '备份任务创建成功', type: BackupEntity })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createBackupDto: CreateBackupDto): Promise<BackupEntity> {
    return this.backupService.create(createBackupDto);
  }

  @Get()
  @ApiOperation({ summary: '获取备份列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [BackupEntity] })
  async findAll(@Query() query: QueryBackupDto) {
    return this.backupService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取备份统计' })
  @ApiResponse({ status: 200, description: '获取成功', type: BackupStatsEntity })
  async getStats(): Promise<BackupStatsEntity> {
    return this.backupService.getStats();
  }

  @Get('types')
  @ApiOperation({ summary: '获取备份类型列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [String] })
  async getTypes(): Promise<string[]> {
    return this.backupService.getTypes();
  }

  @Get('scopes')
  @ApiOperation({ summary: '获取可备份范围列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [String] })
  async getScopes(): Promise<string[]> {
    return this.backupService.getScopes();
  }

  @Get('status/:id')
  @ApiOperation({ summary: '获取备份状态' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: BackupEntity })
  @ApiResponse({ status: 404, description: '备份不存在' })
  async getStatus(@Param('id', ParseIntPipe) id: number): Promise<BackupEntity> {
    return this.backupService.getStatus(id);
  }

  @Post('auto-config')
  @ApiOperation({ summary: '配置自动备份' })
  @ApiResponse({ status: 200, description: '配置成功' })
  @HttpCode(HttpStatus.OK)
  async configAutoBackup(@Body() createBackupDto: CreateBackupDto): Promise<void> {
    return this.backupService.configAutoBackup(createBackupDto);
  }

  @Get('auto-config')
  @ApiOperation({ summary: '获取自动备份配置' })
  @ApiResponse({ status: 200, description: '获取成功', type: [BackupEntity] })
  async getAutoBackupConfig() {
    return this.backupService.getAutoBackupConfig();
  }

  @Post('auto-config/:id/delete')
  @ApiOperation({ summary: '删除自动备份配置' })
  @ApiParam({ name: 'id', description: '备份配置ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  @HttpCode(HttpStatus.OK)
  async removeAutoBackupConfig(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.backupService.removeAutoBackupConfig(id, req.user.userId);
  }

  @Post('restore')
  @ApiOperation({ summary: '恢复数据' })
  @ApiResponse({ status: 200, description: '恢复任务创建成功', type: RestoreEntity })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async restore(@Body() restoreBackupDto: RestoreBackupDto): Promise<RestoreEntity> {
    return this.backupService.restore(restoreBackupDto);
  }

  @Get('restore')
  @ApiOperation({ summary: '获取恢复记录列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [RestoreEntity] })
  async getRestoreHistory(@Query() query: QueryBackupDto) {
    return this.backupService.getRestoreHistory(query);
  }

  @Get('restore/status/:id')
  @ApiOperation({ summary: '获取恢复状态' })
  @ApiParam({ name: 'id', description: '恢复记录ID', type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: RestoreEntity })
  @ApiResponse({ status: 404, description: '恢复记录不存在' })
  async getRestoreStatus(@Param('id', ParseIntPipe) id: number): Promise<RestoreEntity> {
    return this.backupService.getRestoreStatus(id);
  }

  @Post('validate/:id')
  @ApiOperation({ summary: '验证备份文件' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '验证成功' })
  @HttpCode(HttpStatus.OK)
  async validate(@Param('id', ParseIntPipe) id: number): Promise<{ valid: boolean; message?: string }> {
    return this.backupService.validate(id);
  }

  @Get('download/:id')
  @ApiOperation({ summary: '下载备份文件' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '下载成功' })
  @ApiResponse({ status: 404, description: '备份文件不存在' })
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    return this.backupService.download(id, res);
  }

  @Post('cleanup')
  @ApiOperation({ summary: '清理过期备份' })
  @ApiQuery({ name: 'days', description: '保留天数', required: false, type: Number })
  @ApiQuery({ name: 'keepCount', description: '保留数量', required: false, type: Number })
  @ApiResponse({ status: 200, description: '清理成功' })
  @HttpCode(HttpStatus.OK)
  async cleanup(
    @Query('days') days?: number,
    @Query('keepCount') keepCount?: number,
  ): Promise<{ deletedCount: number; freedSpace: number }> {
    return this.backupService.cleanup(days, keepCount);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取备份详情' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: BackupEntity })
  @ApiResponse({ status: 404, description: '备份不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BackupEntity> {
    return this.backupService.findOne(id);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '删除备份' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '备份不存在' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.backupService.remove(id, req.user.userId);
  }

  @Post('batch/delete')
  @ApiOperation({ summary: '批量删除备份' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @HttpCode(HttpStatus.OK)
  async removeBatch(
    @Request() req,
    @Body('ids') ids: number[],
  ): Promise<void> {
    return this.backupService.removeBatch(ids, req.user.userId);
  }

  @Post('stop/:id')
  @ApiOperation({ summary: '停止备份任务' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '停止成功' })
  @HttpCode(HttpStatus.OK)
  async stop(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.backupService.stop(id);
  }

  @Post('retry/:id')
  @ApiOperation({ summary: '重试备份任务' })
  @ApiParam({ name: 'id', description: '备份ID', type: Number })
  @ApiResponse({ status: 200, description: '重试成功', type: BackupEntity })
  async retry(@Param('id', ParseIntPipe) id: number): Promise<BackupEntity> {
    return this.backupService.retry(id);
  }
}
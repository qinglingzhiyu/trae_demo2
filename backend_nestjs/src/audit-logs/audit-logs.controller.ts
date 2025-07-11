import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditLogEntity, AuditLogStatsEntity } from './entities/audit-log.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('操作日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: '创建操作日志' })
  @ApiResponse({ status: 201, description: '创建成功', type: AuditLogEntity })
  async create(@Body() createAuditLogDto: CreateAuditLogDto, @Req() req: Request) {
    // 从请求中获取IP和User-Agent
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.get('User-Agent') || '';
    
    return this.auditLogsService.create({
      ...createAuditLogDto,
      ipAddress,
      userAgent,
    });
  }

  @Get()
  @ApiOperation({ summary: '获取操作日志列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [AuditLogEntity] })
  async findAll(@Query() query: QueryAuditLogDto) {
    return this.auditLogsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取操作日志统计' })
  @ApiResponse({ status: 200, description: '获取成功', type: AuditLogStatsEntity })
  async getStats(@Query() query: { startTime?: string; endTime?: string }) {
    return this.auditLogsService.getStats(query.startTime, query.endTime);
  }

  @Get('modules')
  @ApiOperation({ summary: '获取操作模块列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getModules() {
    return this.auditLogsService.getModules();
  }

  @Get('actions')
  @ApiOperation({ summary: '获取操作动作列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getActions() {
    return this.auditLogsService.getActions();
  }

  @Get('export')
  @ApiOperation({ summary: '导出操作日志' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async export(@Query() query: QueryAuditLogDto) {
    return this.auditLogsService.export(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户操作日志' })
  @ApiResponse({ status: 200, description: '获取成功', type: [AuditLogEntity] })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: QueryAuditLogDto,
  ) {
    return this.auditLogsService.findByUser(userId, query);
  }

  @Get('target/:targetType/:targetId')
  @ApiOperation({ summary: '获取目标资源操作日志' })
  @ApiResponse({ status: 200, description: '获取成功', type: [AuditLogEntity] })
  async findByTarget(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Query() query: QueryAuditLogDto,
  ) {
    return this.auditLogsService.findByTarget(targetType, targetId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取操作日志详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: AuditLogEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogsService.findOne(id);
  }

  @Post('cleanup')
  @ApiOperation({ summary: '清理过期日志' })
  @ApiResponse({ status: 200, description: '清理成功' })
  async cleanup(@Query('days', ParseIntPipe) days: number = 90) {
    return this.auditLogsService.cleanup(days);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '软删除操作日志' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogsService.remove(id);
  }

  @Post('batch/delete')
  @ApiOperation({ summary: '批量软删除操作日志' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async batchRemove(@Body() body: { ids: number[] }) {
    return this.auditLogsService.batchRemove(body.ids);
  }
}
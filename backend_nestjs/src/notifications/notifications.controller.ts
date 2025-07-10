import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import {
  NotificationEntity,
  NotificationReceiverEntity,
  NotificationStatsEntity,
} from './entities/notification.entity';

@ApiTags('消息通知管理')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: '创建通知' })
  @ApiResponse({ status: 201, description: '创建成功', type: NotificationEntity })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationEntity> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: '获取通知列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [NotificationEntity] })
  async findAll(@Query() query: QueryNotificationDto) {
    return this.notificationsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取通知统计' })
  @ApiResponse({ status: 200, description: '获取成功', type: NotificationStatsEntity })
  async getStats(): Promise<NotificationStatsEntity> {
    return this.notificationsService.getStats();
  }

  @Get('types')
  @ApiOperation({ summary: '获取通知类型列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [String] })
  async getTypes(): Promise<string[]> {
    return this.notificationsService.getTypes();
  }

  @Get('levels')
  @ApiOperation({ summary: '获取通知级别列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [String] })
  async getLevels(): Promise<string[]> {
    return this.notificationsService.getLevels();
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的通知' })
  @ApiQuery({ name: 'userId', description: '用户ID', required: true, type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: [NotificationReceiverEntity] })
  async getMyNotifications(
    @Query('userId', ParseIntPipe) userId: number,
    @Query() query: QueryNotificationDto,
  ) {
    return this.notificationsService.getMyNotifications(userId, query);
  }

  @Get('my/stats')
  @ApiOperation({ summary: '获取我的通知统计' })
  @ApiQuery({ name: 'userId', description: '用户ID', required: true, type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: NotificationStatsEntity })
  async getMyStats(@Query('userId', ParseIntPipe) userId: number): Promise<NotificationStatsEntity> {
    return this.notificationsService.getMyStats(userId);
  }

  @Post('send/:id')
  @ApiOperation({ summary: '发送通知' })
  @ApiParam({ name: 'id', description: '通知ID', type: Number })
  @ApiResponse({ status: 200, description: '发送成功' })
  @HttpCode(HttpStatus.OK)
  async send(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notificationsService.send(id);
  }

  @Post('send-batch')
  @ApiOperation({ summary: '批量发送通知' })
  @ApiResponse({ status: 200, description: '发送成功' })
  @HttpCode(HttpStatus.OK)
  async sendBatch(@Body('ids') ids: number[]): Promise<void> {
    return this.notificationsService.sendBatch(ids);
  }

  @Post('mark-read/:receiverId')
  @ApiOperation({ summary: '标记为已读' })
  @ApiParam({ name: 'receiverId', description: '接收记录ID', type: Number })
  @ApiResponse({ status: 200, description: '标记成功' })
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('receiverId', ParseIntPipe) receiverId: number): Promise<void> {
    return this.notificationsService.markAsRead(receiverId);
  }

  @Post('mark-read-batch')
  @ApiOperation({ summary: '批量标记为已读' })
  @ApiResponse({ status: 200, description: '标记成功' })
  @HttpCode(HttpStatus.OK)
  async markAsReadBatch(@Body('receiverIds') receiverIds: number[]): Promise<void> {
    return this.notificationsService.markAsReadBatch(receiverIds);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: '标记全部为已读' })
  @ApiQuery({ name: 'userId', description: '用户ID', required: true, type: Number })
  @ApiResponse({ status: 200, description: '标记成功' })
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Query('userId', ParseIntPipe) userId: number): Promise<void> {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取通知详情' })
  @ApiParam({ name: 'id', description: '通知ID', type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: NotificationEntity })
  @ApiResponse({ status: 404, description: '通知不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<NotificationEntity> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新通知' })
  @ApiParam({ name: 'id', description: '通知ID', type: Number })
  @ApiResponse({ status: 200, description: '更新成功', type: NotificationEntity })
  @ApiResponse({ status: 404, description: '通知不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除通知' })
  @ApiParam({ name: 'id', description: '通知ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '通知不存在' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notificationsService.remove(id);
  }

  @Delete('batch/delete')
  @ApiOperation({ summary: '批量删除通知' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @HttpCode(HttpStatus.OK)
  async removeBatch(@Body('ids') ids: number[]): Promise<void> {
    return this.notificationsService.removeBatch(ids);
  }

  @Delete('receiver/:receiverId')
  @ApiOperation({ summary: '删除接收记录' })
  @ApiParam({ name: 'receiverId', description: '接收记录ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  @HttpCode(HttpStatus.OK)
  async removeReceiver(@Param('receiverId', ParseIntPipe) receiverId: number): Promise<void> {
    return this.notificationsService.removeReceiver(receiverId);
  }

  @Post('cleanup')
  @ApiOperation({ summary: '清理过期通知' })
  @ApiQuery({ name: 'days', description: '保留天数', required: false, type: Number })
  @ApiResponse({ status: 200, description: '清理成功' })
  @HttpCode(HttpStatus.OK)
  async cleanup(@Query('days') days?: number): Promise<void> {
    return this.notificationsService.cleanup(days);
  }
}
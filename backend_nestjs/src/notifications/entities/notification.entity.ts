import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({ description: '通知ID', example: 1 })
  id: number;

  @ApiProperty({ description: '通知标题', example: '系统维护通知' })
  title: string;

  @ApiProperty({ description: '通知内容', example: '系统将于今晚22:00-24:00进行维护，期间可能无法正常使用' })
  content: string;

  @ApiProperty({ description: '通知类型', example: 'SYSTEM' })
  type: string;

  @ApiProperty({ description: '通知级别', example: 'MEDIUM' })
  level: string;

  @ApiProperty({ description: '发送者ID', example: 1, required: false })
  senderId?: number;

  @ApiProperty({ description: '发送者姓名', example: '系统管理员', required: false })
  senderName?: string;

  @ApiProperty({ description: '接收者类型', example: 'USER' })
  receiverType: string;

  @ApiProperty({ description: '关联资源类型', example: 'Order', required: false })
  relatedType?: string;

  @ApiProperty({ description: '关联资源ID', example: '123', required: false })
  relatedId?: string;

  @ApiProperty({ description: '扩展数据', example: { url: '/orders/123' }, required: false })
  extra?: any;

  @ApiProperty({ description: '是否已发送', example: true })
  isSent: boolean;

  @ApiProperty({ description: '发送时间', example: '2023-12-01T10:00:00.000Z', required: false })
  sentAt?: Date;

  @ApiProperty({ description: '定时发送时间', example: '2023-12-31T23:59:59.999Z', required: false })
  scheduledAt?: Date;

  @ApiProperty({ description: '是否启用', example: true })
  isEnabled: boolean;

  @ApiProperty({ description: '创建时间', example: '2023-12-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-12-01T10:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}

export class NotificationReceiverEntity {
  @ApiProperty({ description: '接收记录ID', example: 1 })
  id: number;

  @ApiProperty({ description: '通知ID', example: 1 })
  notificationId: number;

  @ApiProperty({ description: '接收者ID', example: 1 })
  receiverId: number;

  @ApiProperty({ description: '接收者姓名', example: '张三' })
  receiverName: string;

  @ApiProperty({ description: '是否已读', example: false })
  isRead: boolean;

  @ApiProperty({ description: '阅读时间', example: '2023-12-01T10:30:00.000Z', required: false })
  readAt?: Date;

  @ApiProperty({ description: '是否已删除', example: false })
  isDeleted: boolean;

  @ApiProperty({ description: '删除时间', example: '2023-12-01T11:00:00.000Z', required: false })
  deletedAt?: Date;

  @ApiProperty({ description: '创建时间', example: '2023-12-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-12-01T10:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<NotificationReceiverEntity>) {
    Object.assign(this, partial);
  }
}

export class NotificationStatsEntity {
  @ApiProperty({ description: '总通知数', example: 100 })
  totalNotifications: number;

  @ApiProperty({ description: '未读通知数', example: 15 })
  unreadCount: number;

  @ApiProperty({ description: '已读通知数', example: 85 })
  readCount: number;

  @ApiProperty({ description: '按类型统计', example: { SYSTEM: 50, USER: 30, ORDER: 20 } })
  byType: Record<string, number>;

  @ApiProperty({ description: '按级别统计', example: { LOW: 40, MEDIUM: 35, HIGH: 20, URGENT: 5 } })
  byLevel: Record<string, number>;

  @ApiProperty({ description: '今日新增', example: 5 })
  todayCount: number;

  @ApiProperty({ description: '本周新增', example: 25 })
  weekCount: number;

  @ApiProperty({ description: '本月新增', example: 80 })
  monthCount: number;

  constructor(partial: Partial<NotificationStatsEntity>) {
    Object.assign(this, partial);
  }
}
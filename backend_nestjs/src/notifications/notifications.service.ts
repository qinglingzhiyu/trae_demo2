import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import {
  NotificationEntity,
  NotificationReceiverEntity,
  NotificationStatsEntity,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  // 模拟数据存储
  private notifications: NotificationEntity[] = [];
  private receivers: NotificationReceiverEntity[] = [];
  private nextId = 1;
  private nextReceiverId = 1;

  // 通知类型常量
  private readonly NOTIFICATION_TYPES = [
    'SYSTEM',
    'USER',
    'ORDER',
    'PATIENT',
    'REMINDER',
    'WARNING',
    'ERROR',
  ];

  // 通知级别常量
  private readonly NOTIFICATION_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  constructor() {
    // 初始化一些示例数据
    this.initSampleData();
  }

  /**
   * 创建通知
   */
  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationEntity> {
    const notification = new NotificationEntity({
      id: this.nextId++,
      ...createNotificationDto,
      receiverType: createNotificationDto.receiverType || 'USER',
      isSent: false,
      isEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.notifications.push(notification);

    // 如果指定了接收者，创建接收记录
    if (createNotificationDto.receiverIds?.length) {
      await this.createReceivers(notification.id, createNotificationDto.receiverIds);
    }

    // 如果是立即发送，则发送通知
    if (!createNotificationDto.scheduledAt) {
      await this.send(notification.id);
    }

    return notification;
  }

  /**
   * 获取通知列表
   */
  async findAll(query: QueryNotificationDto) {
    let filteredNotifications = [...this.notifications];

    // 搜索过滤
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchLower) ||
          notification.content.toLowerCase().includes(searchLower),
      );
    }

    // 类型过滤
    if (query.type) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.type === query.type,
      );
    }

    // 级别过滤
    if (query.level) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.level === query.level,
      );
    }

    // 发送者过滤
    if (query.senderId) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.senderId === query.senderId,
      );
    }

    // 发送状态过滤
    if (query.isSent !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.isSent === query.isSent,
      );
    }

    // 时间范围过滤
    if (query.startTime) {
      const startTime = new Date(query.startTime);
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.createdAt >= startTime,
      );
    }

    if (query.endTime) {
      const endTime = new Date(query.endTime);
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.createdAt <= endTime,
      );
    }

    // 关联资源过滤
    if (query.relatedType) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.relatedType === query.relatedType,
      );
    }

    // 排序（按创建时间倒序）
    filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 分页
    const total = filteredNotifications.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const data = filteredNotifications.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取通知详情
   */
  async findOne(id: number): Promise<NotificationEntity> {
    const notification = this.notifications.find((n) => n.id === id);
    if (!notification) {
      throw new NotFoundException(`通知 ID ${id} 不存在`);
    }
    return notification;
  }

  /**
   * 更新通知
   */
  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<NotificationEntity> {
    const notification = await this.findOne(id);

    // 如果通知已发送，只允许更新部分字段
    if (notification.isSent) {
      const allowedFields = ['title', 'content', 'isEnabled'];
      const updateFields = Object.keys(updateNotificationDto);
      const invalidFields = updateFields.filter((field) => !allowedFields.includes(field));
      
      if (invalidFields.length > 0) {
        throw new BadRequestException(`已发送的通知不能修改字段: ${invalidFields.join(', ')}`);
      }
    }

    Object.assign(notification, updateNotificationDto, {
      updatedAt: new Date(),
    });

    return notification;
  }

  /**
   * 删除通知（软删除）
   */
  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    
    // 如果通知已发送，不允许删除
    if (notification.isSent) {
      throw new BadRequestException('已发送的通知不能删除');
    }

    const index = this.notifications.findIndex((n) => n.id === id);
    this.notifications.splice(index, 1);

    // 同时删除相关的接收记录
    this.receivers = this.receivers.filter((r) => r.notificationId !== id);
  }

  /**
   * 批量删除通知
   */
  async removeBatch(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }

  /**
   * 发送通知
   */
  async send(id: number): Promise<void> {
    const notification = await this.findOne(id);

    if (notification.isSent) {
      throw new BadRequestException('通知已经发送过了');
    }

    if (!notification.isEnabled) {
      throw new BadRequestException('通知已被禁用，无法发送');
    }

    // 更新发送状态
    notification.isSent = true;
    notification.sentAt = new Date();
    notification.updatedAt = new Date();

    // 这里可以添加实际的发送逻辑，如推送、邮件、短信等
    console.log(`发送通知: ${notification.title}`);
  }

  /**
   * 批量发送通知
   */
  async sendBatch(ids: number[]): Promise<void> {
    for (const id of ids) {
      try {
        await this.send(id);
      } catch (error) {
        console.error(`发送通知 ${id} 失败:`, error.message);
      }
    }
  }

  /**
   * 获取我的通知
   */
  async getMyNotifications(userId: number, query: QueryNotificationDto) {
    let filteredReceivers = this.receivers.filter(
      (receiver) => receiver.receiverId === userId && !receiver.isDeleted,
    );

    // 阅读状态过滤
    if (query.isRead !== undefined) {
      filteredReceivers = filteredReceivers.filter(
        (receiver) => receiver.isRead === query.isRead,
      );
    }

    // 获取对应的通知信息
    const notificationsWithReceiver = filteredReceivers.map((receiver) => {
      const notification = this.notifications.find((n) => n.id === receiver.notificationId);
      return {
        ...receiver,
        notification,
      };
    }).filter((item) => item.notification); // 过滤掉找不到通知的记录

    // 搜索过滤
    let filteredData = notificationsWithReceiver;
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.notification.title.toLowerCase().includes(searchLower) ||
          item.notification.content.toLowerCase().includes(searchLower),
      );
    }

    // 类型过滤
    if (query.type) {
      filteredData = filteredData.filter(
        (item) => item.notification.type === query.type,
      );
    }

    // 级别过滤
    if (query.level) {
      filteredData = filteredData.filter(
        (item) => item.notification.level === query.level,
      );
    }

    // 排序（按创建时间倒序）
    filteredData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 分页
    const total = filteredData.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const data = filteredData.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 标记为已读
   */
  async markAsRead(receiverId: number): Promise<void> {
    const receiver = this.receivers.find((r) => r.id === receiverId);
    if (!receiver) {
      throw new NotFoundException(`接收记录 ID ${receiverId} 不存在`);
    }

    if (!receiver.isRead) {
      receiver.isRead = true;
      receiver.readAt = new Date();
      receiver.updatedAt = new Date();
    }
  }

  /**
   * 批量标记为已读
   */
  async markAsReadBatch(receiverIds: number[]): Promise<void> {
    for (const receiverId of receiverIds) {
      try {
        await this.markAsRead(receiverId);
      } catch (error) {
        console.error(`标记接收记录 ${receiverId} 为已读失败:`, error.message);
      }
    }
  }

  /**
   * 标记全部为已读
   */
  async markAllAsRead(userId: number): Promise<void> {
    const userReceivers = this.receivers.filter(
      (receiver) => receiver.receiverId === userId && !receiver.isRead && !receiver.isDeleted,
    );

    const receiverIds = userReceivers.map((receiver) => receiver.id);
    await this.markAsReadBatch(receiverIds);
  }

  /**
   * 删除接收记录（软删除）
   */
  async removeReceiver(receiverId: number): Promise<void> {
    const receiver = this.receivers.find((r) => r.id === receiverId);
    if (!receiver) {
      throw new NotFoundException(`接收记录 ID ${receiverId} 不存在`);
    }

    receiver.isDeleted = true;
    receiver.deletedAt = new Date();
    receiver.updatedAt = new Date();
  }

  /**
   * 获取通知统计
   */
  async getStats(): Promise<NotificationStatsEntity> {
    const total = this.notifications.length;
    const sent = this.notifications.filter((n) => n.isSent).length;
    const pending = total - sent;

    // 按类型统计
    const byType: Record<string, number> = {};
    this.notifications.forEach((notification) => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
    });

    // 按级别统计
    const byLevel: Record<string, number> = {};
    this.notifications.forEach((notification) => {
      byLevel[notification.level] = (byLevel[notification.level] || 0) + 1;
    });

    // 时间统计
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = this.notifications.filter((n) => n.createdAt >= today).length;
    const weekCount = this.notifications.filter((n) => n.createdAt >= weekAgo).length;
    const monthCount = this.notifications.filter((n) => n.createdAt >= monthAgo).length;

    return new NotificationStatsEntity({
      totalNotifications: total,
      unreadCount: pending,
      readCount: sent,
      byType,
      byLevel,
      todayCount,
      weekCount,
      monthCount,
    });
  }

  /**
   * 获取我的通知统计
   */
  async getMyStats(userId: number): Promise<NotificationStatsEntity> {
    const userReceivers = this.receivers.filter(
      (receiver) => receiver.receiverId === userId && !receiver.isDeleted,
    );

    const total = userReceivers.length;
    const unread = userReceivers.filter((r) => !r.isRead).length;
    const read = total - unread;

    // 获取对应的通知信息进行统计
    const userNotifications = userReceivers
      .map((receiver) => this.notifications.find((n) => n.id === receiver.notificationId))
      .filter((n) => n); // 过滤掉找不到的通知

    // 按类型统计
    const byType: Record<string, number> = {};
    userNotifications.forEach((notification) => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
    });

    // 按级别统计
    const byLevel: Record<string, number> = {};
    userNotifications.forEach((notification) => {
      byLevel[notification.level] = (byLevel[notification.level] || 0) + 1;
    });

    // 时间统计
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = userReceivers.filter((r) => r.createdAt >= today).length;
    const weekCount = userReceivers.filter((r) => r.createdAt >= weekAgo).length;
    const monthCount = userReceivers.filter((r) => r.createdAt >= monthAgo).length;

    return new NotificationStatsEntity({
      totalNotifications: total,
      unreadCount: unread,
      readCount: read,
      byType,
      byLevel,
      todayCount,
      weekCount,
      monthCount,
    });
  }

  /**
   * 获取通知类型列表
   */
  async getTypes(): Promise<string[]> {
    return this.NOTIFICATION_TYPES;
  }

  /**
   * 获取通知级别列表
   */
  async getLevels(): Promise<string[]> {
    return this.NOTIFICATION_LEVELS;
  }

  /**
   * 清理过期通知
   */
  async cleanup(days: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // 删除过期的通知
    this.notifications = this.notifications.filter(
      (notification) => notification.createdAt > cutoffDate,
    );

    // 删除对应的接收记录
    const validNotificationIds = this.notifications.map((n) => n.id);
    this.receivers = this.receivers.filter(
      (receiver) => validNotificationIds.includes(receiver.notificationId),
    );
  }

  /**
   * 创建接收记录
   */
  private async createReceivers(notificationId: number, receiverIds: number[]): Promise<void> {
    for (const receiverId of receiverIds) {
      const receiver = new NotificationReceiverEntity({
        id: this.nextReceiverId++,
        notificationId,
        receiverId,
        receiverName: `用户${receiverId}`, // 实际应用中应该从用户服务获取
        isRead: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.receivers.push(receiver);
    }
  }

  /**
   * 初始化示例数据
   */
  private initSampleData(): void {
    // 创建一些示例通知
    const sampleNotifications = [
      {
        title: '系统维护通知',
        content: '系统将于今晚22:00-24:00进行维护，期间可能无法正常使用',
        type: 'SYSTEM',
        level: 'HIGH',
        receiverType: 'ALL',
      },
      {
        title: '新功能上线',
        content: '我们很高兴地宣布新的报表功能已经上线，欢迎体验',
        type: 'SYSTEM',
        level: 'MEDIUM',
        receiverType: 'ALL',
      },
      {
        title: '订单状态更新',
        content: '您的订单 #12345 已完成',
        type: 'ORDER',
        level: 'LOW',
        receiverType: 'USER',
        relatedType: 'Order',
        relatedId: '12345',
      },
    ];

    sampleNotifications.forEach((notification) => {
      const entity = new NotificationEntity({
        id: this.nextId++,
        ...notification,
        isSent: true,
        sentAt: new Date(),
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.notifications.push(entity);

      // 为前两个通知创建接收记录（模拟全员通知）
      if (entity.receiverType === 'ALL') {
        for (let userId = 1; userId <= 5; userId++) {
          const receiver = new NotificationReceiverEntity({
            id: this.nextReceiverId++,
            notificationId: entity.id,
            receiverId: userId,
            receiverName: `用户${userId}`,
            isRead: Math.random() > 0.5, // 随机已读状态
            readAt: Math.random() > 0.5 ? new Date() : undefined,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          this.receivers.push(receiver);
        }
      } else if (entity.receiverType === 'USER') {
        // 为订单通知创建单个用户的接收记录
        const receiver = new NotificationReceiverEntity({
          id: this.nextReceiverId++,
          notificationId: entity.id,
          receiverId: 1,
          receiverName: '用户1',
          isRead: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        this.receivers.push(receiver);
      }
    });
  }
}
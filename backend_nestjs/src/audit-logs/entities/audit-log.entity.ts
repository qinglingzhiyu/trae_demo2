import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AuditLogEntity {
  @ApiProperty({ description: '日志ID', example: 1 })
  id: number;

  @ApiProperty({ description: '操作用户ID', example: '1' })
  userId: string;

  @ApiProperty({ description: '操作用户名', example: 'admin' })
  username?: string;

  @ApiProperty({ description: '操作用户姓名', example: '管理员' })
  userRealName?: string;

  @ApiProperty({ description: '操作动作', example: 'CREATE' })
  action: string;

  @ApiProperty({ description: '资源类型', example: 'USER' })
  resource: string;

  @ApiProperty({ description: '资源ID', example: '123' })
  resourceId?: string;

  @ApiProperty({ description: 'HTTP方法', example: 'POST' })
  method: string;

  @ApiProperty({ description: '请求路径', example: '/api/users' })
  path: string;

  @ApiProperty({ description: 'IP地址', example: '192.168.1.1' })
  ip: string;

  @ApiProperty({ description: '请求数据', example: '{}' })
  requestData?: string;

  @ApiProperty({ description: '响应数据', example: '{}' })
  responseData?: string;

  @ApiProperty({ description: '用户代理', example: 'Mozilla/5.0...' })
  userAgent?: string;

  @ApiProperty({ description: '响应状态码', example: 200 })
  statusCode?: number;

  @ApiProperty({ description: '响应时间(ms)', example: 100 })
  responseTime?: number;

  @ApiProperty({ description: '错误信息', example: '' })
  error?: string;

  @ApiProperty({ description: '操作时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '用户信息', type: 'object' })
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
  };

  constructor(partial: Partial<AuditLogEntity>) {
    Object.assign(this, partial);
  }
}

export class AuditLogStatsEntity {
  @ApiProperty({ description: '总操作次数', example: 1000 })
  totalOperations: number;

  @ApiProperty({ description: '成功操作次数', example: 950 })
  successOperations: number;

  @ApiProperty({ description: '失败操作次数', example: 50 })
  failureOperations: number;

  @ApiProperty({ description: '今日操作次数', example: 100 })
  todayOperations: number;

  @ApiProperty({ description: '本周操作次数', example: 500 })
  weekOperations: number;

  @ApiProperty({ description: '本月操作次数', example: 2000 })
  monthOperations: number;

  @ApiProperty({ description: '操作模块统计', type: 'array', items: { type: 'object' } })
  moduleStats: {
    module: string;
    count: number;
    percentage: number;
  }[];

  @ApiProperty({ description: '操作动作统计', type: 'array', items: { type: 'object' } })
  actionStats: {
    action: string;
    count: number;
    percentage: number;
  }[];

  @ApiProperty({ description: '用户操作统计', type: 'array', items: { type: 'object' } })
  userStats: {
    userId: string;
    username: string;
    count: number;
    percentage: number;
  }[];

  constructor(partial: Partial<AuditLogStatsEntity>) {
    Object.assign(this, partial);
  }
}
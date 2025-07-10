import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsIn, IsArray, Length } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: '通知标题', example: '系统维护通知' })
  @IsString()
  @Length(2, 200, { message: '通知标题长度必须在2-200个字符之间' })
  title: string;

  @ApiProperty({ description: '通知内容', example: '系统将于今晚22:00-24:00进行维护，期间可能无法正常使用' })
  @IsString()
  @Length(2, 2000, { message: '通知内容长度必须在2-2000个字符之间' })
  content: string;

  @ApiProperty({ description: '通知类型', example: 'SYSTEM', enum: ['SYSTEM', 'USER', 'ORDER', 'PATIENT', 'REMINDER', 'WARNING', 'ERROR'] })
  @IsString()
  @IsIn(['SYSTEM', 'USER', 'ORDER', 'PATIENT', 'REMINDER', 'WARNING', 'ERROR'], {
    message: '通知类型必须是 SYSTEM, USER, ORDER, PATIENT, REMINDER, WARNING, ERROR 之一',
  })
  type: string;

  @ApiProperty({ description: '通知级别', example: 'MEDIUM', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsString()
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    message: '通知级别必须是 LOW, MEDIUM, HIGH, URGENT 之一',
  })
  level: string;

  @ApiProperty({ description: '发送者ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  senderId?: number;

  @ApiProperty({ description: '接收者ID列表', example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  receiverIds?: number[];

  @ApiProperty({ description: '接收者类型', example: 'USER', enum: ['USER', 'ROLE', 'ALL'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['USER', 'ROLE', 'ALL'], { message: '接收者类型必须是 USER, ROLE, ALL 之一' })
  receiverType?: string;

  @ApiProperty({ description: '角色ID列表（当接收者类型为ROLE时）', example: [1, 2], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];

  @ApiProperty({ description: '关联资源类型', example: 'Order', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50, { message: '关联资源类型长度不能超过50个字符' })
  relatedType?: string;

  @ApiProperty({ description: '关联资源ID', example: '123', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '关联资源ID长度不能超过100个字符' })
  relatedId?: string;

  @ApiProperty({ description: '扩展数据', example: { url: '/orders/123' }, required: false })
  @IsOptional()
  extra?: any;

  @ApiProperty({ description: '定时发送时间', example: '2023-12-31T23:59:59.999Z', required: false })
  @IsOptional()
  scheduledAt?: Date;
}
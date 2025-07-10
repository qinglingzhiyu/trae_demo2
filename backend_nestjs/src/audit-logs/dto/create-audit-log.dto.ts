import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsIn, Length } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ description: '操作用户ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '操作模块', example: 'USER' })
  @IsString()
  @Length(2, 50, { message: '操作模块长度必须在2-50个字符之间' })
  module: string;

  @ApiProperty({ description: '操作动作', example: 'CREATE', enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'] })
  @IsString()
  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'], {
    message: '操作动作必须是 CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT, EXPORT, IMPORT 之一',
  })
  action: string;

  @ApiProperty({ description: '操作描述', example: '创建用户' })
  @IsString()
  @Length(2, 200, { message: '操作描述长度必须在2-200个字符之间' })
  description: string;

  @ApiProperty({ description: '目标资源类型', example: 'User', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50, { message: '目标资源类型长度不能超过50个字符' })
  targetType?: string;

  @ApiProperty({ description: '目标资源ID', example: '123', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '目标资源ID长度不能超过100个字符' })
  targetId?: string;

  @ApiProperty({ description: '操作前数据', example: {}, required: false })
  @IsOptional()
  oldData?: any;

  @ApiProperty({ description: '操作后数据', example: {}, required: false })
  @IsOptional()
  newData?: any;

  @ApiProperty({ description: 'IP地址', example: '192.168.1.1', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 45, { message: 'IP地址长度不能超过45个字符' })
  ipAddress?: string;

  @ApiProperty({ description: '用户代理', example: 'Mozilla/5.0...', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '用户代理长度不能超过500个字符' })
  userAgent?: string;

  @ApiProperty({ description: '操作结果', example: 'SUCCESS', enum: ['SUCCESS', 'FAILURE'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['SUCCESS', 'FAILURE'], { message: '操作结果必须是 SUCCESS 或 FAILURE' })
  result?: string;

  @ApiProperty({ description: '错误信息', example: '', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: '错误信息长度不能超过1000个字符' })
  errorMessage?: string;
}
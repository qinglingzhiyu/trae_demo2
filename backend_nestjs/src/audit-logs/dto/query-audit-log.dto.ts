import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAuditLogDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词', example: '创建用户', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '操作用户ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiProperty({ description: '操作模块', example: 'USER', required: false })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiProperty({ description: '操作动作', example: 'CREATE', required: false })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({ description: '目标资源类型', example: 'User', required: false })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiProperty({ description: '操作结果', example: 'SUCCESS', required: false })
  @IsOptional()
  @IsString()
  result?: string;

  @ApiProperty({ description: '开始时间', example: '2023-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: '结束时间', example: '2023-12-31T23:59:59.999Z', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: 'IP地址', example: '192.168.1.1', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryNotificationDto {
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

  @ApiProperty({ description: '搜索关键词', example: '系统维护', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '通知类型', example: 'SYSTEM', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '通知级别', example: 'HIGH', required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ description: '发送者ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  senderId?: number;

  @ApiProperty({ description: '接收者ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  receiverId?: number;

  @ApiProperty({ description: '是否已读', example: false, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ description: '是否已发送', example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isSent?: boolean;

  @ApiProperty({ description: '开始时间', example: '2023-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: '结束时间', example: '2023-12-31T23:59:59.999Z', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: '关联资源类型', example: 'Order', required: false })
  @IsOptional()
  @IsString()
  relatedType?: string;
}
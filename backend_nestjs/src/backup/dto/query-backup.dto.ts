import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryBackupDto {
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

  @ApiProperty({ description: '搜索关键词', example: '系统备份', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '备份类型', example: 'FULL', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '备份状态', example: 'SUCCESS', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '是否加密', example: false, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isEncrypted?: boolean;

  @ApiProperty({ description: '是否自动备份', example: false, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isAutomatic?: boolean;

  @ApiProperty({ description: '开始时间', example: '2023-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: '结束时间', example: '2023-12-31T23:59:59.999Z', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: '创建者ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdBy?: number;
}
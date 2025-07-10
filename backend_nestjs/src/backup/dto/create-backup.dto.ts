import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsIn, Length } from 'class-validator';

export class CreateBackupDto {
  @ApiProperty({ description: '备份名称', example: '系统数据备份_20231201' })
  @IsString()
  @Length(2, 100, { message: '备份名称长度必须在2-100个字符之间' })
  name: string;

  @ApiProperty({ description: '备份描述', example: '定期系统数据备份', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '备份描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({ 
    description: '备份类型', 
    example: 'FULL', 
    enum: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'],
    default: 'FULL'
  })
  @IsString()
  @IsIn(['FULL', 'INCREMENTAL', 'DIFFERENTIAL'], {
    message: '备份类型必须是 FULL, INCREMENTAL, DIFFERENTIAL 之一',
  })
  type: string = 'FULL';

  @ApiProperty({ 
    description: '备份范围', 
    example: ['users', 'orders', 'system_params'], 
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scope?: string[];

  @ApiProperty({ 
    description: '压缩格式', 
    example: 'ZIP', 
    enum: ['ZIP', 'TAR', 'GZIP'],
    required: false,
    default: 'ZIP'
  })
  @IsOptional()
  @IsString()
  @IsIn(['ZIP', 'TAR', 'GZIP'], {
    message: '压缩格式必须是 ZIP, TAR, GZIP 之一',
  })
  compression?: string = 'ZIP';

  @ApiProperty({ description: '是否加密', example: false, required: false, default: false })
  @IsOptional()
  isEncrypted?: boolean = false;

  @ApiProperty({ description: '备份密码（加密时必填）', example: 'backup123', required: false })
  @IsOptional()
  @IsString()
  @Length(6, 50, { message: '备份密码长度必须在6-50个字符之间' })
  password?: string;

  @ApiProperty({ description: '定时备份表达式（Cron格式）', example: '0 2 * * *', required: false })
  @IsOptional()
  @IsString()
  cronExpression?: string;
}
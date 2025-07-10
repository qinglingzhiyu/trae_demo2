import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, Length } from 'class-validator';

export class RestoreBackupDto {
  @ApiProperty({ description: '备份文件ID或路径', example: '1' })
  @IsString()
  backupId: string;

  @ApiProperty({ description: '恢复密码（如果备份加密）', example: 'backup123', required: false })
  @IsOptional()
  @IsString()
  @Length(6, 50, { message: '恢复密码长度必须在6-50个字符之间' })
  password?: string;

  @ApiProperty({ 
    description: '恢复范围（指定要恢复的表或模块）', 
    example: ['users', 'orders'], 
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scope?: string[];

  @ApiProperty({ description: '是否覆盖现有数据', example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  overwrite?: boolean = false;

  @ApiProperty({ description: '是否备份当前数据', example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  backupCurrent?: boolean = true;

  @ApiProperty({ description: '恢复前备份名称', example: '恢复前备份_20231201', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: '备份名称长度必须在2-100个字符之间' })
  preRestoreBackupName?: string;

  @ApiProperty({ description: '是否验证数据完整性', example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  validateIntegrity?: boolean = true;
}
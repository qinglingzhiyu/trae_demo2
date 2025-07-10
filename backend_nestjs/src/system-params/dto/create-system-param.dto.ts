import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Length, IsIn } from 'class-validator';

export class CreateSystemParamDto {
  @ApiProperty({ description: '参数键名', example: 'system.title' })
  @IsString()
  @Length(2, 100, { message: '参数键名长度必须在2-100个字符之间' })
  key: string;

  @ApiProperty({ description: '参数值', example: 'CRM管理系统' })
  @IsString()
  @Length(0, 1000, { message: '参数值长度不能超过1000个字符' })
  value: string;

  @ApiProperty({ description: '参数名称', example: '系统标题' })
  @IsString()
  @Length(2, 100, { message: '参数名称长度必须在2-100个字符之间' })
  name: string;

  @ApiProperty({ description: '参数描述', example: '系统页面显示的标题', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '参数描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({ description: '参数类型', example: 'STRING', enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'] })
  @IsString()
  @IsIn(['STRING', 'NUMBER', 'BOOLEAN', 'JSON'], { message: '参数类型必须是 STRING, NUMBER, BOOLEAN, JSON 之一' })
  type: string;

  @ApiProperty({ description: '参数分组', example: 'SYSTEM', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50, { message: '参数分组长度不能超过50个字符' })
  group?: string;

  @ApiProperty({ description: '是否为系统参数', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsOptional()
  sort?: number;
}
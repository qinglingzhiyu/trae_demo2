import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Length, Min } from 'class-validator';

export class CreateDictionaryDto {
  @ApiProperty({ description: '字典类型', example: 'gender' })
  @IsString()
  @Length(2, 50, { message: '字典类型长度必须在2-50个字符之间' })
  type: string;

  @ApiProperty({ description: '字典名称', example: '性别' })
  @IsString()
  @Length(2, 100, { message: '字典名称长度必须在2-100个字符之间' })
  name: string;

  @ApiProperty({ description: '字典描述', example: '用户性别选项', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '字典描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;
}

export class CreateDictionaryItemDto {
  @ApiProperty({ description: '字典类型ID', example: 1 })
  @IsInt()
  @Min(1)
  typeId: number;

  @ApiProperty({ description: '字典项标签', example: '男' })
  @IsString()
  @Length(1, 100, { message: '字典项标签长度必须在1-100个字符之间' })
  label: string;

  @ApiProperty({ description: '字典项值', example: 'male' })
  @IsString()
  @Length(1, 100, { message: '字典项值长度必须在1-100个字符之间' })
  value: string;

  @ApiProperty({ description: '字典项描述', example: '男性', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '字典项描述长度不能超过500个字符' })
  description?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort?: number;

  @ApiProperty({ description: '扩展属性', example: { color: '#1890ff' }, required: false })
  @IsOptional()
  extra?: any;
}
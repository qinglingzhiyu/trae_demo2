import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '医生' })
  @IsString()
  @Length(2, 50, { message: '角色名称长度必须在2-50个字符之间' })
  name: string;

  @ApiProperty({ description: '角色代码', example: 'DOCTOR' })
  @IsString()
  @Length(2, 50, { message: '角色代码长度必须在2-50个字符之间' })
  code: string;

  @ApiProperty({ description: '角色描述', example: '医生角色，可以查看和管理患者信息', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 200, { message: '角色描述长度不能超过200个字符' })
  description?: string;

  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  permissionIds?: number[];
}
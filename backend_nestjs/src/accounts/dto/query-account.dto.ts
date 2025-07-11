import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '../../common/constants/enums';

export class QueryAccountDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  @Max(100, { message: '每页数量不能超过100' })
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词（姓名、手机号、邮箱、部门）', example: '张医生', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '账号角色', enum: UserRole, example: UserRole.DOCTOR, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: '请选择正确的账号角色' })
  role?: UserRole;

  @ApiProperty({ description: '账号状态', enum: UserStatus, example: UserStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(UserStatus, { message: '请选择正确的账号状态' })
  status?: UserStatus;

  @ApiProperty({ description: '所属部门', example: '内科', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: '职位', example: '主治医师', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: '工号', example: 'D001', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole, UserStatus } from '../../common/constants/enums';

export class QueryUserDto {
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
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词（姓名、手机号）', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiProperty({ description: '用户角色', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: '请选择正确的用户角色' })
  role?: UserRole;

  @ApiProperty({ description: '用户状态', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus, { message: '请选择正确的用户状态' })
  status?: UserStatus;
}
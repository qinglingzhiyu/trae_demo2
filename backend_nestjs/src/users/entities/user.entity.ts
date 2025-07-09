import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../common/constants/enums';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户姓名', example: '张三' })
  name: string;

  @ApiProperty({ description: '手机号码', example: '13800138000' })
  phone: string;

  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  email: string | null;

  @ApiProperty({ description: '身份证号', example: '110101199001011234' })
  idCard: string | null;

  @Exclude()
  password: string;

  @ApiProperty({ description: '用户角色', enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: '用户状态', enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
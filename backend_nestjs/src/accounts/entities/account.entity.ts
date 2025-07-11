import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../common/constants/enums';
import { Exclude, Expose } from 'class-transformer';

export class AccountEntity {
  @ApiProperty({ description: '账号ID', example: 1 })
  id: number;

  @ApiProperty({ description: '账号姓名', example: '张医生' })
  name: string;

  @ApiProperty({ description: '手机号码', example: '13800138000' })
  phone: string;

  @ApiProperty({ description: '邮箱地址', example: 'doctor@hospital.com' })
  email: string | null;

  @ApiProperty({ description: '身份证号', example: '110101199001011234' })
  idCard: string | null;

  @Exclude()
  password: string;

  @ApiProperty({ description: '账号角色', enum: UserRole, example: UserRole.DOCTOR })
  role: UserRole;

  @ApiProperty({ description: '账号状态', enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ description: '所属部门', example: '内科' })
  department: string | null;

  @ApiProperty({ description: '职位', example: '主治医师' })
  position: string | null;

  @ApiProperty({ description: '工号', example: 'D001' })
  employeeId: string | null;

  @ApiProperty({ description: '联系地址', example: '北京市朝阳区xxx街道' })
  address: string | null;

  @ApiProperty({ description: '备注信息', example: '专业擅长心血管疾病' })
  remark: string | null;

  @ApiProperty({ description: '创建者ID', example: 1 })
  createdBy: number | null;

  @ApiProperty({ description: '更新者ID', example: 1 })
  updatedBy: number | null;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: '最后登录时间', example: '2023-01-01T00:00:00.000Z' })
  lastLoginAt: Date | null;

  @ApiProperty({ description: '最后登录IP', example: '192.168.1.1' })
  lastLoginIp: string | null;

  // 关联数据
  @ApiProperty({ description: '分配的角色列表', type: 'array', items: { type: 'object' } })
  @Expose()
  get assignedRoles() {
    return this.userRoles?.map(ur => ur.role) || [];
  }

  @ApiProperty({ description: '创建者信息', type: 'object' })
  @Expose()
  get creatorInfo() {
    return this.creator ? {
      id: this.creator.id,
      name: this.creator.name,
    } : null;
  }

  @ApiProperty({ description: '更新者信息', type: 'object' })
  @Expose()
  get updaterInfo() {
    return this.updater ? {
      id: this.updater.id,
      name: this.updater.name,
    } : null;
  }

  // 隐藏的关联数据（用于内部处理）
  @Exclude()
  userRoles?: any[];

  @Exclude()
  creator?: any;

  @Exclude()
  updater?: any;

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}
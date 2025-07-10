import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RoleEntity {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '医生' })
  name: string;

  @ApiProperty({ description: '角色代码', example: 'DOCTOR' })
  code: string;

  @ApiProperty({ description: '角色描述', example: '医生角色，可以查看和管理患者信息' })
  description: string;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @ApiProperty({ description: '权限列表', type: 'array', items: { type: 'object' } })
  permissions?: any[];

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}

export class PermissionEntity {
  @ApiProperty({ description: '权限ID', example: 1 })
  id: number;

  @ApiProperty({ description: '权限名称', example: '用户管理' })
  name: string;

  @ApiProperty({ description: '权限代码', example: 'USER_MANAGE' })
  code: string;

  @ApiProperty({ description: '权限描述', example: '管理用户信息的权限' })
  description: string;

  @ApiProperty({ description: '权限类型', example: 'MENU' })
  type: string;

  @ApiProperty({ description: '父权限ID', example: null })
  parentId: number;

  @ApiProperty({ description: '排序', example: 1 })
  sort: number;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @ApiProperty({ description: '子权限列表', type: 'array', items: { type: 'object' } })
  children?: PermissionEntity[];

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
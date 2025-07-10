import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SystemParamEntity {
  @ApiProperty({ description: '参数ID', example: 1 })
  id: number;

  @ApiProperty({ description: '参数键名', example: 'system.title' })
  key: string;

  @ApiProperty({ description: '参数值', example: 'CRM管理系统' })
  value: string;

  @ApiProperty({ description: '参数名称', example: '系统标题' })
  name: string;

  @ApiProperty({ description: '参数描述', example: '系统页面显示的标题' })
  description: string;

  @ApiProperty({ description: '参数类型', example: 'STRING' })
  type: string;

  @ApiProperty({ description: '参数分组', example: 'SYSTEM' })
  group: string;

  @ApiProperty({ description: '是否为系统参数', example: false })
  isSystem: boolean;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '排序', example: 1 })
  sort: number;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<SystemParamEntity>) {
    Object.assign(this, partial);
  }
}
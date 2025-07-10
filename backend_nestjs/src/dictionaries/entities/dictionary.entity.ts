import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DictionaryEntity {
  @ApiProperty({ description: '字典ID', example: 1 })
  id: number;

  @ApiProperty({ description: '字典类型', example: 'gender' })
  type: string;

  @ApiProperty({ description: '字典名称', example: '性别' })
  name: string;

  @ApiProperty({ description: '字典描述', example: '用户性别选项' })
  description: string;

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

  @ApiProperty({ description: '字典项列表', type: 'array', items: { type: 'object' } })
  items?: DictionaryItemEntity[];

  constructor(partial: Partial<DictionaryEntity>) {
    Object.assign(this, partial);
  }
}

export class DictionaryItemEntity {
  @ApiProperty({ description: '字典项ID', example: 1 })
  id: number;

  @ApiProperty({ description: '字典类型', example: 'gender' })
  type: string;

  @ApiProperty({ description: '字典项标签', example: '男' })
  label: string;

  @ApiProperty({ description: '字典项值', example: 'male' })
  value: string;

  @ApiProperty({ description: '字典项描述', example: '男性' })
  description: string;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '排序', example: 1 })
  sort: number;

  @ApiProperty({ description: '扩展属性', example: { color: '#1890ff' } })
  extra: any;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @ApiProperty({ description: '所属字典', type: DictionaryEntity })
  dictionary?: DictionaryEntity;

  constructor(partial: Partial<DictionaryItemEntity>) {
    Object.assign(this, partial);
  }
}
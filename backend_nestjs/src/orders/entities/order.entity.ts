import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, OrderType } from '../../common/constants/enums';
import { Exclude } from 'class-transformer';

export class OrderItemEntity {
  @ApiProperty({ description: '订单项目ID' })
  id: number;

  @ApiProperty({ description: '订单ID' })
  orderId: number;

  @ApiProperty({ description: '服务项目名称' })
  itemName: string;

  @ApiProperty({ description: '服务项目代码', required: false })
  itemCode?: string;

  @ApiProperty({ description: '单价' })
  price: number;

  @ApiProperty({ description: '数量' })
  quantity: number;

  @ApiProperty({ description: '小计' })
  subtotal: number;

  @ApiProperty({ description: '服务类别', required: false })
  category?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  constructor(partial: Partial<OrderItemEntity>) {
    Object.assign(this, partial);
  }
}

export class OrderEntity {
  @ApiProperty({ description: '订单ID' })
  id: number;

  @ApiProperty({ description: '订单号' })
  orderNo: string;

  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ApiProperty({ description: '就诊人ID' })
  patientId: number;

  @ApiProperty({ description: '订单类型', enum: OrderType })
  orderType: OrderType;

  @ApiProperty({ description: '订单状态', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ description: '订单描述', required: false })
  description?: string;

  @ApiProperty({ description: '订单总金额', example: 299.99 })
  totalAmount: number;

  @ApiProperty({ description: '已支付金额', example: 299.99 })
  paidAmount: number;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '订单项目列表', type: [OrderItemEntity], required: false })
  items?: OrderItemEntity[];

  @ApiProperty({ description: '就诊人信息', required: false })
  patient?: any;

  @ApiProperty({ description: '用户信息', required: false })
  user?: any;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }
}
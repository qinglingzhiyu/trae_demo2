import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../../common/constants/enums';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ description: '订单状态', enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus, { message: '请选择正确的订单状态' })
  status?: OrderStatus;
}
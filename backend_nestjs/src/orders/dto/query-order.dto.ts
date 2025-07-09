import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderType } from '../../common/constants/enums';

export class QueryOrderDto {
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

  @ApiProperty({ description: '搜索关键词（订单号、就诊人姓名）', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '订单状态', enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus, { message: '请选择正确的订单状态' })
  status?: OrderStatus;

  @ApiProperty({ description: '订单类型', enum: OrderType, required: false })
  @IsOptional()
  @IsEnum(OrderType, { message: '请选择正确的订单类型' })
  orderType?: OrderType;

  @ApiProperty({ description: '就诊人ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '就诊人ID必须是整数' })
  patientId?: number;
}
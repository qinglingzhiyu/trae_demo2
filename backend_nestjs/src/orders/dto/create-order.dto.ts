import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDecimal, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { OrderType } from '../../common/constants/enums';

export class CreateOrderItemDto {
  @ApiProperty({ description: '服务项目名称', example: '血常规检查' })
  @IsString()
  itemName: string;

  @ApiProperty({ description: '服务项目代码', example: 'BC001', required: false })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiProperty({ description: '单价', example: 50.00 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '0,2' }, { message: '价格格式不正确' })
  @Min(0, { message: '价格不能为负数' })
  price: number;

  @ApiProperty({ description: '数量', example: 1 })
  @IsInt({ message: '数量必须是整数' })
  @Min(1, { message: '数量必须大于0' })
  quantity: number;

  @ApiProperty({ description: '服务类别', example: '检验', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: '就诊人ID', example: 1 })
  @IsInt({ message: '就诊人ID必须是整数' })
  patientId: number;

  @ApiProperty({ description: '订单类型', enum: OrderType, example: OrderType.MEDICAL })
  @IsOptional()
  @IsEnum(OrderType, { message: '请选择正确的订单类型' })
  orderType?: OrderType;

  @ApiProperty({ description: '订单描述', example: '常规体检', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '订单项目列表', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
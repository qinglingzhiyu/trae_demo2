import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderEntity } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('订单管理')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  @ApiResponse({
    status: 201,
    description: '订单创建成功',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '就诊人不存在' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(
      createOrderDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiResponse({
    status: 200,
    description: '获取订单列表成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderEntity' },
        },
        total: { type: 'number', description: '总数量' },
        page: { type: 'number', description: '当前页码' },
        limit: { type: 'number', description: '每页数量' },
        totalPages: { type: 'number', description: '总页数' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll(@Query() query: QueryOrderDto, @Request() req) {
    return this.ordersService.findAll(query, req.user.userId, req.user.role);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计信息' })
  @ApiResponse({
    status: 200,
    description: '获取订单统计信息成功',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', description: '总订单数' },
        pending: { type: 'number', description: '待处理订单数' },
        processing: { type: 'number', description: '处理中订单数' },
        completed: { type: 'number', description: '已完成订单数' },
        cancelled: { type: 'number', description: '已取消订单数' },
        totalAmount: { type: 'number', description: '总金额' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  getStatistics(@Request() req) {
    return this.ordersService.getStatistics(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取订单详情' })
  @ApiResponse({
    status: 200,
    description: '获取订单详情成功',
    type: OrderEntity,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.findOne(id, req.user.userId, req.user.role);
  }

  @Post(':id/update')
  @ApiOperation({ summary: '更新订单' })
  @ApiResponse({
    status: 200,
    description: '订单更新成功',
    type: OrderEntity,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    return this.ordersService.update(
      id,
      updateOrderDto,
      req.user.userId,
      req.user.role,
      req.user.userId,
    );
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '软删除订单' })
  @ApiResponse({
    status: 200,
    description: '订单删除成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '订单删除成功' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '订单状态不允许删除' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '订单不存在' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.remove(id, req.user.userId, req.user.role);
  }
}
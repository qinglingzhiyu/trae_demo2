import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderEntity, OrderItemEntity } from './entities/order.entity';
import { OrderStatus, UserRole, OrderType } from '../common/constants/enums';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成订单号
   */
  private generateOrderNumber(): string {
    const now = new Date();
    const timestamp = now.getTime().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  /**
   * 创建订单
   */
  async create(createOrderDto: CreateOrderDto, userId: number, userRole: UserRole) {
    const { patientId, items, ...orderData } = createOrderDto;

    // 验证就诊人是否存在
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('就诊人不存在');
    }

    // 验证权限：普通用户只能为自己的就诊人创建订单
    if (userRole === UserRole.USER && patient.userId !== userId) {
      throw new ForbiddenException('无权限为此就诊人创建订单');
    }

    // 验证订单项目
    if (!items || items.length === 0) {
      throw new BadRequestException('订单项目不能为空');
    }

    // 计算总金额
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // 创建订单
    const order = await this.prisma.order.create({
      data: {
        orderNo: this.generateOrderNumber(),
        userId,
        patientId,
        totalAmount,
        status: OrderStatus.PENDING,
        ...orderData,
        items: {
          create: items.map(item => ({
            itemName: item.itemName,
            itemCode: item.itemCode,
            price: item.price,
            quantity: item.quantity,
            amount: item.price * item.quantity,
            category: item.category,
          })),
        },
      },
      include: {
        items: true,
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            gender: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return new OrderEntity({
      ...order,
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      status: order.status as OrderStatus,
      orderType: order.orderType as OrderType,
      items: order.items?.map(item => new OrderItemEntity({
           ...item,
           price: Number(item.price),
           subtotal: Number(item.amount),
           createdAt: new Date(),
          updatedAt: new Date(),
         })),
    });
  }

  /**
   * 查询订单列表
   */
  async findAll(query: QueryOrderDto, userId: number, userRole: UserRole) {
    const { page = 1, limit = 10, keyword, status, orderType, patientId } = query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    // 权限控制：普通用户只能查看自己的订单
    if (userRole === UserRole.USER) {
      where.userId = userId;
    }

    // 关键词搜索
    if (keyword) {
      where.OR = [
        { orderNo: { contains: keyword } },
        { patient: { name: { contains: keyword } } },
        { description: { contains: keyword } },
      ];
    }

    // 状态筛选
    if (status) {
      where.status = status;
    }

    // 订单类型筛选
    if (orderType) {
      where.orderType = orderType;
    }

    // 就诊人筛选
    if (patientId) {
      where.patientId = patientId;
      // 验证权限：普通用户只能查看自己的就诊人订单
      if (userRole === UserRole.USER) {
        const patient = await this.prisma.patient.findFirst({
          where: { id: patientId, deletedAt: null },
        });
        if (!patient || patient.userId !== userId) {
          throw new ForbiddenException('无权限查看此就诊人的订单');
        }
      }
    }

    // 添加软删除过滤条件
    where.deletedAt = null;

    // 查询订单
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              gender: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map(order => new OrderEntity({
        ...order,
        totalAmount: Number(order.totalAmount),
        paidAmount: Number(order.paidAmount),
        status: order.status as OrderStatus,
        orderType: order.orderType as OrderType,
        items: order.items?.map(item => new OrderItemEntity({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.amount),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 根据ID查询订单
   */
  async findOne(id: number, userId: number, userRole: UserRole) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            gender: true,
            birthday: true,
            idCard: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    // 权限控制：普通用户只能查看自己的订单
    if (userRole === UserRole.USER && order.userId !== userId) {
      throw new ForbiddenException('无权限查看此订单');
    }

    return new OrderEntity({
      ...order,
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      status: order.status as OrderStatus,
      orderType: order.orderType as OrderType,
      items: order.items?.map(item => new OrderItemEntity({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.amount),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  /**
   * 更新订单
   */
  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number, userRole: UserRole, updatedBy?: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    // 权限控制：普通用户只能更新自己的订单，且只能在特定状态下更新
    if (userRole === UserRole.USER) {
      if (order.userId !== userId) {
        throw new ForbiddenException('无权限更新此订单');
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('订单状态不允许修改');
      }
    }

    const updateData: any = {
      description: updateOrderDto.description,
      status: updateOrderDto.status,
    };
    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            gender: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return new OrderEntity({
      ...updatedOrder,
      totalAmount: Number(updatedOrder.totalAmount),
      paidAmount: Number(updatedOrder.paidAmount),
      status: updatedOrder.status as OrderStatus,
      orderType: updatedOrder.orderType as OrderType,
      items: updatedOrder.items?.map(item => new OrderItemEntity({
         ...item,
         price: Number(item.price),
         subtotal: Number(item.amount),
         createdAt: new Date(),
            updatedAt: new Date(),
       })),
    });
  }

  /**
   * 删除订单
   */
  async remove(id: number, userId: number, userRole: UserRole) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    // 权限控制：普通用户只能删除自己的订单，且只能在待处理状态下删除
    if (userRole === UserRole.USER) {
      if (order.userId !== userId) {
        throw new ForbiddenException('无权限删除此订单');
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('订单状态不允许删除');
      }
    }

    // 软删除：更新 deletedAt 字段
    await this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '订单删除成功' };
  }

  /**
   * 获取订单统计信息
   */
  async getStatistics(userId: number, userRole: UserRole) {
    const where: any = { deletedAt: null };

    // 权限控制：普通用户只能查看自己的统计
    if (userRole === UserRole.USER) {
      where.userId = userId;
    }

    const [total, pending, processing, completed, cancelled] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.PROCESSING } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.COMPLETED } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
    ]);

    const totalAmount = await this.prisma.order.aggregate({
      where: { ...where, status: OrderStatus.COMPLETED },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      totalAmount: totalAmount._sum.totalAmount || 0,
    };
  }
}
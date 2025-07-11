import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSystemParamDto } from './dto/create-system-param.dto';
import { UpdateSystemParamDto } from './dto/update-system-param.dto';
import { QuerySystemParamDto } from './dto/query-system-param.dto';
import { SystemParamEntity } from './entities/system-param.entity';

@Injectable()
export class SystemParamsService {
  constructor(private prisma: PrismaService) {}

  async create(createSystemParamDto: CreateSystemParamDto) {
    // 检查参数键名是否已存在
    const existingParam = await this.prisma.systemParam.findUnique({
      where: { key: createSystemParamDto.key },
    });

    if (existingParam) {
      throw new BadRequestException('参数键名已存在');
    }

    const systemParam = await this.prisma.systemParam.create({
      data: {
        ...createSystemParamDto,
      },
    });

    return new SystemParamEntity(systemParam);
  }

  async findAll(query: QuerySystemParamDto) {
    const { page = 1, limit = 10, search, group, type } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { key: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(group && { group }),
      ...(type && { type }),
    };

    const [systemParams, total] = await Promise.all([
      this.prisma.systemParam.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.systemParam.count({ where }),
    ]);

    return {
      data: systemParams.map((param) => new SystemParamEntity(param)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const systemParam = await this.prisma.systemParam.findFirst({
      where: { id, deletedAt: null },
    });

    if (!systemParam) {
      throw new NotFoundException('系统参数不存在');
    }

    return new SystemParamEntity(systemParam);
  }

  async findByKey(key: string) {
    const systemParam = await this.prisma.systemParam.findFirst({
      where: { key, deletedAt: null },
    });

    return systemParam ? new SystemParamEntity(systemParam) : null;
  }

  async findByCategory(category: string) {
    const systemParams = await this.prisma.systemParam.findMany({
      where: {
        category,
        deletedAt: null,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return systemParams.map((param) => new SystemParamEntity(param));
  }

  async getCategories() {
    const categories = await this.prisma.systemParam.groupBy({
      by: ['category'],
      where: {
        deletedAt: null,
        category: { not: null },
      },
      _count: {
        id: true,
      },
    });

    return categories.map((category) => ({
      name: category.category,
      count: category._count.id,
    }));
  }

  async update(id: number, updateSystemParamDto: UpdateSystemParamDto) {
    // 检查参数是否存在
    const existingParam = await this.prisma.systemParam.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingParam) {
      throw new NotFoundException('系统参数不存在');
    }

    // 如果是系统参数，只允许更新值
    if (existingParam.key.startsWith('system.')) {
      const allowedFields = ['value', 'description'];
      const updateData = Object.keys(updateSystemParamDto).reduce((acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = updateSystemParamDto[key];
        }
        return acc;
      }, {});

      const systemParam = await this.prisma.systemParam.update({
        where: { id },
        data: updateData,
      });

      return new SystemParamEntity(systemParam);
    }

    // 如果更新键名，检查是否重复
    if (updateSystemParamDto.key && updateSystemParamDto.key !== existingParam.key) {
      const duplicateParam = await this.prisma.systemParam.findFirst({
        where: { 
          key: updateSystemParamDto.key,
          deletedAt: null,
        },
      });

      if (duplicateParam) {
        throw new BadRequestException('参数键名已存在');
      }
    }

    const systemParam = await this.prisma.systemParam.update({
      where: { id },
      data: updateSystemParamDto,
    });

    return new SystemParamEntity(systemParam);
  }

  async remove(id: number) {
    // 检查参数是否存在
    const systemParam = await this.prisma.systemParam.findFirst({
      where: { id, deletedAt: null },
    });

    if (!systemParam) {
      throw new NotFoundException('系统参数不存在');
    }

    // 系统参数不允许删除
    if (systemParam.key.startsWith('system.')) {
      throw new BadRequestException('系统参数不允许删除');
    }

    // 软删除参数
    await this.prisma.systemParam.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '删除成功' };
  }

  async batchUpdate(params: { key: string; value: string }[]) {
    const updatePromises = params.map(async (param) => {
      const existingParam = await this.prisma.systemParam.findFirst({
        where: { key: param.key, deletedAt: null },
      });

      if (existingParam) {
        return this.prisma.systemParam.update({
          where: { id: existingParam.id },
          data: { value: param.value },
        });
      }
    });

    await Promise.all(updatePromises);
    return { message: '批量更新成功' };
  }

  async reset(id: number) {
    const systemParam = await this.prisma.systemParam.findFirst({
      where: { id, deletedAt: null },
    });

    if (!systemParam) {
      throw new NotFoundException('系统参数不存在');
    }

    // 这里可以根据业务需求设置默认值逻辑
    // 暂时设置为空字符串
    const updatedParam = await this.prisma.systemParam.update({
      where: { id },
      data: { value: '' },
    });

    return new SystemParamEntity(updatedParam);
  }

  // 获取参数值的便捷方法
  async getParamValue(key: string, defaultValue: string = ''): Promise<string> {
    const param = await this.findByKey(key);
    return param ? param.value : defaultValue;
  }

  // 设置参数值的便捷方法
  async setParamValue(key: string, value: string): Promise<void> {
    const param = await this.prisma.systemParam.findFirst({
      where: { key, deletedAt: null },
    });

    if (param) {
      await this.prisma.systemParam.update({
        where: { id: param.id },
        data: { value },
      });
    }
  }
}
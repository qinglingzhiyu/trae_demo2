import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDictionaryDto,
  CreateDictionaryItemDto,
} from './dto/create-dictionary.dto';
import {
  UpdateDictionaryDto,
  UpdateDictionaryItemDto,
} from './dto/update-dictionary.dto';
import {
  QueryDictionaryDto,
  QueryDictionaryItemDto,
} from './dto/query-dictionary.dto';
import {
  DictionaryEntity,
  DictionaryItemEntity,
  DictionaryTypeEntity,
} from './entities/dictionary.entity';

@Injectable()
export class DictionariesService {
  constructor(private prisma: PrismaService) {}

  // 字典类型管理
  async createDictionary(createDictionaryDto: CreateDictionaryDto) {
    // 检查字典类型是否已存在
    const existingDictionary = await this.prisma.dictionaryType.findFirst({
      where: { code: createDictionaryDto.type },
    });

    if (existingDictionary) {
      throw new BadRequestException('字典类型已存在');
    }

    const dictionary = await this.prisma.dictionaryType.create({
      data: {
        code: createDictionaryDto.type,
        name: createDictionaryDto.name,
        description: createDictionaryDto.description,
      },
    });

    return new DictionaryTypeEntity(dictionary);
  }

  async findAllDictionaries(query: QueryDictionaryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const [dictionaries, total] = await Promise.all([
      this.prisma.dictionaryType.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dictionaryType.count({ where }),
    ]);

    return {
      data: dictionaries.map((dict) => new DictionaryEntity(dict)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneDictionary(id: number) {
    const dictionary = await this.prisma.dictionaryType.findUnique({
      where: { id, deletedAt: null },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!dictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    return new DictionaryEntity(dictionary);
  }

  async updateDictionary(id: number, updateDictionaryDto: UpdateDictionaryDto) {
    // 检查字典是否存在
    const existingDictionary = await this.prisma.dictionaryType.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingDictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    // 如果更新类型，检查是否重复
    if (updateDictionaryDto.type && updateDictionaryDto.type !== existingDictionary.code) {
      const duplicateDictionary = await this.prisma.dictionaryType.findFirst({
        where: {
          code: updateDictionaryDto.type,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (duplicateDictionary) {
        throw new BadRequestException('字典类型已存在');
      }
    }

    const updateData: any = { ...updateDictionaryDto };
    if (updateDictionaryDto.type) {
      updateData.code = updateDictionaryDto.type;
      delete updateData.type;
    }

    const dictionary = await this.prisma.dictionaryType.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    return new DictionaryEntity(dictionary);
  }

  async removeDictionary(id: number) {
    // 检查字典是否存在
    const dictionary = await this.prisma.dictionaryType.findUnique({
      where: { id, deletedAt: null },
    });

    if (!dictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    // 软删除字典类型
    await this.prisma.dictionaryType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // 同时软删除关联的字典项
    await this.prisma.dictionaryItem.updateMany({
      where: { typeId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return { message: '删除成功' };
  }

  // 字典项管理
  async createDictionaryItem(createDictionaryItemDto: CreateDictionaryItemDto) {
    // 检查字典类型是否存在
    const dictionaryType = await this.prisma.dictionaryType.findUnique({
      where: { id: createDictionaryItemDto.typeId },
    });

    if (!dictionaryType) {
      throw new NotFoundException('字典类型不存在');
    }

    // 检查值是否重复
    const existingItem = await this.prisma.dictionaryItem.findFirst({
      where: {
        typeId: createDictionaryItemDto.typeId,
        value: createDictionaryItemDto.value,
      },
    });

    if (existingItem) {
      throw new BadRequestException('字典项值已存在');
    }

    const dictionaryItem = await this.prisma.dictionaryItem.create({
      data: createDictionaryItemDto,
      include: {
        type: true,
      },
    });

    return new DictionaryItemEntity(dictionaryItem);
  }

  async findAllDictionaryItems(query: QueryDictionaryItemDto) {
    const { page = 1, limit = 10, search, typeId } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (typeId) where.typeId = typeId;
    if (search) {
      where.OR = [
        { label: { contains: search } },
        { value: { contains: search } },
      ];
    }

    const [dictionaryItems, total] = await Promise.all([
      this.prisma.dictionaryItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          type: true,
        },
        orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.dictionaryItem.count({ where }),
    ]);

    return {
      data: dictionaryItems.map((item) => new DictionaryItemEntity(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findDictionaryItemsByType(typeCode: string) {
    const dictionaryType = await this.prisma.dictionaryType.findFirst({
      where: { code: typeCode, deletedAt: null },
    });

    if (!dictionaryType) {
      return [];
    }

    const dictionaryItems = await this.prisma.dictionaryItem.findMany({
      where: {
        typeId: dictionaryType.id,
        deletedAt: null,
      },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    return dictionaryItems.map((item) => new DictionaryItemEntity(item));
  }

  async findOneDictionaryItem(id: number) {
    const dictionaryItem = await this.prisma.dictionaryItem.findFirst({
      where: { id, deletedAt: null },
      include: {
        type: true,
      },
    });

    if (!dictionaryItem || dictionaryItem.type?.deletedAt) {
      throw new NotFoundException('字典项不存在');
    }

    return new DictionaryItemEntity(dictionaryItem);
  }

  async updateDictionaryItem(id: number, updateDictionaryItemDto: UpdateDictionaryItemDto) {
    // 检查字典项是否存在
    const existingItem = await this.prisma.dictionaryItem.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingItem) {
      throw new NotFoundException('字典项不存在');
    }

    // 如果更新值，检查是否重复
    if (updateDictionaryItemDto.value && updateDictionaryItemDto.value !== existingItem.value) {
      const duplicateItem = await this.prisma.dictionaryItem.findFirst({
        where: {
          typeId: existingItem.typeId,
          value: updateDictionaryItemDto.value,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (duplicateItem) {
        throw new BadRequestException('字典项值已存在');
      }
    }

    const dictionaryItem = await this.prisma.dictionaryItem.update({
      where: { id },
      data: updateDictionaryItemDto,
      include: {
        type: true,
      },
    });

    return new DictionaryItemEntity(dictionaryItem);
  }

  async removeDictionaryItem(id: number) {
    // 检查字典项是否存在
    const dictionaryItem = await this.prisma.dictionaryItem.findUnique({
      where: { id, deletedAt: null },
    });

    if (!dictionaryItem) {
      throw new NotFoundException('字典项不存在');
    }

    // 软删除字典项
    await this.prisma.dictionaryItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '删除成功' };
  }

  async batchCreateDictionaryItems(items: CreateDictionaryItemDto[]) {
    // 验证字典类型是否存在
    const typeIds = [...new Set(items.map(item => item.typeId))];
    const existingTypes = await this.prisma.dictionaryType.findMany({
      where: { id: { in: typeIds } },
    });

    if (existingTypes.length !== typeIds.length) {
      throw new BadRequestException('部分字典类型不存在');
    }

    // 检查重复值
    for (const item of items) {
      const existingItem = await this.prisma.dictionaryItem.findFirst({
        where: {
          typeId: item.typeId,
          value: item.value,
        },
      });

      if (existingItem) {
        throw new BadRequestException(`字典项值 "${item.value}" 已存在`);
      }
    }

    const createdItems = await this.prisma.dictionaryItem.createMany({
      data: items,
    });

    return { message: `成功创建 ${createdItems.count} 个字典项` };
  }

  async getAllDictionaryTypes() {
    const types = await this.prisma.dictionaryType.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });

    return types;
  }

  async exportDictionary(typeCode: string) {
    const dictionaryType = await this.prisma.dictionaryType.findFirst({
      where: { code: typeCode },
    });

    if (!dictionaryType) {
      throw new NotFoundException('字典类型不存在');
    }

    const items = await this.prisma.dictionaryItem.findMany({
      where: {
        typeId: dictionaryType.id,
      },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      dictionaryType: new DictionaryTypeEntity(dictionaryType),
      items: items.map((item) => new DictionaryItemEntity(item)),
    };
  }

  // 便捷方法：根据类型和值获取字典项标签
  async getDictionaryLabel(typeCode: string, value: string): Promise<string> {
    const dictionaryType = await this.prisma.dictionaryType.findFirst({
      where: { code: typeCode },
    });

    if (!dictionaryType) {
      return value;
    }

    const item = await this.prisma.dictionaryItem.findFirst({
      where: {
        typeId: dictionaryType.id,
        value,
      },
    });

    return item ? item.label : value;
  }

  // 便捷方法：根据类型和标签获取字典项值
  async getDictionaryValue(typeCode: string, label: string): Promise<string> {
    const dictionaryType = await this.prisma.dictionaryType.findFirst({
      where: { code: typeCode },
    });

    if (!dictionaryType) {
      return label;
    }

    const item = await this.prisma.dictionaryItem.findFirst({
      where: {
        typeId: dictionaryType.id,
        label,
      },
    });

    return item ? item.value : label;
  }
}
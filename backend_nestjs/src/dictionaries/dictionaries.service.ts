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
} from './entities/dictionary.entity';

@Injectable()
export class DictionariesService {
  constructor(private prisma: PrismaService) {}

  // 字典类型管理
  async createDictionary(createDictionaryDto: CreateDictionaryDto) {
    // 检查字典类型是否已存在
    const existingDictionary = await this.prisma.dictionary.findUnique({
      where: { type: createDictionaryDto.type },
    });

    if (existingDictionary) {
      throw new BadRequestException('字典类型已存在');
    }

    const dictionary = await this.prisma.dictionary.create({
      data: {
        ...createDictionaryDto,
        isActive: true,
        sort: createDictionaryDto.sort || 0,
      },
    });

    return new DictionaryEntity(dictionary);
  }

  async findAllDictionaries(query: QueryDictionaryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { type: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [dictionaries, total] = await Promise.all([
      this.prisma.dictionary.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { items: true },
          },
        },
        orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.dictionary.count({ where }),
    ]);

    return {
      data: dictionaries.map((dictionary) => new DictionaryEntity(dictionary)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneDictionary(id: number) {
    const dictionary = await this.prisma.dictionary.findFirst({
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
    const existingDictionary = await this.prisma.dictionary.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingDictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    // 如果更新类型，检查是否重复
    if (updateDictionaryDto.type && updateDictionaryDto.type !== existingDictionary.type) {
      const duplicateDictionary = await this.prisma.dictionary.findUnique({
        where: { type: updateDictionaryDto.type },
      });

      if (duplicateDictionary) {
        throw new BadRequestException('字典类型已存在');
      }
    }

    const dictionary = await this.prisma.dictionary.update({
      where: { id },
      data: updateDictionaryDto,
    });

    return new DictionaryEntity(dictionary);
  }

  async removeDictionary(id: number) {
    // 检查字典是否存在
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!dictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    // 检查是否有字典项
    if (dictionary._count.items > 0) {
      throw new BadRequestException('该字典类型下还有字典项，无法删除');
    }

    // 软删除字典
    await this.prisma.dictionary.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: '删除成功' };
  }

  // 字典项管理
  async createDictionaryItem(createDictionaryItemDto: CreateDictionaryItemDto) {
    // 检查字典类型是否存在
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { id: createDictionaryItemDto.dictionaryId, deletedAt: null },
    });

    if (!dictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    // 检查值是否重复
    const existingItem = await this.prisma.dictionaryItem.findFirst({
      where: {
        dictionaryId: createDictionaryItemDto.dictionaryId,
        value: createDictionaryItemDto.value,
        deletedAt: null,
      },
    });

    if (existingItem) {
      throw new BadRequestException('字典项值已存在');
    }

    const dictionaryItem = await this.prisma.dictionaryItem.create({
      data: {
        ...createDictionaryItemDto,
        isActive: true,
        sort: createDictionaryItemDto.sort || 0,
      },
      include: {
        dictionary: true,
      },
    });

    return new DictionaryItemEntity(dictionaryItem);
  }

  async findAllDictionaryItems(query: QueryDictionaryItemDto) {
    const { page = 1, limit = 10, search, dictionaryId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };
    if (dictionaryId) where.dictionaryId = dictionaryId;
    if (search) {
      where.OR = [
        { label: { contains: search, mode: 'insensitive' as const } },
        { value: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [dictionaryItems, total] = await Promise.all([
      this.prisma.dictionaryItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          dictionary: true,
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

  async findDictionaryItemsByType(type: string) {
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { type: type, deletedAt: null },
    });

    if (!dictionary) {
      return [];
    }

    const dictionaryItems = await this.prisma.dictionaryItem.findMany({
      where: {
        dictionaryId: dictionary.id,
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
        dictionary: true,
      },
    });

    if (!dictionaryItem) {
      throw new NotFoundException('字典项不存在');
    }

    return new DictionaryItemEntity(dictionaryItem);
  }

  async updateDictionaryItem(id: number, updateDictionaryItemDto: UpdateDictionaryItemDto) {
    // 检查字典项是否存在
    const existingItem = await this.prisma.dictionaryItem.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingItem) {
      throw new NotFoundException('字典项不存在');
    }

    // 如果更新值，检查是否重复
    if (updateDictionaryItemDto.value && updateDictionaryItemDto.value !== existingItem.value) {
      const duplicateItem = await this.prisma.dictionaryItem.findFirst({
        where: {
          dictionaryId: existingItem.dictionaryId,
          value: updateDictionaryItemDto.value,
          deletedAt: null,
          id: { not: id },
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
        dictionary: true,
      },
    });

    return new DictionaryItemEntity(dictionaryItem);
  }

  async removeDictionaryItem(id: number) {
    // 检查字典项是否存在
    const dictionaryItem = await this.prisma.dictionaryItem.findFirst({
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
    const dictionaryIds = [...new Set(items.map(item => item.dictionaryId))];
    const existingDictionaries = await this.prisma.dictionary.findMany({
      where: { id: { in: dictionaryIds }, deletedAt: null },
    });

    if (existingDictionaries.length !== dictionaryIds.length) {
      throw new BadRequestException('部分字典类型不存在');
    }

    // 检查重复值
    for (const item of items) {
      const existingItem = await this.prisma.dictionaryItem.findFirst({
        where: {
          dictionaryId: item.dictionaryId,
          value: item.value,
          deletedAt: null,
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
    const dictionaries = await this.prisma.dictionary.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
      },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    return dictionaries;
  }

  async exportDictionary(type: string) {
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { type: type, deletedAt: null },
    });

    if (!dictionary) {
      throw new NotFoundException('字典类型不存在');
    }

    const items = await this.prisma.dictionaryItem.findMany({
      where: { dictionaryId: dictionary.id, deletedAt: null },
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      dictionary: new DictionaryEntity(dictionary),
      items: items.map((item) => new DictionaryItemEntity(item)),
    };
  }

  // 便捷方法：根据类型和值获取字典项标签
  async getDictionaryLabel(type: string, value: string): Promise<string> {
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { type: type, deletedAt: null },
    });

    if (!dictionary) {
      return value;
    }

    const item = await this.prisma.dictionaryItem.findFirst({
      where: {
        dictionaryId: dictionary.id,
        value,
        deletedAt: null,
      },
    });

    return item ? item.label : value;
  }

  // 便捷方法：根据类型和标签获取字典项值
  async getDictionaryValue(type: string, label: string): Promise<string> {
    const dictionary = await this.prisma.dictionary.findFirst({
      where: { type: type, deletedAt: null },
    });

    if (!dictionary) {
      return label;
    }

    const item = await this.prisma.dictionaryItem.findFirst({
      where: {
        dictionaryId: dictionary.id,
        label,
        deletedAt: null,
      },
    });

    return item ? item.value : label;
  }
}
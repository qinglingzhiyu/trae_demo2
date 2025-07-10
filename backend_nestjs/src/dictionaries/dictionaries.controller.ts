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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DictionariesService } from './dictionaries.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('字典管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  // 字典类型管理
  @Post()
  @ApiOperation({ summary: '创建字典类型' })
  @ApiResponse({ status: 201, description: '创建成功', type: DictionaryEntity })
  async createDictionary(@Body() createDictionaryDto: CreateDictionaryDto) {
    return this.dictionariesService.createDictionary(createDictionaryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典类型列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [DictionaryEntity] })
  async findAllDictionaries(@Query() query: QueryDictionaryDto) {
    return this.dictionariesService.findAllDictionaries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典类型详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: DictionaryEntity })
  async findOneDictionary(@Param('id', ParseIntPipe) id: number) {
    return this.dictionariesService.findOneDictionary(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新字典类型' })
  @ApiResponse({ status: 200, description: '更新成功', type: DictionaryEntity })
  async updateDictionary(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ) {
    return this.dictionariesService.updateDictionary(id, updateDictionaryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典类型' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeDictionary(@Param('id', ParseIntPipe) id: number) {
    return this.dictionariesService.removeDictionary(id);
  }

  // 字典项管理
  @Post('items')
  @ApiOperation({ summary: '创建字典项' })
  @ApiResponse({ status: 201, description: '创建成功', type: DictionaryItemEntity })
  async createDictionaryItem(@Body() createDictionaryItemDto: CreateDictionaryItemDto) {
    return this.dictionariesService.createDictionaryItem(createDictionaryItemDto);
  }

  @Get('items')
  @ApiOperation({ summary: '获取字典项列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [DictionaryItemEntity] })
  async findAllDictionaryItems(@Query() query: QueryDictionaryItemDto) {
    return this.dictionariesService.findAllDictionaryItems(query);
  }

  @Get('items/by-type/:type')
  @ApiOperation({ summary: '根据类型获取字典项' })
  @ApiResponse({ status: 200, description: '获取成功', type: [DictionaryItemEntity] })
  async findDictionaryItemsByType(@Param('type') type: string) {
    return this.dictionariesService.findDictionaryItemsByType(type);
  }

  @Get('items/:id')
  @ApiOperation({ summary: '获取字典项详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: DictionaryItemEntity })
  async findOneDictionaryItem(@Param('id', ParseIntPipe) id: number) {
    return this.dictionariesService.findOneDictionaryItem(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: '更新字典项' })
  @ApiResponse({ status: 200, description: '更新成功', type: DictionaryItemEntity })
  async updateDictionaryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictionaryItemDto: UpdateDictionaryItemDto,
  ) {
    return this.dictionariesService.updateDictionaryItem(id, updateDictionaryItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '删除字典项' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeDictionaryItem(@Param('id', ParseIntPipe) id: number) {
    return this.dictionariesService.removeDictionaryItem(id);
  }

  @Post('items/batch')
  @ApiOperation({ summary: '批量创建字典项' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async batchCreateDictionaryItems(@Body() items: CreateDictionaryItemDto[]) {
    return this.dictionariesService.batchCreateDictionaryItems(items);
  }

  @Get('types/all')
  @ApiOperation({ summary: '获取所有字典类型' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAllDictionaryTypes() {
    return this.dictionariesService.getAllDictionaryTypes();
  }

  @Get('export/:type')
  @ApiOperation({ summary: '导出字典数据' })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportDictionary(@Param('type') type: string) {
    return this.dictionariesService.exportDictionary(type);
  }
}
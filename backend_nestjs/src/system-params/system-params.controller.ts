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
import { SystemParamsService } from './system-params.service';
import { CreateSystemParamDto } from './dto/create-system-param.dto';
import { UpdateSystemParamDto } from './dto/update-system-param.dto';
import { QuerySystemParamDto } from './dto/query-system-param.dto';
import { SystemParamEntity } from './entities/system-param.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('系统参数')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system-params')
export class SystemParamsController {
  constructor(private readonly systemParamsService: SystemParamsService) {}

  @Post()
  @ApiOperation({ summary: '创建系统参数' })
  @ApiResponse({ status: 201, description: '创建成功', type: SystemParamEntity })
  async create(@Body() createSystemParamDto: CreateSystemParamDto) {
    return this.systemParamsService.create(createSystemParamDto);
  }

  @Get()
  @ApiOperation({ summary: '获取系统参数列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [SystemParamEntity] })
  async findAll(@Query() query: QuerySystemParamDto) {
    return this.systemParamsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: '获取参数分组列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getCategories() {
    return this.systemParamsService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: '根据分组获取参数' })
  @ApiResponse({ status: 200, description: '获取成功', type: [SystemParamEntity] })
  async findByCategory(@Param('category') category: string) {
    return this.systemParamsService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取系统参数详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: SystemParamEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.systemParamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新系统参数' })
  @ApiResponse({ status: 200, description: '更新成功', type: SystemParamEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSystemParamDto: UpdateSystemParamDto,
  ) {
    return this.systemParamsService.update(id, updateSystemParamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除系统参数' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.systemParamsService.remove(id);
  }

  @Post('batch-update')
  @ApiOperation({ summary: '批量更新系统参数' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async batchUpdate(@Body() params: { key: string; value: string }[]) {
    return this.systemParamsService.batchUpdate(params);
  }

  @Post('reset/:id')
  @ApiOperation({ summary: '重置参数为默认值' })
  @ApiResponse({ status: 200, description: '重置成功' })
  async reset(@Param('id', ParseIntPipe) id: number) {
    return this.systemParamsService.reset(id);
  }
}
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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientEntity } from './entities/patient.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('就诊人管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: '创建就诊人' })
  @ApiResponse({ status: 201, description: '就诊人创建成功', type: PatientEntity })
  async create(
    @Request() req,
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<PatientEntity> {
    return this.patientsService.create(req.user.userId, createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: '获取就诊人列表' })
  @ApiResponse({ status: 200, description: '就诊人列表获取成功' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  async findAll(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.patientsService.findAll(req.user.userId, page, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取就诊人统计信息' })
  @ApiResponse({ status: 200, description: '统计信息获取成功' })
  async getStatistics(@Request() req) {
    return this.patientsService.getStatistics(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取就诊人详情' })
  @ApiResponse({ status: 200, description: '就诊人详情获取成功', type: PatientEntity })
  @ApiResponse({ status: 404, description: '就诊人不存在' })
  async findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientEntity> {
    return this.patientsService.findOne(id, req.user.userId);
  }

  @Post(':id/update')
  @ApiOperation({ summary: '更新就诊人信息' })
  @ApiResponse({ status: 200, description: '就诊人更新成功', type: PatientEntity })
  @ApiResponse({ status: 404, description: '就诊人不存在' })
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientEntity> {
    return this.patientsService.update(id, req.user.userId, updatePatientDto, req.user.userId);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '软删除就诊人' })
  @ApiResponse({ status: 200, description: '就诊人删除成功' })
  @ApiResponse({ status: 404, description: '就诊人不存在' })
  @ApiResponse({ status: 403, description: '该就诊人存在关联订单，无法删除' })
  async remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.patientsService.remove(id, req.user.userId);
    return { message: '就诊人删除成功' };
  }
}
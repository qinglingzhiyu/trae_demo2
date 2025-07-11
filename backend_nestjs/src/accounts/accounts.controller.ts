import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AccountEntity } from './entities/account.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('后台账号管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: '创建后台账号' })
  @ApiResponse({ status: 201, description: '账号创建成功', type: AccountEntity })
  @ApiResponse({ status: 409, description: '手机号或邮箱已存在' })
  async create(@Body() createAccountDto: CreateAccountDto, @Request() req): Promise<AccountEntity> {
    return this.accountsService.create(createAccountDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: '获取后台账号列表' })
  @ApiResponse({ status: 200, description: '账号列表获取成功' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'role', required: false, description: '账号角色' })
  @ApiQuery({ name: 'status', required: false, description: '账号状态' })
  @ApiQuery({ name: 'department', required: false, description: '所属部门' })
  async findAll(@Query() queryDto: QueryAccountDto) {
    return this.accountsService.findAll(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取账号统计信息' })
  @ApiResponse({ status: 200, description: '统计信息获取成功' })
  async getStatistics() {
    return this.accountsService.getStatistics();
  }

  @Get('roles')
  @ApiOperation({ summary: '获取可用角色列表' })
  @ApiResponse({ status: 200, description: '角色列表获取成功' })
  async getAvailableRoles() {
    return this.accountsService.getAvailableRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取账号详情' })
  @ApiResponse({ status: 200, description: '账号详情获取成功', type: AccountEntity })
  @ApiResponse({ status: 404, description: '账号不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AccountEntity> {
    return this.accountsService.findOne(id);
  }

  @Post(':id/update')
  @ApiOperation({ summary: '更新账号信息' })
  @ApiResponse({ status: 200, description: '账号更新成功', type: AccountEntity })
  @ApiResponse({ status: 404, description: '账号不存在' })
  @ApiResponse({ status: 409, description: '手机号或邮箱已存在' })
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountEntity> {
    return this.accountsService.update(id, updateAccountDto, req.user.userId);
  }

  @Post(':id/reset-password')
  @ApiOperation({ summary: '重置账号密码' })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 404, description: '账号不存在' })
  async resetPassword(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.accountsService.resetPassword(id, resetPasswordDto, req.user.userId);
    return { message: '密码重置成功' };
  }

  @Post(':id/toggle-status')
  @ApiOperation({ summary: '切换账号状态' })
  @ApiResponse({ status: 200, description: '状态切换成功' })
  @ApiResponse({ status: 404, description: '账号不存在' })
  async toggleStatus(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; status: string }> {
    const result = await this.accountsService.toggleStatus(id, req.user.userId);
    return { message: '状态切换成功', status: result.status };
  }

  @Post(':id/assign-roles')
  @ApiOperation({ summary: '分配账号角色' })
  @ApiResponse({ status: 200, description: '角色分配成功' })
  @ApiResponse({ status: 404, description: '账号不存在' })
  async assignRoles(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleIds: number[] },
  ): Promise<{ message: string }> {
    await this.accountsService.assignRoles(id, body.roleIds, req.user.userId);
    return { message: '角色分配成功' };
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '软删除账号' })
  @ApiResponse({ status: 200, description: '账号删除成功' })
  @ApiResponse({ status: 404, description: '账号不存在' })
  async remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.accountsService.remove(id, req.user.userId);
    return { message: '账号删除成功' };
  }

  @Get(':id/login-logs')
  @ApiOperation({ summary: '获取账号登录日志' })
  @ApiResponse({ status: 200, description: '登录日志获取成功' })
  async getLoginLogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.accountsService.getLoginLogs(id, page, limit);
  }

  @Get(':id/operation-logs')
  @ApiOperation({ summary: '获取账号操作日志' })
  @ApiResponse({ status: 200, description: '操作日志获取成功' })
  async getOperationLogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.accountsService.getOperationLogs(id, page, limit);
  }
}
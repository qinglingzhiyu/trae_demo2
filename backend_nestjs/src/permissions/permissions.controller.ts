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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { RoleEntity, PermissionEntity } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('权限管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // 角色管理
  @Post('roles')
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '创建成功', type: RoleEntity })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.permissionsService.createRole(createRoleDto);
  }

  @Get('roles')
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [RoleEntity] })
  async findAllRoles(@Query() query: QueryRoleDto) {
    return this.permissionsService.findAllRoles(query);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: RoleEntity })
  async findOneRole(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOneRole(id);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: 200, description: '更新成功', type: RoleEntity })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.permissionsService.updateRole(id, updateRoleDto);
  }

  @Post('roles/:id/delete')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeRole(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.permissionsService.removeRole(id, req.user.userId);
  }

  @Post('roles/:id/permissions')
  @ApiOperation({ summary: '分配角色权限' })
  @ApiResponse({ status: 200, description: '分配成功' })
  async assignPermissions(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() body: { permissionIds: number[] },
  ) {
    return this.permissionsService.assignPermissions(roleId, body.permissionIds);
  }

  // 权限管理
  @Get('permissions')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({ status: 200, description: '获取成功', type: [PermissionEntity] })
  async findAllPermissions() {
    return this.permissionsService.findAllPermissions();
  }

  @Get('permissions/tree')
  @ApiOperation({ summary: '获取权限树结构' })
  @ApiResponse({ status: 200, description: '获取成功', type: [PermissionEntity] })
  async getPermissionTree() {
    return this.permissionsService.getPermissionTree();
  }

  @Post('permissions')
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '创建成功', type: PermissionEntity })
  async createPermission(@Body() createPermissionDto: any) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch('permissions/:id')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '更新成功', type: PermissionEntity })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: any,
  ) {
    return this.permissionsService.updatePermission(id, updatePermissionDto);
  }

  @Post('permissions/:id/delete')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removePermission(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.permissionsService.removePermission(id, req.user.userId);
  }
}
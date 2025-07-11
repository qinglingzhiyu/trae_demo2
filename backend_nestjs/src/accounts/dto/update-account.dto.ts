import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { UserRole, UserStatus } from '../../common/constants/enums';

export class UpdateAccountDto {
  @ApiProperty({ description: '账号姓名', example: '张医生', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: '姓名长度必须在2-50个字符之间' })
  name?: string;

  @ApiProperty({ description: '手机号码', example: '13800138000', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号码' })
  phone?: string;

  @ApiProperty({ description: '邮箱地址', example: 'doctor@hospital.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  email?: string;

  @ApiProperty({ description: '身份证号', example: '110101199001011234', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, {
    message: '请输入正确的身份证号码'
  })
  idCard?: string;

  @ApiProperty({ description: '账号角色', enum: UserRole, example: UserRole.DOCTOR, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: '请选择正确的账号角色' })
  role?: UserRole;

  @ApiProperty({ description: '账号状态', enum: UserStatus, example: UserStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(UserStatus, { message: '请选择正确的账号状态' })
  status?: UserStatus;

  @ApiProperty({ description: '所属部门', example: '内科', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: '部门名称长度必须在1-100个字符之间' })
  department?: string;

  @ApiProperty({ description: '职位', example: '主治医师', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: '职位名称长度必须在1-100个字符之间' })
  position?: string;

  @ApiProperty({ description: '工号', example: 'D001', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '工号长度必须在1-50个字符之间' })
  employeeId?: string;

  @ApiProperty({ description: '联系地址', example: '北京市朝阳区xxx街道', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: '地址长度必须在1-200个字符之间' })
  address?: string;

  @ApiProperty({ description: '备注信息', example: '专业擅长心血管疾病', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 500, { message: '备注长度必须在1-500个字符之间' })
  remark?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { UserRole } from '../../common/constants/enums';

export class CreateUserDto {
  @ApiProperty({ description: '用户姓名', example: '张三' })
  @IsString()
  @Length(2, 50, { message: '姓名长度必须在2-50个字符之间' })
  name: string;

  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号码' })
  phone: string;

  @ApiProperty({ description: '邮箱地址', example: 'user@example.com', required: false })
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

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @ApiProperty({ description: '用户角色', enum: UserRole, example: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole, { message: '请选择正确的用户角色' })
  role?: UserRole;
}
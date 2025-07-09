import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号码' })
  phone: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @ApiProperty({ description: '记住登录', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}
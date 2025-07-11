import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: '新密码', example: 'newPassword123' })
  @IsString()
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/, {
    message: '密码必须包含字母和数字，可包含特殊字符@$!%*?&'
  })
  newPassword: string;

  @ApiProperty({ description: '确认新密码', example: 'newPassword123' })
  @IsString()
  @Length(6, 20, { message: '确认密码长度必须在6-20个字符之间' })
  confirmPassword: string;

  @ApiProperty({ description: '重置原因', example: '用户忘记密码', required: false })
  @IsString()
  @Length(1, 200, { message: '重置原因长度必须在1-200个字符之间' })
  reason?: string;
}
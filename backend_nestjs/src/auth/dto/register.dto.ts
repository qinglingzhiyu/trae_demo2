import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {
  @ApiProperty({ description: '确认密码', example: 'password123' })
  confirmPassword: string;
}
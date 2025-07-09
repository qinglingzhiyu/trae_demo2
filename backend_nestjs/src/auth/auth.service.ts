import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用');
    }

    const payload = { phone: user.phone, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: new UserEntity(user),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    return this.usersService.create(registerDto);
  }

  async getProfile(userId: number): Promise<UserEntity> {
    return this.usersService.findOne(userId);
  }
}
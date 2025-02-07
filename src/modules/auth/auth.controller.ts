import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Token } from './auth.interface';
import { Response } from '../base.interface';
import { RegisterDto } from './dto/register-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserDC } from '../decorators/user.decorator';
import { AllowAnonymous } from '../guards/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  async login(@Body() request: LoginDto): Promise<Response<Token>> {
    return await this.authService.login(request);
  }

  @AllowAnonymous()
  @Post('register')
  async register(@Body() request: RegisterDto): Promise<Response<User>> {
    return await this.authService.register(request);
  }

  @AllowAnonymous()
  @Post('refresh')
  async refreshToken(@Body() request: RefreshTokenDto): Promise<Response<Token>> {
    return await this.authService.refreshToken(request);
  }

  @Get('logout')
  async logout(@UserDC('id') userId: number): Promise<Response> {
    return this.authService.logout(userId);
  }
}

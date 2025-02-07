import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { UserService } from '../user/user.service';
import { Response } from '../base.interface';
import { Token } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../user/entities/user.entity';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: SendEmailService,
  ) {}

  async register(request: RegisterDto): Promise<Response<User>> {
    try {
      const user = await this.userService.findByEmail(request.email);

      if (user) {
        throw new HttpException('User already exist.', HttpStatus.BAD_REQUEST);
      }

      const passwordHash = await this.hashPasswordToBase64String(request.password);

      request.password = passwordHash;
      const userResult = await this.userService.create(request as User);

      if (!userResult) {
        throw new HttpException('Failed to create user.', HttpStatus.EXPECTATION_FAILED);
      }
      // await this.emailService.sendEmail(request.email);
      return { success: true, data: userResult };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(request: LoginDto): Promise<Response<Token>> {
    try {
      const user = await this.userService.findByEmail(request.email);
      const pass = await this.verifyPassword(request.password, user?.password || '');

      if (!user || !pass) {
        throw new HttpException('Invalid username or password.', HttpStatus.UNAUTHORIZED);
      }

      const payload = { sub: user.id, username: user.email };
      const { accessToken, refreshToken } = await this.generateToken(payload);

      const updateResult = await this.userService.update(user.id, {
        refresh_token: refreshToken,
      });

      if (!updateResult) {
        throw new HttpException("Can't update user.", HttpStatus.EXPECTATION_FAILED);
      }

      return {
        success: true,
        data: { accessToken, refreshToken },
      } as Response<Token>;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(request: RefreshTokenDto): Promise<Response<Token>> {
    try {
      const decode = await this.jwtService.verifyAsync(request.refreshToken, {
        secret: process.env.SECRET_REFRESH_KEY,
      });

      if (!decode) {
        throw new HttpException('Invalid refresh token.', HttpStatus.UNAUTHORIZED);
      }

      const isValidToken = await this.compareRefreshToken(decode.sub, request.refreshToken);

      if (!isValidToken) {
        throw new HttpException('Invalid refresh token.', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.userService.findOne(decode.sub);

      const payload = { sub: user.id, username: user.email };
      const { accessToken, refreshToken } = await this.generateToken(payload);

      const updateResult = await this.userService.update(user.id, {
        refresh_token: refreshToken,
      });

      if (!updateResult) {
        throw new HttpException("Can't update user.", HttpStatus.EXPECTATION_FAILED);
      }

      return {
        success: true,
        data: { accessToken, refreshToken },
      } as Response<Token>;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(userId: number): Promise<Response> {
    try {
      const user = await this.userService.update(userId, {
        refresh_token: null,
      });

      if (!user) {
        throw new HttpException("Can't update user", HttpStatus.EXPECTATION_FAILED);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async verifyPassword(password: string, hash: string) {
    const decodeFromBase64 = atob(hash);
    return await bcrypt.compare(password, decodeFromBase64);
  }

  private async generateToken(payload: object) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN_ACCESS,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_REFRESH_KEY,
      expiresIn: process.env.EXPIRES_IN_REFRESH,
    });
    return { accessToken, refreshToken };
  }

  private async hashPasswordToBase64String(password: string): Promise<string> {
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, saltRounds);
    return btoa(hash);
  }

  private async compareRefreshToken(userId: number, refreshToken: string) {
    const { refresh_token } = await this.userService.findOne(userId);
    if (!refresh_token) return false;
    return refresh_token === refreshToken;
  }
}

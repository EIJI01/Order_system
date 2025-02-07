import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private configService: ConfigService) {}
  getHello(): object {
    return {
      database: this.configService.get<string>('DATABASE_TYPE'),
      port: this.configService.get<string>('DATABASE_PORT'),
      host: this.configService.get<string>('DATABASE_HOST'),
      user: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
    };
  }
}

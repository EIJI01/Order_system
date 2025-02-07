import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemsModule } from './modules/order_items/order_items.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Order } from './modules/order/entities/order.entity';
import { OrderItem } from './modules/order_items/entities/order_item.entity';
import { Product } from './modules/product/entities/product.entity';
import { LoggerMiddleware } from './logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/guards/auth.guard';
import { SendEmailModule } from './modules/send-email/send-email.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<any>('DATABASE_TYPE') || 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Order, Product, OrderItem],
        synchronize: true,
      }),
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: process.env.ALGORITHM as Algorithm,
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    ProductModule,
    OrderModule,
    OrderItemsModule,
    UserModule,
    AuthModule,
    SendEmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const logger = new Logger('RedisClientFactory');
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    redisInstance.on('connect', () => {
      logger.log(
        `Connected to redis on host: ${process.env.REDIS_HOST} port: ${process.env.REDIS_PORT}`,
      );
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};

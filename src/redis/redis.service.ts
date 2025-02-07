import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.quit();
  }

  async get<T>(prefix: string, key: string): Promise<T | null> {
    const cached = await this.redis.get(`${prefix}:${key}`);
    return this.parse<T>(cached);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redis.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redis.del(`${prefix}:${key}`);
  }

  async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
    await this.redis.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  parse<T>(cached: string): T {
    try {
      return cached ? (JSON.parse(cached) as T) : null;
    } catch (error) {
      return null;
    }
  }
}

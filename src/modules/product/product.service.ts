import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  private readonly PREFIX = 'PRODUCT';
  private readonly KEY = 'ALL';

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly redis: RedisService,
  ) {
    super(productRepo, ProductService.name);
  }

  async findAll(): Promise<Product[]> {
    try {
      const isCached = await this.redis.get<Product[]>(this.PREFIX, this.KEY);
      if (isCached) {
        this.logger.log(`Retrieve from cached with [PREFIX:${this.PREFIX} KEY:${this.KEY}]`);
        return isCached;
      }
      const products = await this.productRepo.find();
      await this.redis.set(this.PREFIX, this.KEY, JSON.stringify(products));
      return products;
    } catch (error) {
      this.logger.error(error.message);
      return [];
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepo.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async create(data: DeepPartial<Product>): Promise<Product> {
    try {
      const product = await this.productRepo.save(data);
      await this.redis.delete(this.PREFIX, this.KEY);
      return product;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async update(id: number, data: DeepPartial<Product>): Promise<Product> {
    try {
      await this.productRepo.update(id, data);
      await this.redis.delete(this.PREFIX, this.KEY);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.productRepo.delete(id);
      await this.redis.delete(this.PREFIX, this.KEY);
      return result.affected > 0;
    } catch (error) {
      this.logger.error(error.message);
      return false;
    }
  }
}

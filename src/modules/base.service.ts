import { Logger } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T> {
  public logger: Logger;
  constructor(
    private readonly repo: Repository<T>,
    context: string,
  ) {
    this.logger = new Logger(context);
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      this.logger.error(error.message);
      return [];
    }
  }

  async findOne(id: number): Promise<T | null> {
    try {
      return await this.repo.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      return await this.repo.save(data as T);
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    try {
      await this.repo.update(id, data as QueryDeepPartialEntity<T>);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return result.affected > 0;
    } catch (error) {
      this.logger.error(error.message);
      return false;
    }
  }
}

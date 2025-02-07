import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super(userRepo, UserService.name);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email: email } });
  }
}

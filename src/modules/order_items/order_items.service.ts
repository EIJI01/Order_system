import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { OrderItem } from './entities/order_item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderItemsService extends BaseService<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRep: Repository<OrderItem>,
  ) {
    super(orderItemRep, OrderItemsService.name);
  }
}

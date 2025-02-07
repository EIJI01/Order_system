import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderItemDto } from '../order_items/dto/create-order_item.dto';
import { Product } from '../product/entities/product.entity';
import { OrderItem } from '../order_items/entities/order_item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {
    super(orderRepo, OrderService.name);
  }

  async createOrder(userId: number, items: Partial<CreateOrderItemDto[]>): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) throw new Error(`User ${userId} not found.`);

      let total = 0;
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.itemId } });
        if (!product) throw new Error(`Item ${item.itemId} not found`);
        if (product.stock < item.quantity) throw new Error(`Not enough stock for item ${product.id}`);
        total += product.price * item.quantity;
      }

      const order = queryRunner.manager.create(Order, { user: user, total });
      await queryRunner.manager.save(order);

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.itemId } });
        const orderItem = queryRunner.manager.create(OrderItem, {
          order: order,
          item: product,
          quantity: item.quantity,
          price: product.price * item.quantity,
        });
        await queryRunner.manager.save(orderItem);
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Order creation failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}

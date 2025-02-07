import { Controller } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { BaseController } from '../base.controller';
import { OrderItem } from './entities/order_item.entity';

@Controller('order-items')
export class OrderItemsController extends BaseController<
  CreateOrderItemDto,
  UpdateOrderItemDto,
  OrderItem
> {
  constructor(private readonly orderItemsService: OrderItemsService) {
    super(orderItemsService);
  }
}

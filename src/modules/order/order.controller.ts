import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Response } from '../base.interface';
import { UserDC } from '../decorators/user.decorator';
import { CreateOrderItemDto } from '../order_items/dto/create-order_item.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@UserDC('id') userId: number, @Body() createUserDto: Partial<CreateOrderItemDto[]>): Promise<Response<Order>> {
    try {
      const result = await this.orderService.createOrder(userId, createUserDto);
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Response<Order[]>> {
    const results = await this.orderService.findAll();
    return { success: true, data: results };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<Order>> {
    const result = await this.orderService.findOne(+id);
    if (!result) throw new NotFoundException(`${Text.name} with ${id} not found.`);
    return { success: true, data: result };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateOrderDto): Promise<Response<Order>> {
    try {
      const updatedUser = await this.orderService.update(+id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`${Text.name} with ID ${id} not found.`);
      }
      return { success: true, data: updatedUser };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response> {
    try {
      const deleted = await this.orderService.delete(+id);
      if (!deleted) throw new NotFoundException(`${Text.name} with ID ${id} not found.`);
      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Something went wrong while registering.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

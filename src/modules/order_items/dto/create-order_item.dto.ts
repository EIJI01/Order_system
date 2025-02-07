import { IsDecimal, IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  orderId: number;

  @IsInt()
  itemId: number;

  @IsInt()
  quantity: number;

  @IsDecimal()
  price: number;
}

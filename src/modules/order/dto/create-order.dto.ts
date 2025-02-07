import { IsArray, IsDecimal, IsInt, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsDecimal()
  total: number;

  @IsString()
  status: string;
}

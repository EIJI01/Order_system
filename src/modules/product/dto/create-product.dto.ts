import { IsDecimal, IsInt, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  item_name: string;

  @IsDecimal()
  price: number;

  @IsInt()
  stock: number;
}

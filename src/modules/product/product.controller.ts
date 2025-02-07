import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseController } from '../base.controller';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController extends BaseController<CreateProductDto, UpdateProductDto, Product> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }
}

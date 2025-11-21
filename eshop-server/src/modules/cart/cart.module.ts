import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartResolver } from './cart.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    UsersModule, 
  ],
  controllers: [CartController],
  providers: [CartService, CartResolver], 
  exports: [CartService],
})
export class CartModule {}
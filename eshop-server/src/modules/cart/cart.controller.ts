import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dtos/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId')
  addItem(@Param('userId') userId: string, @Body() dto: AddItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch(':userId/:productId')
  updateItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Query('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(userId, productId, Number(quantity));
  }

  @Delete(':userId/:productId')
  removeItem(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}

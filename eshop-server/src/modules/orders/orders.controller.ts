import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // 🔹 створити замовлення з кошика
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  // 🔹 усі замовлення користувача
  @Get()
  findAll(@Query('userId') userId: string) {
    return this.orders.findAll(userId);
  }

  // 🔹 одне замовлення
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orders.findOne(id);
  }

  // 🔹 оновити статус (адмін)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orders.updateStatus(id, status);
  }
}

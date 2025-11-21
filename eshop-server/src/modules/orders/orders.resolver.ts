import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { OrderType, OrderStatus } from './types/order.type';
import { CreateOrderInput } from './dtos/create-order.input';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/types/user.type';
import { Order } from './schemas/order.schema';

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [OrderType], { name: 'orders', description: 'Отримати всі замовлення користувача' })
  async getUserOrders(@Args('userId', { type: () => ID }) userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Query(() => OrderType, { name: 'order', description: 'Отримати одне замовлення' })
  async getOrder(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => OrderType, { description: 'Створити замовлення з кошика' })
  async createOrder(@Args('input') input: CreateOrderInput) {
    return this.ordersService.create(input);
  }

  @Mutation(() => OrderType, { description: 'Оновити статус замовлення' })
  async updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => OrderStatus }) status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  // Field Resolver: отримати користувача замовлення
  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() order: Order) {
    try {
      return await this.usersService.findOne(order.userId);
    } catch {
      return null;
    }
  }
}
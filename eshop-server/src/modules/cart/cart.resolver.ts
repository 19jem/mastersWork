import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartType } from './types/cart.type';
import { AddItemInput } from './dtos/add-item.input';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/types/user.type';
import { Cart } from './schemas/cart.schema';

@Resolver(() => CartType)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => CartType, { name: 'cart', description: 'Отримати кошик користувача' })
  async getCart(@Args('userId', { type: () => ID }) userId: string) {
    return this.cartService.getCart(userId);
  }

  @Mutation(() => CartType, { description: 'Додати товар в кошик' })
  async addItemToCart(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('input') input: AddItemInput,
  ) {
    return this.cartService.addItem(userId, input);
  }

  @Mutation(() => CartType, { description: 'Оновити кількість товару в кошику' })
  async updateCartItem(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('productId', { type: () => ID }) productId: string,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    return this.cartService.updateItem(userId, productId, quantity);
  }

  @Mutation(() => CartType, { description: 'Видалити товар з кошика' })
  async removeCartItem(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Mutation(() => Boolean, { description: 'Очистити кошик' })
  async clearCart(@Args('userId', { type: () => ID }) userId: string) {
    await this.cartService.clearCart(userId);
    return true;
  }

  // Field Resolver: отримати користувача кошика
  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() cart: Cart) {
    try {
      return await this.usersService.findOne(cart.userId);
    } catch {
      return null;
    }
  }
}
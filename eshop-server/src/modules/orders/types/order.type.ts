import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { ProductType } from 'src/modules/products/types/product.type';
import { UserType } from 'src/modules/users/types/user.type';

// Enum для статусу замовлення
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

// Реєструємо enum для GraphQL
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Статус замовлення',
});

@ObjectType()
export class OrderItemType {
  @Field(() => ProductType)
  product: ProductType;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  quantity: number;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  _id: string;

  @Field()
  userId: string;

  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field(() => Float)
  total: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Field Resolver: отримати користувача
  @Field(() => UserType, { nullable: true })
  user?: UserType;
}
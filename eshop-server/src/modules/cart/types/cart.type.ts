import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ProductType } from 'src/modules/products/types/product.type';
import { UserType } from 'src/modules/users/types/user.type';

@ObjectType()
export class CartItemType {
  @Field(() => ProductType)
  product: ProductType;

  @Field()
  quantity: number;
}

@ObjectType()
export class CartType {
  @Field(() => ID)
  _id: string;

  @Field()
  userId: string;

  @Field(() => [CartItemType])
  items: CartItemType[];

  @Field(() => Float)
  totalPrice: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

    // Опціонально: отримати повний об'єкт користувача
  @Field(() => UserType, { nullable: true })
  user?: UserType;
}
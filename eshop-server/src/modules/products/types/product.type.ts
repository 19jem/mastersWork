// src/modules/products/types/product.type.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { CategoryType } from 'src/modules/categories/types/category.type';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  stock: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => CategoryType)
  category: CategoryType;
}

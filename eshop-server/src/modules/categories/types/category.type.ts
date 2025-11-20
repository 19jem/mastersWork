import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  parent?: string | null;

  // Опціональні поля для резолверів
  @Field(() => CategoryType, { nullable: true })
  parentCategory?: CategoryType;

  @Field(() => [CategoryType], { nullable: true })
  children?: CategoryType[];
}

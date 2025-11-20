import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

